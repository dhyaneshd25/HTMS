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
        console.log(hosp._id);
        const doc =  await doctor.findOne({hos_id:hosp._id});
        console.log(doc);
        const sta = await staff.findOne({hos_id:hosp._id,doc_id:doc._id});
        console.log(sta._id);
        if(alldoccount>doc.max_patient_number){
          return res.status(200).send({data:"Patient Limit reached..."});
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
        return res.status(200).send("Patient Successfully added...")
    } 
      }catch(err){
        return res.status(500).send(err)
      }
    
}

module.exports.get_all_patients = async(req,res)=>{
  try{
    const allpatient  = await patient.find();
    res.status(200).send({pateintlist : allpatient})
  }catch(err){
    res.status(500).send(err)
  }
}

module.exports.get_status = async(req,res)=>{
  try{
    const totalpatientcount = await patient.countDocuments();
    if(totalpatientcount==0){
        return res.status(200).send({statuslist:[-1,-1,0]})
    }else{
      const activecount =await patient.countDocuments({status:"active"})
      if(activecount==1){
        const allactivepatient =  await patient.find({status:"active"})
        return res.status(200).send({statuslist:[allactivepatient[0].token_number,-1,totalpatientcount]})
      }else if(activecount==0){
        return res.status(200).send({statuslist:[-1,-1,totalpatientcount]})
      }else{
        const allactivepatient = await patient.find({status:"active"})
        return res.status(200).send({statuslist:[allactivepatient[0].token_number,allactivepatient[1].token_number,totalpatientcount]})
      }
    }
  }catch(err){
    return res.status(500).send(err);
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