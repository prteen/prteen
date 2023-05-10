const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")


const parties_router = require("./parties")
const users_router = require("./users")

router.use("/parties", parties_router)
router.use("/users", users_router)


module.exports = router
