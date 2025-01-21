const mongoose = require('mongoose');

const doctorschema = new mongoose.Schema({
  doc_name :{type:String,required:true},
  hos_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Hospital',required:true},
  max_patient_number :{type:Number,required:true} 
})

const doctor = mongoose.model('Doctor', doctorschema);

module.exports=doctor;