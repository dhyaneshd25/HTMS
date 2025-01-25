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
        
        const nextcheck = `select max_patient from slots where slot_date=?  and slot_id=? and doctor_id=?`
        db.query(nextcheck,[date,slot_id,doctor_id],(err,result1)=>{
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
   const {doctor_id,date,slot_id}  = req.body;
   const query = `select count(*) from patient where date=? and slot_id=? and doctor_id=?`
   db.query(query,[date,slot_id,doctor_id],(err,result)=>{
    if(err){
      return res.status(400).send(err);
    }
     if(result[0]['count(*)']>0){
     const allpatient = `select * from patient where date=?  and slot_id=? and doctor_id=?`
     db.query(allpatient,[date,slot_id,doctor_id],(err,result1)=>{
      if(err){
        return res.status(400).send(err);
      }
      let status = 'active'
      const activepatientcount = `select count(*) from patient where status=? and date=?  and slot_id=? and doctor_id=?`
      db.query(activepatientcount,[status,date,slot_id,doctor_id],(err,result3)=>{
        if(err){
          return res.status(400).send(err);
        }
        if(result3[0]['count(*)']>0){
          const activepatients = `select * from patient where status=? and date=? and slot_id=? and doctor_id=?`
      
          if(result3[0]['count(*)']==1){
               db.query(activepatients,[status,date,slot_id,doctor_id],(err,result4)=>{
                if(err){
                  return res.status(400).send(err);
                }
                return res.status(200).json({statuslist:[result4[0],null]});
               })
          }else{
            db.query(activepatients,[status,date,slot_id,doctor_id],(err,result4)=>{
              if(err){
                return res.status(400).send(err);
              }
              return res.status(200).json({statuslist:[result4[0],result4[1]]});
             })
          }

        }else{
          return res.status(200).json({statuslist:[null,null]});
        }
      })
     })
  }else{
       return res.status(200).json({statuslist:[null,null]});
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