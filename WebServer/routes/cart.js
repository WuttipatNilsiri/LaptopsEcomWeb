const express = require('express');
const router = express.Router();

// Article Model
let Laptop = require('../models/laptop');
// User Model
let User = require('../models/user');



router.get('/show', function(req,res){
    var array_values = new Array();
    sum = 0
    count = 0
    if (res.locals.user.cart != null){
        for (var key in res.locals.user.cart) {
            item = res.locals.user.cart[key]
            sum = sum + (item.laptop.price * item.quatity)
            array_values.push(item);
            count = count + item.quatity
        }
    } 
    
    
    
    res.render('cart',{
        cart:array_values,
        totalprice:sum,
        count:count,
        
    })
})


router.get('/delete/:id', function(req, res){
    
    let query = {_id:res.locals.user._id}
    
    User.findById(query , function(err, user){
      thiscart = user.cart
      delete thiscart[req.params.id]
      let userupdate = {};
      userupdate.cart = thiscart
      res.locals.user.cart = thiscart
      let query = {_id:res.locals.user._id}
      User.update(query,userupdate, function(err){
          if(err){
            console.log(err);
            return;
          } else {
            res.redirect('/cart/show');
          }
      })


    });
  });

router.post('/save',function(req,res){
    
    res.locals.user = req.user
    let query = {_id:res.locals.user._id}
    User.findById(query , function(err, user){
        thiscart = user.cart

        for(var key in thiscart){
            if(req.body['quatity-'+key] <= 0){
                delete thiscart[key]
            }
            else
                thiscart[key].quatity = parseInt(req.body['quatity-'+key]) 
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
              res.redirect('/cart/show');
            }
        })
    })

})

module.exports = router;
