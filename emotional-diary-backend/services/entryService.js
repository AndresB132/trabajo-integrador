// services/entryService.js
const { DailyEntry } = require('../models');
const { Op } = require('sequelize');
const { calculateMonthlyStats } = require('../utils/calculateStats');

async function createEntry(data, userId) {
  return await DailyEntry.create({
    ...data,
    userId: userId, // Revertido a userId
  });
}

async function getEntriesByMonth(userId, month, year) {
  const lastDay = new Date(year, month, 0).getDate();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  return await DailyEntry.findAll({
    where: {
      userId: userId, // Revertido a userId
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
}

async function getMonthlySummary(userId, month, year) {
  const entries = await getEntriesByMonth(userId, month, year);
  return calculateMonthlyStats(entries);
}

module.exports = {
  createEntry,
  getEntriesByMonth,
  getMonthlySummary,
};