const { User } = require("../models/user")
const { Crud } = require("../interfaces/crud")


// todo: this will be eventually deleted since direct access to users will be disabled 
module.exports = new Crud(
  User,
  {
    identifiers: {
      username: null,
      email: null,
      _id: "id"
    }
    // exclude: "__all__"
  }
)
