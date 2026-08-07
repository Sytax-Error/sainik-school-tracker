# Sainik School Project Tracker — Implementation Plan

Copilot must update this checklist after each completed phase.

## Phase 1 — Foundation

- [x] Create root project structure.
- [x] Create frontend with React, Vite and TypeScript.
- [x] Create backend with Express and TypeScript.
- [x] Configure linting and strict TypeScript.
- [x] Add root development documentation.
- [x] Add backend environment validation.
- [x] Add MongoDB connection.
- [x] Add health endpoint.
- [x] Add basic frontend app shell and routes.
- [x] Add shared frontend design tokens.
- [x] Verify frontend and backend type-check/build.

## Phase 2 — Database and workbook import

- [x] Create Project model.
- [x] Create Phase model.
- [x] Create Item model.
- [x] Add shared status constants.
- [x] Create legacy XLS parsing helpers.
- [x] Implement idempotent workbook import.
- [x] Seed one project and two phases (Phase -1 and Phase -2).
- [x] Seed 107 items total (93 in Phase -1, 14 in Phase -2, only qty > 0).
- [x] Verify repeated seed runs do not duplicate data.
- [x] Document seed command and output.

## Phase 3 — Backend API

- [x] Add standard API response utilities.
- [x] Add error classes and error middleware.
- [x] Add Zod validation.
- [x] Implement current project endpoint.
- [x] Implement dashboard aggregation endpoint.
- [x] Implement phase list endpoint.
- [x] Implement item list endpoint with filters and pagination.
- [x] Implement single item endpoint.
- [x] Implement progress update endpoint.
- [x] Verify API manually with sample requests.
- [x] Verify backend lint, type-check and build.

## Phase 4 — Frontend feature integration

- [x] Configure Axios API client.
- [x] Configure TanStack Query.
- [x] Build dashboard summary.
- [x] Build phase navigation.
- [x] Build item table.
- [x] Add search, status filter, sorting and pagination.
- [x] Build item progress update modal.
- [x] Add validation and API error feedback.
- [x] Refresh related queries after update.
- [x] Verify responsive desktop/tablet layout.
- [x] Verify frontend lint, type-check and build.

## Phase 5 — MVP hardening

- [ ] Add clear README setup steps.
- [ ] Add `.env.example` files.
- [ ] Add MongoDB Docker Compose option.
- [ ] Add loading, empty and error states.
- [ ] Verify Indian currency formatting.
- [ ] Verify value-weighted progress calculations.
- [ ] Verify workbook remains unmodified.
- [ ] Run complete local setup from a clean state.
- [ ] Record known limitations and next-phase ideas.
