const hospital = require('../models/hospitalmodel')
const doctor = require('../models/doctormodel')
const staff = require('../models/staffmodel')
const patient = require('../models/patientmodel')
const shared = require('../shareds/share')


module.exports.add_doctor = async(req,res)=>{
    try{
        const {doc_name,hos_id,max_patient} = req.body;
        const doc= new doctor({
         doc_name:doc_name,
         hos_id:hos_id,
         max_patient_number:max_patient
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
   const doct = await doctor.findOne();
   doct.max_patient_number = max_patient;

   doct.save();

   return res.status(200).json({data: max_patient, message: "Max_patient_limit is setted...."});

   }catch(err){
      res.status(500).send("Internal Server Error")
   }
}

module.exports.get_maxpatient =  async(req,res)=>{
try{
   const doc= await doctor.findOne();
   res.status(200).send({max_patient:doc.max_patient_number});
}catch(err){
   res.status(500).send(err);
}
}

module.exports.get_all_doctors = async(req,res) =>{
   try{
   const docs = await doctor.find();
   res.status(200).send({alldoc:docs});
   }catch(err){
      res.status(500).send(err)
   }
}