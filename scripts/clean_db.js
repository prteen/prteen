const {connect, disconnect} = require("../db/mongodb")
const {_models} = require("../app/models")
const {db} = require("../settings").mongodb
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`Database to clean? (${db}) `, name => {
  connect({db: name || null}).then(() => {
    Promise.all(_models.map(async Model => {
      console.log("Purging", Model.collection.collectionName)
      await Model.deleteMany({})
    })).then(() => { 
        disconnect() 
        readline.close()
      })
  })
})
