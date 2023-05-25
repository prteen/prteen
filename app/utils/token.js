const { sign } = require('jsonwebtoken')
const { auth } = require('../../settings')

// creates a JWT token that expires in 10 minutes
const create_access_token = (id) => {
  return sign({id}, auth.access_token_secret, {
    expiresIn: 100000000 * 60,
  })
}

// creates a JWT refresh token that expires in 7 days
const create_refresh_token = (id) => {
  return sign({id}, auth.refresh_token_secret, {
    expiresIn: "7d",
  })
}

// sends the access token to the client
const send_access_token = (_req, res, access_token) => {
  res.json({
    access_token,
    message: "Logged in successfully",
    type: "success"
  })
}

// sends the refresh token as a cookie to the client
const send_refresh_token = (res, refresh_token) => {
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
  })
}

module.exports = {
  create_access_token,
  create_refresh_token,
  send_access_token,
  send_refresh_token,
}
