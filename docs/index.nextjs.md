# LogoLoco - Project Documentation

This document provides a high-level overview of the LogoLoco AI logo generation platform. For detailed information about specific aspects of the application, please refer to the specialized documentation files listed below.

## Project Overview

LogoLoco is a **SaaS AI-powered logo generation application** that allows users to create professional logos for their businesses using multiple AI models. Built with Next.js and Hono, it features a modern monorepo architecture with clean separation between frontend and backend components.

### Key Features
- Multi-model AI logo generation (3 models: Nano Banana, Seedream v4, Reve Text)
- Real-time generation status tracking with polling
- Color-based logo generation with gradient support
- Batch image generation (up to 4 images at once; 1 credit per output)
- Download functionality for generated logos
- Database persistence of generation history (auth-required access)
- Better Auth-backed sessions (email + anonymous); 1 free signup credit

### Architecture Overview
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

## Detailed Documentation Sections

For comprehensive information about each aspect of the application, see the following specialized documents:

### System Architecture
- [Architecture Overview](architecture.md) - High-level system architecture and design patterns
- [Frontend Documentation](frontend.md) - Next.js application, components, and UI patterns
- [Backend Documentation](backend.md) - Hono API server, middleware, and routes
- [Database Documentation](database.md) - Schema, queries, and data management
- [Authentication Documentation](authentication.md) - Better Auth integration and user management

### API and Integration
- [API Reference](api-reference.md) - Complete API endpoints documentation
- [External Service Integrations](eachlabs/) - Eachlabs AI API integration details
- [Payment Processing](polar-sh/) - Polar payment system integration

### Development and Deployment
- [Deployment Guide](deployment.md) - Environment setup and deployment configurations
- [Monorepo Management](turborepo/) - Turborepo and workspace management
- [ORM Documentation](drizzle-orm/) - Drizzle ORM usage and patterns

### Additional Resources
- [Product Requirements](logoloco-PRD.md) - Product requirements and user stories
- [API Registry](api-registry.md) - Original API documentation

## Technology Stack

### Frontend Technologies
- **Framework**: Next.js 15.5 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x with shadcn/ui components
- **Form Handling**: React Hook Form 7.x with Zod validation
- **API Client**: TanStack Query for data fetching

### Backend Technologies
- **Framework**: Hono
- **Runtime**: Bun
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Drizzle ORM

### Infrastructure
- **Package Manager**: Bun
- **Build System**: Turborepo
- **ORM**: Drizzle