let mongoose = require('mongoose');

// Article Schema
let cartSch = mongoose.Schema({
  userid:{
    type: String,
    required: true
  },

  items:{
    type: Array,
    required: true
  },
});

let cart = module.exports = mongoose.model('cart', cartSch);
