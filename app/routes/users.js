const {User} = require("../models/user")
const {Crud, CrudSettings} = require("../interfaces/crud")

module.exports = new Crud(
  User,
  {
    identifiers: {
      username: null,
      email: null
    }
  }
)
