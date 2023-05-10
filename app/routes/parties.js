const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const {Party} = require("../models/party")
const {Crud, CrudSettings} = require("../interfaces/crud")

let crud = new Crud(
  Party, 
  new CrudSettings({
    _id: "id",
    title: null
}))


// // GET all parties
// router.get("/", (req, res) => {
//   Party.find()
//     .then(parties => {
//       res.json(parties)
//     })
//     .catch(err => {
//       console.log(err)
//     })
// })

// router.get("/title/:title", (req, res) => {
//   Party.find({title: req.params.title})
//     .then(parties => {
//       res.json(parties)
//     })
//     .catch(err => {
//       console.log(err)
//     })
// })

module.exports = crud
