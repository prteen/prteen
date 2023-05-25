require("dotenv/config")


module.exports = {
  mongodb: {
    username: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASS,
    host: process.env.MONGODB_HOST,
    db: process.env.MONGODB_DB
  },
  http: {
    port: process.env.HTTP_PORT || 8080
  },
  auth: {
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expiration: process.env.ACCESS_TOKEN_EXPIRATION || "5m",
    refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRATION || "7d"
  }
}

