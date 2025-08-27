🧪 Desafío Técnico

Objetivo: Evaluar la capacidad técnica, criterio de diseño, y nivel de autonomía de los candidatos. Este desafío no requiere despliegue en la nube ni ejecución de servicios reales en AWS, pero sí incluye ejercicios de diseño relacionados.

📝 Descripción general

La tarea consiste en construir APIs que permitan gestionar información sobre empresas y sus transferencias. La solución deberá ser clara, mantenible, escalable y escrita con buenas prácticas (Clean Code, separación de responsabilidades, claridad en los nombres, etc.).

🎯 Requerimientos funcionales

Debes implementar los siguientes 3 endpoints:

1. [x] Obtener las empresas que realizaron transferencias en el último mes.
2. [x] Obtener las empresas que se adhirieron en el último mes.
3. [x] Registrar la adhesión de una nueva empresa.
   1. [x] Empresa Pyme.
   2. [x] Empresa Corporativa.

🧰 Requerimientos no funcionales

- [x] La API debe estar escrita en NestJs (standalone).
- [x] No se permite el uso de Docker.
- [x] No es necesario desplegar la API, pero debe poder ejecutarse localmente.
- [x] Se puede usar base de datos local, un archivo JSON o persistencia en memoria.
- [x] Si usás base de datos (relacional o no relacional), incluí una instancia embebida, simulada o en Cloud.
- Usá una arquitectura clara (idealmente Clean Architecture, Hexagonal, etc.)
  - Deseable: Hexagonal.

☁️ Parte adicional (AWS - Teórica)

Diseñar una Lambda Function de AWS que reciba una solicitud de adhesión de empresa (como en el punto 3), valide los datos y los almacene.
Incluí:

- [x] Código de la Lambda
- [x] Input/output esperados (formato JSON)
- [x] Breve explicación de cómo la integrarías con el sistema

La Lambda no debe ser ejecutada ni desplegada. Solo necesitamos el diseño funcional y su código fuente.

✅ Entregables

- Código fuente completo en un repositorio (puede ser privado).
- Instrucciones claras para correrlo localmente.
- Pruebas Unitarias.
- Explicación de tus decisiones (README o comentarios).

🧠 Qué evaluaremos

- Criterio técnico general y claridad de diseño.
- Programación Orientada a Objetos.
- Organización del código.
- Modelado de datos y diseño de endpoints.
- Documentación y facilidad de uso.
- Enfoque proactivo y capacidad de comunicación.
