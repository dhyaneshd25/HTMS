const hospital = require('../models/hospitalmodel')
const doctor = require('../models/doctormodel')
const staff = require('../models/staffmodel')
const patient = require('../models/patientmodel')
const shared = require('../shareds/share')

module.exports.add_patient = async(req,res)=>{
    try{
        const {patient_name,patient_desc,mobile_no} = await req.body;
        
        let alldoccount = await patient.countDocuments()
        console.log(alldoccount)
        const hosp = await hospital.findOne();
     
        const doc =  await doctor.findOne({hos_id:hosp._id});
       
        const sta = await staff.findOne({hos_id:hosp._id,doc_id:doc._id});

        if(alldoccount>=shared.max_patient_no){
          res.status(200).send({data:"Patient Limit reached..."});
        }else{
        if(alldoccount==0){
          const pat = new patient({
            hos_id:hosp._id,
            doc_id:doc._id,
            staff_id:sta._id,
            mobile_no:mobile_no,
            patient_name:patient_name,
            patient_desc:patient_desc,
            token_number:1
          })
          await pat.save()
        }else{
          alldoccount++;
         const pat = new patient({
          hos_id:hosp._id,
          doc_id:doc._id,
          staff_id:sta._id,
          mobile_no:mobile_no,
          patient_name:patient_name,
          patient_desc:patient_desc,
          token_number:alldoccount
        })
        await pat.save()
      }
        res.status(200).send("Patient Successfully added...")
    }
      }catch(err){
        res.status(500).send(err)
      }
    
}


module.exports.deleteAllpatients = async(req,res) =>{
  try{
    await patient.deleteMany();
    res.status(200).send("All patient deleted....")
  }catch(err){
    res.status(500).send(err)
  }
}