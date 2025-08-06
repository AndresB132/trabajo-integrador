const express = require('express');
const router = express.Router();
const { getMonthlySummary } = require('../controllers/statsController');
const { authenticateUser } = require('../middleware/auth');

// Usar middleware de autenticación
router.use(authenticateUser);

router.get('/monthly', getMonthlySummary); // GET /api/stats/monthly

module.exports = router;
