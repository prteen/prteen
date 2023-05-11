const {Schema, model} = require('mongoose')
const {ImageSchema, Image} = require('./image')
const {UserSchema, User} = require('./user')

const PartySchema = new Schema({
  title: String,
  description: String,
  tags: [String],
  image: ImageSchema,
  date: Date,
  location: String,
  organizer: UserSchema,
  max_participants: Number,
  participants: [UserSchema],
})

const Party = model('Party', PartySchema)

module.exports = {PartySchema, Party}
