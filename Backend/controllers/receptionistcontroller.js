const db = require('../utils/db')

module.exports.add_receptionist = async(req,res)=>{
  try {
    const { name,clinic_id,hospital_id, doctor_id,username, password } = req.body;

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
        db.query(inserthos, [name, clinic_id,doctor_id,hospital_id,username, password], (err, result) => {
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
      const {patient_id} = req.body;
      const allactivecount = 'select count(*) from patient where status="active"'
      db.query(allactivecount,[],(err,result)=>{
        if(err){
          return res.status(400).send(err);
        }
        if(result[0]['count(*)']>0){
             const updatequery = `update patient set status="missied" where `
             db.query(updatequery,[],(err,results)=>{
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
      // const {token_no} = req.body;
      // const pat = await patient.findOne({token_number:token_no})
      // pat.status = 'completed'
      // await pat.save()
      res.status(200).send("Patient Marked as missied.....")
  }catch(err){
    res.status(500).send(err)
  }
}

module.exports.recall_patient = async(req,res) =>{
  try{
    // const countmissing = await patient.countDocuments({status:"missing"})
    // if(countmissing>0){
    // const {token_no} = req.body;
    // const pat = await patient.findOne({token_number:token_no,status:"missing"})
    // pat.status = 'active'
    // await pat.save()
    return res.status(200).send("Patient recalled.....")
    // }else{
    //   return res.status(200).send("No missing patients")
    // }
  }catch(err){
    return res.status(500).send(err)
  }
}