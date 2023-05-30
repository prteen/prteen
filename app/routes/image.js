const multer = require('multer');
const router = require('express').Router();
const {Image} = require('../models/image');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({dest: 'uploads'});

router.get('/', (req, res) => {
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
})

router.post('/upload', upload.single('image'), (req, res) => {
  const image = new Image({
    img: {
      data: fs.readFileSync(path.join(__dirname + '../../../uploads/' + req.file.filename)),
      contentType: 'image/png'
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

module.exports = router;
