const {connect} = require("../db/mongodb")
const {user, image, party} = require("../app/models")

async function run() {
  let db = await connect().then(() => {
    const models = [user.User, image.Image, party.Party]

    models.forEach(Model => {
      Model.deleteMany({}).await
    })
  })

  console.log(db)
}

run()

