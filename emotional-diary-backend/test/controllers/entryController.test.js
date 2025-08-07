// test/controllers/entryController.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const entryController = require('../../controllers/entryController');
const entryService = require('../../services/entryService');
const moodAnalysisService = require('../../services/moodAnalysisService');
const aiReflectionService = require('../../services/aiReflectionService');
const notificationService = require('../../services/notificationService');

describe('entryController', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'error'); // Oculta los errores en consola durante los tests
    req = {
      body: { description: 'Test entry', emotion_score: 5 },
      user: { id: 123 },
      query: { month: '6', year: '2025' },
      params: { id: '1' },
    };

    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createEntry', () => {
    it('debería crear una entrada y devolver moodSummary y reflection (caso feliz)', async () => {
      const fakeEntry = { id: 1, ...req.body, userId: req.user.id };
      const fakeMoodSummary = { estadoActual: 'neutral', promedioEmocional: '5.00' };
      const fakeReflection = 'Reflexión IA generada';

      sandbox.stub(entryService, 'createEntry').resolves(fakeEntry);
      sandbox.stub(moodAnalysisService, 'analyzeMoodTrends').returns(fakeMoodSummary);
      sandbox.stub(aiReflectionService, 'reflectOnEntry').resolves(fakeReflection);
      sandbox.stub(notificationService, 'sendNotification').resolves();

      await entryController.createEntry(req, res);

      expect(entryService.createEntry.calledWith(req.body, req.user.id)).to.be.true;
      expect(moodAnalysisService.analyzeMoodTrends.calledWith([fakeEntry])).to.be.true;
      expect(aiReflectionService.reflectOnEntry.calledWith(fakeEntry)).to.be.true;
      expect(notificationService.sendNotification.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('moodSummary'))).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;

      await entryController.createEntry(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería manejar error al crear entrada (caso error)', async () => {
      const errorMessage = 'Error creando entrada';
      sandbox.stub(entryService, 'createEntry').rejects(new Error(errorMessage));

      await entryController.createEntry(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: errorMessage })).to.be.true;
    });
  });

  describe('getEntryById', () => {
    it('debería devolver una entrada específica (caso feliz)', async () => {
      const fakeEntry = { id: 1, description: 'Test entry', userId: 123 };
      sandbox.stub(entryService, 'getEntryById').resolves(fakeEntry);

      await entryController.getEntryById(req, res);

      expect(entryService.getEntryById.calledWith('1', req.user.id)).to.be.true;
      expect(res.json.calledWith(fakeEntry)).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;

      await entryController.getEntryById(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería devolver 404 si la entrada no existe', async () => {
      sandbox.stub(entryService, 'getEntryById').resolves(null);

      await entryController.getEntryById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Entrada no encontrada' })).to.be.true;
    });

    it('debería manejar error al obtener entrada', async () => {
      const errorMessage = 'Error obteniendo entrada';
      sandbox.stub(entryService, 'getEntryById').rejects(new Error(errorMessage));

      await entryController.getEntryById(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: errorMessage })).to.be.true;
    });
  });

  describe('updateEntry', () => {
    it('debería actualizar una entrada y devolver moodSummary y reflection (caso feliz)', async () => {
      const fakeEntry = { id: 1, description: 'Updated entry', userId: 123 };
      const fakeMoodSummary = { estadoActual: 'neutral', promedioEmocional: '5.00' };
      const fakeReflection = 'Reflexión IA generada';

      sandbox.stub(entryService, 'updateEntry').resolves(fakeEntry);
      sandbox.stub(moodAnalysisService, 'analyzeMoodTrends').returns(fakeMoodSummary);
      sandbox.stub(aiReflectionService, 'reflectOnEntry').resolves(fakeReflection);

      await entryController.updateEntry(req, res);

      expect(entryService.updateEntry.calledWith('1', req.body, req.user.id)).to.be.true;
      expect(moodAnalysisService.analyzeMoodTrends.calledWith([fakeEntry])).to.be.true;
      expect(aiReflectionService.reflectOnEntry.calledWith(fakeEntry)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('moodSummary'))).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;

      await entryController.updateEntry(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería devolver 404 si la entrada no existe', async () => {
      sandbox.stub(entryService, 'updateEntry').resolves(null);

      await entryController.updateEntry(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Entrada no encontrada' })).to.be.true;
    });

    it('debería manejar error al actualizar entrada', async () => {
      const errorMessage = 'Error actualizando entrada';
      sandbox.stub(entryService, 'updateEntry').rejects(new Error(errorMessage));

      await entryController.updateEntry(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: errorMessage })).to.be.true;
    });
  });

  describe('deleteEntry', () => {
    it('debería eliminar una entrada exitosamente', async () => {
      const fakeDeletedEntry = { id: 1, description: 'Deleted entry', userId: 123 };
      sandbox.stub(entryService, 'deleteEntry').resolves(fakeDeletedEntry);

      await entryController.deleteEntry(req, res);

      expect(entryService.deleteEntry.calledWith('1', req.user.id)).to.be.true;
      expect(res.json.calledWith({ 
        message: 'Entrada eliminada correctamente', 
        deletedEntry: fakeDeletedEntry 
      })).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;

      await entryController.deleteEntry(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería devolver 404 si la entrada no existe', async () => {
      sandbox.stub(entryService, 'deleteEntry').resolves(null);

      await entryController.deleteEntry(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Entrada no encontrada' })).to.be.true;
    });

    it('debería manejar error al eliminar entrada', async () => {
      const errorMessage = 'Error eliminando entrada';
      sandbox.stub(entryService, 'deleteEntry').rejects(new Error(errorMessage));

      await entryController.deleteEntry(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: errorMessage })).to.be.true;
    });
  });

  describe('getEntriesByMonth', () => {
    it('debería devolver las entradas del mes (caso feliz)', async () => {
      const fakeEntries = [{ id: 1 }, { id: 2 }];
      sandbox.stub(entryService, 'getEntriesByMonth').resolves(fakeEntries);

      await entryController.getEntriesByMonth(req, res);

      expect(entryService.getEntriesByMonth.calledWith(req.user.id, 6, 2025)).to.be.true;
      expect(res.json.calledWith(fakeEntries)).to.be.true;
    });

    it('debería devolver 400 si faltan mes o año', async () => {
      req.query = { month: '6' };

      await entryController.getEntriesByMonth(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Mes y año son requeridos' })).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = null;

      await entryController.getEntriesByMonth(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería manejar error al obtener entradas (caso error)', async () => {
      const errorMessage = 'Error obteniendo entradas';
      sandbox.stub(entryService, 'getEntriesByMonth').rejects(new Error(errorMessage));

      await entryController.getEntriesByMonth(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: errorMessage })).to.be.true;
    });
  });

  describe('getMonthlySummary', () => {
    it('debería devolver el resumen mensual (caso feliz)', async () => {
      const fakeSummary = { total_days: 30, average_emotion: '7.00', weekly_averages: [] };
      sandbox.stub(entryService, 'getMonthlySummary').resolves(fakeSummary);

      await entryController.getMonthlySummary(req, res);

      expect(entryService.getMonthlySummary.calledWith(req.user.id, 6, 2025)).to.be.true;
      expect(res.json.calledWith(fakeSummary)).to.be.true;
    });

    it('debería devolver 400 si faltan mes o año', async () => {
      req.query = { year: '2025' };

      await entryController.getMonthlySummary(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Mes y año son requeridos' })).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;

      await entryController.getMonthlySummary(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no autenticado' })).to.be.true;
    });

    it('debería manejar error al obtener resumen (caso error)', async () => {
      const errorMessage = 'Error obteniendo resumen';
      sandbox.stub(entryService, 'getMonthlySummary').rejects(new Error(errorMessage));

      await entryController.getMonthlySummary(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: errorMessage })).to.be.true;
    });
  });
});
