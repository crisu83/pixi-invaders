# Pixi Invaders

A Space Invaders clone built with PixiJS and React.

## Tech Stack

- React 18.2
- PixiJS 7.3 (via @pixi/react 7.1)
- TypeScript 5.7
- Vite 6.1
- Zustand 4.x (State Management)

## Game Architecture

The game uses a modern, component-based architecture:

### Entity System
- Entities are stored in refs to avoid unnecessary re-renders
- Each entity has a ref to its PixiJS sprite for direct manipulation
- Entity groups (missiles, enemies, etc.) are managed in dedicated components
- Component-based architecture for reusable game logic

### State Management
- Centralized game state using Zustand
- Manages game status (score, game state, timers)
- Handles all game entities (player, enemies, missiles)
- Provides actions for entity lifecycle (spawn, destroy)
- Ensures predictable state updates and easier debugging

## Controls

- Left/Right Arrow: Move ship
- Space: Fire missile
- Shift: Boost speed
- Backtick (`): Toggle performance stats

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build