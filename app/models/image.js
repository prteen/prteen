const {Schema, model} = require('mongoose')

const ImageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: String
  }
})

const Image = model('Image', ImageSchema)

module.exports = {ImageSchema, Image}
