const express = require('express')
const body_parser = require('body-parser')

const api_router = require("./routes/api")
const app = express()

app.get("/", (_req, res) => {
  res.send("Welcome to Prteen! Api endpoint is at <a href=/api/v1/>/api/v1/</a>")
})

app.use(body_parser.json());
app.use(body_parser.urlencoded())

app.use("/api/v1", api_router)


module.exports = app
