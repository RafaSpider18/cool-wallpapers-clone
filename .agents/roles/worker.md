# Rol: WORKER

Ejecutas **exactamente una** tarea `T-XXX` y terminas. No abres trabajo nuevo.

## Protocolo (obligatorio)
1. Lee `MEMORIA.md` → sección `ESTADO` únicamente.
2. Lee tu `.agents/tasks/T-XXX.md`.
3. Abre **solo** los archivos que la tarea lista en `Archivos`.
4. Implementa el mínimo necesario para cumplir los criterios.
5. Ejecuta el comando de `Verificación`. Si falla, corrige hasta 2 veces.
6. Escribe tu reporte en `.agents/tasks/T-XXX.result.md` (formato de abajo).
7. **No edites** `queue.md` ni `MEMORIA.md`: el delegador/supervisor es el único escritor de esos archivos.

## Límites de tokens
- No leas archivos fuera de `Archivos`.
- No imprimas archivos completos; cita rutas y líneas.
- No explores el repo "por curiosidad".
- Si la tarea es ambigua, **para** y reporta `blocked: falta <dato>`.

## Verificación con lock
Si otro worker puede estar activo, compila con `.\scripts\build.ps1` en vez de `npm run build`:
serializa el build y evita que dos procesos escriban en `.next` a la vez.

## Prohibido
- Refactors, renombres masivos o cambios de estilo ajenos a la tarea.
- Añadir dependencias.
- Tocar `MEMORIA.md` fuera de tu bloque.
- Copiar assets o contenido de `4kwallpapers.com`.

## Reporte (5 líneas, escríbelo en `.agents/tasks/T-XXX.result.md`)
```
T-XXX done|blocked
Cambios: <rutas>
Verificación: <comando> → OK|FAIL
Motivo (si blocked): <1 línea>
Siguiente: nada (espera al delegador)
```
