const { Party } = require("../../models/party")
const { Crud } = require("../../interfaces/crud")
const { protected } = require("../../utils/protected")
const { Router } = require("express")

module.exports = new Crud(
  Party,
  {
    router: Router({mergeParams: true}),
    overrides: {
      update: (parent, router, route, validator) => {
        console.log(` --> creating operation POST @ ${route}/\{partyId\}/join [protected]`)
        console.log(router)
        router.post("/", protected, async (req, res) => {
          try {
            let party = await parent.model.findById(req.params.partyId)
            console.log(req)
            if(party === null) {
              return res.status(404).json({
                message: "Party not found",
                type: "error"
              })
            }
            if(party.private && !party.invited.includes(req.user._id)) {
              return res.status(404).json({
                message: "Party not found",
                type: "error"
              })
            }
            if(party.participants.includes(req.user._id)) {
              return res.status(409).json({
                message: "You are already partecipating in this party",
                type: "error"
              })
            }
            party.participants.push(req.user._id)
            party.save()
            return res.status(200).json({
              message: "Successfully joined party",
              type: "success",
              id: party._id
            })
          } catch (error) {
            return res.status(500).json({
              message: "Failed to update obj",
              type: "error",
              error: error
            })
          }
        })
      }
    },
    exclude: "__all__"
  }
)

