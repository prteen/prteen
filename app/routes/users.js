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
    },
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
    },
    // exclude: "__all__"
  }
)
