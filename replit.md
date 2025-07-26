# Overview

This is a full-stack web application built with React, TypeScript, Express.js, and Drizzle ORM. The application appears to be a comprehensive dashboard interface featuring data analytics, smart home controls, productivity tools, and interactive components including a tic-tac-toe game, mood tracker, and todo manager.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless adapter
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-based session store

## Key Components

### Database Layer
- **Schema**: Defined in `shared/schema.ts` with user table structure
- **Migrations**: Managed through Drizzle Kit in `./migrations` directory
- **Storage Interface**: Abstracted through `IStorage` interface with in-memory implementation for development

### UI Components
- **Component Library**: Comprehensive set of reusable UI components in `client/src/components/ui/`
- **Dashboard Components**: Specialized dashboard widgets including metrics, charts, notifications, and interactive games
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Business Logic
- **Smart Home Integration**: Mock data for weather, energy usage, and device management
- **Productivity Tools**: Todo management, mood tracking, and quote widget
- **Interactive Games**: Tic-tac-toe with AI opponent
- **Real-time Features**: Simulated real-time data updates and notifications

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express.js routes handle HTTP requests with `/api` prefix
3. **Storage Layer**: Abstract storage interface allows switching between implementations
4. **Database Operations**: Drizzle ORM provides type-safe database interactions
5. **Real-time Updates**: Client-side polling and state management for live data

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database toolkit
- **express**: Web application framework
- **react**: Frontend framework
- **wouter**: Lightweight routing

### UI Dependencies
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Variant-based component styling

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite middleware integrated with Express for seamless development
- **Type Checking**: Incremental TypeScript compilation
- **Error Handling**: Runtime error overlay for development debugging

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Environment-based PostgreSQL connection with migration support

### Environment Configuration
- **Database**: `DATABASE_URL` environment variable for PostgreSQL connection
- **Deployment**: Supports both development and production environments
- **Session Management**: PostgreSQL-backed sessions with configurable settings

The application is designed to be easily deployable on platforms like Replit, with automatic asset serving and proper environment detection for development vs. production modes.