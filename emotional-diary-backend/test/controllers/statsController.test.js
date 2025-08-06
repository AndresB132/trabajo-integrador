// test/controllers/statsController.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const statsController = require('../../controllers/statsController');
const { DailyEntry } = require('../../models');
const statsUtils = require('../../utils/calculateStats');
const { Op } = require('sequelize');

describe('statsController.getMonthlySummary', () => {
  let req, res, jsonStub, statusStub, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'error'); // Oculta los errores en consola durante los tests
    req = {
      query: {},
      user: { id: 123 },
    };

    jsonStub = sandbox.stub();
    statusStub = sandbox.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
      json: jsonStub,
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('debería devolver 400 si la fecha es inválida', async () => {
    req.query = { month: '13', year: '2024' };

    await statsController.getMonthlySummary(req, res);

    expect(statusStub.calledWith(400)).to.be.true;
    expect(jsonStub.calledWith({ error: 'Fecha inválida' })).to.be.true;
  });

  it('debería devolver estadísticas correctamente (happy path)', async () => {
    req.query = { month: '06', year: '2025' };

    const fakeEntries = [
      { emotion_score: 7, date: '2025-06-01' },
      { emotion_score: 5, date: '2025-06-02' },
    ];

    const fakeStats = {
      total_days: 2,
      average_emotion: '6.00',
      weekly_averages: [
        { average: "5.00", week: 1 },
        { average: "7.00", week: 5 }
      ],
      entries: fakeEntries,
    };

    // Stub para simular la consulta a la base de datos
    sandbox.stub(DailyEntry, 'findAll').resolves(fakeEntries);
    // Stub para la función que calcula las estadísticas
    sandbox.stub(statsUtils, 'calculateMonthlyStats').returns(fakeStats);

    await statsController.getMonthlySummary(req, res);

    // Verificamos que el filtro where use userId en camelCase
    const where = DailyEntry.findAll.getCall(0).args[0].where;
    expect(where.userId).to.equal(123);
    expect(where.date).to.have.property(Op.between);
    // Comparación robusta del objeto completo
    expect(jsonStub.firstCall.args[0]).to.deep.equal(fakeStats);
  });

  it('debería manejar errores internos (500)', async () => {
    req.query = { month: '06', year: '2025' };

    const error = new Error('DB fail');
    sandbox.stub(DailyEntry, 'findAll').rejects(error);

    await statsController.getMonthlySummary(req, res);

    expect(statusStub.calledWith(500)).to.be.true;
    expect(jsonStub.calledWith({ error: 'Error al obtener el resumen mensual' })).to.be.true;
  });
});
