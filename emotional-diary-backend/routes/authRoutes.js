const express = require('express');
const router = express.Router();
const { createEntry, getEntriesByMonth } = require('../controllers/entryController');

// Ya no usamos middleware JWT
router.post('/entries', createEntry);
router.get('/entries', getEntriesByMonth);

module.exports = router;
