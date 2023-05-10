const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const parties = require("./parties")
const users = require("./users")

parties.register(router, "/parties")
console.log(router)
users.register(router, "/users")

module.exports = router
