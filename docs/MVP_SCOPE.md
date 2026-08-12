# Sainik School Project Tracker — MVP Scope

## Goal

Replace manual phase-wise progress tracking with one central in-house web application backed by MongoDB.

The first release should be useful quickly. It is not intended to solve every future workflow.

## Source data

The initial sanctioned items come from:

`source-data/Sainik Phase wise Sheets.xls`

The workbook contains two phase sheets and sanction details such as item name, quantity, unit price and total price.

The workbook is imported once through a backend script. Users do not upload spreadsheets through the application.

## Users

For the MVP, the application is used inside the organization and does not include login or roles.

Access control can be handled by the internal network or deployment environment until application authentication is added later.

## Core user flow

1. Open the dashboard.
2. Review overall and phase-wise progress.
3. Open Phase 1 or Phase 2.
4. Search or filter sanctioned items.
5. Select an item.
6. Update progress percentage, status, optional quantity details and remarks.
7. Save the update.
8. See dashboard and phase summaries refresh.

## Dashboard requirements

- Total sanctioned value
- Overall value-weighted progress
- Total items
- Status counts
- Phase 1 value and progress
- Phase 2 value and progress
- Recently updated items
- On-hold items requiring attention

## Phase tracker requirements

- Product name
- Sanctioned quantity
- Unit price
- Total price
- Progress percentage
- Status
- Last update date
- Update action
- Search
- Status filter
- Pagination
- Sorting

## Item update requirements

Read-only sanction details:

- Product
- Phase
- Sanctioned quantity
- Unit price
- Total price

Editable tracking details:

- Progress percentage
- Status
- Delivered quantity, optional
- Installed quantity, optional
- Tested quantity, optional
- Accepted quantity, optional
- Remarks

## Out of scope

- Authentication
- Roles and permissions
- Multiple projects
- Documents and attachments
- Approvals
- Notifications
- Vendors
- Reports and exports
- Audit history
- Real-time collaboration
- Mobile app
