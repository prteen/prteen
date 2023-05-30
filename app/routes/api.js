const express = require("express")
const router = express.Router()

const parties = require("./parties")
const users = require("./users")
const auth = require("./auth")
const friendships = require("./friendships")
const { protected } = require("../utils/protected")

parties.public.register(router, "/parties")

parties.users.register(router, "/parties/users")
parties.organizers.register(router, "/parties/organizers")
parties.join.register(router, "/parties/join")

users.register(router, "/users")

friendships.register(router, "/friendships")

router.use("/auth", auth)

router.get("/", (_req, res) => {
  res.send("<a href=parties>parties/</a><br><a href=users>users/</a><br><a href=auth>auth/</a>")
})



module.exports = router
