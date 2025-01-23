const db = require('../utils/db')
const bcrypt = require('bcrypt')

module.exports.add_hospital= async(req,res)=>{
  try {
    const { name, username, password } = req.body;

    // Validate input
    if (!name || !username || !password) {
        return res.status(400).send("Hospital name, username, and password are required.");
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if this is the first hospital
    const checkQuery = 'SELECT COUNT(*) AS count FROM Hospital';
    db.query(checkQuery, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send("Error while checking the hospital count.");
        }

        const isFirstHospital = rows[0].count === 0;

        // Insert the hospital into the database
        const insertQuery = 'INSERT INTO Hospital (hospital_name, username, password) VALUES (?, ?, ?)';
        db.query(insertQuery, [name, username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting hospital:', err);

                // Handle duplicate username error
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send("Username already exists. Please choose another one.");
                }

                return res.status(500).send("Error while adding hospital.");
            }

            res.status(200).json({
                message: isFirstHospital
                    ? "Successfully Added First Hospital!"
                    : "Successfully Added Hospital.",
                hospitalId: result.insertId, // Return the ID of the inserted record
            });
        });
    });
} catch (err) {
    console.error(err);
    res.status(500).send("Error while adding hospital.");
}
}