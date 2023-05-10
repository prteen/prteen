const {Schema, model} = require('mongoose')

const imageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String
  }
})

const Image = model('Image', imageSchema)

module.exports = {imageSchema, Image}
