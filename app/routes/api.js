const express = require("express")
const router = express.Router()

const parties = require("./parties")
const users = require("./users")
const auth = require("./auth")
const friendships = require("./friendships")
const images = require("./image")

parties.public_p.register(router, "/parties")

parties.users.register(router, "/parties/users")
parties.organizers.register(router, "/parties/organizers")
parties.join.register(router, "/parties/join")

users.register(router, "/users")

friendships.register(router, "/friendships")
images.register(router, "/images")

// router.use("/images", image)
router.use("/auth", auth)

router.get("/", (_req, res) => {
  let html = "<h1>API</h1>"
  for(const c of [parties.users, parties.organizers, parties.public_p, users, friendships, images]) {
    console.log(c)
    html += `<a href=/api/v1${c.route}>${c.route}</a><br>`
  }
  res.send(html)
})



module.exports = router
