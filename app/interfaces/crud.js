const express = require("express")

class CrudSettings {
  static fields = ["identifiers"]

  constructor(data) {
    this.identifiers = null
    CrudSettings.fields.forEach(field => this[field] = data[field])
  }
}


class Crud {
  constructor(model_class, settings) {
    if(typeof settings === "CrudSettings") {
      this.settings = settings
    } else {
      this.settings = new CrudSettings(settings)
    }
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

    router.post("/", async (req, res) => {
      // Future changes to control (organizer, title) tuple to be unique 
      try {
        let obj = new this.model(req.body) 
        await obj.save() 
        return res.status(200).json({
          message: "Successfully created new obj",
          type: "success",
        })
      } catch (error) {
        return res.status(500).json({
          message: "Failed to create new obj",
          type: "error",
          error: error
        }) 
      } 

    })

    Object.keys(this.settings.identifiers).forEach((id_name) => {
      let id_alias = this.settings.identifiers[id_name] || id_name

      console.log(`creating endpoint ${route}/${id_alias}`)
      router.get(`/${id_alias}/:id`, (req, res) => {
        let query = {}
        query[id_name] = req.params.id
        console.log(query)
        this.model.find(query)
          .then(obj => res.json(obj))
          .catch(err => {
            console.log(err)
          })
      })
    })


    parent.use(route, router)
  } 
} 


module.exports = {Crud, CrudSettings}
