let mongoose = require('mongoose');

// Article Schema
let orderSchema = mongoose.Schema({
  userid:{
    type: String,
    required: true  
  },
  date:{
    type: String,
    required: true  
  },

  items:{
    type: JSON,
    required: true
  },

  totalprice:{
      type: Number,
      required:true
  },
  paymentcard:{
      type:String,
      required: true
  }
});

let order = module.exports = mongoose.model('order', orderSchema);
