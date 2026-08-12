# Known Limitations & Next Phase Ideas

## Known Limitations

### 1. Data Model
- **Duplicate items across phases**: 5 items exist in both Phase 1 and Phase 2 with different quantities. Dashboard shows unique count (102) but phase breakdown shows per-phase counts (93 + 14 = 107). This is by design but may confuse users.
- **No audit trail**: Item progress updates don't track history (who changed what, when).
- **No user authentication/authorization**: All endpoints are public.

### 2. API
- **No pagination on dashboard/phases endpoints**: Returns all data at once.
- **No filtering on phases endpoint**: Can't filter phases by status or progress.
- **Progress update is PATCH but not fully RESTful**: Could use PUT for full replacement.

### 3. Frontend
- **No real-time updates**: Uses TanStack Query polling/invalidation, not WebSockets.
- **No offline support**: Requires constant network connection.
- **Limited accessibility**: Basic ARIA labels missing on some interactive elements.
- **No dark mode**: Only light theme implemented.

### 4. Data Import
- **Workbook parsing is fragile**: Relies on specific column names with NBSP characters.
- **No validation of imported data**: Assumes workbook structure is correct.
- **Single project only**: Hardcoded to "SAINIK" project code.

### 5. Testing
- **No unit tests**: Only manual verification.
- **No integration tests**: API endpoints not automatically tested.
- **No E2E tests**: Critical user flows not automated.

### 6. Deployment
- **No CI/CD pipeline**: Manual build and deploy.
- **No production Dockerfile**: Only docker-compose for MongoDB.
- **No environment-specific configs**: Single .env.example for all environments.

## Next Phase Ideas (Phase 6+)

### Phase 6: Authentication & Authorization
- [ ] Add JWT-based authentication
- [ ] Role-based access control (Admin, Viewer, Editor)
- [ ] User management UI
- [ ] Audit logging for all changes

### Phase 7: Enhanced Data Management
- [ ] Item history/timeline view
- [ ] Bulk import/export (CSV, Excel)
- [ ] Data validation rules
- [ ] Phase/item templates

### Phase 8: Reporting & Analytics
- [ ] PDF/Excel report generation
- [ ] Custom date range filters
- [ ] Progress trend charts
- [ ] Export dashboard as image

### Phase 9: Collaboration
- [ ] Comments on items
- [ ] Notifications (email, in-app)
- [ ] Activity feed
- [ ] @mentions

### Phase 10: Advanced Features
- [ ] WebSocket real-time updates
- [ ] Offline mode with sync
- [ ] Mobile-responsive improvements
- [ ] Dark mode
- [ ] Multi-project support
- [ ] Custom fields on items

### Technical Debt
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add integration tests (Supertest)
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Add production Dockerfiles
- [ ] Add monitoring/logging (Sentry, Winston)
- [ ] Add API documentation (OpenAPI/Swagger)
- [ ] Performance optimization (React.memo, virtualization for large lists)