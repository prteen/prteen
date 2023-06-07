const express = require('express')
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser')
const morgan = require('morgan')
const fs = require('fs')
const cors = require('cors')

module.exports = async function(port, callback) {
  const api_router = require("./routes/api")
  const app = express()

  app.get("/", (_req, res) => {
    res.send("Welcome to Prteen! Api endpoint is at <a href=/api/v1/>/api/v1/</a>")
  })

  app.use(morgan('dev'))
  app.use(cors({
    origin: 'http://127.0.0.1:8090',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))
  app.use(body_parser.json());
  app.use(body_parser.urlencoded({extended: true}))
  app.use(cookie_parser())

  app.use("/api/v1", api_router)
  
  app.get("/favicon.ico", (_req, res) => {
    res.set("Content-Type", "image/x-icon")
    fs.createReadStream("res/favicon.ico").pipe(res)
  })

  app.set("view engine", "ejs")

  app.listen(port, callback)
} 
