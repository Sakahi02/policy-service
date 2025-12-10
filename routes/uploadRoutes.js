const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const uploadController = require('../controllers/uploadController');


router.post('/file', upload.single('file'), uploadController.uploadFile);

module.exports = router;
