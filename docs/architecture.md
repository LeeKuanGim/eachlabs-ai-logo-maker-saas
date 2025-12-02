# Architecture Overview

## System Architecture

LogoLoco is a modern monorepo SaaS application built with a clear separation between the Next.js frontend and Hono API backend. The architecture supports independent scaling of web and API components while maintaining clean API boundaries with Zod validation and efficient AI integration.

### High-Level Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Next.js Web   │─────▶│   Hono API      │─────▶│  Eachlabs API   │
│   (port 3000)   │      │   (port 3002)   │      │   (external)    │
└─────────────────┘      └────────┬────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         │   (Drizzle)     │
                         └─────────────────┘
```

### Component Breakdown

| Component | Technology | Purpose |
|-----------|------------|---------|
| Web Frontend | Next.js 15.5, React 19 | User interface and interaction |
| API Backend | Hono + Bun runtime | Business logic and API endpoints |
| Authentication | Better Auth | User sessions and credentials |
| Database | PostgreSQL + Drizzle ORM | Data persistence |
| AI Integration | Eachlabs API | Logo generation |
| Styling | Tailwind CSS 4.x, shadcn/ui | UI components and styling |

## Monorepo Structure

The application uses Turborepo with Bun workspaces for efficient dependency management and build processes:

```
/
├── apps/
│   ├── web/                          # Next.js frontend
│   └── api/                          # Hono API server
├── docs/                             # Documentation
├── node_modules/                     # Shared dependencies
├── package.json                      # Root workspace config
├── turbo.json                        # Turborepo configuration
└── tsconfig.base.json                # Shared TypeScript configuration
```

## Key Design Patterns

### 1. Separation of Concerns
- Frontend handles user interface and client-side interactions
- Backend manages business logic, authentication, and external API integrations
- Database layer provides persistence and data access abstractions

### 2. API-First Architecture
- All data flows through well-defined API endpoints
- Frontend communicates with backend via RESTful APIs
- Clear contract between frontend and backend components

### 3. Event-Driven Processing
- Logo generation is an asynchronous process
- Frontend polls for status updates using a 2-second interval
- 5-minute timeout prevents hung requests

### 4. Modular Component Architecture
- Frontend components are organized by feature and shared utilities
- Backend routes are separated by functionality
- Database schemas are organized by domain

## Scalability Considerations

### Current Strengths
- Turbopack optimization for Next.js builds
- Efficient polling mechanism with 2-second intervals
- 5-minute timeout prevents hung requests
- Bun runtime for fast API responses
- PostgreSQL connection pooling

### Potential Bottlenecks
- Synchronous polling could be optimized with WebSockets
- No caching of prediction status
- No CDN integration for static assets
- No request queuing for high-volume scenarios

## Technology Stack

### Frontend Technologies
- **Framework**: Next.js 15.5 with App Router
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x with shadcn/ui components
- **State Management**: React Hook Form with Zod validation
- **Package Manager**: Bun

### Backend Technologies
- **Framework**: Hono
- **Runtime**: Bun
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **API Client**: Eachlabs API integration

### Infrastructure
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Package Manager**: Bun
- **Build System**: Turborepo