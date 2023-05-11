const express = require("express")
const mongoose = require("mongoose")

const {User} = require("../models/user")
const {Crud, CrudSettings} = require("../interfaces/crud")

const crud = new Crud(
  User,
  {
    identifiers: {
      username: null,
      email: null
    }
  }
)

module.exports = crud
