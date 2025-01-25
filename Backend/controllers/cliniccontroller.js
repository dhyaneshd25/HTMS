const db = require('../utils/db')
const bcrypt = require('bcrypt')

module.exports.add_clinic = async (req,res)=>{
    
    try {
        const {name,days,hospital_id,username,password} =  req.body;
    
        // Check if the username already exists
        const checkUsername = `SELECT * FROM clinic WHERE username = ?`;
        db.query(checkUsername, [username], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
    
            if (results.length > 0) {
                return res.status(400).send("Username already exists. Please choose another one.");
            }
    
            // Insert the clinic only if the username is unique
            const inserthos = `INSERT INTO clinic (clinic_name,schedule_days,hospital_id, username, password) VALUES (?, ?, ?, ?, ?)`;
            db.query(inserthos, [name, days,hospital_id, username, password], (err, result) => {
                if (err) {
                    return res.status(400).send(err);
                }
    
                return res.status(200).json({ clinic_id: result.insertId });
            });
        });
    } catch (err) {
        res.status(500).send(err);
    }
    
}

module.exports.get_schedule_days =  async (req,res) =>{
    try{
        const {clinic_id} = req.body;
        
        const query = `select schedule_days from clinic where clinic_id = ?`

        db.query(query,[clinic_id],(err,result)=>{
            if(err) return res.status(400).send(err)
           
            return res.json({max_day:result[0]['schedule_days']}); //result[0].schedule_days
        })

    }catch(err){
            return res.status(500).send(err)
    }
}

module.exports.get_all_clinic = async(req,res)=>{
    try{
        
        const query = `select * from clinic`
        db.query(query,(err,result)=>{
           if(err){
            return res.status(400).send(err);
           }
           return res.status(200).json({allclinic:result});
        })
    }catch(err){
        return res.status(500).send(err)
    }
}