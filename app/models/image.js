const {Schema, Model} = require('mongoose')

const imageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String
  }
})

const Image = Model('Image', imageSchema)
