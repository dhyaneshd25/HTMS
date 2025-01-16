const mongoose = require('mongoose');

const hospitalschema = new mongoose.Schema({
   name:{type:String,required:true},
})

const hospital = mongoose.model('Hospital', hospitalschema);

module.exports=hospital;