const app = require("./app/app.js")
const mongoose = require("mongoose")
require("dotenv/config")

const port = process.env.HTTP_PORT || 8080
const mongodb_user = process.env.MONGODB_USER
const mongodb_pass = process.env.MONGODB_PASS
const mongodb_host = process.env.MONGODB_HOST
const mongodb_db = process.env.MONGODB_DB

const party = require("./app/models/party.js")

app.locals.db = mongoose.connect(`mongodb+srv://${encodeURIComponent(mongodb_user)}:${mongodb_pass}@${mongodb_host}/${mongodb_db}`, { 
  ssl: true, 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {   
    console.log("Connected to Database");
    app.listen(port, () => {
        console.log(`Server started on http://127.0.0.1:${port}/`);
    })
})


