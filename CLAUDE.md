# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CHESSA is a full-stack jewelry retail management system with multi-location support. It consists of:
- **Admin Panel**: React + TypeScript + Vite + shadcn/ui (`chessa-admin-panel/`)
- **Backend API**: Node.js + TypeScript + Express + PostgreSQL + Prisma (`chessa-backend/`)
- **Shop Frontend**: Next.js + TypeScript + shadcn/ui (`chessa-shop/`) - Customer-facing e-commerce (in development)
- **Deployment**: Docker containers with GitHub Actions CI/CD

## Development Commands

### Quick Start (Full Stack)
```bash
# Start complete development environment
docker-compose up -d

# Or manually start both services:
cd chessa-backend && npm run dev &
cd chessa-admin-panel && npm run dev
```

### Backend Commands (chessa-backend/)
```bash
npm run dev              # Development server with hot reload
npm run build           # Build for production
npm run start           # Run production build
npm run db:migrate      # Run Prisma migrations
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio
npm run lint            # ESLint
npm run type-check      # TypeScript compilation check
npm run format          # Format code with Prettier
npm test                # Run Jest tests (configured but no tests yet)
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate test coverage reports
```

### Frontend Commands (chessa-admin-panel/)
```bash
npm run dev             # Vite development server
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # ESLint
npm run type-check      # TypeScript compilation check
```

### Shop Frontend Commands (chessa-shop/)
```bash
npm run dev             # Next.js development server
npm run build           # Production build
npm run start           # Run production server
npm run lint            # ESLint
```

### Docker Commands
```bash
docker-compose up -d                    # Start all services in background
docker-compose down                     # Stop all services
docker-compose logs -f [service-name]   # View logs
docker-compose exec backend bash       # Access backend container
```

## Architecture Overview

### Backend Architecture (3-Layer Pattern)
```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── models/          # Prisma schema types
├── middleware/      # Express middleware
├── routes/          # API route definitions
└── utils/           # Shared utilities
```

### Frontend Architecture
```
src/
├── components/      # Reusable UI components
├── pages/          # Route-based page components
├── hooks/          # Custom React hooks
├── services/       # API integration
├── utils/          # Frontend utilities
└── types/          # TypeScript type definitions
```

### Database Schema (Key Entities)
- **Users**: Authentication and roles
- **Items**: Jewelry products with gold calculations
- **Categories**: Hierarchical product categorization
- **Locations**: Multi-store inventory management
- **Orders**: Sales and special orders workflow
- **Customers**: Customer management with rewards

## Business Domain Rules

### Jewelry-Specific Calculations
- Gold pricing based on current market rates
- Weight calculations with purity adjustments
- Dynamic pricing for custom jewelry
- Inventory tracking by location and purity

### Multi-Location Management
- Each item can have different stock levels per location
- Location-specific pricing and promotions
- Transfer tracking between locations

### Customer Rewards System
- Points-based loyalty program
- Tier-based discounts and benefits
- Special order workflow with deposits and timeline tracking

## Development Patterns

### API Integration
- Use React Query for all API calls in frontend
- Centralized API client in `services/api.ts`
- Type-safe requests/responses with shared TypeScript types

### Error Handling
- Backend: Centralized error middleware with structured responses
- Frontend: React Query error boundaries with user-friendly messages
- Database: Prisma error handling with transaction rollbacks

### Authentication Flow
- JWT with refresh token rotation
- Role-based access control (Admin, Manager, Employee)
- Protected routes on both frontend and backend

### Form Validation
- Backend: Joi schema validation middleware
- Frontend: React Hook Form with Zod schema validation
- Shared validation schemas where possible

## Common Development Tasks

### Adding New Features
1. **Backend**: Create controller → service → repository layers
2. **Database**: Add Prisma migration if schema changes needed
3. **Frontend**: Create components → hooks → API integration
4. **Types**: Update shared TypeScript interfaces

### Database Changes
```bash
# After modifying schema.prisma:
npx prisma migrate dev --name descriptive_name
npx prisma generate
npm run db:seed  # If seed data needs updating
```

### Testing Strategy
- Jest configured for backend unit/integration tests
- Frontend testing setup ready but not implemented
- Manual testing workflow documented in individual project READMEs
- Path alias support (`@/` mapped to `src/` directory)
- Coverage collection excludes test files and server.ts
- Test environment set to Node.js

### API Documentation
- Swagger/OpenAPI available at `/api-docs` endpoint when server is running
- Auto-generated from TypeScript files in routes, controllers, and DTOs
- JWT Bearer authentication configured in Swagger UI
- Interactive API testing available through Swagger interface

### Debugging Common Issues
- **CORS errors**: Check backend middleware configuration
- **Database connection**: Verify `.env` variables and PostgreSQL status
- **Build failures**: Run type-check first, then lint
- **Authentication issues**: Check JWT token expiration and refresh logic

## Environment Configuration

### Required Environment Variables (Backend)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3001
NODE_ENV=development
```

### Development Database Setup
```bash
# Using Docker (recommended):
docker-compose up -d postgres

# Default PostgreSQL credentials (change in production!):
# Database: chessa_crm
# User: chessa_user  
# Password: changeme

# Or local PostgreSQL:
createdb chessa_dev
# Update DATABASE_URL in .env
```

## Code Style Guidelines

### TypeScript Standards
- Strict TypeScript configuration enabled
- Prefer interfaces over types for object shapes
- Use Prisma-generated types for database entities
- Custom types in dedicated `types/` directories

### Component Patterns (Frontend)
- Functional components with hooks
- Props interfaces defined inline for simple components
- Separate files for complex component types
- shadcn/ui components for consistent styling

### API Design (Backend)
- RESTful endpoints with consistent naming
- Standardized response format: `{ data, message, success }`
- Comprehensive error responses with status codes
- Request/response logging middleware

## Production Considerations

### Database Performance
- PostgreSQL connection pooling: 10-20 connections for web applications
- Transaction handling with automatic rollbacks on error
- Prepared statements for all queries (via Prisma)
- Index optimization for frequently queried fields

### Batch Operations
- Inventory batch upload endpoint: `POST /api/inventory/batch`
- CSV format with example file in `chessa-backend/examples/`
- Support for up to 1000 items per batch
- Validation and error reporting for each row

## Security Practices

### Input Validation
- All API endpoints use Joi validation middleware
- Frontend forms use Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection with content security policies

### Authentication Security
- JWT tokens with short expiration (15 minutes)
- Refresh token rotation on each use
- Password hashing with bcrypt
- Rate limiting on authentication endpoints

## Deployment

### GitHub Actions CI/CD
- Automated testing and linting on PR
- Docker image building and pushing
- Staging and production deployment workflows
- Environment-specific configuration management

### Docker Configuration
- Multi-stage builds for optimized images
- Health checks for container monitoring
- Volume mounting for persistent data
- Network isolation between services
- PostgreSQL 16 Alpine with automatic health checks
- Persistent volume: `postgres_data:/var/lib/postgresql/data`