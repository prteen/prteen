const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const {User} = require("../models/user")

const {Party} = require("../models/party")
const {Crud, CrudSettings} = require("../interfaces/crud")

const crud = new Crud(
  Party, 
  { identifiers: {
    _id: "id",
    title: null
  }}
)

module.exports = crud
