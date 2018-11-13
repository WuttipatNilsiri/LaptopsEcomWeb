const express = require('express');
const router = express.Router();

// Article Model
let Laptop = require('../models/laptop');
// User Model
let User = require('../models/user');

let Order = require('../models/order');

// let temporder = {}
router.get('/',function(req,res){
    
    var array_values = new Array();
    sum = 0
    for (var key in res.locals.user.cart) {
        item = res.locals.user.cart[key]
        sum = sum + (item.laptop.price * item.quatity)
        array_values.push(item);
    }



    let q = {_id:res.locals.user._id}

    User.findById(q,function(err,user){
        
        cards = user.creditcard
        var card = new Array();
        if(cards != null){
            for(var x in cards){
                card.push(x)
            }
        }
        
        res.render('checkout',{
            cart:array_values,
            totalprice:sum,
            cards:card    
        })    
    })
    
    // res.render('checkout',{
    //     cart:array_values,
    //     totalprice:sum
    // })
})

router.post('/placeorder',function(req,res){
    
      card = req.body.cardnumber
      console.log(card)
      if(card){
          
      }
      else{
          return;
      }
      d = new Date();
      date = d.toLocaleString()
    

      res.locals.user = req.user
      let query = {_id:res.locals.user._id}

      
      
      User.findById(query , function(err, user){
        
        var sum = 0
        
        for (var key in user.cart) {
            item = res.locals.user.cart[key]
            sum = sum + (item.laptop.price * item.quatity)
            // array_values.push(item);
        }    

        let newOrder = new Order({
            userid:req.user._id,
            date:date,
            items:user.cart,
            totalprice:sum,
            paymentcard:card
        })

        newOrder.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
              console.log("PLACED_OK");
            }
        });

        thiscart = null
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
              res.render('checkcomplet')
            }
        })
    })

    
})


router.post('/comfirm',function(req,res){
    
    card = req.body.cardnumber
    res.locals.user = req.user
    var array_values = new Array();
    sum = 0
    
    for (var key in res.locals.user.cart) {
        item = res.locals.user.cart[key]
        sum = sum + (item.laptop.price * item.quatity)
        array_values.push(item);
    }



    let q = {_id:res.locals.user._id}

    User.findById(q,function(err,user){
        
        address = user.address
        
        
        res.render('confirm',{
            cart:array_values,
            totalprice:sum,
            card:card,
            address:address    
        })    
    })

  
})




module.exports = router;