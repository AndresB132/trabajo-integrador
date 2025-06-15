const express = require('express');
const router = express.Router();
const { createEntry, getEntriesByMonth } = require('../controllers/entryController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Ya no necesitas "/entries" aquí porque ya lo usas en server.js
router.use(authenticateJWT);

// Rutas relativas (sin repetir "entries")
router.post('/', createEntry); // POST /api/entries/
router.get('/', getEntriesByMonth); // GET /api/entries/

module.exports = router;