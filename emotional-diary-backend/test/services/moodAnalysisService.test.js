// test/services/moodAnalysisService.test.js

const { expect } = require('chai');
const { analyzeMoodTrends } = require('../../services/moodAnalysisService');

describe('moodAnalysisService', () => {
  it('debería retornar estado neutral y promedio 0 si no hay entradas', () => {
    const result = analyzeMoodTrends([]);
    expect(result).to.deep.equal({
      promedioEmocional: '0.00',
      estadoActual: 'neutral',
      totalEntradas: 0,
    });
  });

  it('debería retornar estado positivo si el promedio es >= 7', () => {
    const entries = [
      { emotion_score: 7 },
      { emotion_score: 8 },
      { emotion_score: 9 },
    ];
    const result = analyzeMoodTrends(entries);
    expect(result.estadoActual).to.equal('positivo');
    expect(parseFloat(result.promedioEmocional)).to.be.at.least(7);
    expect(result.totalEntradas).to.equal(entries.length);
  });

  it('debería retornar estado negativo si el promedio es <= 3', () => {
    const entries = [
      { emotion_score: 1 },
      { emotion_score: 3 },
      { emotion_score: 2 },
    ];
    const result = analyzeMoodTrends(entries);
    expect(result.estadoActual).to.equal('negativo');
    expect(parseFloat(result.promedioEmocional)).to.be.at.most(3);
    expect(result.totalEntradas).to.equal(entries.length);
  });

  it('debería retornar estado neutral si el promedio está entre 3 y 7', () => {
    const entries = [
      { emotion_score: 4 },
      { emotion_score: 5 },
      { emotion_score: 6 },
    ];
    const result = analyzeMoodTrends(entries);
    expect(result.estadoActual).to.equal('neutral');
    expect(parseFloat(result.promedioEmocional)).to.be.within(4, 6);
    expect(result.totalEntradas).to.equal(entries.length);
  });
});
