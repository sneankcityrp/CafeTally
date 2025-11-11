# Cafe POS Application

## Overview

This is a touch-optimized Point of Sale (POS) application designed for cafes and quick-service restaurants. The application enables staff to quickly build customer orders, calculate totals in pounds (£), and process transactions with minimal taps. The interface draws inspiration from established POS systems like Toast and Square while implementing a Material Design aesthetic for clarity and efficiency.

The application prioritizes speed-first interactions with large touch targets, clear visual hierarchy, and scannable menu organization. It's built as a single-page application with a responsive layout that adapts from mobile to desktop viewports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (minimal routing needs with primarily single-page workflow)

**UI Component System**
- Shadcn/ui component library configured with "new-york" style preset
- Radix UI primitives for accessible, unstyled component foundations
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables system for theme customization (defined in index.css with HSL color values)

**State Management**
- React hooks (useState, useMemo) for local component state
- TanStack Query (React Query) for server state management and caching
- No global state library needed - application state is primarily transient (current order)

**Design System Configuration**
- Custom spacing scale based on Tailwind units (2, 3, 4, 6, 8)
- Touch-optimized minimum target size of 48px (h-12)
- Typography scale using Inter/Roboto with defined weights (400-700)
- Responsive grid: single-column mobile, 60/40 split on desktop (menu/order summary)
- Custom elevation system with hover and active states for tactile feedback

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Custom middleware for request logging with duration tracking
- JSON body parsing with raw body preservation for webhook compatibility
- Development/production environment configuration via NODE_ENV

**API Design**
- RESTful API structure with `/api` prefix for all endpoints
- Routes registered through centralized `registerRoutes` function
- Storage abstraction layer via `IStorage` interface for data operations
- Currently using in-memory storage (MemStorage) for menu items

**Development Tooling**
- Vite integration in middleware mode for HMR during development
- Custom error overlay plugin for runtime errors
- Replit-specific plugins for Cartographer code mapping and dev banner
- Source map support via @jridgewell/trace-mapping

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL with type-safe query building
- Schema defined in shared/schema.ts for isomorphic TypeScript types
- Schema-to-Zod validation via drizzle-zod for runtime type checking
- Neon serverless PostgreSQL driver for serverless deployment compatibility

**Data Models**
- `menuItems` table: id (UUID primary key), name (text), price (decimal 10,2), category (text)
- `OrderItem` interface (client-side): id, name, price, quantity for cart state
- Insert schemas generated from Drizzle schemas with ID omission for creation

**Storage Layer Abstraction**
- `IStorage` interface defines CRUD contract: getMenuItem, getAllMenuItems, createMenuItem, deleteMenuItem
- `MemStorage` implementation provides in-memory fallback for development/testing
- Design allows easy swap to database-backed storage without changing business logic

### External Dependencies

**UI & Component Libraries**
- Radix UI suite (v1.x): 20+ primitive components for accessible UI patterns
- Lucide React: Icon library for consistent iconography
- cmdk: Command palette component for keyboard-driven interactions
- embla-carousel-react: Touch-friendly carousel implementation
- react-day-picker: Calendar/date selection component
- vaul: Drawer component for mobile-friendly modals

**State & Data Management**
- @tanstack/react-query v5: Server state synchronization and caching
- react-hook-form: Form state management with validation
- @hookform/resolvers: Validation resolver integrations
- zod: Runtime schema validation and type inference

**Styling & Design**
- Tailwind CSS v3: Utility-first CSS framework
- tailwindcss-animate: Animation utilities for transitions
- class-variance-authority: Type-safe variant styling utilities
- clsx + tailwind-merge: Class name merging utilities

**Database & ORM**
- Drizzle ORM v0.39: Type-safe SQL query builder
- @neondatabase/serverless: Serverless PostgreSQL client
- drizzle-kit: Schema migration and management tooling
- drizzle-zod: Schema-to-Zod validation bridge

**Utility Libraries**
- date-fns: Date manipulation and formatting
- nanoid: Compact unique ID generation

**Development Tools**
- TypeScript v5: Static type checking
- tsx: TypeScript execution for Node.js
- esbuild: Fast JavaScript bundler for production builds
- Vite plugins: @replit/vite-plugin-runtime-error-modal, cartographer, dev-banner

**Backend Infrastructure**
- Express v4: HTTP server framework
- connect-pg-simple: PostgreSQL session store for Express sessions (infrastructure ready for authentication)