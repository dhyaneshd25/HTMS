const db = require('../utils/db')

module.exports.add_patient = async(req,res)=>{
    try{
      const {name,num,desc,doctor_id,clinic_id,slot_id,age,gender,date,email} =req.body;
      const checkquery = `select count(*) from patient where date=? and slot_id=? and doctor_id=?`
      db.query(checkquery,[date,slot_id,doctor_id],(err,result)=>{
        if(err){
          return res.status(400).send(err);
        }
        const countpatient = result[0]['count(*)'];
        
        const nextcheck = `select max_patient from slots where  slot_id=? and doctor_id=?`
        db.query(nextcheck,[slot_id,doctor_id],(err,result1)=>{
          if(err){
            return res.status(400).send(err);
          }
          const maxpatient = result1[0]['max_patient']
          if(countpatient>=maxpatient){
            return res.status(400).send({message:"Patient Limit reached for slot"})
          }
        let tokennumber=  countpatient+1;
          const insertpatient = `insert into patient (patient_name,contact_number,description,slot_id,token_number,age,gender,date,doctor_id,clinic_id,email) values(?,?,?,?,?,?,?,?,?,?,?)`
          db.query(insertpatient,[name,num,desc,slot_id,tokennumber,age,gender,date,doctor_id,clinic_id,email],(err,result2)=>{
            if(err){
              return res.status(400).send(err)
            }
            return res.status(200).json({message:result2.insertId})
          })
        })

      })
      }catch(err){
        return res.status(500).send(err)
      }
    
}

module.exports.get_all_patients = async(req,res)=>{
  try{
    db.query('select * from patient',(err,results)=>{
      if(err) return res.status(400).send(err);
      return res.status(200).json({allpatients:results})
    })
  }catch(err){
    res.status(500).send(err)
  }
}

module.exports.get_status = async(req,res)=>{
  try{
   const {slot_id}  = req.query;

   if (!slot_id) {
     console.log("Slot Id is not found");
   }

   let status = 'active'
   const query = `select count(*) from patient where status=? and slot_id=?`
   db.query(query,[status,slot_id],(err,result3)=>{
    if(err){
      return res.status(400).send(err);
    }
      if(result3[0]['count(*)']>0){
            const allactivepatient = `select * from patient where status=? and slot_id=?`
             if(result3[0]['count(*)']==1){
               db.query(allactivepatient,[status,slot_id],(err,result)=>{
                if(err){
                  return res.status(400).send(err);
                }
                return res.status(200).json({statuslist:[result[0]]})
               })
              
             }else{
              db.query(allactivepatient,[status,slot_id],(err,result)=>{
                if(err){
                  return res.status(400).send(err);
                }
                return res.status(200).json({statuslist:[result[0],result[1]]})
               })
             }
      }else{
        return res.status(200).json({statuslist:[]})
      }
})
  }catch(err){
    return res.status(500).send(err);
  }
}

module.exports.deleteAllpatients = async(req,res) =>{
  try{
    db.query('truncate table patient',(err,result)=>{
      if(err){
        return res.status(400).send(err);
      }
      res.status(200).send("suceessfully deleted all patient....")
    })
  }catch(err){
    res.status(500).send(err)
  }
}

module.exports.get_patient_clinic_doctor = async(req,res)=>{
  try{

    const {clinic_id,doctor_id} = req.body

  }catch(err){
    res.status(500).send(err)
  }
}


module.exports.getPatient_receptionist =  async(req,res)=>{
  try{
    const {receptionist_id} = req.query;
    const findquery =`select patient_id,token_number,slot_id,patient_name,description,status,email,contact_number,age,gender from patient as p left  join receptionist as r on p.doctor_id = r.doctor_id where r.receptionist_id=?`

    db.query(findquery,[receptionist_id],(err,result)=>{
      if(err){
        return res.status(400).send(err);
      }

      return res.status(200).json({all_recep_patient:result})
    })
  }catch(err){
    return res.status(500).send(err);
  }
}

module.exports.getslotmaxtotalpatient = async(req,res)=>{
  try {
    const {slot_id}  = req.query;
    const query =  `select max_patient from slots where slot_id = ?`
    db.query(query,[slot_id],(err,result)=>{
      if(err){
        return res.status(400).send(err);
      }
      
      const countp = `select count(*) from patient where slot_id=?`;

      db.query(countp,[slot_id],(err,result1)=>{
        if(err){
          return res.status(400).send(err);
        }
        const countpatient = result1[0]['count(*)']
        return res.status(200).json({maxp:result,curco:countpatient});
      })
    })
  } catch (error) {
    return res.status(500).send(error);
  }
}



