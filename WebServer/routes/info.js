const express = require('express');
const router = express.Router();

// Article Model
let Laptop = require('../models/laptop');
// User Model
let User = require('../models/user');


router.post('/addtocart/:itemid', function(req, res){
    res.locals.user = req.user
    // console.log("User ="+req.user) 
    if (res.locals.user == null){
        res.redirect('/users/login');
        return;
    }
    // console.log("id="+req.params.itemid)
    Laptop.findById(req.params.itemid,function(err,laptop){
        User.findById(res.locals.user._id,function(err,user){
            thiscart = user.cart
            if (thiscart == null){
                thiscart = {}
            }
            // console.log("quatity="+req.body.quatity)
            quati = parseInt(req.body.quatity)
            
            if (thiscart[laptop._id] == null) {
                thiscart[laptop._id] = {laptop:laptop,quatity:quati}
            }
            else {
                q = thiscart[laptop._id].quatity
                q = q + quati
                thiscart[laptop._id] = {laptop:laptop,quatity:q}
            }
            let userupdate = {};
            userupdate.cart = thiscart
            res.locals.user.cart = thiscart
            let query = {_id:res.locals.user._id}
            User.update(query,userupdate, function(err){
                if(err){
                  console.log(err);
                  return;
                } else {
                //   console.log("update OK")
                  res.redirect('/cart/show');
                }
            })
        })
    })
      
})

router.post('/addtocart/:itemid/:q', function(req, res){
    res.locals.user = req.user
    // console.log("User ="+req.user) 
    if (res.locals.user == null){
        res.redirect('/users/login');
        return;
    }
    // console.log("id="+req.params.itemid)
    Laptop.findById(req.params.itemid,function(err,laptop){
        User.findById(res.locals.user._id,function(err,user){
            thiscart = user.cart
            if (thiscart == null){
                thiscart = {}
            }
            // console.log("quatity="+req.body.quatity)
            quati = parseInt(req.params.q)
            
            if (thiscart[laptop._id] == null) {
                thiscart[laptop._id] = {laptop:laptop,quatity:quati}
            }
            else {
                q = thiscart[laptop._id].quatity
                q = q + quati
                thiscart[laptop._id] = {laptop:laptop,quatity:q}
            }
            let userupdate = {};
            userupdate.cart = thiscart
            res.locals.user.cart = thiscart
            let query = {_id:res.locals.user._id}
            User.update(query,userupdate, function(err){
                if(err){
                  console.log(err);
                  return;
                } else {
                //   console.log("update OK")
                  res.redirect('/cart/show');
                }
            })
        })
    })
      
})


// Get Single Article
router.get('/:id', function(req, res){
  Laptop.findById(req.params.id, function(err, laptop){
  
      res.render('info', {
        laptop:laptop, 
        
      });

  });
});


module.exports = router;




