exports.calculateMonthlyStats = (entries) => {
  const totalDays = entries.length;
  const totalScore = entries.reduce((sum, e) => sum + e.emotion_score, 0);
  const averageScore = totalDays ? (totalScore / totalDays).toFixed(2) : 0;

  // Agrupar por semanas
  const byWeek = {};
  entries.forEach(entry => {
    const date = new Date(entry.date);
    const weekNumber = Math.ceil(date.getDate() / 7);
    if (!byWeek[weekNumber]) byWeek[weekNumber] = [];
    byWeek[weekNumber].push(entry);
  });

  const weeklyAverages = Object.entries(byWeek).map(([week, items]) => {
    const avg = items.reduce((sum, i) => sum + i.emotion_score, 0) / items.length;
    return { week: parseInt(week), average: avg.toFixed(2) };
  });

  return {
    total_days: totalDays,
    average_emotion: averageScore,
    weekly_averages: weeklyAverages,
    entries,
  };
};