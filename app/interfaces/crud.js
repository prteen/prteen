const express = require("express")

class CrudSettings {
  constructor(identifiers) {
    this.identifiers = identifiers
  }
}

class Crud {
  constructor(model_class, settings) {
    this.settings = settings
    this.model = model_class
  }

  register(parent, route) {
    let router = express.Router()

    router.get("/", (req, res) => {
      this.model.find()
        .then(objs => {
          res.json(objs)
        })
        .catch(err => {
          console.log(err)
        })
    })

    Object.keys(this.settings.identifiers).forEach((id_name) => {
      let id_alias = this.settings.identifiers[id_name] || id_name

      console.log(`creating endpoint under ${route} for identifier: "${id_alias}"`)
      router.get(`"/${id_alias}/:id`, (req, res) => {
        let query = {}
        query[id_name] = req.params.id
        this.model.find(query)
          .then(obj => res.json)
          .catch(err => {
            console.log(err)
          })
      })
    })


    parent.use(route, router)
  } 
} 


module.exports = {Crud, CrudSettings}
