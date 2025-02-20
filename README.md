# Pixi Invaders

A Space Invaders clone built with PixiJS and React.

## Tech Stack

- React 18.2
- PixiJS 7.3 (via @pixi/react 7.1)
- TypeScript 5.7
- Vite 6.1

## Game Entities

The game uses a ref-based entity system for optimal performance:
- Entities are stored in refs to avoid unnecessary re-renders
- Each entity has a ref to its PixiJS sprite for direct manipulation
- Entity groups (missiles, enemies, etc.) are managed in dedicated components
- Component-based architecture for reusable game logic

## Controls

- Left/Right Arrow: Move ship
- Space: Fire missile
- Shift: Boost speed

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build