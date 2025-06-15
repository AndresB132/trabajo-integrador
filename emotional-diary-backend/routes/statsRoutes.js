const express = require('express');
const router = express.Router();
const { getMonthlySummary } = require('../controllers/statsController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.use(authenticateJWT);

router.get('/summary', getMonthlySummary);

module.exports = router;