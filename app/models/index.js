const image = require("./image")
const user = require("./user")
const party = require("./party")

module.exports = {
  image, 
  user,
  party,
  _models: [image.Image, user.User, party.Party],
  _schemas: [image.ImageSchema, user.UserSchema, party.PartySchema]
}

