// test/controllers/authController.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

describe('Auth Controller Tests', () => {
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
      body: {}
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('register', () => {
    it('debe registrar un usuario exitosamente sin token', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123456'
      };

      const userInstance = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      req.body = userData;
      
      sandbox.stub(authService, 'register').resolves(userInstance);
      
      await authController.register(req, res);

      expect(authService.register.calledWith(userData)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ user: userInstance })).to.be.true;
    });

    it('debe devolver 400 si faltan campos requeridos', async () => {
      req.body = { username: 'test' }; // Falta email y password

      sandbox.stub(authService, 'register').rejects(new Error('Todos los campos son requeridos'));

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ 
        error: 'Todos los campos son requeridos',
        required: ['username', 'email', 'password']
      })).to.be.true;
    });

    it('debe devolver 400 si falta username', async () => {
      req.body = { email: 'test@example.com', password: '123456' };

      sandbox.stub(authService, 'register').rejects(new Error('Todos los campos son requeridos'));

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ 
        error: 'Todos los campos son requeridos',
        required: ['username', 'email', 'password']
      })).to.be.true;
    });

    it('debe devolver 400 si falta email', async () => {
      req.body = { username: 'test', password: '123456' };

      sandbox.stub(authService, 'register').rejects(new Error('Todos los campos son requeridos'));

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ 
        error: 'Todos los campos son requeridos',
        required: ['username', 'email', 'password']
      })).to.be.true;
    });

    it('debe devolver 400 si falta password', async () => {
      req.body = { username: 'test', email: 'test@example.com' };

      sandbox.stub(authService, 'register').rejects(new Error('Todos los campos son requeridos'));

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ 
        error: 'Todos los campos son requeridos',
        required: ['username', 'email', 'password']
      })).to.be.true;
    });

    it('debe manejar errores de validación de Sequelize', async () => {
      req.body = { username: 'test', email: 'invalid-email', password: '123456' };

      sandbox.stub(authService, 'register').rejects(new Error('Todos los campos son requeridos'));

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ 
        error: 'Todos los campos son requeridos',
        required: ['username', 'email', 'password']
      })).to.be.true;
    });

    it('debe manejar errores de constraint único de Sequelize', async () => {
      req.body = { username: 'test', email: 'existing@example.com', password: '123456' };

      sandbox.stub(authService, 'register').rejects(new Error('El email ya está registrado'));

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ 
        error: 'El email ya está registrado',
        field: 'email'
      })).to.be.true;
    });

    it('debe manejar errores durante el registro', async () => {
      const error = new Error('Error en DB');
      req.body = {
        username: 'test',
        email: 'test@example.com',
        password: '123456',
      };

      sandbox.stub(authService, 'register').rejects(error);

      await authController.register(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: error.message })).to.be.true;
    });
  });

  describe('login', () => {
    it('debe iniciar sesión si el correo y contraseña coinciden sin token', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123456'
      };

      const userInstance = {
        id: 1,
        email: 'test@example.com'
      };

      req.body = userData;
      
      sandbox.stub(authService, 'login').resolves(userInstance);
      
      await authController.login(req, res);

      expect(authService.login.calledWith(userData)).to.be.true;
      expect(res.json.calledWith({ user: userInstance })).to.be.true;
    });

    it('debe devolver 400 si falta email', async () => {
      req.body = { password: '123456' };

      sandbox.stub(authService, 'login').rejects(new Error('Email y contraseña son requeridos'));

      await authController.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Email y contraseña son requeridos' })).to.be.true;
    });

    it('debe devolver 400 si falta password', async () => {
      req.body = { email: 'test@example.com' };

      sandbox.stub(authService, 'login').rejects(new Error('Email y contraseña son requeridos'));

      await authController.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Email y contraseña son requeridos' })).to.be.true;
    });

    it('debe devolver 400 si faltan email y password', async () => {
      req.body = {};

      sandbox.stub(authService, 'login').rejects(new Error('Email y contraseña son requeridos'));

      await authController.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Email y contraseña son requeridos' })).to.be.true;
    });

    it('debe devolver error si el usuario no existe', async () => {
      req.body = { email: 'noexiste@example.com', password: '123456' };

      sandbox.stub(authService, 'login').rejects(new Error('Usuario no encontrado'));

      await authController.login(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no encontrado' })).to.be.true;
    });

    it('debe devolver error si la contraseña es incorrecta', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpass' };

      sandbox.stub(authService, 'login').rejects(new Error('Contraseña incorrecta'));

      await authController.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Contraseña incorrecta' })).to.be.true;
    });

    it('debe manejar errores internos', async () => {
      const error = new Error('Error interno');
      req.body = { email: 'test@example.com', password: '123456' };

      sandbox.stub(authService, 'login').rejects(error);

      await authController.login(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: error.message })).to.be.true;
    });
  });
});
