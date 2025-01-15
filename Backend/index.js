const express=require("express")
const mongoose = require('mongoose');



const app = express();
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/hospitalTokens';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));
  

const hospitalschema = new mongoose.Schema({
   name:{type:String,required:true},
})

const hospital = mongoose.model('Hospital', hospitalschema);

const doctorschema = new mongoose.Schema({
  doc_name :{type:String,required:true},
  hos_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Hospital',required:true},  
})

const doctor = mongoose.model('Doctor', doctorschema);


const staffschema = new mongoose.Schema({
  staff_name :{type : String,required:true},
  hos_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Hospital',required:true},
  doc_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Doctor',required:true}  
})

const staff = mongoose.model('Staff', staffschema);

const mobileRegex = /^[0-9]{10}$/;

const patientschema = new mongoose.Schema({
    doc_id :{type :mongoose.Schema.Types.ObjectId,ref: 'Doctor',required:true},
    staff_id :{type : mongoose.Schema.Types.ObjectId,ref: 'Staff',required:true},
    token_number :{type: Number,unqiue:true},
    patient_name :{type:String,required:true},
    patient_desc :{type:String},
    mobile_no: {
        type: String,
        required: true, 
        unique: true, 
        validate: {
          validator: function (v) {
            return mobileRegex.test(v); 
          },
        }
      },
      status: { type: String, enum: ['active', 'missing','completed'], default: 'active' }
})

const patient = mongoose.model('Patient', patientschema);


// Start the server
const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.post('/add-hospital',async(req,res)=>{
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
})

app.post('/add-doctor',async(req,res)=>{
  try{
     const {doc_name,hos_id} = req.body;
     const doc= new doctor({
      doc_name:doc_name,
      hos_id:hos_id,
     });
     await doc.save();
     res.status(200).send("Doctor added successfully")
  }catch(err){
     res.status(500).send(err);
  }
})

app.post('/add-staff',async(req,res)=>{
  try{

    

  }catch(err){

  }
})

app.post('/add-patient',async(req,res)=>{
  try{
    const {doc_id,staff_id,patient_name,patient_desc,mobile_no} = await req.body;
    const alldoccount = await patient.countDocuments()
    if(alldoccount==0){
      const pat = new patient({
        doc_id:doc_id,
        staff_id:staff_id,
        mobile_no:mobile_no,
        patient_name:patient_name,
        patient_desc:patient_desc,
        token_number:1
      })
      await pat.save()
    }else{
      alldoccount++;
    const pat = new patient({
      doc_id:doc_id,
      staff_id:staff_id,
      mobile_no:mobile_no,
      patient_name:patient_name,
      patient_desc:patient_desc,
      token_number:alldoccount
    })
    await pat.save()
  }
    res.status(200).send("Patient Successfully added...")
  }catch(err){
    res.status(500).send(err)
  }
})

