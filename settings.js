require("dotenv/config")

const http_port = process.env.HTTP_PORT || 8080
const mongodb_user = process.env.MONGODB_USER
const mongodb_pass = process.env.MONGODB_PASS
const mongodb_host = process.env.MONGODB_HOST
const mongodb_db = process.env.MONGODB_DB


module.exports = {
  mongodb: {
    username: mongodb_user,
    password: mongodb_pass,
    host: mongodb_host,
    db: mongodb_db
  },
  http: {
    port: http_port
  }
}

