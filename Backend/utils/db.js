const mysql = require('mysql')

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Saibaba25$",
    database:"Hospital_Slots_Management_System"
})

db.connect((err,result)=>{
    if(err) throw err
    
    console.log("successfully connected to mysql database....")
})

module.exports=db;