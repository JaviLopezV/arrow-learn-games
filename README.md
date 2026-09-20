# Arrow Learn Games

Aplicación Next.js con juegos de aprendizaje. La interfaz utiliza Material UI 7 y la librería [`@jlopvil/mui-kit`](../mui-component-library).

```bash
npm install
npm run dev
```

Abre http://localhost:3000 (redirige a `/es`). La portada también está disponible en `/ca` y `/en` y permite cambiar el idioma desde la cabecera. Los literales se encuentran en `src/i18n/es.json`, `ca.json` y `en.json`. La dependencia `@jlopvil/mui-kit` corresponde al proyecto hermano `mui-component-library` y utiliza la versión publicada `^0.4.0`.

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

## Interfaz y mantenimiento

Los botones, campos, selectores, radios, tipografía y superficies usan `@jlopvil/mui-kit`. Las tablas, el acordeón y la barra de progreso usan Material UI directamente. El tema compartido se configura en `src/app/providers.tsx`; el CSS conserva la composición responsive y las ilustraciones de la portada.

La lógica de las partidas está en `use-animal-game.ts`, separada de los componentes de configuración, ronda e historial. La configuración `eslint.config.mjs` replica la de `javier-lopez-portfolio`: 300 líneas por archivo, 200 por función y hasta 600 por archivo de pruebas o fixtures, excluyendo líneas vacías y comentarios.

## Metadatos y vista previa social

Cada idioma incluye título, descripción, URL canónica, enlaces alternativos y metadatos Open Graph/Twitter. La imagen compartida es `public/og.png` (1200 × 630), con el diseño de Arrow Learn Games; los textos y el alt de los metadatos se traducen en `src/i18n/*.json`.

Configura `NEXT_PUBLIC_SITE_URL` con la URL pública completa antes de compilar. Como en el portfolio, si no se define se usa `VERCEL_PROJECT_PRODUCTION_URL` y, en desarrollo local, `http://localhost:3000`. Así las URLs canónicas y de la imagen se generan con el dominio del despliegue.
