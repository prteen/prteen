const mongoose = require("mongoose")
const {mongodb} = require("../settings")


function connect() {
  return mongoose.connect(`mongodb+srv://${encodeURIComponent(mongodb.username)}:${mongodb.password}@${mongodb.host}/${mongodb.db}`, {
    ssl: true, 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
} 

module.exports = {connect}

