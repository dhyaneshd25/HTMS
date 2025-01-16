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


module.exports.mark_missing =  async(req,res)=>{
  try{
      const {token_no} = req.body;
      const pat = await patient.findOne({token_number:token_no})
      pat.status = 'missing'
      await pat.save()
      res.status(200).send("Patient Marked as missied.....")
  }
  catch(err){
    res.status(500).send(err)
  }
}

module.exports.mark_completed = async(req,res) =>{
  try{
      const {token_no} = req.body;
      const pat = await patient.findOne({token_number:token_no})
      pat.status = 'completed'
      await pat.save()
      res.status(200).send("Patient Marked as missied.....")
  }catch(err){
    res.status(500).send(err)
  }
}

module.exports.recall_patient = async(req,res) =>{
  try{
    const {token_no} = req.body;
    const pat = await patient.findOne({token_number:token_no,status:"missing"})
    pat.status = 'active'
    await pat.save()
    res.status(200).send("Patient recalled.....")
  }catch(err){
    res.status(500).send(err)
  }
}