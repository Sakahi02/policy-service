const router = require('express').Router();
const controller = require('../controllers/policyController');

router.get('/search', controller.searchByUser);
router.get('/aggregate', controller.aggregateByUser);


module.exports = router;
