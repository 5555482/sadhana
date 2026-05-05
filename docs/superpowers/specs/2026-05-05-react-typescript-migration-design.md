# React TypeScript Migration Design

## Goal

Replace the current Yew frontend with a mobile-first React/TypeScript frontend while keeping the Rust Actix/Diesel backend as the functional source of truth.

The migration will use a single big cutover: the React app must reach feature parity with the existing Yew app before it replaces the current frontend build.

## Current Context

The app is a Rust workspace with three members:

- `server`: Actix Web backend with Diesel/Postgres, JWT authentication, email utilities, embedded migrations, and static file serving from `./dist`.
- `frontend`: Yew/Trunk frontend with routes for diary entry, auth, charts, reports, user practices, yatras, settings, sharing, import, i18n, PWA assets, and service worker support.
- `common`: small shared Rust crate used by the backend and Yew frontend.

The backend already exposes the application API under `/api` and serves SPA assets from `dist` with fallback to `index.html`. The React frontend can preserve this deployment model by producing Vite build output into the same static asset location used by the server.

The deleted `static-react/` tree is intentionally ignored for this migration design.

## Product Direction

The new frontend should use the migration as a chance to redesign workflows and UI, not merely translate Yew components into React.

The primary daily workflow is quick diary entry on mobile:

1. Open the app.
2. Land on today's diary.
3. See required and optional practices clearly.
4. Enter values with touch-friendly controls.
5. Save with clear feedback.
6. Leave without needing to navigate through dashboards.

Charts, yatras, settings, sharing, import, language, support, registration, and password reset remain required for feature parity, but they should not compete with daily diary entry as the main home experience.

## Recommended Approach

Build a new React/TypeScript Vite frontend against the existing backend API.

The backend API and database model should stay stable during the first migration. Backend changes should be limited to:

- static asset/build wiring needed to serve the React app;
- CORS or local development configuration if needed;
- small compatibility fixes if an existing endpoint prevents a good React implementation;
- optional server-side tests around routes that are risky to depend on.

Do not introduce a hybrid Yew/React runtime. Do not launch a partial React app. The cutover happens only after React covers the existing functional surface.

## Frontend Architecture

The React app should be organized by product features rather than by technical layer alone.

Proposed structure:

- `src/app`: router, top-level providers, app shell, protected route handling.
- `src/api`: typed API client, auth token handling, error normalization, endpoint modules.
- `src/components/ui`: accessible reusable controls such as buttons, inputs, dialogs, menus, tabs, toasts, date controls, empty states, and loading states.
- `src/features/auth`: login, registration link request, registration with confirmation ID, password reset request and confirmation.
- `src/features/diary`: daily diary screen, practice value inputs, date navigation, incomplete-days indicators, save state, offline/cache-aware behavior.
- `src/features/practices`: user practice list, create/edit/delete, required practice settings, ordering, dropdown practice configuration.
- `src/features/charts`: private charts, shared charts, report creation, graph editor, grid editor.
- `src/features/yatras`: yatra list, create/join/leave, yatra settings, admin settings, yatra practice edit/create, user-practice mapping.
- `src/features/settings`: settings home, edit user, edit password, language selection, import, help, support form.
- `src/i18n`: English, Russian, and Ukrainian translations.
- `src/pwa`: service worker registration, app update handling, network status, cache-aware reads.
- `src/styles`: global Tailwind entry and design tokens.

Recommended libraries:

- Vite for development and production builds.
- React Router for routes.
- TanStack Query for server state, caching, invalidation, retries, and loading/error states.
- React Hook Form with Zod for form state and validation.
- Tailwind CSS for styling.
- A chart library chosen during implementation after confirming parity with current Plotly-based chart needs.
- A drag-and-drop library with keyboard support for practice ordering.

## Routing Scope

The React app must cover the current public and authenticated route surface:

- `/`
- `/login`
- `/register`
- `/register/:id`
- `/reset`
- `/reset/:id`
- `/shared/:id`
- `/help`
- `/settings`
- `/settings/edit-user`
- `/settings/edit-password`
- `/settings/import`
- `/settings/language`
- `/help/support-form`
- `/user/practices`
- `/user/practice/new`
- `/user/practice/new/:practice`
- `/user/practice/:id/edit`
- `/charts`
- `/charts/new`
- `/yatras`
- `/yatra/:id/join`
- `/yatra/:id/settings`
- `/yatra/:id/admin/settings`
- `/yatra/:id/practice/new`
- `/yatra/:id/practice/:practice_id/edit`
- `/404`

Route names may be reorganized internally in React, but public URLs should remain compatible unless a separate approved spec explicitly changes them.

## API Contract Strategy

React should initially mirror the current Yew service layer and existing Actix routes.

The API client should:

- derive its base URL from the current browser origin by default, matching the current frontend behavior;
- send JSON requests with bearer authentication when a token is present;
- store the JWT under the existing local storage key `yew.token` for compatibility unless a migration step explicitly renames it;
- map HTTP errors to typed frontend errors;
- preserve the current backend response shapes, including wrapper objects such as `{ "user": ... }`, `{ "user_practices": ... }`, `{ "diary_day": ... }`, and `{ "reports": ... }`;
- support request headers used by the current cache-aware reads, including `X-Cache-Only` and `X-Cache-Key`.

