const { Crud } = require("../interfaces/crud")
const { prot } = require("../utils/prot")
const { Friendship } = require("../models/friendship")
const { User } = require("../models/user")

const user_crud = new Crud(
  Friendship,
  {
    overrides: {
      create: (parent, router, route, validator) => {
        console.log(` --> creating operation POST @ ${route}/ [prot]`)
        router.post("/", prot, async (req, res) => {
          let from = req.user._id
          let to_username = req.body.to
          if (to_username == null || to_username == req.user.username) {
            return res.status(400).json({error: "Invalid username"})
          } 
          let user2 = await User.findOne({username: to_username})
          if (user2 == null) {
            return res.status(404).json({error: "User not found"})
          }

          try {
            let friendship = await Friendship.findOne({$or: [{from: from, to: user2._id}, {from: user2._id, to: from}]})
            if (friendship != null) {
              return res.status(409).json({error: "Friendship already exists"})
            }
            let new_friendship = new Friendship({
              from,
              to: user2._id,
              status: "pending"
            })
            await new_friendship.save()
            return res.json({
              message: "Friendship request sent", 
              type: "success", 
              id: new_friendship._id
            })
          } catch (error) {
            return res.status(500).json({
              message: "Failed to create new friendship",
              type: "error",
              error: err
            })
          }
        })
      }, 
      read_all: (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ / [prot]`)
        router.get("/", prot, (req, res) => {
          let user = req.user._id
          Friendship.find({$or: [{from: user}, {to: user}]})
            .then(friendships => {
              res.json(friendships)
            })
            .catch(err => {
              // todo: handle error
              console.log(err)
            })
        })
      },
      update: (parent, router, route, validator) => {
        console.log(` --> creating operation PUT @ ${route}/id/:id [prot]`)
        router.put("/:id", prot, (req, res) => {
          let id = req.params.id
          let user = req.user._id
          let status = req.body.status
          Friendship.findById(id)
            .then(friendship => {
              if (friendship == null) {
                return res.status(404).json({error: "Friendship not found"})
              }
              if (friendship.to.equals(user)) {
                if (friendship.status != "pending") {
                  return res.status(409).json({error: "Friendship request has already been accepted / rejected"})
                }
                if (status != "accepted" && status != "rejected") {
                  return res.status(400).json({error: "Invalid status", status: status})
                }
                // either "accepted" or "rejected"
                friendship.status = status 
                friendship.save()
                  .then(friendship => {
                    res.json({
                      message: "Friendship request updated",
                      type: "success",
                      id: friendship._id
                    })
                  })
              } else {
                res.status(403).json({error: "Forbidden"})
              }
            })
            .catch(err => {
              console.log(err)
              res.status(500).json({error: "Internal server error", obj: err})
            })
        })
      },
      delete: (parent, router, route, validator) => {
        console.log(` --> creating operation DELETE @ ${route}/:id [prot]`)
        router.delete("/:id", prot, (req, res) => {
          let id = req.params.id
          let user = req.user._id
          Friendship.findById(id)
            .then(friendship => {
              if (friendship == null) {
                return res.status(404).json({error: "Friendship not found"})
              }
              if (friendship.from.equals(user)) {
                if (friendship.status == "rejected") {
                  return res.status(409).json({error: "Cannot delete rejected friendship"})
                }
                friendship.deleteOne()
                  .then(friendship => {
                    res.json(friendship)
                  })
                  .catch(err => {
                    console.log(err)
                  })
              } else if (friendship.to.equals(user)) { 
                if (friendship.status == "pending") {
                  return res.status(400).json({error: "Cannot delete pending friendship request"})
                }
                friendship.deleteOne()
                  .then(friendship => {
                    res.json({
                      message: "Friendship deleted",
                      type: "success"
                    })
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
      }
    },
    exclude: "__all__"
  }
)

module.exports = user_crud
