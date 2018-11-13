const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const Laptop = require('./models/laptop');
const async = require('async');



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

list = [
  {name:'MSI GS65 Stealth Thin',
  brand:'MSI',
  price:1749,
  spec:{
    GPU:'Nvidia GeForce GTX 1070 Max-Q',
    CPU:'Intel Core i7-8750H',
    RAM:'16GB DDR4-2400MHz',
    SCREEN:'15.6-inch FHD (1,920 x 1,080) wide-view 144Hz',
    STORAGE:'512GB M.2 SSD'
  },
  img: 'MSI-GS65.jpg'
  },
  {name:'Razer Blade 15',
  brand:'Razer',
  price:1900,
  spec:{
    GPU:'Nvidia GeForce GTX 1070 Max-Q',
    CPU:'Intel Core i7-8750H',
    RAM:'16GB DDR4-2666MHz',
    SCREEN:'15.6-inch FHD (1,920 x 1,080) IPS 144Hz',
    STORAGE:'512GB SSD'
  },
  img: 'razer-blade-15.jpg'
  },
  {name:'Gigabyte Aero 15X v8',
  brand:'Aero',
  price:2149,
  spec:{
    GPU:'Nvidia GeForce GTX 1070 Max-Q',
    CPU:'Intel Core i7-8750H',
    RAM:'16GB DDR4-2666MHz',
    SCREEN:'15.6-inch FHD (1,920 x 1,080) IPS 144Hz',
    STORAGE:'512GB SSD'
  },
  img: 'gigabyte-aero-15x.jpg'
  },
  {name:'Asus ROG Strix GL503VS-DH74 Scar Edition',
  brand:'Asus',
  price:1899,
  spec:{
    GPU:'Nvidia GeForce GTX 1070',
    CPU:'Intel Core i7-7700HQ ',
    RAM:'16GB DDR4-2400MHz',
    SCREEN:'15.6-inch FHD (1,920 x 1,080) wide-view 144Hz with G-Sync',
    STORAGE:'256GB NVMe SSD, 1TB FireCuda SSHD'
  },
  img: 'asus-ROG-Strix-GL503VS.jpg'
  },
  {name:'Acer Predator Helios 300',
  brand:'Acer',
  price:1138.95,
  spec:{
    GPU:'Nvidia GeForce GTX 1060 6GB',
    CPU:'Intel Core i7-7700HQ',
    RAM:'16GB DDR4-2133MHz',
    SCREEN:'15.6-inch FHD (1,920 x 1,080) wide-view 60 Hz',
    STORAGE:'256GB M.2 SATA SSD'
  },
  img: 'acer-predater-helios300.jpg'
  },
  {name:'Dell Inspiron 15 7567',
  brand:'Dell',
  price:1372.80,
  spec:{
    GPU:'Nvidia GeForce GTX 1050 Ti 4GB',
    CPU:'Intel Core i5-7300HQ',
    RAM:'8GB DDR4-2400MHz',
    SCREEN:'15.6-inch FHD (1,920 x 1,080)',
    STORAGE:'256GB SSD'
  },
  img: 'dell-inspiron-15-7567.jpg'
  },
  {name:'Acer Predator Triton 700',
  brand:'Acer',
  price:2029.98,
  spec:{
    GPU:'Nvidia GeForce GTX 1080 Max-Q',
    CPU:'Intel Core i7-7700HQ',
    RAM:'32GB DDR4-2400MHz',
    SCREEN:'15.6-inch FHD (1,920 x 1,080) IPS 120 Hz with G-Sync',
    STORAGE:'256GB M.2 SATA SSD'
  },
  img: 'acer-predator-triton700.jpg'
  },
  {name:'MSI GT75 Titan',
  brand:'MSI',
  price:2240.27,
  spec:{
    GPU:'Nvidia GeForce GTX 1080',
    CPU:'Intel Core i7-8750H',
    RAM:'64GB DDR4-2666MHz',
    SCREEN:'17.3-inch FHD (1,920 x 1,080) wide-view 120 Hz with G-Sync',
    STORAGE:'512GB M.2 SATA SSD, 1TB HDD'
  },
  img: 'msi-gt75-titan.jpg'
  }
]

async.each(list, function (item, callback) {

  // console.log(item)

  

  var laptop = new Laptop({
    name:item.name,
    brand:item.brand,
    price:item.price,
    img:item.img,
    spec:item.spec
  });

    Laptop.find({name:item.name},function(err,laptops){
    if(laptops.length == 0){
      laptop.save(function(err, item){
        if (err){
          console.log(err);
        }

        console.log('Saved', item);
        callback();
      });
    }
  })

  

}, function (error) {
  if (error) console.log(error);
  else 
    console.log("ADD LAPTOP")
});

// for(i in list){
//   item =list[i]
//   console.log(item)
//   laptop = new Laptop({
//     name:item.name,
//     brand:item.brand,
//     price:item.price,
//     img:item.img,
//     spec:item.spec
//   })
//   Laptop.find({name:item.name},function(err,laptops){
//     if(laptops.length == 0){
//       laptop.save(function(err){
//         if(err){
//           console.log(err)
//         }
//         else{
//           console.log("add "+item.name)
//         }
//       })
//     }
//   })

// }




