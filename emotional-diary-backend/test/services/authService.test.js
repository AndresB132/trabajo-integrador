// test/services/authService.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

const authService = require('../../services/authService');
const { User } = require('../../models');
// Eliminamos la importación de jwtService
// const jwtService = require('../../services/jwtService');

describe('authService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {
    it('debería registrar un usuario y devolver solo el usuario', async () => {
      const fakeUser = { id: 1, username: 'testuser', email: 'test@test.com' };

      sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
      sinon.stub(User, 'create').resolves(fakeUser);
      // Eliminamos stub de jwtService

      const result = await authService.registerUser({
        username: 'testuser',
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.user).to.equal(fakeUser);
      expect(result.token).to.be.undefined; // No hay token
      expect(bcrypt.hash.calledOnceWith('123456', 10)).to.be.true;
      expect(User.create.calledOnceWith({
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashedpassword',
      })).to.be.true;
      // No verificamos llamadas a jwtService
    });
  });

  describe('loginUser', () => {
    it('debería iniciar sesión y devolver solo el usuario si credenciales son correctas', async () => {
      const fakeUser = { id: 1, email: 'test@test.com', password: 'hashedpassword' };

      sinon.stub(User, 'findOne').resolves(fakeUser);
      sinon.stub(bcrypt, 'compare').resolves(true);
      // Eliminamos stub de jwtService

      const result = await authService.loginUser({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.user).to.equal(fakeUser);
      expect(result.token).to.be.undefined; // No hay token
      expect(User.findOne.calledOnceWith({ where: { email: 'test@test.com' } })).to.be.true;
      expect(bcrypt.compare.calledOnceWith('123456', fakeUser.password)).to.be.true;
    });

    it('debería lanzar error si usuario no existe', async () => {
      sinon.stub(User, 'findOne').resolves(null);

      try {
        await authService.loginUser({ email: 'noexiste@test.com', password: '123456' });
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Usuario no encontrado');
      }
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      const fakeUser = { id: 1, email: 'test@test.com', password: 'hashedpassword' };

      sinon.stub(User, 'findOne').resolves(fakeUser);
      sinon.stub(bcrypt, 'compare').resolves(false);

      try {
        await authService.loginUser({ email: 'test@test.com', password: 'wrongpass' });
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Contraseña incorrecta');
      }
    });
  });
});
