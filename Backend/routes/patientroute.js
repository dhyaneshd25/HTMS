const {Router} = require('express')
const {add_patient,get_all_patients} = require('../controllers/patientcontroller')

const router = Router();

router.post('/add-patient',add_patient)
router.get('/get-all-patient',get_all_patients);

module.exports = router