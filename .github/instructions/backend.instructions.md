---
name: "Sainik Tracker Backend"
description: "Express, MongoDB, Mongoose and import rules for the Sainik School project tracker backend."
applyTo: "backend/**/*.ts"
---

# Backend Instructions

Apply the repository-wide instructions in `../copilot-instructions.md`.

## Architecture

Use this structure:

```text
backend/src/
├── config/
├── controllers/
├── errors/
├── middleware/
├── models/
├── routes/
├── scripts/
├── services/
├── types/
├── utils/
├── validators/
├── app.ts
└── server.ts
```

Responsibilities:

- Routes define paths and middleware order.
- Validators parse and validate request input.
- Controllers translate HTTP requests and responses.
- Services contain business logic and database operations.
- Models define MongoDB persistence.
- Middleware handles errors, not-found routes and shared request concerns.
- Scripts contain the workbook import and seed workflow.

Do not put database queries directly in route files.

## Runtime and modules

- Use ECMAScript modules.
- Use strict TypeScript.
- Use `tsx` for development.
- Compile with `tsc`.
- Keep import paths and module resolution compatible with the selected TypeScript configuration.
- Use async/await.
- Do not use callback-style Mongoose APIs.

## Environment

Create `backend/.env.example` with:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sainik_tracker
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
SOURCE_WORKBOOK_PATH=../source-data/Sainik Phase wise Sheets.xls
```

Validate required environment values at startup. Fail with a clear error when configuration is invalid.

## Express setup

Use:

- `express.json()` with a sensible size limit
- CORS configured from `CORS_ORIGIN`
- Helmet
- Request logging appropriate for development
- `/api/v1/health`
- API routes
- Not-found middleware
- Central error middleware

Do not add JWT, sessions or authentication middleware in the MVP.

## Mongoose models

Use explicit schemas with timestamps and useful indexes.

### Project

Create one current project seeded by the import workflow.

Suggested fields:

```text
name
sanctionNumber
description
status
```

### Phase

Suggested fields:

```text
projectId
name
phaseNumber
sourceSheetName
```

Indexes:

- projectId
- unique compound index on projectId and phaseNumber

### Item

Suggested fields:

```text
projectId
phaseId
productName
sanctionedQty
unitPricePaise
totalPricePaise
deliveredQty
installedQty
testedQty
acceptedQty
progressPercent
status
remarks
sourceSheetName
sourceRowNumber
sourceKey
```

Indexes:

- projectId and phaseId
- phaseId and status
- text or case-insensitive search support for productName
- unique sourceKey

For optional quantity fields, prefer `null` when the field is not applicable or has never been entered. Do not confuse `null` with a confirmed quantity of zero.

Use schema validation in addition to Zod request validation.

## Request validation

Use Zod schemas for:

- MongoDB ObjectId parameters
- Phase item query parameters
- Progress update payload

Coerce query string numbers safely.

Reject unknown or forbidden sanction fields in the update payload. A progress update must never modify:

- productName
- sanctionedQty
- unitPricePaise
- totalPricePaise
- projectId
- phaseId
- source fields

Use partial updates, but require at least one allowed tracking field.

## Progress update rules

Validate:

- `progressPercent`: integer, 0–100
- `status`: one allowed enum value
- quantity fields: non-negative and no greater than sanctioned quantity
- `remarks`: trimmed and length-limited

Apply sequence checks only when both related values are non-null:

```text
acceptedQty <= testedQty
testedQty <= installedQty
installedQty <= deliveredQty
```

Do not automatically overwrite a user-entered progress percentage based on quantity fields.

Recommended status consistency:

- When progress is 100, status should normally be `completed`.
- When status is `completed`, progress should be 100.
- When status is `not_started`, progress should normally be 0.

Enforce the completed relationship. For other statuses, return a validation error only for clearly contradictory values.

## Dashboard service

Use MongoDB aggregation to return:

- totalSanctionedValuePaise
- overallProgressPercent
- totalItems
- statusCounts
- per-phase sanctioned value
- per-phase progress
- per-phase status counts
- recently updated items
- attention-needed items such as `on_hold`

Use value-weighted progress. Avoid loading every item into application memory solely to calculate dashboard totals.

## List items service

Support:

- `search`
- `status`
- `page`
- `limit`
- `sortBy`
- `sortOrder`

Default:

```text
page=1
limit=20
sortBy=productName
sortOrder=asc
```

Restrict sortable fields to an allowlist. Escape or safely handle user search input.

Return lean objects when Mongoose document methods are not required.

## Workbook import

Use the `xlsx` package in a TypeScript script.

The script must:

1. Connect to MongoDB.
2. Load the workbook from `SOURCE_WORKBOOK_PATH`.
3. Locate phase 1 and phase 2 sheets using normalized names.
4. Locate each sheet's real header row.
5. Convert rows to normalized import records.
6. Create or reuse the current project.
7. Upsert the two phases.
8. Upsert valid items using `sourceKey`.
9. Print a summary.
10. Close the MongoDB connection even when an error occurs.

Keep parsing helpers separate and testable:

```text
normalizeText
normalizeHeader
parseMoneyToPaise
parseQuantity
findHeaderRow
resolveHeaderIndexes
parsePhaseNumber
buildSourceKey
```

Do not hardcode workbook row numbers.

## Error handling

Create typed application errors such as:

- ValidationError
- NotFoundError
- ConflictError
- DatabaseError

The central error middleware must:

- avoid exposing stack traces in production;
- return the standard error response;
- log contextual details;
- handle malformed MongoDB ObjectIds;
- handle duplicate key errors;
- handle Zod errors.

Do not catch errors only to rethrow them without adding value.

## API behavior

Controllers must be thin.

Examples:

- Project current endpoint returns the single seeded project.
- Dashboard endpoint returns computed summary data.
- Phase list endpoint includes each phase's summary.
- Item list returns pagination metadata.
- Update endpoint returns the updated item.

Use `204` only when there is intentionally no response body. Otherwise return JSON consistently.

## Seed and scripts

Add package scripts similar to:

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/server.js",
  "typecheck": "tsc -p tsconfig.json --noEmit",
  "lint": "eslint .",
  "seed": "tsx src/scripts/importSanctionWorkbook.ts"
}
```

