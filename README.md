# Warehouse Management System (WMS)

A warehouse-management application built around operational workflows: managing warehouses and storage locations, receiving goods, processing requests, tracking inventory movements, and recording user actions.

## Current domain model

The backend schema includes:

- Users and role-based access (administrator, warehouse manager, receiver, warehouse operator)
- Warehouses, zones, and storage locations
- Products and inventory
- Requests and operational tasks
- Receiving workflows, boxes, and inventory movements
- Audit records for important actions

The project is under active development. The repository describes the current implementation and should not be treated as a production deployment guide.

## Tech stack

- **Backend:** Node.js, TypeScript, NestJS
- **Frontend:** React, TypeScript, Vite
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, Passport, bcrypt
- **Infrastructure:** Docker Compose, Redis service

## Run locally with Docker

Requirements: Docker Engine and Docker Compose.

1. Clone the repository.
2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

3. Replace `JWT_SECRET` with a long, random value. The database and Redis hostnames in the example match the Compose service names.
4. Start the application:

   ```bash
   docker compose up --build
   ```

Development URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Stop the services with `docker compose down`. Add `-v` only if you also want to delete the local database and Redis volumes.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` | Redis service hostname |
| `REDIS_PORT` | Redis service port |
| `PORT` | Backend HTTP port |
| `JWT_SECRET` | Secret used to sign JWTs |

Never commit `.env` or real credentials. Use `.env.example` as a template.

## Project structure

- `backend/` — NestJS API, Prisma schema and migrations
- `frontend/` — React application
- `compose.yml` — local development services

This project is a work in progress and is not presented as a production-ready WMS.
