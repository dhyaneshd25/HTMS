const hospital = require('../models/hospitalmodel')
const doctor = require('../models/doctormodel')
const staff = require('../models/staffmodel')
const patient = require('../models/patientmodel')
const shared= require('../shareds/share')

module.exports.add_doctor = async(req,res)=>{
    try{
        const {doc_name,hos_id} = req.body;
        const doc= new doctor({
         doc_name:doc_name,
         hos_id:hos_id,
        });
        await doc.save();
        res.status(200).send("Doctor added successfully")
     }catch(err){
        res.status(500).send(err);
     }
}

module.exports.set_maxpatientnumber = async(req,res)=>{
   try{

   const {max_patient} = req.body;
   shared.max_patient_no = max_patient;

   res.status(200).send("Max_patient_limit is setted....");

   }catch(err){
      res.status(500).send("Internal Server Error")
   }
}