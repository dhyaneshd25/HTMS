const {Router} = require('express')
const {add_hospital} = require('../controllers/hospitalcontroller')

const router = Router();

router.post('/add-hospital',add_hospital)

module.exports = router
