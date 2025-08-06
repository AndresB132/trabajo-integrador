# Diario Emocional - Backend

Este proyecto es una API REST para registrar, consultar y analizar entradas diarias de estado emocional. Permite a los usuarios llevar un diario, obtener estadísticas y tendencias de su estado de ánimo. Ideal para prácticas de desarrollo backend, manejo de bases de datos y pruebas automatizadas.

---

## 1. 🧱 Requisitos previos

- Node.js (versión 16 o superior)
- npm (viene con Node.js)
- PostgreSQL instalado y corriendo
- Visual Studio Code (recomendado, opcional)
- Extensión REST Client (en VS Code): https://marketplace.visualstudio.com/items?itemName=humao.rest-client

---

## 2. 🔽 Descargar o clonar el proyecto

Si es un repositorio GitHub:
```bash
git clone https://github.com/tu-usuario/emotional-diary-backend.git
cd emotional-diary-backend
```
Si es ZIP:
Descomprimir en una carpeta local: emotional-diary-backend/

---

## 3. 📦 Instalar dependencias del backend

Ejecuta en terminal:
```bash
npm install
```

Principales dependencias:
- express
- sequelize
- pg (PostgreSQL)
- cors, morgan, helmet
- bcryptjs
- dotenv
- nodemon (dev)

---

## 4. 🗄️ Configurar base de datos

### a) Crea la base de datos:

En terminal:
```bash
createdb emotional_diary
```
O desde psql:
```sql
psql -U postgres
CREATE DATABASE emotional_diary;
\q
```

### b) Configura el archivo .env:

Copia el ejemplo:
```bash
cp .env.example .env
```
Luego abre `.env` y ajusta credenciales si es necesario:
```
DATABASE_URL=postgres://<tu_usuario>:<tu_contrasena>@localhost:5432/emotional_diary
```

---

## 5. ▶️ Iniciar servidor

Para iniciar en modo desarrollo:
```bash
npm run dev
```
Para producción:
```bash
npm start
```
El servidor corre en:
http://localhost:5001

---

## 6. 📚 Documentación interactiva (Swagger)

Una vez que el servidor esté corriendo, puedes acceder a la documentación y probar los endpoints desde tu navegador en:

http://localhost:5001/api-docs

Aquí podrás ver todos los endpoints, sus parámetros y probarlos directamente.

---

## 7. 🚀 Probar la API con Postman

1. Abre Postman.
2. Haz clic en "Importar" y selecciona el archivo `postman_collection.json` de la carpeta del proyecto.
3. Prueba los endpoints. **No necesitas agregar ningún token ni header especial.**

---

## 8. 🧪 Probar la API desde VS Code (REST Client)

1. Abre el archivo `test.http` en VS Code.
2. Haz clic en **"Send Request"** encima de cada bloque.

✅ Requisito: Tener instalada la extensión **REST Client**

---

## 9. 📋 Ejemplo de peticiones (sin token)

### Registro de usuario
```http
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "username": "juanito",
  "email": "juan@example.com",
  "password": "123456"
}
```

### Inicio de sesión
```http
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

### Registrar entrada diaria
```http
POST http://localhost:5001/api/entries
Content-Type: application/json

{
  "date": "2025-06-12",
  "emotion_score": 7,
  "description": "Un día tranquilo.",
  "activities": ["meditar", "pasear"]
}
```

### Obtener resumen mensual
```http
GET http://localhost:5001/api/stats/summary?month=06&year=2025
```

---

## 10. 🧪 Pruebas automatizadas

Las pruebas están ubicadas en la carpeta:
```
/test/
```
Incluyen controladores y servicios principales.

### Ejecutar las pruebas
Desde la raíz del proyecto en la terminal ejecuta:
```bash
npm test
```

Si deseas medir cobertura de código (opcional):
```bash
npm run test:coverage
```

---

## 11. 📝 Notas finales

- No necesitas token ni autenticación para probar los endpoints.
- Puedes usar Postman, REST Client o Swagger UI para probar la API.
- Si usas Docker, puedes levantar todo con:
```bash
docker-compose up
```
- Si tienes dudas, revisa los comentarios en el código y la documentación Swagger.

---

¡Listo! Tu proyecto está preparado para ser presentado y probado fácilmente.