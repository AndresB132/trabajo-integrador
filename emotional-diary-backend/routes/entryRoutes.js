const express = require('express');
const router = express.Router();
const { createEntry, getEntryById, updateEntry, deleteEntry, getEntriesByMonth } = require('../controllers/entryController');
const { authenticateUser } = require('../middleware/auth');

// Usar middleware de autenticación
router.use(authenticateUser);

router.post('/', createEntry); // POST /api/entries/
router.get('/:id', getEntryById); // GET /api/entries/:id
router.put('/:id', updateEntry); // PUT /api/entries/:id
router.delete('/:id', deleteEntry); // DELETE /api/entries/:id
router.get('/', getEntriesByMonth); // GET /api/entries/

module.exports = router;
