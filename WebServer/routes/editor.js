var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
let Laptop = require('../models/laptop');
 
//path and originalname are the fields stored in mongoDB
 
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


router.get('/:id',function(req,res){
    Laptop.findById(req.params.id,function(err,laptop){
        if(err){
            console.log(err)
        }else
            res.render('edit',{laptop:laptop})
    })
})
 
router.post('/save/:id', function(req, res, next) {
    // console.log(req.body)
    // console.log(req.files)
    let data = req.body
    let laptoptoupdate = {}
    for (var key in data){
        // console.log(key)
        if (data[key] != null || data[key] != ''){
            if (key == 'spec')
                laptoptoupdate[key] = JSON.parse(data[key])
            else
                laptoptoupdate[key] = data[key]
        }
    }
    Laptop.update({_id:req.params.id},laptoptoupdate,function(err){
        if (err){
            console.log(err)
        }
        else
            res.redirect('/laptops/'+req.params.id)
    })


 
//  res.send(req.files);

//     console.log(req.body)
 
    
// /*req.files has the information regarding the file you are uploading...
// from the total information, i am just using the path and the imageName to store in the mongo collection(table)
// */  imageName = null
//     if (req.files[0] == null)
//         var imageName = 'nullimg.jpg'
//     else 
//         var imageName = req.files[0].originalname;
 
//     var imagepath = {};
//     imagepath['path'] = 'uploads/'+imageName;
//     imagepath['originalname'] = imageName;
//     let spec = null
//     try {
//         spec = JSON.parse(req.body.spec)
//     }catch(err){
//         res.render('upload',{error:err})
//         return
//     }


//  //imagepath contains two objects, path and the imageName
 
//  //we are passing two objects in the addImage method.. which is defined above..
//     router.addImage(imagepath, function(err,result) {
//     console.log(result)
//     var laptop = new Laptop({
//         name:req.body.name,
//         brand:req.body.brand,
//         price:parseInt(req.body.price),
//         img:result._id,
//         spec:spec,
//         detail:req.body.detail
//     });
    
//     Laptop.find({name:req.body.name},function(err,laptops){
//         if(laptops.length == 0){
//           laptop.save(function(err){
//             if (err){
//               console.log(err);
//             }
//             else
//               console.log('Saved');
//               res.redirect('/store')
//           });
//         }
//     })
    
//     });
        
 
});
 
module.exports = router;