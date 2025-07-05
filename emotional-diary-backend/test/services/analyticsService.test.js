const { expect } = require('chai');
const { generateEntryStats } = require('../../services/analyticsService');

describe('generateEntryStats', () => {
  it('debería devolver valores correctos para entradas vacías', () => {
    const result = generateEntryStats([]);
    expect(result).to.deep.equal({
      totalEntradas: 0,
      entradasPorDia: {},
      distribucionEmocional: {}
    });
  });

  it('debería usar array vacío si entries es undefined', () => {
    const result = generateEntryStats(undefined);
    expect(result).to.deep.equal({
      totalEntradas: 0,
      entradasPorDia: {},
      distribucionEmocional: {}
    });
  });

  it('debería contar correctamente entradas y agrupar por día', () => {
    const entries = [
      { date: '2025-06-25T10:00:00Z', emotion_score: 5 },
      { date: '2025-06-25T15:00:00Z', emotion_score: 7 },
      { date: '2025-06-26T08:00:00Z', emotion_score: 5 }
    ];

    const result = generateEntryStats(entries);
    expect(result.totalEntradas).to.equal(3);
    expect(result.entradasPorDia).to.deep.equal({
      '2025-06-25': 2,
      '2025-06-26': 1
    });
  });

  it('debería calcular correctamente la distribución emocional', () => {
    const entries = [
      { date: '2025-06-25T10:00:00Z', emotion_score: 5 },
      { date: '2025-06-25T15:00:00Z', emotion_score: 7 },
      { date: '2025-06-26T08:00:00Z', emotion_score: 5 },
      { date: '2025-06-26T09:00:00Z', emotion_score: 7 },
      { date: '2025-06-26T10:00:00Z', emotion_score: 7 },
    ];

    const result = generateEntryStats(entries);
    expect(result.distribucionEmocional).to.deep.equal({
      5: 2,
      7: 3
    });
  });

  it('debería ignorar entradas sin emotion_score numérico', () => {
    const entries = [
      { date: '2025-06-25T10:00:00Z', emotion_score: 5 },
      { date: '2025-06-25T15:00:00Z', emotion_score: 'alto' },
      { date: '2025-06-26T08:00:00Z' } // sin emotion_score
    ];

    const result = generateEntryStats(entries);
    expect(result.distribucionEmocional).to.deep.equal({
      5: 1
    });
  });

  it('debería agrupar correctamente entradas con fechas inválidas o indefinidas', () => {
    const entries = [
      { date: 'invalid-date', emotion_score: 3 },
      { emotion_score: 4 }, // sin fecha
      { date: '2025-07-01T12:00:00Z', emotion_score: 5 }
    ];

    const result = generateEntryStats(entries);
    expect(result.entradasPorDia).to.deep.equal({
      'invalid-date': 2,
      '2025-07-01': 1
    });
  });
});