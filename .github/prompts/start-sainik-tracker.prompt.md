---
name: "start-sainik-tracker"
description: "Plan and implement the Sainik School phase-wise tracking MVP in controlled phases."
agent: "agent"
argument-hint: "Optionally specify a phase, for example: phase=1"
---

# Build the Sainik School Project Tracker

Read and follow these files before making changes:

- [Repository instructions](../copilot-instructions.md)
- [MVP scope](../../docs/MVP_SCOPE.md)
- [Implementation plan](../../docs/IMPLEMENTATION_PLAN.md)
- [Frontend instructions](../instructions/frontend.instructions.md)
- [Backend instructions](../instructions/backend.instructions.md)

The repository is for an in-house project tracking application.

The source workbook is:

`source-data/Sainik Phase wise Sheets.xls`

It contains Phase 1 and Phase 2 sanctioned items with product, quantity, unit price and total price information.

## Required architecture

Use:

- React + Vite + TypeScript + Tailwind CSS for the frontend
- Node.js + Express 5 + TypeScript for the backend
- MongoDB + Mongoose for persistence
- Zod for backend validation
- Axios + TanStack Query for frontend API state
- The `xlsx` package for the one-time legacy `.xls` import

Do not add authentication or non-MVP features.

## Working method

1. Inspect the repository and determine the first incomplete phase in `docs/IMPLEMENTATION_PLAN.md`.
2. Explain the current phase in no more than ten concise bullets.
3. List the files you will create or modify.
4. Implement only that phase.
5. Do not delete or rewrite valid existing work.
6. Use terminal commands when available to create, install, lint, type-check and build.
7. Fix all errors caused by your changes.
8. Update the implementation checklist.
9. End with:
   - completed work;
   - commands run and their result;
   - environment values the user must set;
   - the exact next prompt to continue.

## Phase boundaries

### Phase 1: Foundation

Create the monorepo foundation, frontend and backend applications, strict TypeScript, MongoDB connection, health API, frontend shell and common design tokens.

Do not create all business features during Phase 1.

### Phase 2: Database and import

Create Mongoose models and an idempotent script that imports both phase sheets from the legacy workbook.

The import must discover headers and sheet names robustly. Do not hardcode row numbers. Do not modify the workbook.

### Phase 3: Backend API

Create dashboard aggregation, phase list, item list, item detail and progress update endpoints with validation and central error handling.

### Phase 4: Frontend integration

Create the dashboard, phase-wise table, filters, pagination and progress update modal using the API.

### Phase 5: Hardening

Complete documentation, Docker Compose for MongoDB, empty/error/loading states and clean-state validation.

## Start now

Unless the user explicitly specifies another phase, begin with the first incomplete phase.

Do not merely provide sample code. Create the actual project files and verify the affected package builds.
