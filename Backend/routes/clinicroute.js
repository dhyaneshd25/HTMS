const {Router} = require('express');
const { add_clinic, get_schedule_days, get_all_clinic } = require('../controllers/cliniccontroller');
const { get_doctor_clinic } = require('../controllers/doctorcontroller');
const router = Router();


router.post('/add-clinic',add_clinic);

router.get('/get-schedule-day',get_schedule_days);

router.get('/get-all-clinic', get_all_clinic);

router.get('/get-clinic-doctor', get_doctor_clinic);


module.exports =router;