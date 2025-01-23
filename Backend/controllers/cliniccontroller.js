const db = require('../utils/db')
const bcrypt = require('bcrypt')

module.exports.add_clinic = async (req,res)=>{
try{
    const {name,days,hospital_id,username,password} =  req.body;
    const insertclinic = `insert into clinic (clinic_name,schedule_days,hospital_id,username,password) values (?,?,?,?,?)`

    db.query(insertclinic,[name,days,hospital_id,username,password],(err,result)=>{
        if(err){
           
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send("Username already exists. Please choose another one.");
            }

            return res.status(500).send(err);
        }
        return res.status(200).json({message:result.insertId})
    })

}catch(err){
   return res.status(500).send("Internal Server Error")
}
}

module.exports.get_schedule_days =  async (req,res) =>{
    try{
        const {clinic_id} = req.body;
        
        const query = `select schedule_days from clinic where clinic_id = ?`

        db.query(query,[clinic_id],(err,result)=>{
            if(err) return res.send(err)
           
            return res.json({max_day:result[0].schedule_days});
        })

    }catch(err){
            return res.status(500).send(err)
    }
}