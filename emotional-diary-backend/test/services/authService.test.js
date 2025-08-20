// test/services/authService.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

const authService = require('../../services/authService');
const { User } = require('../../models');

describe('authService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('debería registrar un usuario y devolver solo el usuario', async () => {
      const fakeUser = { 
        id: 1, 
        username: 'testuser', 
        email: 'test@test.com',
        password: 'hashedpassword',
        toJSON: () => ({ id: 1, username: 'testuser', email: 'test@test.com', password: 'hashedpassword' })
      };

      sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
      sinon.stub(User, 'findOne').resolves(null); // No existe usuario previo
      sinon.stub(User, 'create').resolves(fakeUser);

      const result = await authService.register({
        username: 'testuser',
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.username).to.equal('testuser');
      expect(result.email).to.equal('test@test.com');
      expect(result.password).to.be.undefined; // No debe incluir la contraseña
      expect(bcrypt.hash.calledOnceWith('123456', 10)).to.be.true;
      expect(User.create.calledOnceWith({
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashedpassword',
      })).to.be.true;
    });

    it('debería lanzar error si faltan campos requeridos', async () => {
      try {
        await authService.register({
          username: 'testuser',
          // email faltante
          password: '123456',
        });
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Todos los campos son requeridos');
      }
    });

    it('debería lanzar error si el email ya existe', async () => {
      const existingUser = { id: 1, email: 'test@test.com' };
      
      sinon.stub(User, 'findOne').resolves(existingUser);

      try {
        await authService.register({
          username: 'testuser',
          email: 'test@test.com',
          password: '123456',
        });
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('El email ya está registrado');
      }
    });
  });

  describe('login', () => {
    it('debería iniciar sesión y devolver solo el usuario si credenciales son correctas', async () => {
      const fakeUser = { 
        id: 1, 
        email: 'test@test.com', 
        password: 'hashedpassword',
        toJSON: () => ({ id: 1, email: 'test@test.com', password: 'hashedpassword' })
      };

      sinon.stub(User, 'findOne').resolves(fakeUser);
      sinon.stub(bcrypt, 'compare').resolves(true);

      const result = await authService.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.email).to.equal('test@test.com');
      expect(result.password).to.be.undefined; // No debe incluir la contraseña
      expect(User.findOne.calledOnceWith({ where: { email: 'test@test.com' } })).to.be.true;
      expect(bcrypt.compare.calledOnceWith('123456', fakeUser.password)).to.be.true;
    });

    it('debería lanzar error si faltan credenciales', async () => {
      try {
        await authService.login({ email: 'test@test.com' });
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Email y contraseña son requeridos');
      }
    });

    it('debería lanzar error si usuario no existe', async () => {
      sinon.stub(User, 'findOne').resolves(null);

      try {
        await authService.login({ email: 'noexiste@test.com', password: '123456' });
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
        await authService.login({ email: 'test@test.com', password: 'wrongpass' });
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Contraseña incorrecta');
      }
    });
  });

  describe('getUserById', () => {
    it('debería devolver un usuario por ID', async () => {
      const fakeUser = { 
        id: 1, 
        username: 'testuser', 
        email: 'test@test.com',
        password: 'hashedpassword',
        toJSON: () => ({ id: 1, username: 'testuser', email: 'test@test.com', password: 'hashedpassword' })
      };

      sinon.stub(User, 'findByPk').resolves(fakeUser);

      const result = await authService.getUserById(1);

      expect(result.username).to.equal('testuser');
      expect(result.email).to.equal('test@test.com');
      expect(result.password).to.be.undefined;
    });

    it('debería lanzar error si el usuario no existe', async () => {
      sinon.stub(User, 'findByPk').resolves(null);

      try {
        await authService.getUserById(999);
        throw new Error('No debería llegar aquí');
      } catch (error) {
        expect(error.message).to.equal('Usuario no encontrado');
      }
    });
  });
});
