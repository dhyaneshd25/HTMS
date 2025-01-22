const mongoose = require("mongoose")

const mobileRegex = /^[0-9]{10}$/;

const patientschema = new mongoose.Schema({
    hos_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Hospital',required:true},
    doc_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Doctor',required:true},
    staff_id :{type : mongoose.Schema.Types.ObjectId,ref: 'Staff',required:true},
    token_number :{type: Number,unqiue:true},
    patient_name :{type:String,required:true},
    patient_desc :{type:String},
    mobile_no: {
        type: String,
        required: true, 
        unique: true, 
        validate: {
          validator: function (v) {
            return mobileRegex.test(v); 
          },
        }
      },
      status: { type: String, enum: ['active', 'missing','completed'], default: 'active' },
},{
  timestamps : true
})

const patient = mongoose.model('Patient', patientschema);

module.exports = patient;