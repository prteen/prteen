const mongoose = require("mongoose")
const {mongodb} = require("../settings")

exports.connect = function(overrides = {}) {
  return mongoose.connect(`mongodb+srv://${encodeURIComponent(overrides.username || mongodb.username)}:${overrides.password || mongodb.password}@${overrides.host || mongodb.host}/${overrides.db || mongodb.db}`, {
    ssl: true, 
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
      console.log("󱘲 Connected to MongoDB")
    })
}

exports.disconnect = async function() {
  await mongoose.connection.close()
}

