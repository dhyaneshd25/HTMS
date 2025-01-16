const express=require("express")
const mongoose = require('mongoose');
const cors = require('cors')


const app = express();

app.use(cors({
      origin: "http://localhost:5173",
      methods: "GET,POST,DELETE,PUT",
      credentials: true
}))

app.use(express.json());

const mongoURI = 'mongodb+srv://dhyaneshd7:Dharmik2001@cluster0.pharjkj.mongodb.net/';

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

app.use('/api',hospital_router);
app.use('/api',doctor_router);
app.use('/api',staff_router);
app.use('/api',patient_router);