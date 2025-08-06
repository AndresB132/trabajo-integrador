const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const entryRoutes = require('./routes/entryRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Iniciar servidor
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/stats', statsRoutes);

// Rutas de prueba para verificar conectividad
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend del Diario Emocional funcionando correctamente 🎉',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint para verificar conectividad desde el frontend
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend conectado correctamente',
    timestamp: new Date().toISOString(),
    cors: {
      origin: req.headers.origin || 'No origin header',
      method: req.method
    }
  });
});

// Endpoint para probar CORS
app.options('/api/test-cors', cors(corsOptions));
app.get('/api/test-cors', cors(corsOptions), (req, res) => {
  res.json({
    message: 'CORS funcionando correctamente',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Endpoint para verificar conexión a PostgreSQL
app.get('/api/test-db', async (req, res) => {
  try {
    const sequelize = require('./config/db');
    
    // Probar conexión
    await sequelize.authenticate();
    
    // Obtener información de la base de datos
    const [results] = await sequelize.query('SELECT version() as version, current_database() as database, current_user as user');
    
    res.json({
      status: 'OK',
      message: 'PostgreSQL conectado correctamente',
      database: {
        version: results[0].version,
        database: results[0].database,
        user: results[0].user
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Error conectando a PostgreSQL',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});