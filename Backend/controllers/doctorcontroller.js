const db= require('../utils/db')
const bcrypt = require('bcrypt')

module.exports.add_doctor = async(req,res)=>{
   try {
      const { name, clinic_id, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      // Check if the username already exists
      const checkUsername = `SELECT * FROM doctor WHERE username = ?`;
      db.query(checkUsername, [username], (err, results) => {
          if (err) {
              return res.status(500).send(err);
          }
  
          if (results.length > 0) {
              return res.status(400).send("Username already exists. Please choose another one.");
          }
  
          // Insert the doctor only if the username is unique
          const insertDoctor = `INSERT INTO doctor (doctor_name, clinic_id, username, password) VALUES (?, ?, ?, ?)`;
          db.query(insertDoctor, [name, clinic_id, username, hashedPassword], (err, result) => {
              if (err) {
                  return res.status(400).send(err);
              }
  
              return res.status(200).json({ doctor_id: result.insertId });
          });
      });
  } catch (err) {
      res.status(500).send(err);
  }
  
}

module.exports.add_slot = async (req,res)=>{
   try{
          const {doctor_id,clinic_id,date,start,end,max_patient,slot_no} = req.body;
          
          const insertslot = `insert into slots ( clinic_id,doctor_id,slot_date,start_time,end_time,max_patient,slot_number) values(?,?,?,?,?,?,?)`

          db.query(insertslot,[clinic_id,doctor_id,date,start,end,max_patient,slot_no],(err,result)=>{
            if(err){
               return res.status(400).send(err)
            }
            return res.status(200).json({slot_id:result.insertId})
          })
         
      }catch(err){
      return res.status(500).send(err)
   }
}


module.exports.get_all_doctors = async(req,res) =>{
   try{
      db.query(`select * from doctor`,(err,results)=>{
         if(err){
            return res.status(400).send(err);
         }
         return res.status(200).json({all_doctors:results})
      })
   }catch(err){
      res.status(500).send(err)
   }
}
module.exports.get_doctor_clinic = async(req,res)=>{
   try{
      const {clinic_id} = req.query;
      if (!clinic_id) {
         return res.status(404).json({message: "Clinic ID not found"})
      }
      const query = `select * from doctor where clinic_id=?`
        db.query(query,[clinic_id],(err,result)=>{
           if(err){
            return res.status(400).send(err);
           }
           return res.status(200).json({alldoctor:result});
        })
   }catch(err){
      return res.status(500).send(err);
   }
}

module.exports.get_doctor_slots = async(req,res)=>{
   try{
      const {doctor_id} = req.query;

      if (!doctor_id) {
         return res.status(200).json({message: "Doctor ID is not found"})
      }

      const getslots = `Select * from slots where doctor_id = ?`

      db.query(getslots,[doctor_id],(err,result)=>{
         if(err){
            return res.status(400).send(err);
         }

         return res.status(200).json({doctorslots:result,doctor_id:doctor_id});
      })

   }catch(err){
      return res.status(500).send(err);
   }
}