const db = require('../utils/db')
const bcrypt = require('bcrypt')

module.exports.add_receptionist = async(req,res)=>{
  try {
    const { name,clinic_id,hospital_id, doctor_id,username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if the username already exists
    const checkUsername = `SELECT * FROM receptionist WHERE username = ?`;
    db.query(checkUsername, [username], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            return res.status(400).send("Username already exists. Please choose another one.");
        }

        // Insert the receptionist only if the username is unique
        const inserthos = `INSERT INTO receptionist (receptionist_name,clinic_id,doctor_id,hospital_id, username, password) VALUES (?, ?,?,?,?, ?)`;
        db.query(inserthos, [name, clinic_id,doctor_id,hospital_id,username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(400).send(err);
            }

            return res.status(200).json({ receptionist_id: result.insertId });
        });
    });
} catch (err) {
    res.status(500).send(err);
}

}


module.exports.mark_missing =  async(req,res)=>{
  try{
      const {patient_id,slot_id} = req.query;
      const allactivecount = 'select count(*) from patient where status="active" and slot_id=?'
      db.query(allactivecount,[slot_id],(err,result)=>{
        if(err){
          return res.status(400).send(err);
        }
        if(result[0]['count(*)']>0){
             const updatequery = `update patient set status="missed" where patient_id=? and slot_id=?`
             db.query(updatequery,[patient_id,slot_id],(err,results)=>{
              if(err){
                return res.status(400).send(err);
              }
              return res.status(200).send("marked missied");
             })
        }
      })
  }
  catch(err){
    res.status(500).send(err)
  }
}

module.exports.mark_completed = async(req,res) =>{
  try{
    
    const {patient_id,slot_id} = req.query;
    const allactivecount = 'select count(*) from patient where status="active" and slot_id=?'
    db.query(allactivecount,[slot_id],(err,result)=>{
      if(err){
        return res.status(400).send(err);
      }
      if(result[0]['count(*)']>0){
           const updatequery = `update patient set status="completed" where patient_id=? and slot_id=?`
           db.query(updatequery,[patient_id,slot_id],(err,results)=>{
            if(err){
              return res.status(400).send(err);
            }
            return res.status(200).send("marked completed...");
           })
      }
    })

  }catch(err){
    return res.status(500).send(err)
  }
}

module.exports.recall_patient = async(req,res) =>{
  try{
    const {patient_id,slot_id} = req.query;
    const allactivecount = 'select count(*) from patient where status="missed" and slot_id=?'
    db.query(allactivecount,[slot_id],(err,result)=>{
      if(err){
        return res.status(400).send(err);
      }
      if(result[0]['count(*)']>0){
           const updatequery = `update patient set status="active" where patient_id=? and slot_id=?`
           db.query(updatequery,[patient_id,slot_id],(err,results)=>{
            if(err){
              return res.status(400).send(err);
            }
            return res.status(200).send("marked active...");
           })
      }
    })
  }catch(err){
    return res.status(500).send(err)
  }
}


module.exports.gettodayslots = async(req,res)=>{
  try {
    const {date} = req.query;
    const findq = `select * from slots where slot_date=? and status in ('available','current')`;

    db.query(findq,[date],(err,result)=>{
      if(err){
        return res.status(400).send(err);
      }
      return  res.status(200).json({slot:result});
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}


module.exports.updatecomplete = async(req,res)=>{
  try {
     const {slotid} = req.query;

     const updatequery = `update slots set status="completed" where slot_id=?`

     db.query(updatequery,[slotid],(err,result)=>{
      if(err){
        return res.status(400).send(err);
      }
      return res.status(200).send("update slot status to completed......")
     })
  } catch (error) {
    return res.status(500).send(error)
  }
}


module.exports.updatecurrent = async(req,res)=>{
  try {
    const {slotid} = req.query;

     const updatequery = `update slots set status="current" where slot_id=?`

     db.query(updatequery,[slotid],(err,result)=>{
      if(err){
        return res.status(400).send(err);
      }
      return res.status(200).send("update slot status to completed......")
     })
  } catch (error) {
    return res.status(500).send(error)
  }
}