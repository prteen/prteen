const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: false,
  }
})

const User = model('User', UserSchema)

module.exports = {UserSchema, User}
