const multer = require('multer')
const {Image} = require('../models/image');
const protected = require('../utils/protected');
const { Crud } = require('../interfaces/crud.js')


const crud = new Crud(
  Image,
  {
    identifiers: {
      _id: "id"
    },
    overrides: {
      create: (parent, router, route, validator) => {
        console.log(` --> creating operation POST @ ${route}/upload [protected]`)
        const upload = multer({storage: multer.memoryStorage()})
        console.log(upload)
        router.post("/upload", protected, upload.single('image'), (req, res) => {
          const image = new Image({
            img: {
              data: req.file.buffer,
              contentType: 'image'
            }
          })

          image.save()
            .then((result) => {
              return res.status(200).json({
                success: true,
                document: result
              })
            }
            ).catch((err) => { 
              return res.status(500).json({
                success: false,
                error: err,
                message: 'Error uploading image'
              })}
            )
        })
      },
      "read_all": (parent, router, route, validator) => {
        console.log(` --> creating operation GET @ ${route}/`)
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
      "delete": (parent, router, route, validator) => {
        console.log(` --> creating operation DELETE @ ${route}/:id [protected]`)
        router.delete("/:id", protected, (req, res) => {
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
