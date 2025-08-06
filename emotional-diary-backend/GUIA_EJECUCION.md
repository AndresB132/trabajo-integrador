# 🚀 Guía de Ejecución - Diario Emocional Backend

## 📋 Requisitos Previos

### Software Necesario:
- ✅ **Docker Desktop** (instalado y corriendo)
- ✅ **Node.js** (versión 16 o superior)
- ✅ **npm** (viene con Node.js)
- ✅ **Git** (opcional, para clonar)

### Verificar Instalaciones:
```bash
# Verificar Docker
docker --version

# Verificar Node.js
node --version

# Verificar npm
npm --version
```

---

## 🏗️ Paso 1: Preparar el Proyecto

### 1.1 Navegar al Directorio
```bash
cd C:\Users\PC\Desktop\intregador\emotional-diary-backend
```

### 1.2 Verificar Archivos
Asegúrate de tener estos archivos principales:
- ✅ `docker-compose.yml`
- ✅ `Dockerfile`
- ✅ `package.json`
- ✅ `server.js`

---

## 🐳 Paso 2: Levantar con Docker

### 2.1 Iniciar Docker Desktop
- Abre Docker Desktop desde el menú de inicio
- Espera a que aparezca el ícono verde (Docker corriendo)

### 2.2 Levantar los Servicios
```bash
# Construir y levantar todos los servicios
docker-compose up -d --build
```

### 2.3 Verificar que Estén Corriendo
```bash
# Ver estado de los contenedores
docker-compose ps
```

**Deberías ver:**
- ✅ `emotional_diary_backend` - Up (corriendo)
- ✅ `emotional_diary_db` - Up (healthy)

---

## 🔍 Paso 3: Verificar que Todo Funcione

### 3.1 Probar Health Check
Abre tu navegador y ve a:
```
http://localhost:5001/api/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "message": "Backend conectado correctamente",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3.2 Probar Conexión a Base de Datos
Ve a:
```
http://localhost:5001/api/test-db
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "message": "PostgreSQL conectado correctamente",
  "database": {
    "version": "PostgreSQL 15.13...",
    "database": "emotional_diary",
    "user": "postgres"
  }
}
```

---

## 📱 Paso 4: Configurar tu App Android

### 4.1 URL del Backend
En tu app Android, usa esta URL:
```kotlin
const val BASE_URL = "http://192.168.18.10:5001/"
```

### 4.2 Probar desde Android Studio
Agrega este código en tu app Android:
```kotlin
fun testBackendConnection() {
    val client = OkHttpClient()
    val request = Request.Builder()
        .url("http://192.168.18.10:5001/api/health")
        .build()

    client.newCall(request).enqueue(object : Callback {
        override fun onResponse(call: Call, response: Response) {
            val responseBody = response.body?.string()
            Log.d("BackendTest", "✅ Conectado: $responseBody")
        }

        override fun onFailure(call: Call, e: IOException) {
            Log.e("BackendTest", "❌ Error: ${e.message}")
        }
    })
}
```

---

## 🧪 Paso 5: Ejecutar Tests

### 5.1 Instalar Dependencias (si no están)
```bash
npm install
```

### 5.2 Ejecutar Tests
```bash
npm test
```

**Resultado esperado:**
```
43 passing (295ms)
```

---

## 📊 Paso 6: Probar con Postman

### 6.1 Importar Colección
1. Abre Postman
2. Click en "Import"
3. Selecciona el archivo `postman_collection.json`
4. ¡Listo!

### 6.2 Flujo de Prueba Recomendado
1. **Health Check** → Verificar servidor
2. **Test DB** → Verificar PostgreSQL
3. **Registrar Usuario** → Crear cuenta
4. **Login** → Obtener token
5. **Crear Entrada** → Añadir entrada
6. **Obtener Entradas** → Ver listado
7. **Estadísticas** → Ver análisis

---

## 🔧 Paso 7: Comandos Útiles

### Ver Logs
```bash
# Ver logs del backend
docker-compose logs app

# Ver logs de PostgreSQL
docker-compose logs postgres

# Ver todos los logs
docker-compose logs
```

### Reiniciar Servicios
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo el backend
docker-compose restart app
```

### Detener Servicios
```bash
# Detener todo
docker-compose down

# Detener y limpiar volúmenes
docker-compose down -v
```

---

## 🚨 Solución de Problemas

### Problema: Docker no responde
**Solución:**
```bash
# Reiniciar Docker Desktop
# Luego ejecutar:
docker-compose up -d
```

### Problema: Puerto 5001 ocupado
**Solución:**
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :5001

# Cambiar puerto en docker-compose.yml si es necesario
```

### Problema: PostgreSQL no conecta
**Solución:**
```bash
# Verificar logs
docker-compose logs postgres

# Reiniciar solo PostgreSQL
docker-compose restart postgres
```

### Problema: App Android no conecta
**Solución:**
1. Verificar que PC y Android estén en la misma red WiFi
2. Verificar que la IP sea correcta: `192.168.18.10`
3. Probar desde el navegador primero

---

## 📋 Checklist de Verificación

### ✅ Backend Funcionando
- [ ] Docker Desktop corriendo
- [ ] Contenedores activos (`docker-compose ps`)
- [ ] Health check responde (`http://localhost:5001/api/health`)
- [ ] Base de datos conectada (`http://localhost:5001/api/test-db`)

### ✅ Tests Pasando
- [ ] `npm test` ejecuta sin errores
- [ ] 43 tests pasando

### ✅ App Android Conectada
- [ ] URL configurada: `http://192.168.18.10:5001/`
- [ ] Health check desde Android funciona
- [ ] Login/registro funcionando

### ✅ Postman Configurado
- [ ] Colección importada
- [ ] Variables configuradas
- [ ] Endpoints probados

---

## 🎯 Estado Final Esperado

Cuando todo esté funcionando correctamente:

```
📱 Tu App Android
    ↓ HTTP requests
🖥️ Backend (localhost:5001) ✅
    ↓ SQL queries
🗄️ PostgreSQL (localhost:5433) ✅
```

**¡Tu proyecto está completamente funcional!**

---

## 📞 Comandos de Emergencia

### Reinicio Completo
```bash
# Detener todo
docker-compose down

# Limpiar volúmenes
docker-compose down -v

# Reconstruir y levantar
docker-compose up -d --build

# Verificar
docker-compose ps
```

### Verificar Todo
```bash
# Estado de contenedores
docker-compose ps

# Health check
curl http://localhost:5001/api/health

# Tests
npm test
```

**¡Con estos pasos tu proyecto debería estar funcionando perfectamente!** 🎉 