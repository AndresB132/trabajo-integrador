// controllers/authController.js
const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar errores específicos
    if (error.message === 'Todos los campos son requeridos') {
      return res.status(400).json({ 
        error: error.message,
        required: ['username', 'email', 'password']
      });
    }
    
    if (error.message === 'El email ya está registrado') {
      return res.status(400).json({ 
        error: error.message,
        field: 'email'
      });
    }

    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await authService.login(req.body);
    res.json({ user });
  } catch (error) {
    console.error('Error en login:', error);
    
    if (error.message === 'Email y contraseña son requeridos') {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.message === 'Contraseña incorrecta') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};
