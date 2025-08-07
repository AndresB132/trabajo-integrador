const { expect } = require('chai');
const sinon = require('sinon');
const { Op } = require('sequelize');

const entryService = require('../../services/entryService');
const { DailyEntry } = require('../../models');
const statsUtils = require('../../utils/calculateStats'); // import con destructuring

describe('entryService', () => {
  beforeEach(() => {
    sinon.stub(console, 'error'); // Oculta los errores en consola durante los tests
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createEntry', () => {
    it('debería crear una entrada con los datos y userId', async () => {
      const fakeEntry = { id: 1, description: 'test', userId: 123 };
      const data = { description: 'test' };
      const userId = 123;

      const createStub = sinon.stub(DailyEntry, 'create').resolves(fakeEntry);

      const result = await entryService.createEntry(data, userId);

      expect(createStub.calledOnce).to.be.true;
      expect(createStub.firstCall.args[0]).to.include(data);
      expect(createStub.firstCall.args[0].userId).to.equal(userId);
      expect(result).to.equal(fakeEntry);
    });
  });

  describe('getEntryById', () => {
    it('debería devolver una entrada específica por id y userId', async () => {
      const fakeEntry = { id: 1, description: 'test', userId: 123 };
      const id = 1;
      const userId = 123;

      const findOneStub = sinon.stub(DailyEntry, 'findOne').resolves(fakeEntry);

      const result = await entryService.getEntryById(id, userId);

      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.firstCall.args[0]).to.deep.equal({
        where: {
          id: id,
          userId: userId,
        },
      });
      expect(result).to.equal(fakeEntry);
    });

    it('debería devolver null cuando no encuentra la entrada', async () => {
      const id = 999;
      const userId = 123;

      const findOneStub = sinon.stub(DailyEntry, 'findOne').resolves(null);

      const result = await entryService.getEntryById(id, userId);

      expect(findOneStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('updateEntry', () => {
    it('debería actualizar una entrada existente', async () => {
      const fakeEntry = { 
        id: 1, 
        description: 'test', 
        userId: 123,
        update: sinon.stub().resolves({ id: 1, description: 'updated', userId: 123 })
      };
      const id = 1;
      const userId = 123;
      const updateData = { description: 'updated' };

      const findOneStub = sinon.stub(DailyEntry, 'findOne').resolves(fakeEntry);

      const result = await entryService.updateEntry(id, updateData, userId);

      expect(findOneStub.calledOnce).to.be.true;
      expect(fakeEntry.update.calledOnce).to.be.true;
      expect(fakeEntry.update.firstCall.args[0]).to.deep.equal(updateData);
      expect(result).to.deep.equal({ id: 1, description: 'updated', userId: 123 });
    });

    it('debería devolver null cuando no encuentra la entrada para actualizar', async () => {
      const id = 999;
      const userId = 123;
      const updateData = { description: 'updated' };

      const findOneStub = sinon.stub(DailyEntry, 'findOne').resolves(null);

      const result = await entryService.updateEntry(id, updateData, userId);

      expect(findOneStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('deleteEntry', () => {
    it('debería eliminar una entrada existente', async () => {
      const fakeEntry = { 
        id: 1, 
        description: 'test', 
        userId: 123,
        destroy: sinon.stub().resolves()
      };
      const id = 1;
      const userId = 123;

      const findOneStub = sinon.stub(DailyEntry, 'findOne').resolves(fakeEntry);

      const result = await entryService.deleteEntry(id, userId);

      expect(findOneStub.calledOnce).to.be.true;
      expect(fakeEntry.destroy.calledOnce).to.be.true;
      expect(result).to.equal(fakeEntry);
    });

    it('debería devolver null cuando no encuentra la entrada para eliminar', async () => {
      const id = 999;
      const userId = 123;

      const findOneStub = sinon.stub(DailyEntry, 'findOne').resolves(null);

      const result = await entryService.deleteEntry(id, userId);

      expect(findOneStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe('getEntriesByMonth', () => {
    it('debería devolver las entradas entre las fechas calculadas', async () => {
      const userId = 123;
      const month = 6; // Junio
      const year = 2024;

      const fakeEntries = [{ id: 1 }, { id: 2 }];
      const findAllStub = sinon.stub(DailyEntry, 'findAll').resolves(fakeEntries);

      const result = await entryService.getEntriesByMonth(userId, month, year);

      const lastDay = new Date(year, month, 0).getDate();
      const startDate = `${year}-06-01`;
      const endDate = `${year}-06-${lastDay}`;

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0]).to.deep.include({
        where: {
          userId: userId,
          date: { [Op.between]: [startDate, endDate] },
        },
      });
      expect(result).to.equal(fakeEntries);
    });

    it('debería manejar correctamente meses con diferentes números de días', async () => {
      const userId = 123;
      const month = 2; // Febrero
      const year = 2024;

      const fakeEntries = [{ id: 1 }];
      const findAllStub = sinon.stub(DailyEntry, 'findAll').resolves(fakeEntries);

      const result = await entryService.getEntriesByMonth(userId, month, year);

      const lastDay = new Date(year, month, 0).getDate();
      const startDate = `${year}-02-01`;
      const endDate = `${year}-02-${lastDay}`;

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0]).to.deep.include({
        where: {
          userId: userId,
          date: { [Op.between]: [startDate, endDate] },
        },
      });
      expect(result).to.equal(fakeEntries);
    });
  });

  describe('getMonthlySummary', () => {
    it('debería obtener entradas y devolver el resultado de calculateMonthlyStats', async () => {
      const userId = 123;
      const month = 6;
      const year = 2024;

      const fakeEntries = [
        { id: 1, emotion_score: 5, date: '2024-06-02' },
        { id: 2, emotion_score: 7, date: '2024-06-30' }
      ];
      const expectedStats = {
        total_days: 2,
        average_emotion: '6.00',
        weekly_averages: [
          { week: 1, average: '5.00' },
          { week: 5, average: '7.00' }
        ],
        entries: fakeEntries,
      };

      // Hacer stub de DailyEntry.findAll para simular la base de datos
      const findAllStub = sinon.stub(DailyEntry, 'findAll').resolves(fakeEntries);

      const result = await entryService.getMonthlySummary(userId, month, year);

      expect(findAllStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedStats);
    });
  });
});
