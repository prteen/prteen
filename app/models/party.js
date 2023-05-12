const {Schema, model, ObjectId} = require('mongoose')
const {ImageSchema, Image} = require('./image')
// const {UserSchema, User} = require('./user')

const PartySchema = new Schema({
  title: String,
  description: String,
  tags: [String],
  image: {
    type: ObjectId,
    refer: "Image",
  },
  date: Date,
  location: String,
  organizer: {
    type: ObjectId,
    ref: 'User',
  },
  max_participants: Number,
  participants: [{
    type: ObjectId,
    ref: 'User'
  }],
})

const Party = model('Party', PartySchema)

module.exports = {PartySchema, Party}
