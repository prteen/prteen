const multer = require('multer');
const router = require('express').Router();
const {Image} = require('../models/image');
const { prot } = require('../utils/prot');
const { Crud } = require('../interfaces/crud.js')

const upload = multer({storage: multer.memoryStorage()});

const crud = new Crud(
  Image,
  {
    identifiers: {
      _id: "id"
    },
    overrides: {
      create: (parent, router, route, validator) => {
        console.log(` --> creating operation POST @ ${route}/ [prot]`)
        router.post('/', prot, upload.single('image'), (req, res) => {
          const image = new Image({
            img: {
              data: req.file.buffer,
              contentType: 'image'
            }
          })

          image.save()
            .then((result) => {
              res.status(200).json({
                success: true,
                document: result
              })
            }
            ).catch((err) => 
              res.status(500).json({
                success: false,
                error: err,
                message: 'Error uploading image'
              })
            )
        })
      },
      read_all: (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/:id`)
        router.get('/', (_req, res) => {
        Image.find({}) 
          .then((data, err) => {
            if (err) {
              res.status(500).json({
                success: false,
                error: err
              })
            }
            res.render('image_upload', {images: data});
        })
        .catch(err => {
          console.log(err)
          })
        })
      },
      read: (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/:id [prot]`)
        router.get('/:id', prot, (req, res) => {
          Image.findById(req.params.id)
            .then((result) => {
              res.status(200).json({
                success: true,
                document: result
              })
            })
            .catch((err) => {
              res.status(500).json({
                success: false,
                error: err
              })
            })
        }) 
      },
      delete: (parent, router, route, validator) => {
        console.log(` --> creating operation DELETE @ ${route}/:id [prot]`)
        router.delete("/:id", prot, (req, res) => {
          let id = req.params.id
          Image.findByIdAndDelete(id)
            .then(image => {
              if (image == null) {
                return res.status(404).json({error: "Image not found"})
              }
              res.json(image)
            })
            .catch(err => {
              console.log(err)
            })
        })
      }
    },
    exclude: ["update"]
})



module.exports = crud;
