# Pixi Invaders

A Space Invaders clone built with PixiJS and React.

## Tech Stack

- React 18.2
- PixiJS 7.3 (via @pixi/react 7.1)
- TypeScript 5.7
- Vite 6.1

## Project Structure

```
src/
├── components/         # React components
│ ├── text.tsx          # Reusable text components
│ ├── player.tsx        # Player ship component
│ ├── enemy.tsx         # Enemy ship component
│ └── ...
├── hooks/              # Custom React hooks
│ ├── use-text-style.ts
│ ├── use-sprite-sheet.ts
│ └── ...
├── utils/              # Utility functions
│ ├── entity.ts         # Entity utilities
│ └── entity-factory.ts # Entity factory
├── types.ts            # TypeScript type definitions
└── constants.ts        # Game constants
```

## Game Entities

The game uses an entity-component system where:
- Entities are objects with position and type
- Components add behavior (like explosions)
- Factory functions create entities
- Helper functions manage entity state

## Controls

- Left/Right Arrow: Move ship
- Space: Fire missile
- Shift: Boost speed

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build