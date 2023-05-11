const express = require("express")

class CrudSettings {
  constructor(data) {
    this.identifiers = data.identifiers || {}
    this.exclude = data.exclude || []
  }

  forIdentifiers(callback) {
    Object.keys(this.identifiers).forEach((key) => {
      callback(key, this.identifiers[key] || key)
    })
  }
}

const operations = {
  create(parent, router, route) {
    console.log(` --> creating operation POST @ ${route}`)
    router.post("/", async (req, res) => {
      try {
        let obj = new parent.model(req.body)
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
  },
  
  read(parent, router, route) {
    parent.settings.forIdentifiers((id_db, id_symb) => {
      console.log(` --> creating operation GET @ ${route}/${id_symb}`)
      router.get(`/${id_symb}/:id`, (req, res) => {
        let query = {}
        query[id_db] = req.params.id
        parent.model.find(query)
          .then(obj => res.json(obj))
          .catch(err => {
            console.log(err)
          })
      })
    })
  },

  read_all(parent, router, route) {
    console.log(` --> creating operation GET @ ${route}/`)
    router.get("/", (_req, res) => {
      parent.model.find()
        .then(objs => {
          res.json(objs)
        })
        .catch(err => {
          console.log(err)
        })
    })
  },

  update(parent, router, route) {
    parent.settings.forIdentifiers((id_db, id_symb) => {
      console.log(` --> creating operation PUT @ ${route}/${id_symb}`)
      router.get(`/${id_symb}/:id`, async (req, res) => {
        try {
          let query = {}
          query[id_db] = req.params.id
          let obj = await parent.model.findOne(query)
          obj = Object.assign(obj, req.body)
          await obj.save()
          return res.status(200).json({
            message: "Successfully updated obj",
            type: "success",
          })
        } catch (error) {
          return res.status(500).json({
            message: "Failed to update obj",
            type: "error",
            error: error
          }) 
        }
      })
    })
  },

  delete(parent, router, route) {
    parent.settings.forIdentifiers((id_db, id_symb) => {
      console.log(` --> creating operation DELETE @ ${route}/${id_symb}`)
      router.delete(`/${id_symb}/:id`, async (req, res) => {
        try {
          let query = {}
          query[id_db] = req.params.id
          let obj = await parent.model.deleteOne(query)
          if(obj.deletedCount == 0) {
            return res.status(404).json({
              message: "Failed to delete obj",
              type: "error",
              error: "Object not found"
            })
          }
          return res.status(200).json({
            message: "Successfully deleted obj",
            type: "success",
            response: obj
          })
        } catch (error) {
          throw error
          return res.status(500).json({
            message: "Failed to delete obj",
            type: "error",
            error: error
          }) 
        }
      })
    })
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

    Object.keys(operations).forEach((operation) => {
      if(this.settings.exclude.includes(operation)) {
        return
      }
      console.log(`=> Creating operation ${operation} for route ${route}`)
      operations[operation](this, router, route)
    })

    parent.use(route, router)
  } 
} 


module.exports = {Crud, CrudSettings}
