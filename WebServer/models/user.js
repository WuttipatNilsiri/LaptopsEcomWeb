const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  firstname:{
    type: String,
    required: true
  },
  lastname:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  address:{
    type: JSON,
    required:true
  },
  creditcard:{
      type: Object,
      required:false
  },
  cart:{
    type:JSON,
    required:false
  }
  
});

const user = module.exports = mongoose.model('user', UserSchema);
