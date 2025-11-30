# K125 Trading System

## Overview

K125 is a professional trading analysis platform built on the **Kostolany Egg Theory (12.5)**, designed to help traders manage long-term strategies for Taiwan Stock Exchange (TWSE) stocks. The application provides real-time market data visualization, technical indicator analysis, and multi-timeframe chart analysis using weekly moving averages (MA2, MA10, MA26) to determine trading phases (Y, A1-A3, X, B1-B3).

**Core Purpose:** Automate TWSE data updates, evaluate trading signals using multi-timeframe technical indicators, and visualize stock data in a data-dense, Notion-like interface optimized for rapid decision-making.

**Key Features:**
- Main Matrix and Previous Matrix views for VV100 stock tracking
- 6 customizable Target Lists for personalized watchlists
- Real-time chart analysis (daily and weekly K-bar charts)
- Instant messaging for trading discussions
- Alert notifications for custom trading conditions
- Kostolany Egg phase detection and visualization

## Recent Changes

**November 30, 2025 - Stock Screener Improvements:**
- Fixed sidebar toggle to work correctly within Stock Screener context
- Stock Screener now respects sidebar width and positions itself to the right
- Sidebar remains visible and interactive when Stock Screener is open
- Reduced header padding from h-12 to h-10 for more compact UI
- Added `initialHiddenColumns` prop to MatrixTable for customizable default column visibility
- Stock Screener MatrixTableWindow shows only 3 columns by default (index, code, change) to save canvas space

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript using Vite as the build tool

**UI System:** Material Design principles adapted for financial data density
- shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible component foundations
- Tailwind CSS for utility-first styling with custom design tokens

**Routing:** Client-side routing using Wouter (lightweight React router)

**State Management:**
- TanStack Query (React Query) for server state and data fetching
- Local component state with React hooks for UI state
- No global state management library (by design choice)

**Design Philosophy:**
- **Data-dense interface** optimized for professional traders
- **Information hierarchy** with critical signals immediately scannable
- **Typography:** Inter for UI/data tables, JetBrains Mono for stock codes/numbers
- **Color coding:** Red for bullish (non-standard), Green for bearish
- **Dark mode:** Default enabled, always-on preference

**Key UI Components:**
- MatrixTable: Sortable stock data grid with technical indicators
- ChartModal: Daily/weekly K-bar chart visualization
- TargetListCard: Customizable stock watchlists (6 lists)
- ChatInterface: Real-time messaging system
- AlertBuilder: Custom trading alert configuration
- MarketStatusBar: Live market status with scheduled events

### Backend Architecture

**Server Framework:** Express.js running on Node.js

**Build & Development:**
- TypeScript for type safety across client and server
- ESBuild for production server bundling
- Vite dev server with HMR in development

**API Design:**
- RESTful API pattern with `/api` prefix
- JSON request/response format
- Session-based approach (infrastructure present via connect-pg-simple)

**Storage Layer:**
- In-memory storage (MemStorage class) for development/testing
- Interface-based storage abstraction (IStorage) allowing easy swap to database
- User management with username/password schema defined

**Data Flow:**
- TWSE API integration planned (not yet implemented)
- Mock data generators for development (generateMainMatrix, generatePreviousMatrix)
- Real-time data updates expected for market hours

### Database & ORM

**ORM:** Drizzle ORM with PostgreSQL dialect

**Database Provider:** Neon serverless PostgreSQL (configured via @neondatabase/serverless)

**Schema Definition:**
- Users table with UUID primary keys, username/password fields
- Schema validation using drizzle-zod for type-safe operations
- Migrations managed via drizzle-kit in `/migrations` directory

**Current Schema:**
```typescript
users: {
  id: uuid (primary key, auto-generated)
  username: text (unique, not null)
  password: text (not null)
}
```

**Note:** The application currently uses in-memory storage. Database integration is configured but not actively used in the codebase. The storage interface allows seamless migration when needed.

### Project Structure

**Monorepo Layout:**
```
/client          - React frontend application
  /src
    /components  - Reusable UI components
    /pages       - Top-level route components
    /lib         - Utilities, mock data, query client
    /hooks       - Custom React hooks
/server          - Express backend
  index.ts       - Server entry point
  routes.ts      - API route registration
  storage.ts     - Storage interface & in-memory implementation
/shared          - Shared TypeScript types and schemas
  schema.ts      - Database schema definitions
/migrations      - Database migration files
```

**Module Resolution:**
- `@/*` → client/src
- `@shared/*` → shared directory
- `@assets/*` → attached_assets directory

### Authentication & Sessions

**Strategy:** Session-based authentication (configured but not fully implemented)

**Session Store:** PostgreSQL session store via connect-pg-simple

**User Model:** Username/password authentication with hashed passwords expected

**Current State:** User schema and storage interface exist, but authentication routes and middleware are not yet implemented

### External Dependencies

**Frontend Libraries:**
- React 18 with TypeScript
- TanStack Query for data fetching/caching
- Radix UI for accessible primitives
- shadcn/ui component system
- Wouter for routing
- date-fns for date manipulation
- Embla Carousel for carousel components

**Backend Dependencies:**
- Express.js web framework
- Neon serverless PostgreSQL driver
- Drizzle ORM with Zod validation
- WebSocket support via ws package

**Development Tools:**
- Vite for frontend build/dev server
- TypeScript compiler (tsc) for type checking
- ESBuild for server bundling
- Replit-specific plugins for development environment

**External APIs (Planned):**
- TWSE (Taiwan Stock Exchange) API for real-time market data
- Not yet integrated in current codebase

### Design System Specifications

**Color Scheme:**
- Bullish indicators: Red shades
- Bearish indicators: Green shades
- Phase badges: Gradient from green (Y/A-phases) to red (X/B-phases)

**Spacing:** Tailwind units (2, 4, 6, 8) for consistent padding/margins

**Typography Scale:**
- Page headers: text-2xl font-semibold
- Stock codes: text-sm font-mono uppercase
- Data cells: text-sm (monospace for numbers)

**Responsive Behavior:**
- Mobile breakpoint: 768px
- Sidebar: 16rem width (collapsible)
- Tables: Horizontal scroll on overflow