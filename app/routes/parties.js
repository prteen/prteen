const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const { User } = require("../models/user")

const { Party } = require("../models/party")
const { Crud } = require("../interfaces/crud")
const { protected } = require("../utils/protected")

const crud = new Crud(
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
      }
    },
    exclude: ["create", "read", "update", "delete"]
  }
)

// Edit a party. Requires the user to be logged in.
router.put('/edit/:id', protected, async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({message: 'User is not logged in', type: 'error'});

    let party = await Party.findById(req.params.id)
    if (!party) return res.status(404).json({message: 'Party not found', type: 'error'})

    // Check if the user is the organizer
    if (!party.organizer.equals(req.user._id)) return res.status(401).json({message: 'User is not the organizer', type: 'error'})

    // Set the new values
    party.title = req.body.title
    party.description = req.body.description
    party.tags = req.body.tags 
    party.image = req.body.image
    party.max_participants = req.body.max_participants

    // Save the Party
    await party.save()

    return res.status(200).json({message: 'Party updated', type: 'success', party})
  } catch (err) {
    return res.status(401).json({message: 'Error in checking login', type: 'error', err}) 
  }
})

module.exports = {crud, router}
