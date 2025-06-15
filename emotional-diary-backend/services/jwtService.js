const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};