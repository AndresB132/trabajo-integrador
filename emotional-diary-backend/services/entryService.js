// services/entryService.js
const { DailyEntry } = require('../models');
const { Op } = require('sequelize');
const { calculateMonthlyStats } = require('../utils/calculateStats');
const moodAnalysisService = require('./moodAnalysisService');
const aiReflectionService = require('./aiReflectionService');
const notificationService = require('./notificationService');

class EntryService {
  async createEntry(data, userId) {
    // Crear la entrada
    const entry = await DailyEntry.create({
      ...data,
      userId: userId,
    });

    // Análisis de humor
    const moodSummary = moodAnalysisService.analyzeMoodTrends([entry]);
    
    // Reflexión AI
    const reflection = await aiReflectionService.reflectOnEntry(entry);

    // Notificación
    await notificationService.sendNotification(
      { id: userId },
      '¡Has agregado una nueva entrada en tu diario!'
    );

    return { entry, moodSummary, reflection };
  }

  async getEntryById(id, userId) {
    return await DailyEntry.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });
  }

  async updateEntry(id, data, userId) {
    const entry = await DailyEntry.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!entry) {
      return null;
    }

    const updatedEntry = await entry.update(data);

    // Análisis de humor después de actualizar
    const moodSummary = moodAnalysisService.analyzeMoodTrends([updatedEntry]);
    
    // Nueva reflexión AI
    const reflection = await aiReflectionService.reflectOnEntry(updatedEntry);

    return { entry: updatedEntry, moodSummary, reflection };
  }

  async deleteEntry(id, userId) {
    const entry = await DailyEntry.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!entry) {
      return null;
    }

    await entry.destroy();
    return entry;
  }

  async getEntriesByMonth(userId, month, year) {
    const lastDay = new Date(year, month, 0).getDate();
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    return await DailyEntry.findAll({
      where: {
        userId: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }

  async getMonthlySummary(userId, month, year) {
    const entries = await this.getEntriesByMonth(userId, month, year);
    return calculateMonthlyStats(entries);
  }

  async getAllEntries(userId) {
    return await DailyEntry.findAll({
      where: { userId },
      order: [['date', 'DESC']],
    });
  }
}

module.exports = new EntryService();