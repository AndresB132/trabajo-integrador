# Guía de Verificación de Conectividad Frontend-Backend

Esta guía te ayudará a verificar si tu frontend está correctamente conectado al backend.

## 🚀 Pasos para Verificar la Conectividad

### 1. Verificar que el Backend esté Funcionando

```bash
# Levantar el backend con Docker
npm run docker:up

# Verificar que los servicios estén corriendo
docker-compose ps

# Ver logs en tiempo real
npm run docker:logs
```

### 2. Probar la Conectividad desde la Terminal

```bash
# Instalar axios si no está instalado
npm install axios

# Ejecutar el script de prueba
npm run test:connection
```

### 3. Probar desde el Navegador

Abre tu navegador y ve a `http://localhost:5000` - deberías ver un mensaje de bienvenida.

### 4. Probar desde la Consola del Navegador

Abre las herramientas de desarrollador (F12) y ejecuta:

```javascript
// Probar el endpoint principal
fetch('http://localhost:5000/')
  .then(response => response.json())
  .then(data => console.log('✅ Backend conectado:', data))
  .catch(error => console.error('❌ Error:', error));

// Probar el health check
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('✅ Health check:', data))
  .catch(error => console.error('❌ Error:', error));
```

## 🔍 Endpoints de Prueba Disponibles

| Endpoint | Descripción | Método |
|----------|-------------|--------|
| `http://localhost:5000/` | Página principal | GET |
| `http://localhost:5000/api/health` | Health check | GET |
| `http://localhost:5000/api/test-cors` | Prueba de CORS | GET |

## 🌐 Configuración de CORS

El backend está configurado para aceptar conexiones desde:
- `http://localhost:3000` (React por defecto)
- `http://localhost:3001` (puerto alternativo)
- `http://127.0.0.1:3000`

## 🔧 Configuración en el Frontend

### Para React/Vue/Angular

```javascript
// URL base del backend
const API_BASE_URL = 'http://localhost:5000';

// Ejemplo de función para hacer peticiones
async function testConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Conectado al backend:', data);
    return data;
  } catch (error) {
    console.error('❌ Error conectando al backend:', error);
    throw error;
  }
}
```

### Para Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Probar conexión
api.get('/api/health')
  .then(response => console.log('✅ Conectado:', response.data))
  .catch(error => console.error('❌ Error:', error));
```

## 🚨 Problemas Comunes y Soluciones

### Error: "Connection refused"
```bash
# Verificar que Docker esté corriendo
docker --version

# Verificar que los contenedores estén activos
docker-compose ps

# Reiniciar los servicios
npm run docker:restart
```

### Error: "CORS policy"
- Verifica que el frontend esté corriendo en uno de los puertos permitidos
- Revisa la configuración de CORS en `server.js`

### Error: "Port already in use"
```bash
# Verificar qué está usando el puerto 5000
netstat -ano | findstr :5000

# Cambiar el puerto en docker-compose.yml si es necesario
```

## 📊 Verificación Completa

### 1. Backend Funcionando
```bash
curl http://localhost:5000/api/health
```

### 2. Base de Datos Conectada
```bash
# Verificar logs de PostgreSQL
docker-compose logs postgres
```

### 3. Frontend Puede Conectar
```javascript
// En la consola del navegador
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log);
```

## 🎯 Señales de Éxito

✅ **Backend funcionando correctamente:**
- `http://localhost:5000` responde con mensaje de bienvenida
- `http://localhost:5000/api/health` devuelve status "OK"
- Los logs muestran "Servidor corriendo en http://localhost:5000"

✅ **Frontend conectado correctamente:**
- Las peticiones desde el navegador funcionan sin errores CORS
- Las respuestas del backend llegan al frontend
- No hay errores en la consola del navegador

## 🔄 Reinicio Completo

Si tienes problemas, prueba un reinicio completo:

```bash
# Detener todo
npm run docker:down

# Limpiar volúmenes (opcional)
docker-compose down -v

# Reconstruir y levantar
npm run docker:build
npm run docker:up

# Verificar
npm run test:connection
``` 