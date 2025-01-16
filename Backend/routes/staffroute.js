const {Router} = require('express')
const {add_staff} = require('../controllers/staffcontroller')

const router = Router();

router.post('/add-staff',add_staff)

module.exports = router