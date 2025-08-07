const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const authController = require('../../controllers/authController');

describe('Auth Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    sinon.stub(console, 'error'); // Oculta los errores en consola durante los tests
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => sinon.restore());

  describe('register', () => {
    it('debe registrar un usuario exitosamente sin token', async () => {
      const userData = { username: 'test', email: 'test@example.com', password: '123456' };
      const hashedPassword = 'hashed-password';
      const userInstance = { id: 1, ...userData };

      sinon.stub(bcrypt, 'hash').resolves(hashedPassword);
      sinon.stub(User, 'create').resolves(userInstance);

      req.body = userData;
      await authController.register(req, res);

      expect(bcrypt.hash.calledWith(userData.password, 10)).to.be.true;
      expect(User.create.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ user: userInstance })).to.be.true;
    });

    it('debe devolver 400 si faltan campos requeridos', async () => {
      req.body = { username: 'test' }; // Falta email y password

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('error', 'Todos los campos son requeridos'))).to.be.true;
    });

    it('debe devolver 400 si falta username', async () => {
      req.body = { email: 'test@example.com', password: '123456' };

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('error', 'Todos los campos son requeridos'))).to.be.true;
    });

    it('debe devolver 400 si falta email', async () => {
      req.body = { username: 'test', password: '123456' };

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('error', 'Todos los campos son requeridos'))).to.be.true;
    });

    it('debe devolver 400 si falta password', async () => {
      req.body = { username: 'test', email: 'test@example.com' };

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('error', 'Todos los campos son requeridos'))).to.be.true;
    });

    it('debe manejar errores de validación de Sequelize', async () => {
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [
        { path: 'email', message: 'Email inválido', value: 'invalid-email' }
      ];

      sinon.stub(bcrypt, 'hash').resolves('hashed-password');
      sinon.stub(User, 'create').rejects(validationError);

      req.body = { username: 'test', email: 'invalid-email', password: '123456' };

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('error', 'Error de validación'))).to.be.true;
    });

    it('debe manejar errores de constraint único de Sequelize', async () => {
      const uniqueError = new Error('Unique constraint error');
      uniqueError.name = 'SequelizeUniqueConstraintError';

      sinon.stub(bcrypt, 'hash').resolves('hashed-password');
      sinon.stub(User, 'create').rejects(uniqueError);

      req.body = { username: 'test', email: 'existing@example.com', password: '123456' };

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('error', 'El email ya está registrado'))).to.be.true;
    });

    it('debe manejar errores durante el registro', async () => {
      const error = new Error('Error en DB');
      sinon.stub(User, 'create').rejects(error);

      req.body = {
        username: 'test',
        email: 'test@example.com',
        password: '123456',
      };

      await authController.register(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: error.message })).to.be.true;
    });
  });

  describe('login', () => {
    const userData = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
    };
    const reqBody = {
      email: 'test@example.com',
      password: '123456',
    };

    it('debe iniciar sesión si el correo y contraseña coinciden sin token', async () => {
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(User, 'findOne').resolves(userData);

      req.body = reqBody;
      await authController.login(req, res);

      expect(User.findOne.calledOnce).to.be.true;
      expect(bcrypt.compare.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ user: userData })).to.be.true;
    });

    it('debe devolver 400 si falta email', async () => {
      req.body = { password: '123456' };

      await authController.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Email y contraseña son requeridos' })).to.be.true;
    });

    it('debe devolver 400 si falta password', async () => {
      req.body = { email: 'test@example.com' };

      await authController.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Email y contraseña son requeridos' })).to.be.true;
    });

    it('debe devolver 400 si faltan email y password', async () => {
      req.body = {};

      await authController.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Email y contraseña son requeridos' })).to.be.true;
    });

    it('debe devolver error si el usuario no existe', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      req.body = reqBody;
      await authController.login(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Usuario no encontrado' })).to.be.true;
    });

    it('debe devolver error si la contraseña es incorrecta', async () => {
      sinon.stub(bcrypt, 'compare').resolves(false);
      sinon.stub(User, 'findOne').resolves(userData);
      req.body = reqBody;
      await authController.login(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Contraseña incorrecta' })).to.be.true;
    });

    it('debe manejar errores internos', async () => {
      const error = new Error('Internal server error');
      sinon.stub(User, 'findOne').rejects(error);
      req.body = reqBody;
      await authController.login(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: error.message })).to.be.true;
    });
  });
});
