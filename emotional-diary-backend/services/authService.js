const bcrypt = require('bcryptjs');
const { User } = require('../models');
// Eliminamos jwtService

async function registerUser({ username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  // Ya no generamos ni devolvemos token
  return { user };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Contraseña incorrecta');

  // Ya no generamos ni devolvemos token
  return { user };
}

module.exports = {
  registerUser,
  loginUser,
};
