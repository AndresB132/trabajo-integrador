// test/services/notificationService.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const { sendNotification } = require('../../services/notificationService');

describe('notificationService', () => {
  beforeEach(() => {
    sinon.restore(); // Limpia cualquier stub o spy antes de cada test
  });

  it('debería enviar la notificación y retornar true', async () => {
    // Stub para console.log para no imprimir en consola durante el test
    const consoleStub = sinon.stub(console, 'log').callsFake(() => {});

    const user = { email: 'test@example.com' };
    const message = 'Mensaje de prueba';

    const result = await sendNotification(user, message);

    expect(consoleStub.calledOnce).to.be.true;
    expect(consoleStub.calledWith(`📬 Notificación para ${user.email}: ${message}`)).to.be.true;
    expect(result).to.be.true;

    consoleStub.restore();
  });
});
