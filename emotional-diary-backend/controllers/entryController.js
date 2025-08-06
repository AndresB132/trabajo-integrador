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

exports.getEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' });
    }

    const entry = await entryService.getEntryById(id, req.user.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error en getEntryById:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' });
    }

    const entry = await entryService.updateEntry(id, req.body, req.user.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    const moodSummary = moodAnalysisService.analyzeMoodTrends([entry]);
    const reflection = await aiReflectionService.reflectOnEntry(entry);

    res.json({ entry, moodSummary, reflection });
  } catch (error) {
    console.error('Error en updateEntry:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' });
    }

    const deleted = await entryService.deleteEntry(id, req.user.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    res.json({ message: 'Entrada eliminada correctamente', deletedEntry: deleted });
  } catch (error) {
    console.error('Error en deleteEntry:', error);
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
