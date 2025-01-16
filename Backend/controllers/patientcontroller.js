const hospital = require('../models/hospitalmodel')
const doctor = require('../models/doctormodel')
const staff = require('../models/staffmodel')
const patient = require('../models/patientmodel')


module.exports.add_patient = async(req,res)=>{
    try{
        const {doc_id,staff_id,patient_name,patient_desc,mobile_no} = await req.body;
        const alldoccount = await patient.countDocuments()
        if(alldoccount==0){
          const pat = new patient({
            doc_id:doc_id,
            staff_id:staff_id,
            mobile_no:mobile_no,
            patient_name:patient_name,
            patient_desc:patient_desc,
            token_number:1
          })
          await pat.save()
        }else{
          alldoccount++;
        const pat = new patient({
          doc_id:doc_id,
          staff_id:staff_id,
          mobile_no:mobile_no,
          patient_name:patient_name,
          patient_desc:patient_desc,
          token_number:alldoccount
        })
        await pat.save()
      }
        res.status(200).send("Patient Successfully added...")
      }catch(err){
        res.status(500).send(err)
      }
    
}