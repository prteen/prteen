const { Schema, Model } = require('mongoose')
const {Image} = require('./image.js')
const {User} = require('./user.js')

const partySchema = new Schema({
  name: String,
  description: String,
  tags: [String],
  image: Image,
  date: Date,
  location: String,
  organizer: User,
  max_participants: Number,
  participants: [User],
})

const Party = Model('Party', partySchema)
