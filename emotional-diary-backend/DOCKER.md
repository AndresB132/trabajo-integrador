# Docker para Diario Emocional Backend

Este documento explica cómo usar Docker con el backend del diario emocional.

## Requisitos Previos

- Docker
- Docker Compose

## Configuración Inicial

1. **Copiar el archivo de variables de entorno:**
   ```bash
   cp env.example .env
   ```

2. **Editar las variables de entorno:**
   - Abre el archivo `.env`
   - Cambia `JWT_SECRET` por una clave secreta segura
   - Ajusta otras variables según necesites

## Comandos Principales

### Desarrollo
```bash
# Construir las imágenes
npm run docker:build

# Levantar los servicios en modo desarrollo
npm run docker:up

# Ver logs en tiempo real
npm run docker:logs

# Detener los servicios
npm run docker:down
```

### Producción
```bash
# Levantar en modo producción
docker-compose -f docker-compose.yml up -d

# Ver logs
docker-compose logs -f app
```

## Estructura de Servicios

### PostgreSQL
- **Puerto:** 5432
- **Base de datos:** emotional_diary
- **Usuario:** postgres
- **Contraseña:** Jkanime123

### Aplicación Node.js
- **Puerto:** 5000
- **URL:** http://localhost:5000
- **Health check:** http://localhost:5000

## Volúmenes

- `postgres_data`: Datos persistentes de PostgreSQL
- Código fuente montado en `/app` para desarrollo

## Redes

- `emotional_diary_network`: Red interna para comunicación entre servicios

## Troubleshooting

### Problemas de Conexión a la Base de Datos
```bash
# Verificar estado de PostgreSQL
docker-compose logs postgres

# Conectar a PostgreSQL
docker-compose exec postgres psql -U postgres -d emotional_diary
```

### Reiniciar Servicios
```bash
# Reiniciar solo la aplicación
docker-compose restart app

# Reiniciar todo
docker-compose down && docker-compose up -d
```

### Limpiar Todo
```bash
# Eliminar contenedores, redes y volúmenes
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all
```

## Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| NODE_ENV | Entorno de ejecución | development |
| PORT | Puerto de la aplicación | 5000 |
| DATABASE_URL | URL de conexión a PostgreSQL | postgres://postgres:Jkanime123@postgres:5432/emotional_diary |
| JWT_SECRET | Clave secreta para JWT | your_jwt_secret_here |

## Notas Importantes

- En desarrollo, el código se monta como volumen para hot-reload
- PostgreSQL tiene health check para asegurar que esté listo antes de iniciar la app
- Los datos de PostgreSQL se persisten en un volumen Docker
- La aplicación se reinicia automáticamente en caso de fallo 