// controllers/entryController.js

const entryService = require('../services/entryService');
const moodAnalysisService = require('../services/moodAnalysisService');
const aiReflectionService = require('../services/aiReflectionService');
const notificationService = require('../services/notificationService');

exports.createEntry = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' }); // ✅ Añadido para mejor cobertura
    }

    const entry = await entryService.createEntry(req.body, req.user.id);

    const moodSummary = moodAnalysisService.analyzeMoodTrends([entry]);
    const reflection = await aiReflectionService.reflectOnEntry(entry);

    await notificationService.sendNotification(
      req.user,
      '¡Has agregado una nueva entrada en tu diario!'
    );

    res.status(201).json({ entry, moodSummary, reflection });
  } catch (error) {
    console.error('Error en createEntry:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEntriesByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Mes y año son requeridos' }); // ✅ Validación ya existente
    }

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' }); // ✅ Añadido
    }

    const entries = await entryService.getEntriesByMonth(
      req.user.id,
      Number(month),
      Number(year)
    );

    res.json(entries);
  } catch (error) {
    console.error('Error en getEntriesByMonth:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Mes y año son requeridos' }); // ✅ Validación ya existente
    }

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' }); // ✅ Añadido
    }

    const summary = await entryService.getMonthlySummary(
      req.user.id,
      Number(month),
      Number(year)
    );

    res.json(summary);
  } catch (error) {
    console.error('Error en getMonthlySummary:', error);
    res.status(500).json({ error: error.message });
  }
};
