const { Op } = require('sequelize');
const { calculateMonthlyStats } = require('../utils/calculateStats');
const { DailyEntry } = require('../models');

exports.getMonthlySummary = async (req, res) => {
  const { month, year } = req.query;

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (
    isNaN(monthNum) || isNaN(yearNum) ||
    monthNum < 1 || monthNum > 12 ||
    yearNum < 1900
  ) {
    return res.status(400).json({ error: 'Fecha inválida' });
  }

  const lastDay = new Date(yearNum, monthNum, 0).getDate();

  const startDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-01`;
  const endDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-${lastDay}`;

  try {
    const entries = await DailyEntry.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const stats = calculateMonthlyStats(entries);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el resumen mensual' });
  }
};
