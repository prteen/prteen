//const app = require("./app/app")
const {connect} = require("./db/mongodb")
const {http} = require("./settings")
const bootstrap = require("./app/app")

Promise.all([connect(), bootstrap()]).then(() => {
  console.log(` Server started on http://127.0.0.1:${http.port}/`);
})


// app.locals.db = connect()
//   .then(() => {
//     console.log("Connected to Database");
//     app.listen(http.port, () => {
//         //     })
// })



