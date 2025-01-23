const {Router} = require('express');
const { add_clinic, get_schedule_days } = require('../controllers/cliniccontroller');
const router = Router();


router.post('/add-clinic',add_clinic);
router.get('/get-schedule-day',get_schedule_days);

module.exports =router;