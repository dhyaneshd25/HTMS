const {Router} = require('express')
const {add_receptionist,mark_completed,mark_missing,recall_patient} = require('../controllers/receptionistcontroller')

const router = Router();

router.post('/add-receptionist',add_receptionist)
router.post('/mark-completed',mark_completed)
router.post('/mark-miss',mark_missing)
router.post('/recall',recall_patient)

module.exports = router