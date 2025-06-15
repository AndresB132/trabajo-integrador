const { DailyEntry } = require('../models');

exports.createEntry = async (req, res) => {
  try {
    const entry = await DailyEntry.create({
      ...req.body,
      user_id: req.user.id,
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEntriesByMonth = async (req, res) => {
  const { month, year } = req.query;
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  const entries = await DailyEntry.findAll({
    where: {
      user_id: req.user.id,
      date: {
        [Symbol.for('sequelize.Op.between')]: [startDate, endDate],
      },
    },
  });

  res.json(entries);
};