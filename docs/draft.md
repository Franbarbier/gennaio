# Gennaio — borrador de conceptos

Documento vivo para registrar ideas, referencias y decisiones de implementación.

## 1. Entrada dividida en dos universos

La primera pantalla se divide en dos áreas principales:

- **Diseño de interiores**
- **Muebles — propios y a medida**

La división debe sentirse visual e inmersiva, no como dos botones convencionales. Cada lado puede tener su propia imagen o video, atmósfera y microinteracción. Al mover el cursor o enfocar una opción, ese universo gana protagonismo y revela una invitación a explorarlo.

### Ideas de interacción

- Composición 50/50 al entrar.
- En hover, el lado activo se expande suavemente y el otro se repliega.
- Títulos grandes y mínimos, con una breve bajada opcional.
- Transición fluida desde la portada hacia la sección elegida.
- En mobile, resolver los dos universos en bloques verticales de igual jerarquía.

### Pendiente de definir

- Si esta división funciona como una portada inicial o como el hero de la página principal.
- Qué material visual representa mejor cada universo.
- Si ambas rutas viven dentro de una misma home o conducen a páginas independientes.

## 2. Diseño de interiores — lienzo navegable de proyectos

Referencia principal: [Yabu Pushelberg](https://www.yabupushelberg.com/)

Al ingresar a **Diseño de interiores**, la página se convierte en un gran lienzo visual con muchas fotografías de proyectos distribuidas libremente, sin una grilla rígida ni una estructura evidente. La sensación debe ser la de explorar una superficie amplia y continua, no la de recorrer un listado tradicional.

### Navegación con el cursor

- El movimiento debe ser continuo y muy suave.
- En el centro de la pantalla existe una zona neutra imaginaria de aproximadamente `30vw × 30vw`.
- Mientras el cursor permanece dentro de esa zona, el lienzo no se desplaza.
- Al salir de la zona neutra, el lienzo comienza a desplazarse en la dirección del cursor.
- La velocidad aumenta progresivamente según la distancia entre el cursor y la zona neutra.
- Cuanto más cerca esté el cursor de un margen de la ventana, mayor será la velocidad.
- La aceleración y el frenado deben tener interpolación suave, sin saltos bruscos.
- La experiencia puede permitir movimiento horizontal y vertical para reforzar la idea de un canvas amplio.

### Composición del lienzo

- Muchas fotografías de diferentes tamaños y proporciones.
- Posiciones aparentemente libres y orgánicas, evitando filas o columnas reconocibles.
- Suficiente espacio negativo para que el conjunto respire.
- Las imágenes pueden revelar el nombre, ubicación o año del proyecto al pasar el cursor.
- Un clic sobre una fotografía abre el proyecto correspondiente.
- La transición hacia el detalle debería conservar la imagen seleccionada como elemento conductor, ampliándola o llevándola a pantalla completa.

### Consideraciones de implementación

- Construir un canvas virtual mayor que el viewport y moverlo mediante transformaciones, evitando depender del scroll convencional.
- Animar posición y velocidad con `requestAnimationFrame` y una interpolación tipo `lerp` o spring.
- Limitar la velocidad máxima para conservar una sensación refinada y controlable.
- Pausar el desplazamiento automático durante el hover preciso o clic sobre una imagen si hiciera falta para mejorar la usabilidad.
- Preparar una interacción alternativa para touch: arrastre directo con inercia y acceso claro a cada proyecto.
- Respetar `prefers-reduced-motion` con una vista navegable más estable y sin movimiento automático.

## 3. Navegación contextual y menú desplegable

Referencia principal: [Yabu Pushelberg](https://www.yabupushelberg.com/)

### Aparición contextual de la barra superior

- La home inicial, dividida entre **Diseño de interiores** y **Muebles**, no muestra una barra de navegación convencional.
- Al entrar a **Diseño de interiores**, aparece una barra superior mínima sobre el canvas.
- La barra debe entrar como parte de la transición entre pantallas, con un desplazamiento vertical corto y un fade suave; no debe aparecer de golpe.
- Puede contener la marca, `Approach`, `Projects` o `Works`, y accesos secundarios todavía por definir.
- La navegación queda asociada al universo de Interior Design; no tiene por qué repetirse de la misma forma en el acceso inicial.

### Apertura del menú

- El menú se despliega desde la propia barra superior, como una expansión continua del header y no como un modal desconectado.
- El panel puede crecer verticalmente mediante una máscara, `clip-path` o altura animada, conservando el origen visual en la barra.
- Fondo sólido o ligeramente translúcido para separar el menú del canvas sin generar un corte agresivo.
- Usar una curva de animación suave y con carácter editorial; evitar rebotes o movimientos demasiado juguetones.
- Al cerrar, invertir el orden: primero salen contenidos e imágenes y luego se contrae el panel.

### Ítem `Projects` / `Works`

- Debe listar todos los proyectos representados por fotografías en el canvas.
- El listado puede aparecer organizado alfabéticamente, por tipología o como índice continuo.
- Al pasar el cursor sobre `Projects` o `Works`, el contenido se despliega progresivamente en lugar de aparecer todo al mismo tiempo.
- Cada proyecto puede mostrar nombre y, como información secundaria, ubicación, año o categoría.
- En hover sobre un proyecto, mostrar una miniatura o destacar la fotografía correspondiente dentro del canvas.
- Al hacer clic, abrir el mismo detalle al que conduce la imagen del canvas para mantener una única fuente de navegación.
- Si el listado supera la altura disponible, usar un scroll interno muy limpio o dividirlo en columnas.

### Hover de `Approach`

- Inspirarse en la forma en que Yabu Pushelberg revela sus opciones de Approach.
- Los enlaces o categorías aparecen de a uno con un pequeño `translateY` y cambio de opacidad.
- Aplicar un stagger corto y perceptible, aproximadamente entre `40ms` y `80ms` entre elementos.
- El primer elemento debe comenzar inmediatamente para que la interfaz se sienta reactiva.
- Distancia sugerida del translate: entre `16px` y `28px`, terminando con opacidad completa.
- La entrada puede resolverse con una máscara por línea para dar la sensación de que el texto emerge desde abajo.

### Imágenes y categorías a la derecha

- El panel se organiza en dos áreas: navegación textual a la izquierda y composición visual a la derecha.
- A la derecha aparecen fotografías vinculadas con las categorías o disciplinas del estudio.
- Las imágenes entran con una combinación de revelado por máscara, leve desplazamiento y escala sutil.
- Al cambiar de categoría, realizar un crossfade o slide controlado entre imágenes, evitando flashes o saltos de layout.
- Puede haber más de una imagen parcialmente superpuesta para conservar una composición editorial y no convertirla en una tarjeta convencional.
- El movimiento de las imágenes debería comenzar apenas después del texto, reforzando la secuencia: panel → enlaces → visuales.

### Ritmo de animación sugerido

- Expansión general del panel: `500–700ms`.
- Aparición escalonada de enlaces: `350–550ms` en total.
- Entrada de imágenes: `500–800ms`, con un retraso leve respecto del texto.
- Curva inicial sugerida: una easing editorial tipo `cubic-bezier(0.76, 0, 0.24, 1)`, a ajustar visualmente.
- Todas las animaciones deben poder interrumpirse y responder con fluidez si el usuario cambia rápidamente de ítem.

### Mobile y accesibilidad

- En touch, reemplazar los estados de hover por apertura mediante tap.
- Mantener foco por teclado, `Escape` para cerrar y estados `aria-expanded` claros.
- El listado completo de proyectos debe seguir siendo accesible aun si las imágenes o animaciones no cargan.
- Con `prefers-reduced-motion`, conservar la jerarquía y el orden pero reducir translates, stagger y transiciones prolongadas.

## Estado del primer prototipo

Implementado el 7 de octubre de 2026:

- Portada dividida entre Interior Design y Muebles.
- Canvas de proyectos con zona neutra central y velocidad progresiva hacia los márgenes.
- Navegación táctil por arrastre.
- Barra superior contextual dentro de Interior Design.
- Menús animados de Approach y Projects.
- Índice conectado con los mismos proyectos del canvas.
- Detalle de proyecto con transición a pantalla completa.
- Sección editorial inicial para muebles.
- Material real recuperado de Gennaio y placeholders claramente marcados como `MOCK CONTENT`.
