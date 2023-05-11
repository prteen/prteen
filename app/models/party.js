const {Schema, model, ObjectId} = require('mongoose')
const {ImageSchema, Image} = require('./image')
const {UserSchema, User} = require('./user')

const PartySchema = new Schema({
  title: String,
  description: String,
  tags: [String],
  image: ImageSchema,
  date: Date,
  location: String,
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  max_participants: Number,
  participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
})

const Party = model('Party', PartySchema)

module.exports = {PartySchema, Party}
