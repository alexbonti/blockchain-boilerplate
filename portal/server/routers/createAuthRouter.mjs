import KoaRouter from "koa-router"

export default passport =>
    new KoaRouter()
        .post("/login", async ctx =>
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    throw err
                }
                if (user === false) {
                    ctx.status = 401
                } else {
                    ctx.status = 200
                    ctx.body = user
                    return ctx.login(user)
                }
                return null
            })(ctx)
        )
        .post("/logout", async ctx => {
            ctx.status = 200
            return ctx.logout()
        })
        .get("/user", async ctx => {
            ctx.body = ctx.state.user
        })
