let mongoose = require('mongoose');

// Article Schema
let laptopSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },

  brand:{
    type: String,
    required: true
  },

  price:{
      type: String,
      required:true
  },

  img:{
   type: String,
   required: false
  }
  ,
  spec:{
    type: JSON,
    required: true
  }
});

let laptop = module.exports = mongoose.model('laptop', laptopSchema);
