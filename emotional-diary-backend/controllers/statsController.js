// controllers/statsController.js
const statsService = require('../services/statsService');

exports.getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' });
    }

    const stats = await statsService.getMonthlySummary(req.user.id, month, year);
    res.json(stats);
  } catch (error) {
    console.error('Error en getMonthlySummary:', error);
    
    if (error.message === 'Fecha inválida') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al obtener el resumen mensual' });
  }
};

exports.getYearlySummary = async (req, res) => {
  try {
    const { year } = req.query;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' });
    }

    const stats = await statsService.getYearlySummary(req.user.id, year);
    res.json(stats);
  } catch (error) {
    console.error('Error en getYearlySummary:', error);
    
    if (error.message === 'Año inválido') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al obtener el resumen anual' });
  }
};

exports.getMoodTrends = async (req, res) => {
  try {
    const { days } = req.query;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Usuario no autenticado' });
    }

    const trends = await statsService.getMoodTrends(req.user.id, days ? parseInt(days) : 30);
    res.json(trends);
  } catch (error) {
    console.error('Error en getMoodTrends:', error);
    res.status(500).json({ error: 'Error al obtener las tendencias de humor' });
  }
};