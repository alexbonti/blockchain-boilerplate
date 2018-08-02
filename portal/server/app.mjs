import Koa from "koa"
import http from "http"
import koaStatic from "koa-static"
import koaBodyParser from "koa-bodyparser"
import KoaRouter from "koa-router"
import koaSend from "koa-send"
import path from "path"
import session from "koa-session"
import fcw from "fabric-client-wrapper"
import networkBootstrap from "./util/networkBootstrap"
import createApiRouter from "./routers/createApiRouter"
import passport from "./passport"

const CHAINCODE_DEV = process.env.CHAINCODE_DEV === "true" || false
const ORG = (process.env.ORG || "org1").toLowerCase()
// Loading the environment port with default fallbacks
const HTTP_PORT = process.env.PORT || 3000

// const fcw = require("@blockchain/fabric-client-wrapper")
const app = new Koa()
const router = new KoaRouter()
const server = http.createServer(app.callback())

app.keys = ["cbh-session-secret"]
app.use(session(app))

// mount parser for applicaton/json content
app.use(koaBodyParser())

// Require authentication
app.use(passport.initialize())
app.use(passport.session())

// TODO re-enable auth
// app.use((ctx, next) => {
//     const apiPath = "/api/"
//     if (
//         !ctx.isAuthenticated() &&
//         ctx.request.url.substr(0, apiPath.length) === apiPath
//     ) {
//         ctx.status = 401
//         return null
//     }
//
//     return next()
// })

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || 500
        ctx.body = err.message
        ctx.app.emit("error", err, ctx)
    }
})
// mount static frontend to koa
app.use(koaStatic(path.join(__dirname, "..", "dist")))

function getCommonConfigFile() {
    return path.join(
        __dirname,
        CHAINCODE_DEV ? "./conf/common-fabric-network-dev.json" : "./conf/common-fabric-network.json"
    )
}

function getOrgConfigFile() {
    if (!["org1", "org2"].includes(ORG)) {
        throw new Error("Invalid org supplied")
    }
    return path.join(
        __dirname,
        CHAINCODE_DEV ? `./conf/${ORG}-fabric-network-dev.json` : `./conf/${ORG}-fabric-network.json`
    )
}

async function init() {
    console.log("---NetworkBootstrap Start---")
    const network = await networkBootstrap(getCommonConfigFile(), getOrgConfigFile())
    console.log("---NetworkBootstrap Finish---")

    let exampleUser
    try {
        exampleUser = await fcw.newUserClientFromCARegisterAndEnroll({
            userClient: network.users.caAdmin,
            registerRequest: {
                enrollmentID: "UserABC",
                enrollmentSecret: "password123",
                affiliation: `${ORG}.department1`
            }
        })
    } catch (error) {
        if (!error.message.includes("is already registered")) {
            throw error
        }
        exampleUser = await fcw.newUserClientFromStore({
            username: "UserABC",
            ...network.config
        })
    }

    const transactor = fcw(
        exampleUser,
        network.channels.mychannel,
        network.chaincodes.examplecc.id,
        network.endorsementPolicies.mychannel.examplecc
    )

    if (ORG === "org1") {
        const invokeResponse = await transactor.invoke("move", ["a", "b", "10"])
        await invokeResponse.wait()
    }

    const queryResponse = await transactor.query("query", ["a"])
    console.log("queryResponse", queryResponse.data.payload.toString())

    /*
     * API endpoints
     */
    const apiRouter = createApiRouter({ transactor, passport })
    router.use("/api", apiRouter.routes(), apiRouter.allowedMethods())

    // // reroute all frontend routes to be handled by react-router
    router.get("*", async ctx => {
        await koaSend(ctx, "dist/index.html")
    })

    app.use(router.routes())

    // Start the app
    server.listen(HTTP_PORT, () => {
        console.log(`Listening on port ${HTTP_PORT}`)
    })
}

init().catch(error => {
    console.error("error", error)
})
