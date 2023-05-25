const {ObjectId, model, Schema} = require('mongoose');

const FriendshipSchema = new Schema({ 
  from: {type: ObjectId, ref: 'User', required: true}, 
  to: {type: ObjectId, ref: 'User', required: true},
  status: {type: String, enum: ['pending', 'accepted', 'rejected']},
})

const Friendship = model('Friendship', FriendshipSchema)

module.exports = {FriendshipSchema, Friendship}
