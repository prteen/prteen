const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const parties = require("./parties")
const users = require("./users")
const auth = require("./auth")

parties.register(router, "/parties")
users.register(router, "/users")
router.use("/auth", auth)


module.exports = router
