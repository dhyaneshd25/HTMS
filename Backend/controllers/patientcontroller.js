const hospital = require('../models/hospitalmodel')
const doctor = require('../models/doctormodel')
const staff = require('../models/staffmodel')
const patient = require('../models/patientmodel')


module.exports.add_patient = async(req,res)=>{
    try{
        const {patient_name,patient_desc,mobile_no} = await req.body;

        if (!patient_name) {
          console.log("Patient name is not found");
        }
        if (!patient_desc) {
          console.log("Patient description is not found");
        }
        if (!mobile_no) {
          console.log("Mobile Number is not found");
        }
        
        let alldoccount = await patient.countDocuments()
        console.log(alldoccount)
        const hosp = await hospital.findOne();
        console.log(hosp)
        const doc =  await doctor.findOne({hos_id:hosp._id});
        console.log(doc)
        const sta = await staff.findOne({hos_id:hosp._id,doc_id:doc._id});
        console.log(sta)
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
          console.log(alldoccount)
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
      }catch(err){
        res.status(500).send(err)
      }
    
}