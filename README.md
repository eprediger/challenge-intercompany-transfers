# Intercompany transfers

## Enunciado _Challenge_

[La descripción del desafío se encuentra aquí](challenge.md)

## Decisiones de diseño

- Tanto para la estructura de carpetas como el diseño de la aplicación aplican la Arquitectura Hexagonal.
  - `application/`:
    - `domain/`: contiene las entidades de dominio, tipos de datos, value objects ;
    - `ports/`: definición de interfaces para los actores que inicien la interacción con la aplicación(`in/`) o son iniciados por la misma (`out/`)
    - `services/`: clases encargadas de orquestar la funcionalidad.
  - `infrastructure/`:
    - `adapters`: componentes que interactúan entre la lógica central de la aplicación y el _mundo exterior_ (en este caso **requests HTTP** y persistencia en **base de datos**)
- Se identificaron las siguientes entidades:
  - Empresa (`Company`)
    - Con los atributos nombre (`name`), tipo (`type`) y fecha de adhesión (`subscriptionDate`). Sobre el último campo se tomó la decisión de permitir al cliente ingresar el valor, esto es, que la adhesión no necesariamente sea en el momento de la creación en la aplicación.
- Para resolver **la consulta de las empresas que se adhirieron en el último mes**, se tomó la definición de exponer un contrato que reciba dos fechas como ventana de tiempo, donde el parámetro `subscription-date-from` es obligatorio, mientras que `subscription-date-to`, opcional. De esta forma, para responder la consulta planteada, el request sería `GET {host}/v1/companies?subscription-date-from=2025-07-25` (siendo hoy 2025-08-25).
- Persistencia: se optó por una instancia de `SQLite`

## Documentación

### OpenAPI (Swagger)

La documentación de los distintos endpoints de la aplicación se encuentra disponible en la ruta `{host}/docs`

### Ejecución

Crear archivo `.env` (`$ cp .env.example .env`)

- Modo desarrollo: `$ npm run start:dev`
- O productiva: `$ npm run build && node dist/main`

### Migraciones

Tras cada modificación en el modelo de datos, definido en el archivo `schema.prisma`, crear una migración mediante `npx prisma migrate dev --name <nombre-migracion>`

### Database seeding

El comando `$  npm run db:seed` genera valores iniciales para las tablas.
