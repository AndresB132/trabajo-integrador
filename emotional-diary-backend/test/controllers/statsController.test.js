// test/controllers/statsController.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const statsController = require('../../controllers/statsController');
const statsService = require('../../services/statsService');

describe('statsController', () => {
  let req, res, sandbox;

  before(function () {
    sinon.stub(console, 'error');
  });
  after(function () {
    console.error.restore();
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: 123 },
      query: {}
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getMonthlySummary', () => {
    it('debería devolver 400 si la fecha es inválida', async () => {
      req.query = { month: '13', year: '2024' }; // Mes inválido

      sandbox.stub(statsService, 'getMonthlySummary').rejects(new Error('Fecha inválida'));

      await statsController.getMonthlySummary(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Fecha inválida' })).to.be.true;
    });

    it('debería devolver estadísticas correctamente (happy path)', async () => {
      req.query = { month: '6', year: '2024' };

      const fakeStats = {
        total_days: 30,
        average_emotion: '6.50',
        weekly_averages: []
      };

      sandbox.stub(statsService, 'getMonthlySummary').resolves(fakeStats);

      await statsController.getMonthlySummary(req, res);

      expect(statsService.getMonthlySummary.calledWith(123, '6', '2024')).to.be.true;
      expect(res.json.calledWith(fakeStats)).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;
      req.query = { month: '6', year: '2024' };

      await statsController.getMonthlySummary(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería manejar errores internos (500)', async () => {
      req.query = { month: '6', year: '2024' };

      sandbox.stub(statsService, 'getMonthlySummary').rejects(new Error('Error interno'));

      await statsController.getMonthlySummary(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al obtener el resumen mensual' })).to.be.true;
    });
  });

  describe('getYearlySummary', () => {
    it('debería devolver estadísticas anuales correctamente', async () => {
      req.query = { year: '2024' };

      const fakeYearlyStats = {
        year: 2024,
        totalEntries: 365,
        monthlyStats: {},
        averageMood: 6.5
      };

      sandbox.stub(statsService, 'getYearlySummary').resolves(fakeYearlyStats);

      await statsController.getYearlySummary(req, res);

      expect(statsService.getYearlySummary.calledWith(123, '2024')).to.be.true;
      expect(res.json.calledWith(fakeYearlyStats)).to.be.true;
    });

    it('debería devolver 400 si el año es inválido', async () => {
      req.query = { year: '1800' }; // Año inválido

      sandbox.stub(statsService, 'getYearlySummary').rejects(new Error('Año inválido'));

      await statsController.getYearlySummary(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Año inválido' })).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;
      req.query = { year: '2024' };

      await statsController.getYearlySummary(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería manejar errores internos (500)', async () => {
      req.query = { year: '2024' };

      sandbox.stub(statsService, 'getYearlySummary').rejects(new Error('Error interno'));

      await statsController.getYearlySummary(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al obtener el resumen anual' })).to.be.true;
    });
  });

  describe('getMoodTrends', () => {
    it('debería devolver tendencias de humor correctamente', async () => {
      req.query = { days: '30' };

      const fakeTrends = {
        moodCounts: { 5: 10, 7: 15, 8: 5 },
        dailyMoods: { '2024-06-01': 5, '2024-06-02': 7 },
        totalDays: 30,
        averageMood: 6.5
      };

      sandbox.stub(statsService, 'getMoodTrends').resolves(fakeTrends);

      await statsController.getMoodTrends(req, res);

      expect(statsService.getMoodTrends.calledWith(123, 30)).to.be.true;
      expect(res.json.calledWith(fakeTrends)).to.be.true;
    });

    it('debería usar 30 días por defecto si no se especifica', async () => {
      req.query = {}; // Sin parámetro days

      const fakeTrends = {
        moodCounts: { 5: 10, 7: 15 },
        totalDays: 30,
        averageMood: 6.0
      };

      sandbox.stub(statsService, 'getMoodTrends').resolves(fakeTrends);

      await statsController.getMoodTrends(req, res);

      expect(statsService.getMoodTrends.calledWith(123, 30)).to.be.true;
      expect(res.json.calledWith(fakeTrends)).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;
      req.query = { days: '30' };

      await statsController.getMoodTrends(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería manejar errores internos (500)', async () => {
      req.query = { days: '30' };

      sandbox.stub(statsService, 'getMoodTrends').rejects(new Error('Error interno'));

      await statsController.getMoodTrends(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al obtener las tendencias de humor' })).to.be.true;
    });
  });
});
