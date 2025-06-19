# ✅ Instrucciones para ejecutar el backend del "Diario Emocional"

## 1. 🧱 Requisitos previos

- Node.js (versión 16 o superior)
- npm (viene con Node.js)
- PostgreSQL instalado y corriendo
- Visual Studio Code (recomendado, opcional)
- Extensión REST Client (en VS Code): https://marketplace.visualstudio.com/items?itemName=humao.rest-client

---

## 2. 🔽 Descargar o clonar el proyecto 

Si es un repositorio GitHub:
git clone https://github.com/tu-usuario/emotional-diary-backend.git 
cd emotional-diary-backend

Si es ZIP:
Descomprimir en una carpeta local: emotional-diary-backend/

---

## 3. 📦 Instalar dependencias del backend

Ejecuta en terminal:
npm install

Estas son las principales dependencias usadas:
- express
- sequelize
- pg (PostgreSQL)
- cors, morgan, helmet
- jsonwebtoken
- bcryptjs
- dotenv
- nodemon (dev)

---

## 4. 🗄️ Configurar base de datos

### a) Crea la base de datos:

En terminal:
createdb emotional_diary

O desde psql:
psql -U postgres
CREATE DATABASE emotional_diary;
\q

### b) Configura el archivo .env:

Copia el ejemplo:
cp .env.example .env

Luego abre `.env` y ajusta credenciales si es necesario:
DATABASE_URL=postgres://<tu_usuario>:<tu_contrasena>@localhost:5432/emotional_diary

---

## 5. ▶️ Iniciar servidor

Para iniciar en modo desarrollo:
npm run dev

Para producción:
npm start

El servidor corre en:
http://localhost:5000

---

## 6. 🧪 Probar la API

### Opción A: REST Client (en VS Code)

1. Abre el archivo `test.http` en VS Code.
2. Haz clic en **"Send Request"** encima de cada bloque.

✅ Requisito: Tener instalada la extensión **REST Client**

🔗 Link de descarga de la extensión:
https://marketplace.visualstudio.com/items?itemName=humao.rest-client

### Opción B: Postman 

Importa una colección con estos endpoints:
- Registro de usuario
- Login
- Registrar entrada diaria
- Obtener resumen mensual

---

## 7. 📋 Archivo test.http incluido

### Registro de usuario
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "juanito",
  "email": "juan@example.com",
  "password": "123456"
}

### Inicio de sesión
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}

Recibirás un token JWT que usarás en las siguientes peticiones.

### Registrar entrada diaria
POST http://localhost:5000/api/entries
Content-Type: application/json
Authorization: Bearer TU_TOKEN_AQUÍ

{
  "date": "2025-06-12",
  "emotion_score": 7,
  "description": "Un día tranquilo.",
  "activities": ["meditar", "pasear"]
}

### Obtener resumen mensual
GET http://localhost:5000/api/stats/summary?month=06&year=2025
Authorization: Bearer TU_TOKEN_AQUÍ
