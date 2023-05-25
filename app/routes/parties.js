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
              Object.assign(obj, req.body)
              console.log(obj)
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
      }
    },
    exclude: ["create", "read", "delete"]
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

module.exports = {logged: crud_logged, public: crud_public, router}
