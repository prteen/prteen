const { Party } = require("../../models/party")
const { Crud } = require("../../interfaces/crud")
const { protected } = require("../../utils/protected")

module.exports = new Crud(
  Party, 
  { 
    overrides: {
      "read_all": (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/`)
        router.get("/", protected, (req, res) => {
          parent.model.find({"participants": {"$in": [req.user._id]}})
            .then(objs => {
              return res.json(objs)
            })
            .catch(err => {
              return res.status(500).json({
                message: "Failed to get objs",
                type: "error",
                error: err 
              })
            })
        })
      },
    },
    exclude: "__all__"
  }
)
