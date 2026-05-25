#  MindDrop

Aplicación móvil de productividad y bienestar mental desarrollada con React Native y Expo.

## ¿Qué es MindDrop?

MindDrop ayuda a las personas a organizar su mente en un solo lugar. Combina reflexiones personales, seguimiento de hábitos y captura rápida de ideas con una estética calmada que invita a usarla cada día.

## Stack tecnológico

- **React Native** con Expo SDK 54
- **TypeScript** para tipado estático
- **Expo Router** para navegación basada en archivos
- **React Native Paper** como librería de componentes
- **Zustand** para estado global
- **AsyncStorage** para persistencia local
- **FlashList** para listas de alto rendimiento
- **Zod** para validación de formularios

## Cómo arrancar el proyecto

### Requisitos previos
- Node.js v18 o superior
- npm o yarn
- Expo Go instalado en tu móvil

### Instalación

```bash
git clone https://github.com/arianaft/minddrop.git
cd minddrop
npm install
npx expo start --tunnel
```

Escanea el QR con Expo Go y la app arrancará en tu móvil.

## Estructura del proyecto

```
minddrop/
├── app/              # Pantallas y navegación
│   └── (tabs)/       # Pestañas principales
├── components/       # Componentes reutilizables
├── store/            # Estado global con Zustand
├── types/            # Interfaces TypeScript
├── constants/        # Tema y tokens de diseño
└── docs/             # Documentación técnica
```

## Documentación

- [Idea y funcionalidades](./docs/idea.md)
- [Teoría React Native](./docs/react-native-teoria.md)
- [Configuración IA](./docs/ai-setup.md)
- [Gestión del proyecto](./docs/project-management.md)

## Gestión del proyecto

El desarrollo se gestiona con Trello. Puedes ver el estado actual del proyecto aquí: [Tablero Trello MindDrop](https://trello.com/invite/b/6a04445bc750ec8081089738/ATTIc32d62d4403a8206a969e6634fb0e20f2701AF86/minddrop)