// test/controllers/entryController.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const entryController = require('../../controllers/entryController');
const entryService = require('../../services/entryService');

describe('entryController', () => {
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
      body: { description: 'Test entry', mood: 5 },
      params: { id: '1' },
      query: { month: '6', year: '2024' }
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createEntry', () => {
    it('debería crear una entrada y devolver moodSummary y reflection (caso feliz)', async () => {
      const fakeResult = {
        entry: { id: 1, description: 'Test entry', userId: 123 },
        moodSummary: { estadoActual: 'neutral', promedioEmocional: '5.00' },
        reflection: { entradaAnalizada: true, mensajeReflexivo: 'Gracias por compartir tu día.' }
      };

      sandbox.stub(entryService, 'createEntry').resolves(fakeResult);

      await entryController.createEntry(req, res);

      expect(entryService.createEntry.calledWith(req.body, req.user.id)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(fakeResult)).to.be.true;
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
      const fakeResult = {
        entry: { id: 1, description: 'Updated entry', userId: 123 },
        moodSummary: { estadoActual: 'neutral', promedioEmocional: '5.00' },
        reflection: { entradaAnalizada: true, mensajeReflexivo: 'Gracias por compartir tu día.' }
      };

      sandbox.stub(entryService, 'updateEntry').resolves(fakeResult);

      await entryController.updateEntry(req, res);

      expect(entryService.updateEntry.calledWith('1', req.body, req.user.id)).to.be.true;
      expect(res.json.calledWith(fakeResult)).to.be.true;
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
      const fakeEntries = [
        { id: 1, description: 'Entry 1', userId: 123 },
        { id: 2, description: 'Entry 2', userId: 123 }
      ];
      sandbox.stub(entryService, 'getEntriesByMonth').resolves(fakeEntries);

      await entryController.getEntriesByMonth(req, res);

      expect(entryService.getEntriesByMonth.calledWith(req.user.id, 6, 2024)).to.be.true;
      expect(res.json.calledWith(fakeEntries)).to.be.true;
    });

    it('debería devolver 400 si faltan mes o año', async () => {
      req.query = { month: '6' }; // Falta year

      await entryController.getEntriesByMonth(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Mes y año son requeridos' })).to.be.true;
    });

    it('debería devolver 400 si el usuario no está autenticado', async () => {
      req.user = undefined;

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
      const fakeSummary = {
        total_days: 30,
        average_emotion: '6.50',
        weekly_averages: []
      };
      sandbox.stub(entryService, 'getMonthlySummary').resolves(fakeSummary);

      await entryController.getMonthlySummary(req, res);

      expect(entryService.getMonthlySummary.calledWith(req.user.id, 6, 2024)).to.be.true;
      expect(res.json.calledWith(fakeSummary)).to.be.true;
    });

    it('debería devolver 400 si faltan mes o año', async () => {
      req.query = { year: '2024' }; // Falta month

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
