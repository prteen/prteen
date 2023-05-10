const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const party_router = require("./parties")
const auth_router = require("./auth")

router.use("/parties", party_router)
router.use("/auth", auth_router)

module.exports = router
