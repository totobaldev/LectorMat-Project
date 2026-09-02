# Sistema visual LectorMat

Este directorio contiene los componentes de identidad compartidos. No cambian rutas, navegación ni estado funcional; unifican la presentación de las acciones y contenidos ya existentes.

## `BrandMark`

- **Objetivo:** representar la unión de lectura y matemática con un libro abierto, símbolos abstractos y una chispa de logro.
- **Actor:** estudiante y docente.
- **Contexto:** cabeceras, accesos y navegación.
- **Variantes:** completa y compacta.
- **Estados:** estático; hereda tamaño del contexto.
- **Responsive:** la variante compacta se usa en navegación estrecha.
- **Accesibilidad:** nombre accesible `LectorMat`; el SVG interno es decorativo.
- **Paleta:** azul Lector, naranja Mat y acento emerald de logro.
- **Interacción:** ninguna.

## `LectorMatIcon`

- **Objetivo:** ofrecer iconografía de marca para acciones educativas principales.
- **Actor:** estudiante y docente.
- **Contexto:** lectura, matemática, cursos, método, misiones, progreso, desafíos, logros, docencia, feedback, biblioteca, estadísticas, carrera, recompensas y habilidades.
- **Variantes:** una silueta por valor de `name`; color y tamaño heredables.
- **Estados:** default, active, disabled, success y error mediante color del componente contenedor.
- **Responsive:** trazos legibles desde 16 px; SVG escalable y fondo transparente.
- **Accesibilidad:** decorativo por defecto; `title` habilita nombre y rol de imagen cuando aporta significado independiente.
- **Paleta:** usa `currentColor` para integrarse con azul, naranja, emerald o slate.
- **Interacción:** ninguna; las animaciones pertenecen al control contenedor.

## `ActionButton`

- **Objetivo:** unificar las acciones principales sin convertir el texto en imagen.
- **Actor:** estudiante, docente o ambos según variante.
- **Contexto:** accesos, continuidad, confirmaciones y acciones secundarias.
- **Variantes:** `student`, `teacher`, `success`, `secondary` y `ghost`; tamaños `sm`, `md` y `lg`.
- **Estados:** default, hover, active, focus-visible y disabled. Los estados loading/error se componen con `disabled`, texto y contenido del llamador.
- **Responsive:** altura táctil mínima de 40 px y opción `fullWidth`.
- **Accesibilidad:** botón HTML real, foco visible, respeta `prefers-reduced-motion` y conserva los atributos ARIA recibidos.
- **Paleta:** azul-600 para estudiante, naranja-500 para docente, emerald-500 para éxito, slate para secundarios.
- **Iconografía:** acepta elementos `leading` y `trailing`, preferentemente `LectorMatIcon` para acciones de marca.
- **Interacción:** elevación de 2 px en hover y escala 0.98 en active.

## `StatusBadge`

- **Objetivo:** comunicar estado, materia, nivel o recomendación de forma breve y consistente.
- **Actor:** estudiante y docente.
- **Contexto:** estados de actividad, novedades y etiquetas de interfaz.
- **Variantes:** `blue`, `orange`, `emerald`, `amber` y `slate`.
- **Estados:** informativo; no interactivo.
- **Responsive:** texto compacto, icono opcional y ancho definido por contenido.
- **Accesibilidad:** texto real de alto contraste; el icono complementario se marca como decorativo.
- **Paleta:** superficies claras con texto oscuro y anillo sutil.
- **Interacción:** ninguna.

