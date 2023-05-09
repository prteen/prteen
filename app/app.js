const express = require('express')

const api_router = require("./routes/api")
const app = express()

app.get("/", (req, res) => {
  res.send("Ciao")
})

app.use("/api/v1", api_router)


module.exports = app
