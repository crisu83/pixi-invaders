# Pixi Invaders

A Space Invaders clone built with PixiJS and React.

## Tech Stack

- React 18.2
- PixiJS 7.3 (via @pixi/react 7.1)
- TypeScript 5.7
- Vite 6.1

## Game Entities

The game uses a lightweight entity-component system implemented with TypeScript types:
- Entities and components are immutable using TypeScript's Readonly types
- Components are type-safe and enforce required properties
- Factory functions create properly typed entities
- Helper functions ensure type-safe entity state management

## Controls

- Left/Right Arrow: Move ship
- Space: Fire missile
- Shift: Boost speed

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build