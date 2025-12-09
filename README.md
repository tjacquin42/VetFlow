# VetFlow

Veterinary nutrition calculator for web and mobile platforms.

## Project Structure

This is a monorepo containing multiple packages:

- **packages/web** - Web application (React + Vite + TypeScript + Tailwind)
- **packages/mobile** - Mobile application (React Native + Expo)
- **packages/shared** - Shared code (types, formulas, validators)

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Development

Run web application:
```bash
pnpm dev:web
```

Run mobile application:
```bash
pnpm dev:mobile
```

### Build

Build web application:
```bash
pnpm build:web
```

Build shared package:
```bash
pnpm build:shared
```

## Tech Stack

### Web
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router v6
- React Hook Form + Zod
- TanStack Query
- Supabase

### Mobile
- React Native
- Expo
- TypeScript
- NativeWind
- Expo Router
- Supabase

### Shared
- TypeScript
- Zod (validation)

## Documentation

See the `/docs` folder or the Obsidian vault at `/Users/jack/DEV/Obsidian/ObsiBot/VetFlow/` for complete project documentation.

## License

MIT
