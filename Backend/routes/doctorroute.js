const {Router} = require('express')

const {add_doctor,set_maxpatientnumber, get_all_doctors} = require('../controllers/doctorcontroller')

const router = Router()

router.post('/add-doctor',add_doctor)
router.post('/set-patient-limit',set_maxpatientnumber)
router.get('/get-alldocs',get_all_doctors)

module.exports = router