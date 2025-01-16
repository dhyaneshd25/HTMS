const mongoose = require("mongoose")

const staffschema = new mongoose.Schema({
  staff_name :{type : String,required:true},
  hos_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Hospital',required:true},
  doc_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Doctor',required:true}  
})

const staff = mongoose.model('Staff', staffschema);

module.exports=staff;