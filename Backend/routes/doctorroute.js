const {Router} = require('express')

const {add_doctor} = require('../controllers/doctorcontroller')

const router = Router()

router.post('/add-doctor',add_doctor)

module.exports = router