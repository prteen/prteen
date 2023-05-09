const { Schema, Model} = require('mongoose')

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
})

const User = Model('User', userSchema)
