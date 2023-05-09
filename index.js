const app = require("./app/app.js")
const mongoose = require("mongoose")
require("dotenv/config")

const port = process.env.HTTP_PORT || 8080
const mongodb_user = process.env.MONGODB_USER
const mongodb_pass = process.env.MONGODB_PASS
const mongodb_host = process.env.MONGODB_HOST
const mongodb_db = process.env.MONGODB_DB

const party = require("./app/models/party.js")
let p = new party.Party({
  name: "Test Party",
  description: "This is a test party",
  tags: ["test", "party"],
  image: null,
  date: new Date(),
  location: "Test Location",
  organizer: null,
  max_participants: 10,
  participants: [],
})


app.locals.db = mongoose.connect(`mongodb+srv://${encodeURIComponent(mongodb_user)}:${mongodb_pass}@${mongodb_host}/${mongodb_db}`, { ssl: true })
  .then(() => {  
    party.Party.collection.insertOne(p)
    
    console.log("Connected to Database");
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })
})


