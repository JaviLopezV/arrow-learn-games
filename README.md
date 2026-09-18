# Arrow Learn Games

Proyecto base en Next.js para futuros juegos de aprendizaje. La portada utiliza la librería local [`@jlopvil/mui-kit`](../mui-component-library).

```bash
npm install
npm run dev
```

Abre http://localhost:3000 (redirige a `/es`). La portada también está disponible en `/ca` y `/en` y permite cambiar el idioma desde la cabecera. Los literales se encuentran en `src/i18n/es.json`, `ca.json` y `en.json`. La dependencia de la librería apunta al repositorio hermano `../mui-component-library`; si cambian sus componentes, ejecuta `npm run build` en ese repositorio antes de instalar o actualizar esta app.
