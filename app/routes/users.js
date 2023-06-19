const { User } = require("../models/user")
const { Crud } = require("../interfaces/crud")
const { Friendship } = require("../models/friendship")
const { prot } = require("../utils/prot")


// todo: this will be eventually deleted since direct access to users will be disabled 
module.exports = new Crud(
  User,
  {
    identifiers: {
      username: null,
      _id: "id"
    },
    overrides: {
      read: (parent, router, route, validator) => {
        parent.settings.forIdentifiers((id_db, id_symb) => {
          console.log(` --> creating operation GET @ ${route}/${id_symb}/:id [prot]`)
          router.get(`/${id_symb}:id`, prot, async (req, res) => {
            try {
              if(req.user._id.equals(req.params.id)) {
                return res.redirect("/api/v1/auth/me")
              }

              let query = {}
              query[id_db] = req.params.id
              console.log(query)
              let user = await parent.model.findOne(query)
              if(user === null) {
                return res.status(404).json({
                  message: "User not found",
                  type: "error"
                })
              }
              let query2 = {$or: [{from: req.user._id}, {to: req.user._id}]}
              console.log(query2)
              let all_friendships = await Friendship.find(query2)
              let friendships = all_friendships.filter(f => f.to.equals(user._id) || f.from.equals(user._id))
              if(friendships.length > 1) {
                return res.status(500).json({
                  message: "Internal server error",
                  type: "error",
                })
              } else if(friendships == 0 /* || friendships[0].status != "accepted" */) {
                return res.status(403).json({
                  message: "Forbidden",
                  type: "error"
                })
              } else {
                let data = user.toObject()
                delete data.password
                delete data.refresh_token
                delete data.__v
                
                return res.status(200).json(data)
              }
            } catch (error) {
              return res.status(500).json({
                message: "Failed to fetch user",
                type: "error",
                error: error
              })
            }
          })
        })
      }
    },
    exclude: "__all__"
  }
)
