const {Router} = require('express')

const {add_doctor,set_maxpatientnumber} = require('../controllers/doctorcontroller')

const router = Router()

router.post('/add-doctor',add_doctor)
router.post('/set-patient-limi',set_maxpatientnumber)

module.exports = router