const express = require('express');
const router = express.Router();
const { runScoring, getResults, exportCSV } = require('../controllers/scoreController');

router.post('/', runScoring);
router.get('/results', getResults);
router.get('/results/export', exportCSV);
module.exports = router;
