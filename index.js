const {connect} = require("./db/mongodb")
const {http} = require("./settings")
const bootstrap = require("./app/app")

Promise.all([connect(), bootstrap(http.port, () => {
  console.log(` Server started on http://127.0.0.1:${http.port}/`);
})])


