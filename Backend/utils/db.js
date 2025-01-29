// const mysql = require('mysql')

// const db = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"Saibaba25$",
//     database:"Hospital_Management_System"
// })

// db.connect((err,result)=>{
//     if(err) throw err
    
//     console.log("successfully connected to mysql database....")
// })

// module.exports=db;


const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

async function runMigrations() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'Saibaba25$',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 10,
        multipleStatements: true,
    });

    try {
        // Test the connection
        console.log("Testing the database connection...");
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Database connection failed:', err.message);
                pool.end();
                return;
            }
            console.log('Database connection successful!');
            connection.release();
        });

        // Create the database if not exists
        const databaseName = 'Hospital_Management_Database';
        await new Promise((resolve, reject) => {
            pool.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`, (err) => {
                if (err) {
                    console.error(`Error creating the database:`, err.message);
                    reject(err);
                } else {
                    console.log(`Database ${databaseName} created or already exists.`);
                    resolve();
                }
            });
        });

        // Set the active database
        pool.config.connectionConfig.database = databaseName;
        console.log(`Using database: ${databaseName}`);

        // Migrations directory
        const migrationsPath = path.resolve(__dirname, '../migrations');
        const files = fs.readdirSync(migrationsPath)
            .filter(file => file.endsWith('.sql'));

        // Execute migrations
        for (const file of files) {
            try {
                const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
                console.log(`Executing ${file}...`);
                await new Promise((resolve, reject) => {
                    pool.query(sql, (err) => {
                        if (err) {
                            console.error(`Error executing ${file}:`, err.message);
                            reject(err);
                        } else {
                            console.log(`${file} executed successfully.`);
                            resolve();
                        }
                    });
                });
            } catch (err) {
                console.error(`Error in executing ${file}:`, err.message);
            }
        }

        console.log("Migrations Completed.");
    } catch (err) {
        console.error("Error in migrations:", err.message);
    } finally {
        pool.end((err) => {
            if (err) console.error('Error closing the database pool:', err.message);
            else console.log('Database pool closed.');
        });
    }
}

runMigrations().catch(err => console.error('Unexpected error:', err.message));