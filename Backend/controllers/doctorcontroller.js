const hospital = require('../models/hospitalmodel')
const doctor = require('../models/doctormodel')
const staff = require('../models/staffmodel')
const patient = require('../models/patientmodel')


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