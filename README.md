# Intercompany transfers

## Enunciado _Challenge_

[La descripción del desafío se encuentra aquí](challenge.md)

## Decisiones de diseño

- Tanto para la estructura de carpetas como el diseño de la aplicación aplican la Arquitectura Hexagonal
- Se identificaron las siguientes entidades:
  - Empresa (`Company`)
- Persistencia: se optó por una instancia de SQLite

## Documentación

### OpenAPI (Swagger)

La documentación de los distintos endpoints de la aplicación se encuentra disponible en la ruta `{host}/docs`

### Ejecución

Crear archivo `.env` (`$ cp .env.example .env`)

- Modo desarrollo: `$ npm run start:dev`
- O productiva: `$ npm run build && node dist/main`

### Migraciones

Tras cada modificación en el modelo de datos, definido en el archivo `schema.prisma`, crear una migración mediante `npx prisma migrate dev --name <nombre-migracion>`
