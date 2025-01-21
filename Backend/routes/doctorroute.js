const {Router} = require('express')

const {add_doctor,set_maxpatientnumber, get_all_doctors, get_maxpatient} = require('../controllers/doctorcontroller')

const router = Router()

router.post('/add-doctor',add_doctor)
router.post('/set-patient-limit',set_maxpatientnumber)
router.get('/get-alldocs',get_all_doctors)
router.get('/get-maxpatient',get_maxpatient);

module.exports = router