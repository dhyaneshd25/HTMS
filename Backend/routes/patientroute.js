const {Router} = require('express')
const {add_patient} = require('../controllers/patientcontroller')

const router = Router();

router.post('/add-patient',add_patient)