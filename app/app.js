const express = require('express')
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser')
const morgan = require('morgan')

module.exports = async function() {
  const api_router = require("./routes/api")
  const app = express()

  app.get("/", (_req, res) => {
    res.send("Welcome to Prteen! Api endpoint is at <a href=/api/v1/>/api/v1/</a>")
  })

  app.use(morgan('dev'))
  app.use(body_parser.json());
  app.use(body_parser.urlencoded({extended: true}))
  app.use(cookie_parser())

  app.use("/api/v1", api_router)

  return app
} 
