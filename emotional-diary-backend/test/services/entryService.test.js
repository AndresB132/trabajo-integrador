const { expect } = require('chai');
const sinon = require('sinon');
const { Op } = require('sequelize');

const entryService = require('../../services/entryService');
const { DailyEntry } = require('../../models');
const statsUtils = require('../../utils/calculateStats'); // import con destructuring

describe('entryService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createEntry', () => {
    it('debería crear una entrada con los datos y userId', async () => {
      const fakeEntry = { id: 1, description: 'test', user_id: 123 };
      const data = { description: 'test' };
      const userId = 123;

      const createStub = sinon.stub(DailyEntry, 'create').resolves(fakeEntry);

      const result = await entryService.createEntry(data, userId);

      expect(createStub.calledOnce).to.be.true;
      expect(createStub.firstCall.args[0]).to.include(data);
      expect(createStub.firstCall.args[0].user_id).to.equal(userId);
      expect(result).to.equal(fakeEntry);
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
          user_id: userId,
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

      const fakeEntries = [{ id: 1 }, { id: 2 }];
      const fakeStats = { total: 2 };

      const getEntriesStub = sinon.stub(entryService, 'getEntriesByMonth').resolves(fakeEntries);
      const calculateStub = sinon.stub(statsUtils, 'calculateMonthlyStats').returns(fakeStats);

      const result = await entryService.getMonthlySummary(userId, month, year);

      expect(getEntriesStub.calledOnceWith(userId, month, year)).to.be.true;
      expect(calculateStub.calledOnceWith(fakeEntries)).to.be.true;
      expect(result).to.equal(fakeStats);
    });
  });
});
