const hospital = require('../models/hospitalmodel')
const doctor = require('../models/doctormodel')
const staff = require('../models/staffmodel')
const patient = require('../models/patientmodel')


module.exports.add_hospital= async(req,res)=>{
    try{
        const {name} = req.body;
         const hos= new hospital({
          name:name,
         });
         await hos.save();
       res.status(200).send("Successfully Added Hospital...")
      }catch(err){
        res.status(500).send(err)
      }
}