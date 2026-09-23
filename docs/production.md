# Preparación de producción

Implementado: metadatos por ruta, canonical y alternates es/ca/en, Open Graph y Twitter, datos estructurados WebSite, sitemap derivado de los juegos disponibles y robots. Las páginas legales usan noindex para reducir la exposición en buscadores de los datos personales del titular; siguen siendo públicas y accesibles desde cualquier página.

Configurar `NEXT_PUBLIC_SITE_URL` con el origen HTTPS definitivo antes de compilar. En Vercel se admite como alternativa `VERCEL_PROJECT_PRODUCTION_URL`. El dominio confirmado se usa por defecto. En previews de Vercel se emite noindex y robots bloquea el rastreo. Para otros proveedores, definir VERCEL_ENV=preview en entornos de prueba y protegerlos con autenticación si contienen datos privados. Noindex no controla acceso.

## Pendiente de confirmar con el titular antes de publicar

- Confirmados: https://arrow-learn-games.vercel.app y alojamiento Vercel.
- Exactitud del domicilio aportado y código postal si corresponde.
- Proveedores concretos, contrato de encargo cuando proceda, regiones de tratamiento, transferencias internacionales y garantías efectivas del alojamiento y correo. No basta con mencionar garantías posibles: deben verificarse las aplicables.
- Política efectiva de registros técnicos y plazo de conservación; concretar la política de privacidad con esa información. Alinear también la conservación de consultas con la operativa real.
- Verificar en el despliegue si el proveedor añade cookies, analítica o scripts. El inventario publicado describe el código del repositorio. Si se incorporan finalidades no exentas, implantar consentimiento previo con rechazo y retirada accesibles.

Los cuatro documentos se publican en castellano, con enlaces identificados como tales desde catalán e inglés. No hay pagos ni cuentas, por lo que no se añaden condiciones de venta o devolución ficticias. Una futura modificación del servicio exige revisar los documentos.

## Comprobación del despliegue

1. Ejecutar `npm run lint`, `npm run typecheck` y `npm run build`.
2. Revisar `/robots.txt`, `/sitemap.xml`, canonical, hreflang y tarjetas sociales con el dominio definitivo.
3. Recorrer inicio, temario, catálogo, juegos y enlaces legales en móvil y escritorio.
4. Comprobar las peticiones y almacenamiento en un navegador limpio. Se ha eliminado la importación remota de Google Fonts; se emplean las fuentes locales disponibles y sus alternativas de sistema.
5. Dar de alta el dominio en las herramientas de los buscadores y enviar `/sitemap.xml`.

Fuentes de referencia: [LSSI, artículo 10](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758), [deber de información AEPD](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/6-el-deber-informacion), [guía de cookies AEPD](https://www.aepd.es/guias/guia-cookies.pdf).
