const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadLeads } = require('../controllers/leadsController');

router.post('/upload', upload.single('file'), uploadLeads);
module.exports = router;
