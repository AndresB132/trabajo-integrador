// services/authService.js
const bcrypt = require('bcryptjs');
const { User } = require('../models');

class AuthService {
  async register(userData) {
    const { username, email, password } = userData;
    
    // Validaciones básicas
    if (!username || !email || !password) {
      throw new Error('Todos los campos son requeridos');
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword 
    });

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async login(credentials) {
    const { email, password } = credentials;
    
    // Validaciones básicas
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }
}

module.exports = new AuthService();
