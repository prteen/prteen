const express = require("express")

class CrudSettings {
  constructor(data) {
    this.identifiers = data.identifiers || {_id: ""}
    this.exclude = data.exclude || []
    this.overrides = data.overrides || {}
    this.validators = data.validators || {}
    this.router = data.router || express.Router({mergeParams: true})

    if(data.exclude === "__all__"){
      this.exclude = Object.keys(operations)
    }
  }

  forIdentifiers(callback) {
    Object.keys(this.identifiers).forEach((key) => {
      let value = this.identifiers[key]
      if(value === null){
        value = key
      }
      if(value !== ""){
        value += "/"
      }

      callback(key, value)
    })
  }
}

const operations = {
  create(parent, router, route, validator) {
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
  
  read(parent, router, route, validator) {
    parent.settings.forIdentifiers((id_db, id_symb) => {
      console.log(` --> creating operation GET @ ${route}/${id_symb}`)
      router.get(`/${id_symb}:id`, (req, res) => {
        let query = {}
        query[id_db] = req.params.id
        parent.model.findOne(query)
          .then(obj => res.json(obj))
          .catch(err => {
            console.log(err)
          })
      })
    })
  },

  read_all(parent, router, route, validator) {
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

  update(parent, router, route, validator) {
    console.log(` --> creating operation PUT @ ${route}/`)

    parent.settings.forIdentifiers((id_db, id_symb) => {
      router.put(`/${id_symb}:id`, async (req, res) => {
        try {
          // if(validation !== undefined) {
          //   const validation = validator(req, res)
          //   if(!validation.ok) {
          //     return res.status(401).json({
          //       message: "Unauthorized",
          //       type: "error",
          //       error: validation.error
          //     })
          //   }
          // }
          console.log(req.body)
          let query = {}
          query[id_db] = req.params.id
          let obj = await parent.model.findOne(query)
          if(obj === null) {
            let new_data = Object.assign({}, req.body)
            new_data[id_db] = req.params.id
            obj = new parent.model(new_data)
            await obj.save()
            return res.status(200).json({
              message: "Successfully created new obj",
              type: "success",
            })
          }
          console.log(obj)
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

  delete(parent, router, route, validator) {
    parent.settings.forIdentifiers((id_db, id_symb) => {
      console.log(` --> creating operation DELETE @ ${route}/${id_symb}`)
      router.delete(`/${id_symb}:id`, async (req, res) => {
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
    Object.keys(operations).forEach((operation) => {
      if(operation in this.settings.overrides) {
        console.log(`=> Creating [overriden] operation ${operation} for route ${route}`)
        this.settings.overrides[operation](this, this.settings.router, route)
        return
      } else if(!this.settings.exclude.includes(operation)) {
        console.log(`=> Creating [automatic] operation ${operation} for route ${route}`)
        operations[operation](this, this.settings.router, route, this.settings.validators[operation])
      }
    })

    parent.use(route, this.settings.router)
    return this.settings.router
  } 
} 


module.exports = {Crud, CrudSettings}
