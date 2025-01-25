const {Router} = require('express')

const {add_doctor,add_slot, get_all_doctors, get_doctor_slots} = require('../controllers/doctorcontroller')

const router = Router()

router.post('/add-doctor',add_doctor)
router.post('/add-slot',add_slot)
router.get('/get-alldoctors',get_all_doctors)
router.get('/get-doctor-slots',get_doctor_slots)


module.exports = router