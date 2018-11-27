var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
let Laptop = require('../models/laptop');
 
//path and originalname are the fields stored in mongoDB
var imageSchema = mongoose.Schema({
 path: {
 type: String,
 required: true,
 trim: true
 },
 originalname: {
 type: String,
 required: true
 }
 
});
 
 
var Image = module.exports = mongoose.model('files', imageSchema);
 
router.getImages = function(callback, limit) {
 
 Image.find(callback).limit(limit);
}
 
 
router.getImageById = function(id, callback) {
  
 Image.findById(id, callback);
 
}
 
router.addImage = function(image, callback) {
 Image.create(image, callback);
}
 
 
// To get more info about 'multer'.. you can go through https://www.npmjs.com/package/multer..
var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 console.log(file)
 cb(null, 'public/uploads/')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});
 
var upload = multer({
 storage: storage
});


router.get('/img', function(req, res) {
    //calling the function from index.js class using routes object..
    router.getImages(function(err, genres) {
    if (err) {
    
     
    }
    res.json(genres);
     
    });
});
     
    // URL : http://localhost:3000/images/(give you collectionID)
    // To get the single image/File using id from the MongoDB
router.get('/img/:id', function(req, res) {
     
    //calling the function from index.js class using routes object..
    // q = {_id:req.params.id}
    router.getImageById(req.params.id, function(err, genres) {
    if (err) {
        res.redirect('/uploads/nullimg.jpg')
    }
    
    else if (genres == null){
        res.redirect('/uploads/nullimg.jpg')
    }else
        res.redirect('/'+genres.path.toString())
    // res.send(genres.path)
    });
});
 
router.get('/', function(req, res, next) {
    // console.log('sadada')
    res.render('upload');
});
 
router.post('/addlaptop', upload.any(), function(req, res, next) {
 
//  res.send(req.files);

    console.log(req.body)
 
 
/*req.files has the information regarding the file you are uploading...
from the total information, i am just using the path and the imageName to store in the mongo collection(table)
*/
    var path = req.files[0].path;
    var imageName = req.files[0].originalname;
 
    var imagepath = {};
    imagepath['path'] = 'uploads/'+imageName;
    imagepath['originalname'] = imageName;
 


 //imagepath contains two objects, path and the imageName
 
 //we are passing two objects in the addImage method.. which is defined above..
    router.addImage(imagepath, function(err,result) {
    console.log(result)
    var laptop = new Laptop({
        name:req.body.name,
        brand:req.body.brand,
        price:parseInt(req.body.price),
        img:result._id,
        spec:JSON.parse(req.body.spec)
    });
    
    Laptop.find({name:req.body.name},function(err,laptops){
        if(laptops.length == 0){
          laptop.save(function(err){
            if (err){
              console.log(err);
            }
            else
              console.log('Saved');
              res.redirect('/store')
          });
        }
    })
    
 });
 
});
 
module.exports = router;