# Bitácora — Persistencia en BD y despliegue

**URL pública (Render):** https://nestjs-productos-api-grxr.onrender.com
**Swagger:** https://nestjs-productos-api-grxr.onrender.com/swagger
**Repositorio:** https://github.com/estebangarciaojeda-ui/nestjs-productos-api

## ¿Por qué los datos sobrevivieron al reinicio del Paso 8?

En la práctica anterior (`web-practica.html`), `ProductosService` guardaba los productos en un arreglo (`private productos: Producto[] = [...]`) que vivía **en la memoria del propio proceso de Node**. Esa memoria (el heap del proceso `node`) existe solo mientras el proceso está corriendo: al hacer `Ctrl+C`, el proceso termina y el sistema operativo libera esa memoria por completo. Al volver a ejecutar `npm run start:dev`, se crea un proceso de Node completamente nuevo, con un heap vacío, así que `ProductosService` se reconstruye desde el arreglo hardcodeado inicial.

En esta práctica, `ProductosService` ya no guarda nada en memoria: cada método (`find`, `save`, `delete`...) del `Repository` de TypeORM abre una conexión y ejecuta una sentencia SQL contra **PostgreSQL, un proceso completamente distinto** (corriendo en su propio contenedor Docker, con sus propios archivos en disco bajo `/var/lib/postgresql/data`). Cuando el proceso de Node muere y se reinicia, PostgreSQL nunca se detuvo — sigue corriendo con sus archivos de datos intactos en disco. El nuevo proceso de Node simplemente se vuelve a conectar a la misma base de datos y encuentra las mismas filas que dejó el proceso anterior.

## Declaración de uso de IA

- Herramienta(s): Claude (Anthropic)
- Nivel de uso: 2-3 (borrador/revisor) — se usó para generar el andamiaje TypeORM/NestJS siguiendo la guía paso a paso
- Qué se le pidió: implementar el CRUD con TypeORM + PostgreSQL, el filtro por nombre, el workflow de CI y el despliegue en Render
- Qué se modificó/verificó manualmente: cada endpoint se probó contra la base de datos real (local con Docker y en producción en Render) antes de continuar al siguiente paso; se diagnosticó y corrigió un conflicto de puerto con un PostgreSQL nativo ya instalado, un desajuste del lock file en CI, y un archivo de caché de TypeScript (`tsconfig.build.tsbuildinfo`) que rompía el build en Render
