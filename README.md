# Pixi Invaders

A Space Invaders clone built with PixiJS and React.

## Tech Stack

- React 18.2
- PixiJS 7.3 (via @pixi/react 7.1)
- TypeScript 5.7
- Vite 6.1
- Zustand 4.x

## Game Architecture

The game uses a modern, functional architecture:

### Entity Component System (ECS)
- Entities are composed of reusable components (Sprite, Movement, Explosive)
- Each component handles a specific aspect of entity behavior
- Pure functions for component operations
- Component-based architecture for flexible game logic

### State Management
- Dedicated stores for each entity type (player, enemies, missiles)
- Clean separation of concerns between game elements
- Predictable state updates using Zustand
- Each store manages its own initialization and cleanup

### Utilities
- Collision checking between game entities
- Entity factory for creating game objects
- Component utilities for common operations
- Sprite management and texture handling

## Controls

- Left/Right Arrow: Move ship
- Space: Fire missile
- Shift: Boost speed
- Backtick (`): Toggle performance stats

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

# Credits

- Code by [@crisu83](https://github.com/crisu83)
- Music by [Ian Aisling](https://uppbeat.io/t/ian-aisling/oblanka)