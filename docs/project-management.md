# Gestión del proyecto

## Metodología

El proyecto se ha gestionado con un tablero Trello siguiendo una metodología Kanban simplificada. El tablero tiene cinco columnas:

- **Backlog** — Funcionalidades identificadas pero no priorizadas
- **Todo** — Tareas priorizadas y listas para desarrollar
- **In Progress** — Tarea en desarrollo activo
- **Review** — Completada, pendiente de verificar en el dispositivo
- **Done** — Verificada y funcionando correctamente

## Enlace al tablero

 [Tablero Trello MindDrop](https://trello.com/invite/b/6a04445bc750ec8081089738/ATTIc32d62d4403a8206a969e6634fb0e20f2701AF86/minddrop)

## Criterio de priorización

Se ha seguido el orden marcado por el enunciado del proyecto, priorizando primero la arquitectura base (navegación, tipos, estado) antes que las funcionalidades de usuario (formularios, detalle, persistencia).

## Gestión de bloqueos

Durante el desarrollo surgieron varios bloqueos técnicos que se gestionaron así:

- **Conflictos de dependencias**: Gluestack UI no era compatible con React 19. Se investigaron las causas, se probaron alternativas y se tomó la decisión de usar React Native Paper junto con un sistema de diseño propio.
- **FlashList con Expo Go**: FlashList tiene conflictos de tipos con versiones recientes de React. Se creó un componente wrapper sobre FlatList que mantiene la misma API.
- **Tunnel de ngrok**: El servicio de tunnel caía ocasionalmente. Se alternó entre `--tunnel` y `--lan` según disponibilidad.