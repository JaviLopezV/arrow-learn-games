# Arrow Learn Games

Proyecto base en Next.js para futuros juegos de aprendizaje. La portada utiliza la librería local [`@jlopvil/mui-kit`](../mui-component-library).

```bash
npm install
npm run dev
```

Abre http://localhost:3000 (redirige a `/es`). La portada también está disponible en `/ca` y `/en` y permite cambiar el idioma desde la cabecera. Los literales se encuentran en `src/i18n/es.json`, `ca.json` y `en.json`. La dependencia de la librería apunta al repositorio hermano `../mui-component-library`; si cambian sus componentes, ejecuta `npm run build` en ese repositorio antes de instalar o actualizar esta app.

## Juegos de animales

La sección «Juegos» ofrece identificación mediante ilustraciones locales y traducción entre español, catalán, inglés, francés, alemán e italiano. El idioma de la interfaz se elige por separado. Cada ronda incluye ocho animales sin repeticiones.

Cada acierto suma 10 puntos; un error suma 0 y termina la racha. Se aceptan mayúsculas, espacios exteriores y las variantes del vocabulario definidas en `src/lib/animals.ts`; se requieren los acentos correctos. Tras comprobar una respuesta se muestra el resultado antes de continuar.

El total de puntos, los aciertos/intentos, la racha actual y la mejor racha se guardan en `localStorage` bajo `arrow-learn-games:score:v1`, compartidos entre juegos e idiomas. Se recuperan al volver a abrir la página en el mismo navegador; no se sincronizan entre dispositivos. Si el almacenamiento no está disponible, se indica en pantalla y se conserva el progreso en memoria durante la visita. Las rondas en curso no se guardan.

Verificaciones: `npm run typecheck`, `npm run lint` y `npm run build`.
