const express = require('express');
const multer = require('multer');
const { uploadControllers, listControllers } = require('./controller');

const router = express.Router();
const uploadFile = multer({ dest: './_temp' });

router.post('/upload', uploadFile.single('file'), uploadControllers);
router.get('/records', listControllers);

module.exports = router;
