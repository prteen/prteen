const { Crud } = require("../interfaces/crud")
const { protected } = require("../utils/protected")
const { Friendship } = require("../models/friendship")
const { User } = require("../models/user")

const crud = new Crud(
  Friendship,
  {
    identifiers: {
      _id: "id",
      user1: null,
      user2: null
    },
    overrides: {
      "create": (parent, router, route, validator) => {
        console.log(` --> creating operation POST @ ${route}/`)
        router.post("/", protected, (req, res) => {
          let user1 = req.user._id
          let user2 = req.body.user2
          let status = "pending"
          let friendship = new Friendship({user1, user2, status})
          friendship.save()
            .then(friendship => {
              res.json(friendship)
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    exclude: ["read", "read_all", "update", "delete"]
  }
)
