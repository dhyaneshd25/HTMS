const express=require("express")
// const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();

app.use(cors({
      origin: "http://localhost:5173",
      methods: "GET,POST,DELETE,PUT",
      credentials: true
}))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))



// Start the server
const PORT = 2001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const hospital_router = require('./routes/hospitalroute')
const clinic_router = require('./routes/clinicroute')
// const doctor_router = require('./routes/doctorroute')
// const staff_router = require('./routes/staffroute')
// const patient_router = require('./routes/patientroute')

app.use('/api',hospital_router);
app.use('/api',clinic_router);
// app.use('/api',doctor_router);
// app.use('/api',staff_router);
// app.use('/api',patient_router);