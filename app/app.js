const express = require('express')

const api_router = require("./routes/api")
const app = express()

const {Crud, CrudSettings} = require("./interfaces/crud")

let x = new Crud(1, 2)



app.get("/", (req, res) => {
  res.send("Welcome to Prteen! Api endpoint is at <a href=/api/v1/>/api/v1/</a>")
})

app.use("/api/v1", api_router)


module.exports = app
