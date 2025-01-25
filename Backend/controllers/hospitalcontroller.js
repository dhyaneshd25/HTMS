const db = require('../utils/db')
const bcrypt = require('bcrypt')

module.exports.add_hospital= async(req,res)=>{
    try {
        const { name, username, password } = req.body;
    
        // Check if the username already exists
        const checkUsername = `SELECT * FROM hospital WHERE username = ?`;
        db.query(checkUsername, [username], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
    
            if (results.length > 0) {
                return res.status(400).send("Username already exists. Please choose another one.");
            }
    
            // Insert the hospital only if the username is unique
            const inserthos = `INSERT INTO hospital (hospital_name, username, password) VALUES (?, ?, ?)`;
            db.query(inserthos, [name,  username, password], (err, result) => {
                if (err) {
                    return res.status(400).send(err);
                }
    
                return res.status(200).json({ hospital_id: result.insertId });
            });
        });
    } catch (err) {
        res.status(500).send(err);
    }
    
}