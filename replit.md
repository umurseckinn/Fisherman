# Island Hopper - Fishing Game

## Overview

Island Hopper is a browser-based fishing game built with React and Express. Players catch fish to earn money, pay fuel costs, and progress through increasingly difficult islands. The game features a canvas-based fishing mechanic with different fish rarities, a high score leaderboard, and celebratory effects for achievements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Game Engine**: Custom canvas-based game engine (`client/src/game/GameEngine.ts`)
- **Build Tool**: Vite with React plugin

The frontend follows a page-based structure with three main routes:
- Home (`/`) - Landing page with start game and leaderboard links
- Game (`/game`) - Main fishing gameplay canvas
- Leaderboard (`/leaderboard`) - High scores display

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` using Zod schemas for type-safe request/response validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Schema Location**: `shared/schema.ts` contains database table definitions

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Database schema and Zod validation schemas
- `routes.ts` - API route definitions with input/output type contracts

### Build System
- Development: Vite dev server with HMR for frontend, tsx for backend
- Production: Custom build script using esbuild for server bundling and Vite for client bundling
- Output: `dist/` directory with `index.cjs` (server) and `public/` (static assets)

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries with schema defined in `shared/schema.ts`
- **drizzle-kit**: Database migration tool (`db:push` script)

### UI Components
- **shadcn/ui**: Pre-built accessible React components based on Radix UI primitives
- **Radix UI**: Headless UI component primitives (dialogs, dropdowns, tooltips, etc.)
- **Lucide React**: Icon library

### Frontend Libraries
- **Framer Motion**: Animation library for modals and transitions
- **canvas-confetti**: Celebration effects when reaching new islands
- **TanStack React Query**: Async state management for API calls

### Development Tools
- **Vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **Replit plugins**: Dev banner, cartographer, and runtime error overlay for Replit environment