The first migration should not require OpenAPI generation or backend DTO restructuring. Type generation can be considered after cutover if backend/frontend contract drift becomes a maintenance problem.

## UX Design Direction

The application should feel modern, calm, and task-focused. It is an operational personal practice tool, so the UI should favor clarity and repeated daily use over decorative marketing-style composition.

Mobile layout:

- bottom navigation for primary areas;
- a today-first diary screen;
- thumb-friendly controls;
- compact but readable cards or rows for practice inputs;
- sticky or easily reachable save feedback;
- clear offline, saving, saved, and error states;
- date navigation that supports today, previous/next day, and calendar access.

Desktop layout:

- use the same product hierarchy as mobile;
- allow wider diary and chart layouts;
- avoid creating a separate desktop-only workflow;
- keep navigation predictable and scannable.

Daily diary screen priorities:

- required practices are visually and semantically clear;
- completion progress is visible without becoming distracting;
- each practice input uses the most natural control for its data type;
- unsaved changes are visible;
- save success and validation errors are obvious;
- incomplete days remain discoverable.

## Accessibility Requirements

Accessibility is a core requirement for the redesign.

The React frontend must include:

- semantic HTML for navigation, forms, headings, lists, dialogs, and buttons;
- explicit labels for all inputs;
- visible focus states;
- keyboard support for forms, dialogs, menus, tabs, date controls, and reorder flows;
- screen-reader-friendly validation messages;
- status messages for save success, save failure, offline mode, and app updates;
- color contrast that meets WCAG AA for normal text and UI controls;
- no status indicated by color alone;
- reduced-motion support for animated transitions;
- touch targets of at least 44 by 44 CSS pixels for primary mobile actions;
- accessible loading and empty states.

## Internationalization

The React app must support the existing language set:

- English
- Russian
- Ukrainian

Translation keys should be namespaced by feature. Existing JSON translation files can be migrated, but labels and help text should be revised where needed to match the redesigned workflows.

The language setting must remain user-facing and accessible from settings.

## PWA And Offline Behavior

The existing app includes service worker and cache-aware behavior. The React app should preserve the user-visible PWA expectations:

- app shell loads from installed/mobile browser contexts;
- network status is visible when relevant;
- app update availability is handled cleanly;
- cache-aware GET requests used by diary/report flows are preserved or intentionally replaced with an equivalent strategy;
- generated precache manifest behavior remains compatible with backend static serving.

Implementation should verify actual mobile browser behavior before cutover, especially iOS PWA behavior.

## Testing And Verification

The migration needs stronger verification because it uses a single big cutover.

Minimum test coverage:

- API client unit tests for auth token handling, wrapped responses, and error mapping.
- Form validation tests for auth, diary, practices, yatras, settings, and support form flows.
- Component tests for core diary inputs and reusable UI controls.
- Route-level tests for protected routes and public routes.
- Accessibility checks with automated tooling.
- End-to-end tests for the critical workflows:
  - login;
  - quick diary entry for today;
  - editing a user practice;
  - creating/viewing a chart report;
  - joining or viewing a yatra;
  - changing language;
  - password reset path;
  - shared chart route.

Manual verification should include mobile viewport checks, keyboard-only checks, screen-reader spot checks, and offline/update behavior checks.

Backend tests should be added only where the React implementation uncovers uncertain route behavior or contract gaps.

## Build And Deployment

The repository build should move from Trunk/Yew to Vite/React for frontend assets.

Expected build changes:

- add a React/TypeScript package in the frontend area or an approved replacement path;
- update frontend build command to run Vite and emit assets to `dist`;
- update `Makefile` so `make run` builds React before running the server;
- update Docker build stages to install Node dependencies, build React assets, and package them with the Rust server;
- keep Actix static file serving from `./dist` unless implementation finds a strong reason to change it.

The final cutover should remove the Yew frontend from the workspace and build pipeline only after the React app reaches parity.

## Cutover Criteria

React is ready to replace Yew when:

- every current route has a React equivalent;
- quick diary entry is better on mobile than the current Yew implementation;
- all existing backend API workflows used by the frontend are covered;
- i18n works for English, Russian, and Ukrainian;
- PWA/update/offline expectations are verified;
- accessibility checks pass with no known critical issues;
- end-to-end tests cover the critical workflows;
- Docker and local run commands build and serve the React app successfully;
- no temporary hybrid Yew/React routing remains.

## Non-Goals For First Cutover

The first cutover will not:

- redesign the backend domain model;
- require OpenAPI/type generation;
- launch React route-by-route while Yew remains active;
- replace authentication semantics;
- remove existing user data or require data migrations beyond already existing Diesel migrations;
- introduce native mobile apps.

## Open Decisions For Implementation Planning

These decisions should be made in the implementation plan or at the first relevant implementation task:

- exact React project path;
- final charting library after checking current graph/grid parity requirements;
- final drag-and-drop library for accessible ordering;
- whether to keep Tailwind v3-style config or adopt current Tailwind tooling;
- exact local development ports and proxy setup.
