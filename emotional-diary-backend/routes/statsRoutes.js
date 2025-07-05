const express = require('express');
const router = express.Router();
const { getMonthlySummary } = require('../controllers/statsController');

// router.use(authenticateJWT); // comentar o eliminar

router.get('/summary', getMonthlySummary);

module.exports = router;