The seed script must be safe to run multiple times.

## Logging

Use the centralized `logger` utility from `src/utils/logger.ts` for all application logging.

### Logger Features

- **Structured JSON output** in production, pretty-printed in development
- **Log levels**: debug, info, warn, error
- **File-based persistence** with daily rotation (Winston + winston-daily-rotate-file)
- **Specialized tracking methods**:
  - `trackOperation(operation, details)` — business operations
  - `trackRecordChange(recordType, recordId, action, changes)` — audit trail for record modifications
  - `trackApiRequest(method, path, statusCode, durationMs, userId)` — API request logging
  - `trackImport(phase, itemsProcessed, itemsCreated, itemsUpdated, itemsSkipped)` — workbook import tracking

### Log Files (with volume mount `./backend/logs:/app/logs`)

| File | Retention | Purpose |
|------|-----------|---------|
| `application-YYYY-MM-DD.log` | 30 days | All logs |
| `error-YYYY-MM-DD.log` | 30 days | Errors only |
| `audit-YYYY-MM-DD.log` | 90 days | Record changes (audit trail) |

### Usage in Controllers

```typescript
import { logger } from "../utils/logger.js";

// Log operations
logger.trackOperation("get_dashboard", { projectCode: "SAINIK", totalItems: 102 });

// Log record changes (audit trail)
logger.trackRecordChange("Item", itemId, "progress_update", {
  progressPercent: updatedItem.progressPercent,
  status: updatedItem.status,
  deliveredQty: updatedItem.deliveredQty,
  remarks: updatedItem.remarks,
});

// Log errors with context
logger.error("Failed to update item", { itemId }, error);
```

### Request Logging Middleware

The `requestLogger` middleware (`src/middleware/requestLogger.ts`) automatically logs all API requests with method, path, status code, and duration.

### ESLint Compliance

The logger uses `console.warn` for info/debug and `console.error` for warn/error to comply with the `no-console` rule (only warn/error allowed).
