// services/moodAnalysisService.js

function analyzeMoodTrends(entries) {
  if (!entries || entries.length === 0) {
    return {
      estadoActual: 'neutral',
      promedioEmocional: '0.00',
      totalEntradas: 0,
    };
  }

  const total = entries.length;
  const avg = entries.reduce((sum, e) => sum + e.emotion_score, 0) / total;

  let moodState = 'neutral';
  if (avg >= 7) moodState = 'positivo';
  else if (avg <= 3) moodState = 'negativo';

  return {
    estadoActual: moodState,
    promedioEmocional: avg.toFixed(2),
    totalEntradas: total,
  };
}

module.exports = {
  analyzeMoodTrends,
};