const express = require("express")
const router = express.Router()

const parties = require("./parties")
const users = require("./users")
const auth = require("./auth")
const { protected } = require("../utils/protected")

parties.crud.register(router, "/parties")
users.register(router, "/users")
router.use("/auth", auth)

router.use("/parties", parties.router)

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
