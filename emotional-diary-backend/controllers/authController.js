const bcrypt = require('bcryptjs');
const { User } = require('../models');
// Eliminamos: const jwtService = require('../services/jwtService');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos',
        required: ['username', 'email', 'password'],
        received: { username, email, password: password ? '***' : undefined }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    // Eliminamos generación de token
    // const token = jwtService.generateToken(user);

    // Respondemos solo con el usuario
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar errores específicos de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: 'El email ya está registrado',
        field: 'email'
      });
    }

    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Eliminamos token
    // const token = jwtService.generateToken(user);

    res.json({ user });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
};
