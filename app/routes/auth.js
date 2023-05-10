const express = require('express');
const router = express.Router();
const { hash, compare } = require('bcryptjs');
const { verify } = require('jsonwebtoken');

const {
  create_access_token,
  create_refresh_token,
  send_access_token,
  send_refresh_token,
} = require('../utils/token');

const {User} = require('../models/user');

router.post("/signup", async (req, res) => {
  try {
    console.log(req)
    const { username, email, password } = req.body;
    const user = await User.findOne({ username: username });

    if (user)
      return res.status(500).json({
        message: "User already exists",
        type: "warning"
    }) 

    const password_hash = await hash(password, 10)
    const new_user = new User({
      username: username,
      email: email,
      password: password_hash
    }) 

    await new_user.save()

    res.status(200).json({
      message: "User created successfully",
      type: "success"
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Error creating user",
      type: "error",
    }) 
  }
})

router.post("/signin", async (req, res) => {
  try {
    const {username, password} = req.body;

    const user = User.findOne({ username: username });

    // check if user exists
    if (!user)
      return res.status(500).json({
        message: "User not found",
        type: "error"
      })

    const is_correct = await compare(password, user.password)

    // if the passwords hashes don't match
    if (!is_correct)
      return res.status(500).json({
        message: "Password is incorrect",
        type: "error"
        })

    // create refresh and access token
    const access_token = create_access_token(user._id)
    const refresh_token = create_refresh_token(user._id)

    // put the refresh token in the database
    user.refresh_token = refresh_token
    await user.save()

    send_refresh_token(res, refresh_token)
    send_access_token(req, res, access_token)

  } catch (err) {
    return res.status(500).json({
      message: "Error signing in",
      type: "error",
      err
      })
  }
})

// signout function
router.post("/signout", (_req, res) => {
  res.clearCookie("refresh_token")
  return res.json({
    message: "Logged out",
    type: "success"
  })
})

// refresh token function
router.post("/refresh_token", async (req, res) => {
  try {
    const {refresh_token} = req.cookies
    if (!refresh_token)
      return res.status(500).json({
        message: "No refresh token provided",
        type: "error"
    })

    // verify the refresh token
    let id;
    try {
      id = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET).id
    } catch (err) {
      return res.status(500).json({
        message: "Refresh token is invalid",
        type: "error"
      }) 
    }

    if (!id)
      return res.status(500).json({
        message: "Invalid refresh token",
        type: "error"
      })

    // At this point, the refresh token is valid
    // Check user

    const user = User.findById(id)

    // if the user doesn't exist
    if (!user) 
      return res.status(500).json({
        message: "User not found",
        type: "error"
    })

    if (user.refresh_token != refresh_token)
      return res.status(500).json({
        message: "Refresh token is invalid",
        type: "error"
    })

    // The refresh token is correct
    const access_token = create_access_token(user._id)
    const new_refresh_token = create_refresh_token(user._id)
    user.refresh_token = new_refresh_token
    send_refresh_token(res, new_refresh_token)
    return res.status(200).json({
      access_token,
      message: "Access token refreshed",
      type: "success"
    })

  } catch (err) {
    return res.status(500).json({
      message: "Error refreshing token",
      type: "error"
    })
  }

})


module.exports = router
