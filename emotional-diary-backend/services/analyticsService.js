// services/analyticsService.js

function generateEntryStats(entries) {
  // Asegura que entries sea un arreglo, incluso si es undefined
  const safeEntries = Array.isArray(entries) ? entries : [];

  const total = safeEntries.length;

  // Agrupar entradas por fecha
  const entriesByDay = {};
  for (const entry of safeEntries) {
    let day;
    try {
      if (!entry.date) throw new Error('Fecha no definida');
      const dateObj = new Date(entry.date);
      if (isNaN(dateObj)) throw new Error('Fecha inválida');
      day = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch {
      day = 'invalid-date';
    }

    if (!entriesByDay[day]) entriesByDay[day] = 0;
    entriesByDay[day]++;
  }

  // Distribución de emociones
  const emotionDistribution = safeEntries.reduce((acc, entry) => {
    const score = entry.emotion_score;
    if (typeof score === 'number' && !isNaN(score)) {
      acc[score] = (acc[score] || 0) + 1;
    }
    return acc;
  }, {});

  return {
    totalEntradas: total,
    entradasPorDia: entriesByDay,
    distribucionEmocional: emotionDistribution,
  };
}

module.exports = {
  generateEntryStats,
};