const express = require("express")
const router = express.Router()

const parties = require("./parties")
const users = require("./users")
const auth = require("./auth")
const friendships = require("./friendships")
const { protected } = require("../utils/protected")

let parties_router = parties.public.settings.router
// first we register other routes for /parties/, then we register the /parties/:id route
parties.users.register(parties_router, "/users")
parties.organizers.register(parties_router, "/organizers")
parties.public.register(router, "/parties")
parties.join.register(parties.public.settings.read_router, "/join")
console.log(parties_router.stack)

users.register(router, "/users")

friendships.register(router, "/friendships")

router.use("/auth", auth)

router.get("/", (_req, res) => {
  res.send("<a href=parties>parties/</a><br><a href=users>users/</a><br><a href=auth>auth/</a>")
})



module.exports = router
