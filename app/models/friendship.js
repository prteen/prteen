const {ObjectId, model, Schema} = require('mongoose');

const FriendshipSchema = new Schema({ 
  user1: {type: ObjectId, ref: 'User'}, 
  user2: {type: ObjectId, ref: 'User'},
  status: {type: String, enum: ['pending', 'accepted', 'rejected']},
})

const Friendship = model('Friendship', FriendshipSchema)

module.exports = {FriendshipSchema, Friendship}
