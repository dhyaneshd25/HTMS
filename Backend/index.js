const express=require("express")
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/hospitalTokens';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));
  

// Start the server
const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const hospital_router = require('./routes/hospitalroute')
const doctor_router = require('./routes/doctorroute')
const staff_router = require('./routes/staffroute')
const patient_router = require('./routes/patientroute')

app.use('/',hospital_router);
app.use('/',doctor_router);
app.use('/',staff_router);
app.use('/',patient_router);