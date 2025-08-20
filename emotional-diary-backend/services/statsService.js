// services/statsService.js
const { Op } = require('sequelize');
const { DailyEntry } = require('../models');
const { calculateMonthlyStats } = require('../utils/calculateStats');

class StatsService {
  async getMonthlySummary(userId, month, year) {
    // Validar parámetros
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (
      isNaN(monthNum) ||
      isNaN(yearNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      yearNum < 1900
    ) {
      throw new Error('Fecha inválida');
    }

    // Calcular fechas
    const lastDay = new Date(yearNum, monthNum, 0).getDate();
    const startDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-01`;
    const endDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-${lastDay}`;

    // Obtener entradas
    const entries = await DailyEntry.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Calcular estadísticas
    return calculateMonthlyStats(entries);
  }

  async getYearlySummary(userId, year) {
    const yearNum = parseInt(year, 10);

    if (isNaN(yearNum) || yearNum < 1900) {
      throw new Error('Año inválido');
    }

    const startDate = `${yearNum}-01-01`;
    const endDate = `${yearNum}-12-31`;

    const entries = await DailyEntry.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return this.calculateYearlyStats(entries, yearNum);
  }

  async getMoodTrends(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await DailyEntry.findAll({
      where: {
        userId: userId,
        date: {
          [Op.gte]: startDate,
        },
      },
      order: [['date', 'ASC']],
    });

    return this.calculateMoodTrends(entries);
  }

  calculateYearlyStats(entries, year) {
    const monthlyStats = {};
    
    for (let month = 1; month <= 12; month++) {
      const monthEntries = entries.filter(entry => {
        const entryMonth = new Date(entry.date).getMonth() + 1;
        return entryMonth === month;
      });
      
      monthlyStats[month] = calculateMonthlyStats(monthEntries);
    }

    return {
      year: year,
      totalEntries: entries.length,
      monthlyStats,
      averageMood: this.calculateAverageMood(entries),
    };
  }

  calculateMoodTrends(entries) {
    const moodCounts = {};
    const dailyMoods = {};

    entries.forEach(entry => {
      let dateStr;
      if (entry.date instanceof Date) {
        dateStr = entry.date.toISOString().split('T')[0];
      } else if (typeof entry.date === 'string') {
        dateStr = entry.date;
      } else {
        dateStr = new Date().toISOString().split('T')[0];
      }
      
      // Solo procesar entradas con emotion_score válido
      if (entry.emotion_score !== null && 
          entry.emotion_score !== undefined && 
          !isNaN(entry.emotion_score)) {
        
        dailyMoods[dateStr] = entry.emotion_score;
        
        if (moodCounts[entry.emotion_score]) {
          moodCounts[entry.emotion_score]++;
        } else {
          moodCounts[entry.emotion_score] = 1;
        }
      }
    });

    return {
      moodCounts,
      dailyMoods,
      totalDays: entries.length,
      averageMood: this.calculateAverageMood(entries),
    };
  }

  calculateAverageMood(entries) {
    if (entries.length === 0) return 0;
    
    const validEntries = entries.filter(entry => 
      entry.emotion_score !== null && 
      entry.emotion_score !== undefined && 
      !isNaN(entry.emotion_score)
    );
    
    if (validEntries.length === 0) return 0;
    
    const totalMood = validEntries.reduce((sum, entry) => sum + entry.emotion_score, 0);
    return Math.round((totalMood / validEntries.length) * 100) / 100;
  }
}

module.exports = new StatsService();
