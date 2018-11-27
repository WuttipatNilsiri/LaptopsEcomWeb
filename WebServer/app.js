const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
let Laptop = require('./models/laptop');





mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
// let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'rinneprprpr',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', function(req, res){

  Laptop.find({}, function(err, laptops){
    if(err){
      console.log(err);
    } else {
      res.render('home', {
        title:'Home',
        laptops: laptops
      });
      // console.log(res.locals.user == null);
    }
  });

  // res.render('index', {
  //   title:'Home'

  // });
});

app.get('/store', function(req, res){

  Laptop.find({}, function(err, laptops){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Home',
        laptops: laptops
      });
      // console.log(res.locals.user == null);
    }
  });

  // res.render('index', {
  //   title:'Home'

  // });
});

function filter(kws,laptops){
    result = {}
    list = []
    for (i in laptops){
      it = {}
      it._id = laptops[i]._id
      it.name = laptops[i].name
      it.brand = laptops[i].brand
      it.GPU = laptops[i].spec.GPU
      it.CPU = laptops[i].spec.CPU
      it.price = laptops[i].price
      it.img = laptops[i].img
      list.push(it)
    }

    for (i in list){
      laptop = list[i]
      // console.log(laptop.name)
      const kcheck = {}
      
      for (i in kws) {
        kcheck[kws[i]] = false
      }

      for (key in laptop){
        // console.log(laptop[key])
        for (i in kws){
          // console.log(kws[i])
          str = laptop[key]+""
          keyy = kws[i]+""
          strl = str.toLowerCase()
          keyl = keyy.toLowerCase()

          // console.log(str)
          if (strl.includes(keyl)){
            kcheck[kws[i]] = true
            
          }

        }
      }

      check = false

      for (i in kcheck) {
        check = check | kcheck[i]
      }

      if (check){
        result[laptop._id] = laptop
      }

    }
    
    arr = []
    
    for (key in result){
      arr.push(result[key])
    }

    return arr
}

function search(kws,laptops){
  
  result = {}
  list = []
  for (i in laptops){
    it = {}
    it._id = laptops[i]._id
    it.name = laptops[i].name
    it.brand = laptops[i].brand
    it.GPU = laptops[i].spec.GPU
    it.CPU = laptops[i].spec.CPU
    it.price = laptops[i].price
    it.img = laptops[i].img
    list.push(it)
  }

  for (i in list){
    laptop = list[i]
    // console.log(laptop.name)
    const kcheck = {}
    
    for (i in kws) {
      kcheck[kws[i]] = false
    }

    for (key in laptop){
      // console.log(laptop[key])
      for (i in kws){
        // console.log(kws[i])
        str = laptop[key]+""
        keyy = kws[i]+""
        strl = str.toLowerCase()
        keyl = keyy.toLowerCase()

        // console.log(str)
        if (strl.includes(keyl)){
          kcheck[kws[i]] = true
          
        }

      }
    }

    check = true

    for (i in kcheck) {
      check = check & kcheck[i]
    }

    if (check){
      result[laptop._id] = laptop
    }

  }
  arr = []
  
  for (key in result){
    arr.push(result[key])
  }

  return arr
}


app.get('/filter', function(req,res){

  query = req.query
  console.log(query)
  const kws = []
  for (q in query){
    kws.push(q)
  }


  
  Laptop.find({} , function(err,laptops){

    arr = filter(kws,laptops)
    // result = {}
    // list = []
    // for (i in laptops){
    //   it = {}
    //   it._id = laptops[i]._id
    //   it.name = laptops[i].name
    //   it.brand = laptops[i].brand
    //   it.GPU = laptops[i].spec.GPU
    //   it.CPU = laptops[i].spec.CPU
    //   it.price = laptops[i].price
    //   it.img = laptops[i].img
    //   list.push(it)
    // }

    // for (i in list){
    //   laptop = list[i]
    //   // console.log(laptop.name)
    //   const kcheck = {}
      
    //   for (i in kws) {
    //     kcheck[kws[i]] = false
    //   }

    //   for (key in laptop){
    //     // console.log(laptop[key])
    //     for (i in kws){
    //       // console.log(kws[i])
    //       str = laptop[key]+""
    //       keyy = kws[i]+""
    //       strl = str.toLowerCase()
    //       keyl = keyy.toLowerCase()

    //       // console.log(str)
    //       if (strl.includes(keyl)){
    //         kcheck[kws[i]] = true
            
    //       }

    //     }
    //   }

    //   check = false

    //   for (i in kcheck) {
    //     check = check | kcheck[i]
    //   }

    //   if (check){
    //     result[laptop._id] = laptop
    //   }

    // }
    
    // arr = []
    
    // for (key in result){
    //   arr.push(result[key])
    // }

    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Home',
        laptops: arr
      });
      // console.log(res.locals.user == null);
    }    
    
  })
  
  
    
  
})

app.get('/search', function(req,res){

  kw = req.query.keyword
  // console.log(kw)
  const kws = kw.split(' ')
  

  // console.log(kws)
  
  Laptop.find({} , function(err,laptops){
    
    // result = {}
    // list = []
    // for (i in laptops){
    //   it = {}
    //   it._id = laptops[i]._id
    //   it.name = laptops[i].name
    //   it.brand = laptops[i].brand
    //   it.GPU = laptops[i].spec.GPU
    //   it.CPU = laptops[i].spec.CPU
    //   it.price = laptops[i].price
    //   it.img = laptops[i].img
    //   list.push(it)
    // }

    // for (i in list){
    //   laptop = list[i]
    //   // console.log(laptop.name)
    //   const kcheck = {}
      
    //   for (i in kws) {
    //     kcheck[kws[i]] = false
    //   }

    //   for (key in laptop){
    //     // console.log(laptop[key])
    //     for (i in kws){
    //       // console.log(kws[i])
    //       str = laptop[key]+""
    //       keyy = kws[i]+""
    //       strl = str.toLowerCase()
    //       keyl = keyy.toLowerCase()

    //       // console.log(str)
    //       if (strl.includes(keyl)){
    //         kcheck[kws[i]] = true
            
    //       }

    //     }
    //   }

    //   check = true

    //   for (i in kcheck) {
    //     check = check & kcheck[i]
    //   }

    //   if (check){
    //     result[laptop._id] = laptop
    //   }

    // }
    // arr = []
    
    // for (key in result){
    //   arr.push(result[key])
    // }

    arr = search(kws,laptops)

    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Home',
        laptops: arr
      });
      // console.log(res.locals.user == null);
    }    
    
  })
})


// Route Files
let laptop = require('./routes/info');
let users = require('./routes/users');
let cart = require('./routes/cart');
let checkout = require('./routes/checkout');
let upload = require('./routes/upload');
app.use('/laptops', laptop);
app.use('/users', users);
app.use('/cart', cart);
app.use('/checkout', checkout);
app.use('/upload', upload)



// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});