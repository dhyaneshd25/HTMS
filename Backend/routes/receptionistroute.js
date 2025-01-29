const {Router} = require('express')
const {add_receptionist,mark_completed,mark_missing,recall_patient,  gettodayslots, updatecomplete, updatecurrent} = require('../controllers/receptionistcontroller');


const router = Router();

router.post('/add-receptionist',add_receptionist)
router.post('/mark-completed',mark_completed)
router.post('/mark-miss',mark_missing)
router.post('/recall',recall_patient)
router.get('/gettodayslot',gettodayslots)
router.post('/updatecomplete',updatecomplete)
router.post('/updatecurrent',updatecurrent)


module.exports = router