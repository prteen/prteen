const { Party } = require("../../models/party")
const { Crud } = require("../../interfaces/crud")


module.exports = new Crud(
  Party,
  {
    identifiers: {
      _id: "id",
      title: null
    },
    overrides: {
      "read_all": (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/`)
        router.get("/", (req, res) => {
          // this sounds dumb, but its needed if the object haven't a "private" field. If it hasn't, then assume it is public
          console.log(req.query)
          let query = {private: {"$ne": true}}
          if("tags" in req.query){
            query.tags = {}

            const include = []
            const exclude = []
            req.query.tags.toLowerCase().split(",").forEach(tag => {
              if(tag.startsWith("!")){
                exclude.push(tag.substring(1))
              } else {
                include.push(tag)
              }
            })

            if(include.length > 0) query.tags.$all = include
            if(exclude.length > 0) query.tags.$nin = exclude
            if(Object.keys(query.tags).length === 0) delete query.tags
          }
          console.log(query)
          parent.model.find(query)
            .then(objs => {
              return res.status(200).json(objs)
            })
            .catch(error => {
              return res.status(500).json({
                message: "Failed to retrieve objs",
                type: "error",
                error: error
              })
            })
        })
      },
      "read": (parent, router, route, validator) => {
        parent.settings.forIdentifiers((id_db, id_symb) => {
          console.log(` --> creating operation GET @ ${route}/${id_symb}`)
          router.get(`/${id_symb}/:id`, (req, res) => {
            let query = {}
            query[id_db] = req.params.id
            parent.model.findOne(query)
              .then(obj => {
                console.log(obj)
                if(obj.private){
                  return res.status(403).json({
                    message: "Forbidden",
                    type: "error"
                  })
                }
                return res.status(200).json(obj)
              })
              .catch(err => {
                console.log(err)
              })
          })
        }) 
      },
    },
    exclude: ["update", "delete", "create"]
  }
)

