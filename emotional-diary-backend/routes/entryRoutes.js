const express = require('express');
const router = express.Router();
const { createEntry, getEntriesByMonth } = require('../controllers/entryController');
const { authenticateUser } = require('../middleware/auth');

// Usar middleware de autenticación
router.use(authenticateUser);

router.post('/', createEntry); // POST /api/entries/
router.get('/', getEntriesByMonth); // GET /api/entries/

module.exports = router;
