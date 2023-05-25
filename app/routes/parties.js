const express = require("express")
const router = express.Router()

const { Party } = require("../models/party")
const { Crud } = require("../interfaces/crud")
const { protected } = require("../utils/protected")

const crud_logged = new Crud(
  Party, 
  { 
    identifiers: {
      _id: "id",
      title: null
    },
    overrides: {
      "read_all": (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/`)
        router.get("/", protected, (req, res) => {
          parent.model.find({"participants": {"$in": [req.user._id]}})
            .then(objs => {
              res.json(objs)
            })
            .catch(err => {
              console.log(err)
            })
        })
      },
    },
    exclude: "__all__"
  }
)

const crud_public = new Crud(
  Party,
  {
    identifiers: {
      _id: "id",
      title: null
    },
    exclude: ["update", "delete", "create"]
  }
)

const crud_organizer = new Crud(
  Party,
  {
    identifiers: {
      _id: "id",
      title: null
    },
    overrides: {
      "create": (parent, router, route, validator) => {
        console.log(` --> creating operation POST @ ${route}/ [protected]`)
        router.post("/", protected, async (req, res) => {
          try {
            let obj = new parent.model(req.body)
            obj.organizer = req.user._id
            await obj.save()
            return res.status(200).json({
              message: "Successfully created new obj",
              type: "success",
            })
          }
          catch (error) {
            return res.status(500).json({
              message: "Failed to create new obj",
              type: "error",
              error: error
            })
          }
        })
      },
      "update": (parent, router, route, validator) => {
        parent.settings.forIdentifiers((id_db, id_symb) => {
          console.log(` --> creating operation PUT @ ${route}/${id_symb} [protected]`)
          router.put(`/${id_symb}/:id`, protected, async (req, res) => {
            try {
              let query = {}
              query[id_db] = req.params.id
              let obj = await parent.model.findOne(query)
              if(obj === null) {
                return res.status(404).json({
                  message: "Object not found",
                  type: "error"
                })
              }
              if(!obj.organizer.equals(req.user._id)) {
                return res.status(403).json({
                  message: "Forbidden",
                  type: "error"
                })
              }
              
              for(const field of ["organizer", "_id"]) {
                if(field in req.body) {
                  return res.status(409).json({
                    message: `Read only field: ${field}`,
                    type: "error"
                  })
                }
              }


              Object.assign(obj, req.body)
              obj.save()
              return res.status(200).json({
                message: "Object updated",
                type: "success",
                obj
              })
            } catch (error) {
              throw error
              return res.status(500).json({
                message: "Failed to update obj",
                type: "error",
                error: error
              }) 
            }
          })
        })
      },
      "delete": (parent, router, route, validator) => {
        parent.settings.forIdentifiers((id_db, id_symb) => {
          console.log(` --> creating operation DELETE @ ${route}/${id_symb} [protected]`)
          router.delete(`/${id_symb}/:id`, protected, async (req, res) => {
            try {
              let query = {}
              query[id_db] = req.params.id
              let obj = await parent.model.findOne(query)
              if(obj === null) {
                return res.status(404).json({
                  message: "Object not found",
                  type: "error"
                })
              }
              if(!obj.organizer.equals(req.user._id)) {
                return res.status(403).json({
                  message: "Forbidden",
                  type: "error"
                })
              }
              await obj.remove()
              return res.status(200).json({
                message: "Object deleted",
                type: "success",
                obj
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
    },
    exclude: "__all__"
  }
)

module.exports = {logged: crud_logged, public: crud_public, organizer: crud_organizer, router}
