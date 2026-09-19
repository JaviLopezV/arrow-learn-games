# Arrow Learn Games

Proyecto base en Next.js para futuros juegos de aprendizaje. La portada utiliza la librería local [`@jlopvil/mui-kit`](../mui-component-library).

```bash
npm install
npm run dev
```

Abre http://localhost:3000 (redirige a `/es`). La portada también está disponible en `/ca` y `/en` y permite cambiar el idioma desde la cabecera. Los literales se encuentran en `src/i18n/es.json`, `ca.json` y `en.json`. La dependencia de la librería apunta al repositorio hermano `../mui-component-library`; si cambian sus componentes, ejecuta `npm run build` en ese repositorio antes de instalar o actualizar esta app.

## Juegos de animales

La sección «Juegos» ofrece identificación mediante ilustraciones locales y traducción entre español, catalán, inglés, francés, alemán e italiano. El idioma de la interfaz se elige por separado. Cada ronda incluye ocho animales sin repeticiones.

Cada acierto suma 10 puntos; un error suma 0. Se aceptan mayúsculas, espacios exteriores y las variantes del vocabulario definidas en `src/lib/animals.ts`; se requieren los acentos correctos. Tras comprobar una respuesta se muestra el resultado antes de continuar.

Cada partida empieza en cero y mantiene su puntuación individual. El historial se guarda por juego en `localStorage`, con claves `arrow-learn-games:history:v2:picture`, `:translation` y `:pronouns`. Incluye fecha de inicio, idiomas, puntos, aciertos, respuestas y estado. La última puntuación y el récord se muestran para el juego seleccionado; solo las partidas completas cuentan para el récord.

El resultado se guarda al empezar y tras cada respuesta, incluida la última antes de abrir el resumen. Una partida abandonada o interrumpida por una recarga aparece como «Sin terminar» y no se reanuda. Los datos se recuperan en el mismo navegador; no se sincronizan entre dispositivos. Si falla el almacenamiento, se indica en pantalla y se conserva el historial en memoria durante la visita.

El antiguo score global `arrow-learn-games:score:v1` no se modifica ni se atribuye a ningún juego: no contiene datos que permitan repartirlo.

Verificaciones: `npm run typecheck`, `npm run lint` y `npm run build` y `node --test tests/game-history.mjs`.

## Pronombres sujeto

El tercer juego permite consultar una lista bilingüe de pronombres sujeto y practicar su traducción en rondas de 12 preguntas. Cada pregunta aporta persona, número, género y registro para distinguir formas ambiguas como «you» o «sie». La lista cambia con los idiomas seleccionados y solo se muestra antes de empezar. Incluye formas personales y de cortesía; no pretende cubrir usos neutros o impersonales. Se aceptan variantes regionales españolas como «vos» y «ustedes» donde corresponden.

El vocabulario está en `src/lib/pronouns.ts`. Usa las mismas reglas de puntuación, con su propio historial y récord independientes de los juegos de animales.
