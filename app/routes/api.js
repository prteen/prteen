const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const party_router = require("./parties")

router.use("/parties", party_router)

module.exports = router
