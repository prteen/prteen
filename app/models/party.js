const {Schema, model, ObjectId} = require('mongoose')

const PartySchema = new Schema({
  title: String,
  description: String,
  tags: [String],
  images: [{
    type: ObjectId,
    ref: "Image",
  }],
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

  invited: [{type: ObjectId, ref: 'User'}],
  private: Boolean, 
})

const Party = model('Party', PartySchema)

module.exports = {PartySchema, Party}
