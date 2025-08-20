// test/services/statsService.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const { Op } = require('sequelize');

const statsService = require('../../services/statsService');
const { DailyEntry } = require('../../models');
const calculateStatsModule = require('../../utils/calculateStats');

describe('statsService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getMonthlySummary', () => {
    it('debería devolver estadísticas mensuales correctamente', async () => {
      const userId = 123;
      const month = 6;
      const year = 2024;

      const fakeEntries = [
        { id: 1, emotion_score: 5, date: '2024-06-01' },
        { id: 2, emotion_score: 7, date: '2024-06-15' }
      ];

      sandbox.stub(DailyEntry, 'findAll').resolves(fakeEntries);
      
      const result = await statsService.getMonthlySummary(userId, month, year);

      expect(DailyEntry.findAll.calledOnce).to.be.true;
      expect(result).to.be.an('object');
      expect(result).to.have.property('total_days');
      expect(result).to.have.property('average_emotion');
      expect(result).to.have.property('weekly_averages');
    });

    it('debería lanzar error si la fecha es inválida - mes inválido', async () => {
      const userId = 123;
      const month = 13; // Mes inválido
      const year = 2024;

      try {
        await statsService.getMonthlySummary(userId, month, year);
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Fecha inválida');
      }
    });

    it('debería lanzar error si la fecha es inválida - año inválido', async () => {
      const userId = 123;
      const month = 6;
      const year = 1800; // Año inválido

      try {
        await statsService.getMonthlySummary(userId, month, year);
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Fecha inválida');
      }
    });

    it('debería lanzar error si la fecha es inválida - mes como string', async () => {
      const userId = 123;
      const month = 'invalid'; // Mes inválido
      const year = 2024;

      try {
        await statsService.getMonthlySummary(userId, month, year);
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Fecha inválida');
      }
    });
  });

  describe('getYearlySummary', () => {
    it('debería devolver estadísticas anuales correctamente', async () => {
      const userId = 123;
      const year = 2025;

      const fakeEntries = [
        { id: 1, emotion_score: 5, date: '2025-01-01' },
        { id: 2, emotion_score: 7, date: '2025-06-15' },
        { id: 3, emotion_score: 8, date: '2025-12-31' }
      ];

      // Stub calculateMonthlyStats para que devuelva estadísticas válidas
      const monthlyStatsStub = {
        total_days: 1,
        average_emotion: '5.00',
        weekly_averages: []
      };
      
      sandbox.stub(calculateStatsModule, 'calculateMonthlyStats').returns(monthlyStatsStub);
      sandbox.stub(DailyEntry, 'findAll').resolves(fakeEntries);

      const result = await statsService.getYearlySummary(userId, year);

      expect(DailyEntry.findAll.calledOnce).to.be.true;
      expect(result.year).to.equal(2025);
      expect(result.totalEntries).to.equal(3);
      expect(result.averageMood).to.equal(6.67);
      expect(result.monthlyStats).to.have.property('1');
      expect(result.monthlyStats).to.have.property('6');
      expect(result.monthlyStats).to.have.property('12');
    });

    it('debería lanzar error si el año es inválido', async () => {
      const userId = 123;
      const year = 1800; // Año inválido

      try {
        await statsService.getYearlySummary(userId, year);
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Año inválido');
      }
    });

    it('debería lanzar error si el año es NaN', async () => {
      const userId = 123;
      const year = 'invalid'; // Año inválido

      try {
        await statsService.getYearlySummary(userId, year);
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Año inválido');
      }
    });

    it('debería manejar año sin entradas', async () => {
      const userId = 123;
      const year = 2025;

      sandbox.stub(DailyEntry, 'findAll').resolves([]);

      const result = await statsService.getYearlySummary(userId, year);

      expect(result.year).to.equal(2025);
      expect(result.totalEntries).to.equal(0);
      expect(result.averageMood).to.equal(0);
      expect(result.monthlyStats).to.be.an('object');
    });
  });

  describe('getMoodTrends', () => {
    it('debería devolver tendencias de humor correctamente', async () => {
      const userId = 123;
      const days = 30;

      const fakeEntries = [
        { id: 1, emotion_score: 5, date: new Date('2024-06-01') },
        { id: 2, emotion_score: 7, date: new Date('2024-06-02') },
        { id: 3, emotion_score: 8, date: new Date('2024-06-03') }
      ];

      sandbox.stub(DailyEntry, 'findAll').resolves(fakeEntries);

      const result = await statsService.getMoodTrends(userId, days);

      expect(DailyEntry.findAll.calledOnce).to.be.true;
      expect(result.totalDays).to.equal(3);
      expect(result.averageMood).to.equal(6.67);
      expect(result.moodCounts).to.deep.equal({ 5: 1, 7: 1, 8: 1 });
      expect(result.dailyMoods).to.have.property('2024-06-01');
      expect(result.dailyMoods).to.have.property('2024-06-02');
      expect(result.dailyMoods).to.have.property('2024-06-03');
    });

    it('debería usar 30 días por defecto', async () => {
      const userId = 123;

      const fakeEntries = [
        { id: 1, emotion_score: 5, date: new Date() }
      ];

      sandbox.stub(DailyEntry, 'findAll').resolves(fakeEntries);

      const result = await statsService.getMoodTrends(userId);

      expect(DailyEntry.findAll.calledOnce).to.be.true;
      expect(result.totalDays).to.equal(1);
      expect(result.averageMood).to.equal(5);
    });

    it('debería manejar entradas sin emotion_score', async () => {
      const userId = 123;
      const days = 30;

      const fakeEntries = [
        { id: 1, emotion_score: 5, date: new Date('2024-06-01') },
        { id: 2, emotion_score: null, date: new Date('2024-06-02') },
        { id: 3, emotion_score: undefined, date: new Date('2024-06-03') }
      ];

      sandbox.stub(DailyEntry, 'findAll').resolves(fakeEntries);

      const result = await statsService.getMoodTrends(userId, days);

      expect(result.totalDays).to.equal(3);
      expect(result.averageMood).to.equal(5);
      expect(result.moodCounts).to.deep.equal({ 5: 1 });
    });

    it('debería manejar entradas vacías', async () => {
      const userId = 123;
      const days = 30;

      sandbox.stub(DailyEntry, 'findAll').resolves([]);

      const result = await statsService.getMoodTrends(userId, days);

      expect(result.totalDays).to.equal(0);
      expect(result.averageMood).to.equal(0);
      expect(result.moodCounts).to.deep.equal({});
      expect(result.dailyMoods).to.deep.equal({});
    });
  });

  describe('calculateYearlyStats', () => {
    it('debería calcular estadísticas anuales correctamente', () => {
      const entries = [
        { id: 1, emotion_score: 5, date: '2025-01-01' },
        { id: 2, emotion_score: 7, date: '2025-06-15' },
        { id: 3, emotion_score: 8, date: '2025-12-31' }
      ];

      // Stub calculateMonthlyStats
      sandbox.stub(calculateStatsModule, 'calculateMonthlyStats').returns({
        total_days: 1,
        average_emotion: '5.00',
        weekly_averages: []
      });

      const result = statsService.calculateYearlyStats(entries, 2025);

      expect(result.year).to.equal(2025);
      expect(result.totalEntries).to.equal(3);
      expect(result.averageMood).to.equal(6.67);
      expect(result.monthlyStats).to.have.property('1');
      expect(result.monthlyStats).to.have.property('6');
      expect(result.monthlyStats).to.have.property('12');
    });

    it('debería manejar entradas vacías', () => {
      const entries = [];

      const result = statsService.calculateYearlyStats(entries, 2025);

      expect(result.year).to.equal(2025);
      expect(result.totalEntries).to.equal(0);
      expect(result.averageMood).to.equal(0);
      expect(result.monthlyStats).to.be.an('object');
    });
  });

  describe('calculateMoodTrends', () => {
    it('debería calcular tendencias de humor correctamente', () => {
      const entries = [
        { id: 1, emotion_score: 5, date: new Date('2024-06-01') },
        { id: 2, emotion_score: 7, date: new Date('2024-06-02') },
        { id: 3, emotion_score: 8, date: new Date('2024-06-03') }
      ];

      const result = statsService.calculateMoodTrends(entries);

      expect(result.totalDays).to.equal(3);
      expect(result.averageMood).to.equal(6.67);
      expect(result.moodCounts).to.deep.equal({ 5: 1, 7: 1, 8: 1 });
      expect(result.dailyMoods).to.have.property('2024-06-01');
      expect(result.dailyMoods).to.have.property('2024-06-02');
      expect(result.dailyMoods).to.have.property('2024-06-03');
    });

    it('debería manejar entradas con fechas inválidas', () => {
      const entries = [
        { id: 1, emotion_score: 5, date: 'invalid-date' },
        { id: 2, emotion_score: 7, date: null },
        { id: 3, emotion_score: 8, date: undefined }
      ];

      const result = statsService.calculateMoodTrends(entries);

      expect(result.totalDays).to.equal(3);
      expect(result.averageMood).to.equal(6.67);
      expect(result.moodCounts).to.deep.equal({ 5: 1, 7: 1, 8: 1 });
    });

    it('debería manejar entradas con emotion_score válido e inválido', () => {
      const entries = [
        { id: 1, emotion_score: 5, date: '2024-06-01' },
        { id: 2, emotion_score: null, date: '2024-06-02' },
        { id: 3, emotion_score: 8, date: '2024-06-03' },
        { id: 4, emotion_score: undefined, date: '2024-06-04' },
        { id: 5, emotion_score: 10, date: '2024-06-05' }
      ];

      const result = statsService.calculateMoodTrends(entries);

      expect(result.totalDays).to.equal(5);
      expect(result.averageMood).to.equal(7.67);
      expect(result.moodCounts).to.deep.equal({ 5: 1, 8: 1, 10: 1 });
      expect(result.dailyMoods).to.have.property('2024-06-01');
      expect(result.dailyMoods).to.have.property('2024-06-03');
      expect(result.dailyMoods).to.have.property('2024-06-05');
      expect(result.dailyMoods).to.not.have.property('2024-06-02');
      expect(result.dailyMoods).to.not.have.property('2024-06-04');
    });

    it('debería manejar entradas con diferentes tipos de fechas', () => {
      const entries = [
        { id: 1, emotion_score: 5, date: new Date('2024-06-01') },
        { id: 2, emotion_score: 7, date: '2024-06-02' },
        { id: 3, emotion_score: 8, date: null },
        { id: 4, emotion_score: 9, date: undefined }
      ];

      const result = statsService.calculateMoodTrends(entries);

      expect(result.totalDays).to.equal(4);
      expect(result.averageMood).to.equal(7.25);
      expect(result.moodCounts).to.deep.equal({ 5: 1, 7: 1, 8: 1, 9: 1 });
      expect(result.dailyMoods).to.have.property('2024-06-01');
      expect(result.dailyMoods).to.have.property('2024-06-02');
      // Las fechas null/undefined se convierten en la fecha actual (pueden ser la misma)
      expect(Object.keys(result.dailyMoods).length).to.be.at.least(3);
    });

    it('debería cubrir completamente el método calculateMoodTrends con fechas únicas', () => {
      // Crear entradas con fechas que generen diferentes dateStr
      const entries = [
        { id: 1, emotion_score: 5, date: new Date('2024-06-01') },
        { id: 2, emotion_score: 7, date: '2024-06-02' },
        { id: 3, emotion_score: 8, date: new Date('2024-06-03') },
        { id: 4, emotion_score: 9, date: '2024-06-04' }
      ];

      const result = statsService.calculateMoodTrends(entries);

      expect(result.totalDays).to.equal(4);
      expect(result.averageMood).to.equal(7.25);
      expect(result.moodCounts).to.deep.equal({ 5: 1, 7: 1, 8: 1, 9: 1 });
      expect(result.dailyMoods).to.have.property('2024-06-01');
      expect(result.dailyMoods).to.have.property('2024-06-02');
      expect(result.dailyMoods).to.have.property('2024-06-03');
      expect(result.dailyMoods).to.have.property('2024-06-04');
      expect(Object.keys(result.dailyMoods)).to.have.length(4);
    });

    it('debería cubrir completamente el método calculateMoodTrends con fechas null/undefined', () => {
      // Crear entradas con fechas que generen diferentes dateStr
      const entries = [
        { id: 1, emotion_score: 5, date: new Date('2024-06-01') },
        { id: 2, emotion_score: 7, date: '2024-06-02' },
        { id: 3, emotion_score: 8, date: null },
        { id: 4, emotion_score: 9, date: undefined }
      ];

      const result = statsService.calculateMoodTrends(entries);

      expect(result.totalDays).to.equal(4);
      expect(result.averageMood).to.equal(7.25);
      expect(result.moodCounts).to.deep.equal({ 5: 1, 7: 1, 8: 1, 9: 1 });
      expect(result.dailyMoods).to.have.property('2024-06-01');
      expect(result.dailyMoods).to.have.property('2024-06-02');
      // Las fechas null/undefined se convierten en la fecha actual
      expect(Object.keys(result.dailyMoods).length).to.be.at.least(3);
    });

    it('debería manejar entradas vacías', () => {
      const entries = [];

      const result = statsService.calculateMoodTrends(entries);

      expect(result.totalDays).to.equal(0);
      expect(result.averageMood).to.equal(0);
      expect(result.moodCounts).to.deep.equal({});
      expect(result.dailyMoods).to.deep.equal({});
    });

    it('debería cubrir casos extremos de date y emotion_score', () => {
      const statsService = require('../../services/statsService');
      const entries = [
        { emotion_score: 11, date: {} }, // date como objeto vacío
        { emotion_score: 12, date: 12345 }, // date como número
        { emotion_score: 11, date: false }, // date como booleano
      ];
      const result = statsService.calculateMoodTrends(entries);
      expect(result.moodCounts[11]).to.equal(2);
      expect(result.moodCounts[12]).to.equal(1);
      // Las fechas se convierten en la fecha actual
      Object.values(result.dailyMoods).forEach(score => {
        expect([11, 12]).to.include(score);
      });
    });
  });

  describe('calculateAverageMood', () => {
    it('debería calcular promedio correctamente', () => {
      const entries = [
        { emotion_score: 5 },
        { emotion_score: 7 },
        { emotion_score: 8 }
      ];

      const result = statsService.calculateAverageMood(entries);

      expect(result).to.equal(6.67);
    });

    it('debería devolver 0 para entradas vacías', () => {
      const entries = [];

      const result = statsService.calculateAverageMood(entries);

      expect(result).to.equal(0);
    });

    it('debería manejar entradas con emotion_score inválido', () => {
      const entries = [
        { emotion_score: 5 },
        { emotion_score: null },
        { emotion_score: undefined },
        { emotion_score: 'invalid' }
      ];

      const result = statsService.calculateAverageMood(entries);

      expect(result).to.equal(5);
    });

    it('debería devolver 0 si todas las entradas tienen emotion_score inválido', () => {
      const entries = [
        { emotion_score: null },
        { emotion_score: undefined },
        { emotion_score: NaN },
        { emotion_score: 'no-num' }
      ];
      const result = statsService.calculateAverageMood(entries);
      expect(result).to.equal(0);
    });
  });
});
