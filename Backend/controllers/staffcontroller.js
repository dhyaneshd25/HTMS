const hospital = require('../models/hospitalmodel')
const doctor = require('../models/doctormodel')
const staff = require('../models/staffmodel')
const patient = require('../models/patientmodel')



module.exports.add_staff = async(req,res)=>{
    try{
        const {staff_name,hos_id,doc_id}= req.body;
        const staf= new staff({
          staff_name:staff_name,
          hos_id:hos_id,
          doc_id:doc_id
        })
        await staf.save();
        res.status(200).send("Staff added successfully");
      }catch(err){
        res.status(500).send(err)
      }
}