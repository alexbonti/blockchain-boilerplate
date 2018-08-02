import passport from "koa-passport"

const fetchUser = async () => {
    const ORG = (process.env.ORG || "cbh").toLowerCase()
    return {
        id: 1,
        username: `admin@${ORG}.example.com`,
        name: "admin",
        organisation: `${ORG}.example.com`,
        password: "password"
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await fetchUser()
        done(null, user)
    } catch (err) {
        done(err)
    }
})

const LocalStrategy = require("passport-local").Strategy

passport.use(
    new LocalStrategy((username, password, done) => {
        fetchUser()
            .then(user => {
                if (username === user.username && password === user.password) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            })
            .catch(err => done(err))
    })
)

export default passport
