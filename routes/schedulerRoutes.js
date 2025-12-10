const router = require('express').Router();
const ctrl = require('../controllers/schedulerController');

router.post('/create', ctrl.createSchedule);

module.exports = router;
