const {Router} = require('express')
const {add_patient,get_all_patients,get_status, getPatient_receptionist, getslotmaxtotalpatient} = require('../controllers/patientcontroller')

const router = Router();

router.post('/add-patient',add_patient)
router.get('/get-all-patient',get_all_patients);
router.get('/get-status',get_status);
router.get('/patientreceptionist',getPatient_receptionist);
router.get('/getslotmaxpatient',getslotmaxtotalpatient);

module.exports = router