const {Router} = require('express')
const {add_staff,mark_completed,mark_missing,recall_patient} = require('../controllers/staffcontroller')

const router = Router();

router.post('/add-staff',add_staff)
router.post('/mark-completed',mark_completed)
router.post('/mark-miss',mark_missing)
router.post('/recall',recall_patient)

module.exports = router