# Configuración de herramientas de IA

## Herramienta utilizada: Claude (Anthropic)

Durante el desarrollo de MindDrop he utilizado Claude como asistente principal de desarrollo.

## Cómo está configurado

Claude se ha utilizado con contexto técnico explícito en cada consulta, proporcionando siempre:

- El stack del proyecto: React Native, Expo SDK 54, TypeScript, Expo Router, React Native Paper, Zustand
- La estructura de carpetas del proyecto
- Las convenciones de nomenclatura: componentes en PascalCase, archivos en camelCase, carpetas en kebab-case
- La temática de MindDrop: app de bienestar mental con paleta verde salvia y beige

## Restricciones aplicadas

Se ha instruido a la IA para que:

- Genere siempre código TypeScript estricto, nunca JavaScript puro
- Use el hook `useTheme()` de `constants/theme.ts` para todos los colores, nunca valores hardcodeados
- Respete la estructura de carpetas definida al inicio del proyecto
- Use Expo Router para navegación, nunca React Navigation directamente
- Genere componentes funcionales con hooks, nunca componentes de clase

## Por qué esta configuración

Sin este contexto, la IA tiende a generar código genérico que no respeta las decisiones de arquitectura del proyecto. Por ejemplo, generaría colores hardcodeados en lugar de usar el sistema de diseño, o usaría React Navigation en lugar de Expo Router.

Proporcionar el contexto desde el principio garantiza que el código generado sea coherente con el resto del proyecto y no requiera refactorización posterior.