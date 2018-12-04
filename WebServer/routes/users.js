const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');
let Order = require('../models/order');



// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const email = req.body.email;
  const username = req.body.email;
  const password = req.body.password;
  const address = {address:req.body.address,
                   city:req.body.city,
                   country:req.body.country,
                   zipcode:req.body.zipcode};
  const creditcard = {};
  
  const admintest = req.body.admin
  admin = null
  
  

  req.checkBody('firstname', 'F_Name is required').notEmpty();
  req.checkBody('lastname', 'L_Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('address', 'Address is required').notEmpty();
  req.checkBody('city', 'Address is required').notEmpty();
  req.checkBody('country', 'Address is required').notEmpty();
  req.checkBody('zipcode', 'Address is required').notEmpty();
  

  if(req.body.creditcard != ''){
    creditcard[req.body.creditcard] = req.body.creditcard
  }
  if (admintest){
      if(req.checkBody('admin', 'Passwords do not match').equals('rinneprpr')){
        admin = true
      };
  }
  let errors = req.validationErrors();
  

  if(errors){
    console.log(errors)
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      firstname:fname,
      lastname:lname,
      email:email,
      username:username,
      password:password,
      address:address,
      creditcard:creditcard,
      cart:{},
      admin:admin
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','You are now registered and can log in');
            res.redirect('/users/login');
            console.log('add user')
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  err = req.flash('error')
  if(err){
    res.render('login', {errors:err});  
  }
  else
    res.render('login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);

})

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

router.get('/member', function(req,res){
  res.render('member')
})

router.get('/member/history', function(req,res){
  let q = {userid:res.locals.user._id}
  Order.find(q,function(err,orders){
    if(err){
      console.log(err)
    }
    else {
      // array = new Array()
      // for (var i = 0; i < 4; i++) {
      //   array.push(orders[i])
      // }
      res.render('history',{
        orders:orders
      })
    }
  })
})

router.get('/member/deletecard/:id', function(req, res){
  let user = req.user
  let query = {_id:user._id}
  
  User.findById(query , function(err, user){
    thiscreditcard = user.creditcard
    delete thiscreditcard[req.params.id]
    let userupdate = {};
    userupdate.creditcard = thiscreditcard
    User.update(query,userupdate, function(err){
        if(err){
          console.log(err);
          return;
        } else {
          res.redirect('/users/member/wallet');
        }
    })


  });
});

router.get('/member/wallet',function(req,res){
  User.findById({_id:res.locals.user._id},function(err,user){
    if(err){
      console.log(err) 
    }
    else {
      cards = user.creditcard
      var array_values = new Array();
      if(cards != null){
        for(var x in cards){
          array_values.push(x)
        }
      }
      res.render('wallet',{
        creditcard:array_values
      })
    } 
  })
  
})

router.get('/member/add',function(req,res){
  res.render('addcard')
})

router.post('/member/addnewcard', function(req,res){
  
  let user = req.user
  

  let q = {_id:user._id}
  User.findById(q,function(err,user){
    if(err){
      console.log(err)
    }
    else {
      card = null
      if (req.body.creditcard.trim() != '' && !req.body.creditcard.trim().includes('/') && !req.body.creditcard.trim().includes('\\') )
        card = req.body.creditcard.trim()
      else {
        // console.log('add new Card OK')
        res.render('addcard',{error:'card NOT valid'})
        return
      }
      creditcard = user.creditcard
      if(creditcard == null){
        creditcard = {}
      }
      creditcard[card] = card
      let userupdate = {};
      userupdate.creditcard = creditcard
      User.update(q,userupdate,function(err){
        if(err){
          console.log(err)
        }
        else
          console.log('add new Card OK')
          res.redirect('/users/member/wallet')
      })
      
      
      

    }
  })
})

router.get('/member/orderinfo/:id',function(req,res){
  orderid = req.params.id
  Order.findById(orderid,function(err,order){
    if(err){
      console.log(err)
    }
    else
      res.render('orderinfo',{
        order:order
      })

  })
})

module.exports = router;
