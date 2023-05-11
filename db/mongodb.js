const mongoose = require("mongoose")
const {mongodb} = require("../settings")

exports.connect = async function(overrides = {}) {
  return await mongoose.connect(`mongodb+srv://${encodeURIComponent(overrides.username || mongodb.username)}:${overrides.password || mongodb.password}@${overrides.host || mongodb.host}/${overrides.db || mongodb.db}`, {
    ssl: true, 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

exports.disconnect = async function() {
  await mongoose.connection.close()
}

