const { Schema, model } = require('mongoose')
const {imageSchema, Image} = require('./image.js')
const {userSchema, User} = require('./user.js')

const partySchema = new Schema({
  title: String,
  description: String,
  tags: [String],
  image: imageSchema,
  date: Date,
  location: String,
  organizer: userSchema,
  max_participants: Number,
  participants: [userSchema],
})

const Party = model('Party', partySchema)

module.exports = {partySchema, Party}
