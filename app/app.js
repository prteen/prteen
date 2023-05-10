const express = require('express')
const body_parser = require('body-parser')

const api_router = require("./routes/api")
const app = express()

app.get("/", (req, res) => {
  res.send("Ciao")
})

app.use(body_parser.json());

app.use("/api/v1", api_router)


module.exports = app
