# Design Analysis and Architecture

## Source

The design source is `figmaDesigns.pdf` at the workspace root. It contains 58 pages. The PDF is a static export rather than a clickable prototype; controls are implemented from their visible affordances. It provides desktop layouts but no mobile frames, so mobile behavior is responsive inference.

## Screen Inventory

| PDF pages | Design area | Application route or implementation |
| --- | --- | --- |
| 1-6, 13-14, 20-25, 37-41 | Training programs, create/edit, learning plans, review/publish, content modules | `/programs`, `/programs/create`, `/programs/:programId`, `/programs/:programId/content`, and Training workspace tabs |
| 7, 12, 15-19, 32 | HR dashboard, activity, pending assignments, training today, skill gaps, detail panels | `/` and `/training` |
| 42-44 | Employee directory, profile, employee actions | `/employees` and `/employees/:employeeId`; quick actions are integrated into the profile workflow |
| 46-48 | Examination list, schedule form, results | `/exams` and `/exams/:examId/results` |
| 49-50 | Report catalog and training completion | `/reports` and `/reports/training-completion` |
| 51-58 | Settings index and general, user/role, security, notification, training, examination, certificate settings | `/settings` with seven settings tabs |
| 29-30, 35-36, 45 | Typography, radii, effects, component states, admin palette | CSS tokens and shared UI styles |
| 31 | Public learning platform landing page | `/learn` |

Pages with isolated icons or blank component exports are treated as visual references, not standalone routes.

## Design Tokens

- Typeface: Open Sans, weights 400, 600, 700, 800.
- Admin UI: light blue-gray canvas, white work surfaces, slate-blue sidebar, compact typography, thin borders, bright blue actions.
- Public site: navy `#132A56`, teal `#176789`, dark sections, bright mint accent, larger display hierarchy.
- Status colors: success `#109D58`, error `#F44336`, warning `#F59E0B`.
- Radius scale: 8, 10, 12, 16, 20, 24, 28, and 99px.
- Elevation and gradient references are encoded in the public and admin styles; admin panels remain mostly flat and compact.

The PDF uses slightly different grays between its palette sheet and screen captures. The application follows the screen captures for the admin shell and keeps public-site tokens separate.

## Architecture

- `app/`: browser router, app providers, and shared shell.
- `components/shared/`: page headings, buttons, panels, status badges, and the generic TanStack Table adapter.
- `features/`: dashboard, training, programs, employees, exams, reports, settings, and landing pages; each owns its types, API, hooks, and schemas as needed.
- `features/platform-admin/`: platform access, organization lifecycle, dashboard, registration, details, and audit history.
- `services/api/`: Axios instance, endpoints, and normalized errors.
- `services/mock/`: MSW browser worker, handlers, and mock REST data.
- Server state uses TanStack Query; forms use React Hook Form and Zod. No global client store is required for the implemented flows.

## Interaction Coverage

Search, status/department filters, sorting, pagination, program create/edit/delete, four-step program creation, program publishing, content module creation, employee creation/profile navigation, exam scheduling/results, assignment approval/rejection, attendance marking, skill-gap review, learning-plan creation, report filtering/export, and settings/user-role editing use shared state and mock API services.

The Platform Super Admin portal is mounted at `/platform` behind a separate `/auth/me` role query and a `PLATFORM_SUPER_ADMIN` UI route guard. The organization list uses server-side mock filtering, sorting, and pagination; lifecycle transitions are centralized and audit history is written by the mock API. The mock `/auth/me` response grants the platform role for local development only. This client guard is not a security boundary: production API authorization must independently enforce platform-level permissions.

The browser preview used for implementation did not activate its registered service worker. In that preview, mock API requests returned 404 and data-driven pages showed their loading/error states. A service-worker-capable browser is required to verify MSW interception end to end; the Axios/MSW contracts compile and are configured for normal browser use.