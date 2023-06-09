const { Party } = require("../../models/party")
const { Crud } = require("../../interfaces/crud")
const { prot } = require("../../utils/prot")

module.exports = new Crud(
  Party,
  {
    overrides: {
      "create": (parent, router, route, validator) => {
        console.log(` --> creating operation POST @ ${route}/ [prot]`)
        router.post("/", prot, async (req, res) => {
          try {
            let obj = new parent.model(req.body)
            obj.organizer = req.user._id
            await obj.save()
            return res.status(201).json({
              message: "Party created successfully",
              type: "success",
              id: obj._id
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
          console.log(` --> creating operation PUT @ ${route}/${id_symb} [prot]`)
          router.put(`/${id_symb}:id`, prot, async (req, res) => {
            try {
              let query = {}
              query[id_db] = req.params.id
              let obj = await parent.model.findOne(query)
              if(obj === null || !obj.organizer.equals(req.user._id)) {
                return res.status(404).json({
                  message: "Party not found",
                  type: "error"
                })
              }
              for(const field of ["organizer", "_id"]) {
                if(field in req.body) {
                  return res.status(409).json({
                    message: `Read-only field: ${field}`,
                    type: "error"
                  })
                }
              }


              Object.assign(obj, req.body)
              await obj.save()
              return res.status(200).json({
                message: "Party updated",
                type: "success",
                obj: obj 
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
      "read_all": (parent, router, route, validator) => {
        parent.settings.forIdentifiers((id_db, id_symb) => {
          console.log(` --> creating operation GET @ ${route}/${id_symb} [prot]`)
          router.get(`/`, prot, async (req, res) => {
            try {
              let query = {"organizer": req.user._id}
              let objs = await parent.model.find(query)
              return res.status(200).json(objs)
            } catch (error) {
              return res.status(500).json({
                message: "Failed to get objs",
                type: "error",
                error: error
              })
            }
          })
        })
      },
      "read": (parent, router, route, validator) => {
        parent.settings.forIdentifiers((id_db, id_symb) => {
          console.log(` --> creating operation GET @ ${route}/${id_symb} [prot]`)
          router.get(`/${id_symb}:id`, prot, async (req, res) => {
            try {
              let query = {organizer: req.user._id}
              query[id_db] = req.params.id
              let obj = await parent.model.findOne(query)
              if(obj === null || !obj.organizer.equals(req.user._id)) {
                return res.status(404).json({
                  message: "Party not found",
                  type: "error"
                })
              }
              return res.status(200).json(obj) 
            } catch (error) {
              return res.status(500).json({
                message: "Failed to get obj",
                type: "error",
                error: error
              })
            }
          })
        })
      },
      "delete": (parent, router, route, validator) => {
        parent.settings.forIdentifiers((id_db, id_symb) => {
          console.log(` --> creating operation DELETE @ ${route}/${id_symb} [prot]`)
          router.delete(`/${id_symb}:id`, prot, async (req, res) => {
            try {
              let query = {}
              query[id_db] = req.params.id
              let obj = await parent.model.findOne(query)
              if(obj === null || !obj.organizer.equals(req.user._id)) {
                return res.status(404).json({
                  message: "Object not found",
                  type: "error"
                })
              }
              await parent.model.deleteOne({_id: obj._id})
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

