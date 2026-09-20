# Arrow Learn Games

Aplicación Next.js App Router con TypeScript estricto, Material UI 7 y `@jlopvil/mui-kit`. No se necesitan dependencias adicionales para los juegos.

```bash
npm install
npm run dev
```

La portada redirige a `/es`. Interfaz en español, catalán e inglés; práctica en español, catalán, inglés, francés, alemán e italiano. Cambiar el idioma de interfaz conserva la ruta.

## Contenido × mecánica

El catálogo se organiza por Vocabulario, Gramática y Frases y expresiones. Las rutas incluyen el idioma:

```text
/es/games
/es/games/vocabulary
/es/games/vocabulary/animals
/es/games/vocabulary/animals/image-to-word
/es/games/vocabulary/animals/translation
/es/games/vocabulary/animals/matching
/es/games/grammar/subject-pronouns/translation
/es/games/phrases/everyday-conversation/matching
```

`/games` y sus subrutas redirigen a su equivalente español. Las áreas, temas y combinaciones no disponibles devuelven 404. Los temas sin contenido aparecen como «Próximamente» sin enlaces de juego.

- `src/games/types/game.types.ts`: áreas, niveles, contenido, modos y selección de práctica.
- `src/games/config/learningAreas.ts`: áreas del catálogo.
- `src/games/config/topics.ts`: temas, contenido, imágenes, contexto y modos compatibles.
- `src/games/config/gameModes.ts`: modos, disponibilidad, habilidades y tipo de interacción para futuros filtros.
- `src/games/config/practice.ts`: accesos y estrategias futuras de partida rápida, errores y reto diario.
- `src/games/components/GameCatalog.tsx` y `CatalogCard.tsx`: navegación y tarjetas reutilizables.
- `src/games/components/GameRunner.tsx`: sesión, configuración, puntuación e historial.
- `src/games/components/game-round.tsx`: registro de motores y resumen común.
- `src/games/engines/use-game.ts`: estado de ronda y persistencia, independiente del tema.
- `src/games/engines/writing-round.tsx`: imagen → palabra y traducción.
- `src/games/engines/matching-round.tsx`: relacionar cualquier colección compatible.
- `src/lib/animals.ts`, `pronouns.ts`, `sentences.ts`: datos originales conservados; el catálogo los adapta a `ContentItem`.

Las imágenes son campos de contenido, no rutas construidas por el motor. El contexto de pronombres también viaja en los datos. La tabla de consulta bilingüe se mantiene como referencia opcional del tema. Los componentes de sesión se han trasladado desde `src/app/[locale]` a `src/games`.

## Añadir un tema

1. Añade una colección de `ContentItem` con IDs únicos y traducciones/variantes en los seis idiomas de práctica. Para imagen → palabra, incluye `image` apuntando a un recurso real de `public`.
2. Añade una entrada `Topic` en `config/topics.ts`: `id`, `area`, títulos en es/ca/en, icono, nivel, contenido y `availableGameModes`.
3. Opcionalmente define `roundSize` o `createDeck` para un muestreo específico; por defecto se mezclan todos los elementos sin repetir.

No se crean páginas ni componentes nuevos. Ejemplo con una colección `food` importada:

```ts
{
  id: 'food', area: 'vocabulary',
  title: { es: 'Comida', ca: 'Menjar', en: 'Food' },
  icon: '🍎', level: 'A1', items: food,
  availableGameModes: ['translation', 'matching']
}
```

Para relacionar, las traducciones visibles deben distinguirse inequívocamente en cada idioma. Por eso pronombres ofrece traducción con contexto y no parejas ambiguas. Los temas pueden reutilizar todos los motores compatibles.

## Añadir un modo

1. Añade el identificador a `GameMode` si aún no existe; los trece modos previstos ya están declarados.
2. Implementa el motor reutilizable en `engines/`, utilizando el contenido de la sesión. Si necesita otra interacción (audio, temporizador…), amplía el contrato de contenido/controlador según corresponda.
3. Añádelo a `ImplementedMode`, declara sus metadatos y disponibilidad en `config/gameModes.ts` y registra el componente en `components/game-round.tsx`.
4. Añade título y descripción a `catalog.modes` en los tres JSON de `src/i18n`.
5. Habilítalo solo en los temas compatibles mediante `availableGameModes`. No es necesario modificar los demás temas ni las rutas.

Los modos previstos no tienen enlaces hasta estar implementados. Partida rápida (repaso variado), repasar errores y reto diario están preparados en configuración y señalados como futuros; todavía no generan sesiones. Los niveles y habilidades son metadatos, no filtros activos.

## Reglas e historial

Cada acierto escrito suma 10 puntos; los errores suman 0. Se respetan los acentos, se ignoran mayúsculas y espacios exteriores, y se aceptan las variantes indicadas en el contenido. Animales mantiene ocho preguntas; pronombres mantiene doce con su contexto y tabla de referencia. Frases mantiene el muestreo de dos personas por cada uno de cuatro verbos, ocho parejas en total.

En relacionar, cada pareja acertada al primer intento suma 10 puntos; después de un error suma 0. Es posible seguir intentándolo. El motor también funciona con animales.

El historial se guarda al empezar y tras cada respuesta en `localStorage`, bajo `arrow-learn-games:history:v3:<area>:<topic>:<mode>`. Incluye idiomas, fecha, puntos, respuestas y estado. El récord considera solo partidas completas; recargar no reanuda la ronda abandonada. No hay sincronización entre dispositivos. Si falla el almacenamiento, se avisa y se conserva la puntuación en memoria.

La migración de lectura conserva y combina sin duplicar los historiales v2:

| Historial anterior | Destino                                    |
| ------------------ | ------------------------------------------ |
| picture            | vocabulary / animals / image-to-word       |
| translation        | vocabulary / animals / translation         |
| pronouns           | grammar / subject-pronouns / translation   |
| matching           | phrases / everyday-conversation / matching |

La migración no borra las claves v2. Las combinaciones nuevas empiezan vacías; relacionar animales no hereda el historial de frases. El score global v1 se mantiene aparte porque no identificaba juegos.

## Verificación

```bash
npm run typecheck
npm run lint
node --test tests/*.mjs
npm run build
```

Las pruebas cubren validación del historial, guardados repetidos, partidas incompletas, migración e independencia de temas/modos, integridad del catálogo, imágenes y muestreo de frases.

## Diseño y metadatos

Se conservan colores, tipografías, superficies, cabecera y componentes existentes. Las tarjetas se adaptan a una columna en móvil y rejillas en escritorio, con foco visible y navegación mediante enlaces. No se cambia el branding.

Configura `NEXT_PUBLIC_SITE_URL` antes de compilar. Si falta, se usa `VERCEL_PROJECT_PRODUCTION_URL` o `http://localhost:3000`. La imagen social sigue siendo `public/og.png`.

## Siguientes pasos

Añadir contenido real de comida/casa/ropa; implementar audio y opciones múltiples; guardar errores por ítem para el repaso; introducir un planificador de sesiones mixtas y retos diarios; activar filtros cuando aumente el catálogo.
