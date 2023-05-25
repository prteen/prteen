const express = require("express")
const router = express.Router()

const {public: parties_public, users: parties_users, organizers: parties_organizers} = require("./parties")
const users = require("./users")
const auth = require("./auth")
const friendships = require("./friendships")
const { protected } = require("../utils/protected")

parties_public.register(router, "/parties")
parties_users.register(router, "/parties/users")
parties_organizers.register(router, "/parties/organizers")
users.register(router, "/users")
friendships.register(router, "/friendships")

router.use("/auth", auth)

router.get("/", (_req, res) => {
  res.send("<a href=parties>parties/</a><br><a href=users>users/</a><br><a href=auth>auth/</a>")
})

router.get("/protected", protected, async (req, res) => {
  try {
    if (req.user)
      return res.status(200).json({message: 'User is logged in', type: 'success', user: req.user});

    return res.status(401).json({message: 'User is not logged in', type: 'error'});
  } catch (err) {
    return res.status(401).json({message: 'Error in checking login', type: 'error', err}) 
  }
})


module.exports = router
