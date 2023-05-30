const { Party } = require("../../models/party")
const { Crud } = require("../../interfaces/crud")
const { Router } = require("express")


module.exports = new Crud(
  Party,
  {
    router: Router({mergeParams: true}),
    overrides: {
      "read_all": (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/`)
        router.get("/", (req, res) => {
          console.log(req.query)
          // this sounds dumb, but its needed if the object haven't a "private" field. If it hasn't, then assume it is public
          let query = {private: {"$ne": true}}

          // parse tags
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

          // parse date
          if("date" in req.query){
            const date = new Date(req.query.date)
            console.log(date)
            if(date >= (new Date()).setTime(0)){
              // check if date in db is greater than query date and less than query date + 24 hours
              query.date = {"$gte": date, "$lt": new Date(date.getTime() + 24 * 60 * 60 * 1000)}
            }
          }

          console.log(query)
          parent.model.find(query)
            .then(objs => {
              return res.status(200).json(objs)
            })
            .catch(error => {
              //throw error
              return res.status(500).json({
                message: "Failed to retrieve objs",
                type: "error",
                error: error
              })
            })
        })
      },
      "read": (parent, router, route, validator) => {
        parent.settings.read_router = internal = Router({mergeParams: true})
        router.use("/id/:id", internal)
        console.log(` --> creating operation GET @ ${route}/:id`)
        internal.get(`/`, (req, res) => {
          let query = {}
          console.log(req.params)
          query._id = req.params.id
          parent.model.findOne(query)
            .then(obj => {
              if(obj === null || obj.private) {
                return res.status(404).json({
                  message: "Party not found",
                  type: "error"
                })
              }
              return res.status(200).json(obj)
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

