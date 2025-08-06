// Middleware de autenticación simple para pruebas
const authenticateUser = (req, res, next) => {
  // Para pruebas, vamos a simular un usuario autenticado
  // En producción, esto debería verificar un token JWT
  
  // Si hay un header de autorización, usamos ese usuario
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Simular usuario basado en el token
    req.user = {
      id: 11, // Usuario que acabamos de crear
      username: 'nuevo_usuario',
      email: 'nuevo@ejemplo.com'
    };
    return next();
  }
  
  // Si no hay header, usar usuario por defecto para pruebas
  req.user = {
    id: 11,
    username: 'nuevo_usuario', 
    email: 'nuevo@ejemplo.com'
  };
  
  next();
};

module.exports = { authenticateUser }; 