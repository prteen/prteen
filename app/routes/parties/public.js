const { Party } = require("../../models/party")
const { Crud } = require("../../interfaces/crud")

module.exports = new Crud(
  Party,
  {
    identifiers: {
      _id: "id",
      title: null
    },
    exclude: ["update", "delete", "create"]
  }
)

