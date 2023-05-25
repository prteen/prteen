const { Crud } = require("../interfaces/crud")
const { protected } = require("../utils/protected")
const { Friendship } = require("../models/friendship")
const { User } = require("../models/user")

const user_crud = new Crud(
  Friendship,
  {
    identifiers: {
      _id: "id",
      from: null,
      to: null
    },
    overrides: {
      "create": (parent, router, route, validator) => {
        console.log(` --> creating operation POST @ ${route}/`)
        router.post("/", protected, async (req, res) => {
          let from = req.user._id
          let to_username = req.body.to // username
          if (to_username == null) {
            return res.status(400).json({error: "Missing username"})
          } else if (to_username == req.user.username) {
            return res.status(400).json({error: "Cannot add yourself"})
          }
          let user2 = await User.findOne({username: to_username})
          if (user2 == null) {
            return res.status(400).json({error: "User does not exist"})
          }

          Friendship.findOne({$or: [{from: from, to: user2._id}, {from: user2._id, to: from}]})
            .then(friendship => {
              if (friendship != null) {
                return res.status(400).json({error: "Friendship already exists"})
              }
              let status = "pending"
              let new_friendship = new Friendship({
                from,
                to: user2._id,
                status
              })
              new_friendship.save()
                .then(friendship => {
                  res.json(friendship)
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(err => {
              console.log(err)
            })
        })
      },
      "read": (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/:id`)
        router.get("/:id", protected, (req, res) => {
          let id = req.params.id
          let user = req.user._id
          Friendship.findById(id)
            .then(friendship => {
              if (friendship.from == user || friendship.to == user) {
                res.json(friendship)
              } else {
                res.status(403).json({error: "Forbidden"})
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
      },
      "read_all": (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/sent`)
        router.get("/view/sent", protected, (req, res) => {
          let user = req.user._id
          Friendship.find({from: user})
            .then(friendships => {
              res.json(friendships)
            })
            .catch(err => {
              console.log(err)
            })
        })

        console.log(` --> creating operation GET @ ${route}/received`)
        router.get("/view/received", protected, (req, res) => {
          let user = req.user._id
          Friendship.find({to: user})
            .then(friendships => {
              res.json(friendships)
            })
            .catch(err => {
              console.log(err)
            })
        })
      },
      "update": (parent, router, route, validator) => {
        console.log(` --> creating operation PUT @ ${route}/:id`)
        router.put("/:id", protected, (req, res) => {
          let id = req.params.id
          let user = req.user._id
          let status = req.body.status
          Friendship.findById(id)
            .then(friendship => {
              if (friendship.to.equals(user) && friendship.status == "pending") {
                if (status != "accepted" && status != "rejected") {
                  return res.status(400).json({error: "Invalid status", status: status})
                }
                // either "accepted" or "rejected"
                friendship.status = status 
                friendship.save()
                  .then(friendship => {
                    res.json(friendship)
                  })
                  .catch(err => {
                    console.log(err)
                  })
              } else {
                res.status(403).json({error: "Forbidden"})
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
      },
      "delete": (parent, router, route, validator) => {
        console.log(` --> creating operation DELETE @ ${route}/:id`)
        router.delete("/:id", protected, (req, res) => {
          let id = req.params.id
          let user = req.user._id
          Friendship.findById(id)
            .then(friendship => {
              if (friendship == null) {
                return res.status(400).json({error: "Friendship does not exist"})
              }
              if (friendship.from.equals(user)) {
                if (friendship.status == "rejected") {
                  return res.status(400).json({error: "Cannot delete rejected friendship"})
                }
                friendship.remove()
                  .then(friendship => {
                    res.json(friendship)
                  })
                  .catch(err => {
                    console.log(err)
                  })
              } else if (friendship.to.equals(user)) { 
                if (friendship.status == "pending") {
                  return res.status(400).json({error: "Cannot delete pending friendship, can only accept or reject"})
                }
                friendship.deleteOne()
                  .then(friendship => {
                    res.json(friendship)
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }else {
                res.status(403).json({error: "Forbidden"})
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
      }
    },
    exclude: []
  }
)

module.exports = user_crud
