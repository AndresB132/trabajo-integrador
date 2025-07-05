const express = require('express');
const router = express.Router();
const { createEntry, getEntriesByMonth } = require('../controllers/entryController');

// Ya no usamos middleware de autenticación
// router.use(authenticateJWT);

router.post('/', createEntry); // POST /api/entries/
router.get('/', getEntriesByMonth); // GET /api/entries/

module.exports = router;
