const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const parties_crud = require("./parties")
const users_router = require("./users")

parties_crud.register(router, "/parties")
//router.use("/parties", parties_router)
router.use("/users", users_router)

module.exports = router
