import KoaRouter from "koa-router"

export default transactor => {
    const exampleccRouter = new KoaRouter()

    exampleccRouter
        .post("/move", async ctx => {
            const { sender, receiver, amount } = ctx.request.body
            const invokeResponse = await transactor.invoke("move", [sender, receiver, amount.toString()])
            await invokeResponse.wait()
            ctx.status = 200
        })
        .get("/query/:target", async ctx => {
            const { target } = ctx.params
            const queryResponse = await transactor.query("query", [target])
            ctx.body = {
                result: +queryResponse.data.payload.toString()
            }
        })

    return exampleccRouter
}
