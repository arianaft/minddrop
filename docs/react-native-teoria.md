# Teoría React Native

## React Native vs App nativa

Una app nativa se escribe en Swift/Objective-C (iOS) o Kotlin/Java (Android) y usa directamente las APIs del sistema operativo. React Native permite escribir una sola base de código en JavaScript/TypeScript que se compila a componentes nativos reales.

La diferencia clave con una WebApp o PWA es que React Native NO renderiza HTML en un WebView. Cuando usas `<View>` en React Native, el framework habla con el sistema operativo para crear una vista nativa real, lo que le da el aspecto y rendimiento de una app nativa.

## Arquitectura de dos hilos

React Native tiene dos hilos que deben comunicarse:

- **JS Thread**: donde corre tu código React y la lógica de negocio
- **UI Thread (nativo)**: donde se renderizan los componentes del sistema operativo

Cuando el JS thread se bloquea (por ejemplo con una operación pesada), la interfaz se congela porque el UI thread no recibe instrucciones. Entender esto es la base para escribir apps con rendimiento real.

## Metro Bundler

Metro es el empaquetador de JavaScript de React Native, equivalente a Webpack en proyectos web. Se encarga de:
- Resolver las importaciones de módulos
- Transformar TypeScript a JavaScript
- Enviar el bundle al dispositivo durante el desarrollo
- Actualizar el código en tiempo real (Fast Refresh)

## Expo Go vs Development Build

**Expo Go** es el entorno de desarrollo rápido: escaneas un QR y tu app corre sin compilar nada. Es ideal para aprender y prototipar pero tiene limitaciones: solo funciona con módulos incluidos en el SDK de Expo.

**Development Build** es un binario propio generado con EAS Build. Permite usar módulos nativos personalizados (cámara, notificaciones push, biometría). En proyectos reales siempre se usa Development Build.

En MindDrop usamos Expo Go porque no necesitamos módulos nativos personalizados.

## Sistemas de diseño

Investigué las dos librerías UI más usadas con Expo:

**Gluestack UI**: filosofía similar a Tailwind CSS, altamente personalizable. Durante el desarrollo encontré conflictos de dependencias con React 19 que impedían que la app arrancara en el dispositivo.

**React Native Paper**: implementación de Material Design, lista para usar. Más estable y con mejor compatibilidad con el SDK de Expo actual.

**Decisión**: Elegí React Native Paper por su estabilidad, combinado con un sistema de diseño propio en `constants/theme.ts` con tokens de color, tipografía y espaciado propios de MindDrop. Esto me permite mantener la identidad visual de la app sin depender completamente de los estilos de Material Design.

## Navegación con Expo Router

Expo Router ofrece tres patrones de navegación principales que se combinan según las necesidades de la app:

**Tabs (pestañas)**: Navegación horizontal entre secciones independientes. El usuario puede saltar entre ellas sin perder el estado de cada una. Se usa cuando las secciones tienen el mismo nivel jerárquico y el usuario las alterna con frecuencia.

**Stack (pila)**: Navegación en profundidad. Cada pantalla se apila sobre la anterior y el usuario puede volver atrás. Se usa para flujos jerárquicos: listado → detalle, configuración → opción concreta.

**Modal**: Pantalla que se superpone sobre la navegación actual, normalmente para acciones puntuales (formularios, confirmaciones). No forma parte de la jerarquía de navegación permanente.

**Cómo se usa cada uno en MindDrop**:
- **Tabs** (`app/(tabs)/_layout.tsx`): las tres secciones principales (Reflexiones, Hábitos, Ideas) son independientes entre sí y tienen el mismo peso, por lo que Tabs es la elección natural.
- **Stack**: dentro de cada pestaña, navegar de la lista al detalle de un elemento es una relación jerárquica padre-hijo, perfecta para Stack. Expo Router lo gestiona automáticamente con los archivos `[id].tsx`.
- **Modal** (`app/nueva-nota.tsx`): el formulario de creación es una acción puntual que no pertenece a ninguna pestaña concreta. Presentarlo como modal permite cerrarlo con un gesto de deslizamiento y deja clara su naturaleza temporal.

## Gestión de estado

Comparativa de las tres opciones principales:

**useState**: Estado local de un componente. Solo accesible dentro del componente donde se define. Ideal para formularios y estados de UI simples.

**Context API**: Estado compartido entre componentes mediante un Provider. Provoca re-renders en todos los componentes que consumen el contexto cuando cualquier valor cambia, lo que puede degradar el rendimiento.

**Zustand**: Librería de estado global minimalista. No requiere providers anidados y solo re-renderiza los componentes que usan el dato específico que cambió. Es el estándar moderno para gestión de estado en React Native.

En MindDrop usamos Zustand porque necesitamos compartir el estado de las notas entre las tres pestañas y el formulario de creación.

## Type guards en TypeScript

Cuando tienes un tipo unión como `AnyNote = Note | ChecklistNote | IdeaNote`, TypeScript no sabe en tiempo de ejecución con qué tipo concreto estás trabajando. Los **type guards** son funciones que comprueban el tipo real y le informan al compilador para que active el tipado correcto dentro de ese bloque.

En MindDrop se usan comprobaciones de propiedad con el operador `in`:

```typescript
export function isChecklist(note: AnyNote): note is ChecklistNote {
  return 'items' in note;
}
```

`'items' in note` devuelve `true` solo si el objeto tiene la propiedad `items`, que es exclusiva de `ChecklistNote`. Dentro de un `if (isChecklist(note))`, TypeScript ya sabe que `note` es `ChecklistNote` y permite acceder a `note.items` sin error.

Esto es necesario porque JavaScript no tiene tipos en tiempo de ejecución: un `AnyNote` es solo un objeto, y el compilador necesita una prueba explícita para reducir el tipo unión a uno concreto.

## Rendimiento en listas

**FlatList** (React Native): renderiza elementos de forma lazy pero el reciclaje de componentes no es óptimo en listas largas, lo que puede provocar pantallas en blanco al hacer scroll rápido.

**FlashList** (Shopify): resuelve este problema reciclando componentes de forma más agresiva. La propiedad `estimatedItemSize` le indica cuánto espacio ocupará cada elemento antes de renderizarlo, lo que mejora el rendimiento.

En MindDrop usamos FlashList a través de un wrapper sobre FlatList por compatibilidad con la versión actual de Expo, manteniendo la misma API y pudiendo migrar a FlashList nativo cuando se resuelvan los conflictos de tipos.

## Persistencia con AsyncStorage

AsyncStorage es el sistema de almacenamiento clave-valor de React Native. Sus características:

- **Asíncrono**: todas las operaciones devuelven Promises
- **Sin cifrado**: los datos se guardan en texto plano
- **Límite de tamaño**: no apto para grandes volúmenes de datos
- **Solo local**: los datos solo están en ese dispositivo

En MindDrop integramos AsyncStorage con Zustand mediante el middleware `persist`. Cada vez que el estado cambia, Zustand serializa los datos a JSON y los guarda automáticamente. Al arrancar la app, Zustand lee los datos guardados y rehidrata el store — este proceso se llama **rehidratación**.

Durante la rehidratación el store está vacío momentáneamente. En una app de producción mostraríamos un indicador de carga usando el hook `useHydration` de Zustand hasta que los datos estén disponibles.