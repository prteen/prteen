const {User} = require("../models/user")
const {Crud, CrudSettings} = require("../interfaces/crud")

module.exports = new Crud(
  User,
  {
    identifiers: {
      username: null,
      email: null,
      _id: "id"
    },
    exclude: ["read_all"],
    overrides: {
      read: (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/username`)
        router.get(`/username/:id`, (req, res) => {
          let query = {username: req.params.id}
          parent.model.findOne(query)
            .then(obj => res.json(obj))
            .catch(err => {
              console.log(err)
            })
        })
      }
    }
  }
)
