# React TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Yew frontend with a mobile-first React/TypeScript app that preserves the current Rust backend functionality and ships as a single big cutover.

**Architecture:** Build a new React app in `web/` against the existing `/api` routes, keep the Actix backend as the source of truth, and switch the build pipeline from Trunk/Yew to Vite/React only after React reaches route and workflow parity. The React app should be feature-organized, mobile-first, accessibility-first, and optimized around quick daily diary entry.

**Tech Stack:** React 19, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, `@dnd-kit`, `react-plotly.js`, Vitest, Testing Library, Playwright, Actix Web, Diesel, Docker.

---

## File Structure

Create the new frontend in `web/` so the current Rust `frontend/` crate can stay in place until final cutover.

New frontend files and responsibilities:

- `web/package.json`: scripts, dependencies, test commands.
- `web/tsconfig.json`: TypeScript project config.
- `web/vite.config.ts`: Vite dev server, API proxy, build output to `../dist`.
- `web/index.html`: React entry document plus manifest and PWA shell metadata.
- `web/src/main.tsx`: React bootstrap.
- `web/src/app/AppRouter.tsx`: route tree and protected route handling.
- `web/src/app/AppProviders.tsx`: Query client, router wrappers, auth provider, i18n bootstrap.
- `web/src/app/AppShell.tsx`: top-level mobile-first navigation shell.
- `web/src/app/routes.tsx`: centralized route definitions.
- `web/src/styles/index.css`: Tailwind imports, CSS variables, global tokens, accessibility defaults.
- `web/src/api/client.ts`: fetch wrapper, base URL, token storage, typed errors.
- `web/src/api/*.ts`: feature-specific endpoint modules.
- `web/src/features/auth/*`: login, registration, password reset, auth session handling.
- `web/src/features/diary/*`: today page, practice inputs, save flows, date navigation.
- `web/src/features/practices/*`: user practice CRUD and reordering.
- `web/src/features/charts/*`: private/shared reports, create/edit flows.
- `web/src/features/yatras/*`: yatra list, join, settings, admin flows.
- `web/src/features/settings/*`: edit user, edit password, import, language, support.
- `web/src/i18n/*`: language bootstrapping and translation namespaces.
- `web/src/pwa/*`: service worker registration, update prompts, network awareness.
- `web/src/test/*`: Vitest setup, mocks, helpers.
- `web/e2e/*`: Playwright tests.

Rust-side files to modify during cutover:

- `Cargo.toml`: remove `frontend` from workspace members after React parity.
- `Makefile`: replace Trunk build with `npm --prefix web run build`.
- `Dockerfile`: install Node, `npm install`, run Vite build, remove Trunk/Yew build steps.
- `server/src/routes.rs`: keep serving `./dist`, retain SPA fallback, simplify precache handling only if React build layout requires it.
- `README.md`: replace Trunk/Yew developer instructions with React/Vite instructions.

## Task 1: Scaffold The React Frontend And Test Harness

**Files:**
- Create: `web/package.json`
- Create: `web/tsconfig.json`
- Create: `web/vite.config.ts`
- Create: `web/index.html`
- Create: `web/src/main.tsx`
- Create: `web/src/app/AppRouter.tsx`
- Create: `web/src/app/App.test.tsx`
- Create: `web/src/test/setup.ts`

- [ ] **Step 1: Write the failing smoke test**

```tsx
// web/src/app/App.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppRouter } from "./AppRouter";

describe("AppRouter", () => {
  it("renders the application loading shell", () => {
    render(<AppRouter />);
    expect(screen.getByText("Loading Sadhana Pro")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix web run test -- src/app/App.test.tsx`
Expected: FAIL because `web/package.json` and `web/src/app/AppRouter.tsx` do not exist yet.

- [ ] **Step 3: Write the minimal scaffold**

```json
// web/package.json
{
  "name": "sadhana-web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5173",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@tanstack/react-query": "^5.66.8",
    "i18next": "^24.2.3",
    "i18next-browser-languagedetector": "^8.0.4",
    "i18next-http-backend": "^3.0.2",
    "plotly.js-dist-min": "^2.35.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "react-i18next": "^15.4.1",
    "react-plotly.js": "^2.6.0",
    "react-router-dom": "^7.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^26.0.0",
    "typescript": "^5.7.3",
    "tailwindcss": "^4.0.0",
    "vite": "^6.1.0",
    "vitest": "^3.0.5"
  }
}
```

```json
// web/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

```ts
// web/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8080",
      "/version": "http://127.0.0.1:8080",
      "/precache-manifest.js": "http://127.0.0.1:8080"
    }
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  }
});
```

```tsx
// web/src/app/AppRouter.tsx
export function AppRouter() {
  return <main aria-busy="true">Loading Sadhana Pro</main>;
}
```

```tsx
// web/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";

import { AppRouter } from "./app/AppRouter";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
```

```html
<!-- web/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />
    <meta name="theme-color" content="#f6efe4" />
    <link rel="manifest" href="/site.webmanifest" />
    <title>Sadhana Pro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```ts
// web/src/test/setup.ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix web install`
Expected: PASS with dependencies installed.

Run: `npm --prefix web run test -- src/app/App.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add web/package.json web/tsconfig.json web/vite.config.ts web/index.html web/src/main.tsx web/src/app/AppRouter.tsx web/src/app/App.test.tsx web/src/test/setup.ts
git commit -m "feat: scaffold react frontend workspace"
```

## Task 2: Build The App Shell, Tokens, And Protected Routing

**Files:**
- Create: `web/src/app/AppProviders.tsx`
- Create: `web/src/app/AppShell.tsx`
- Create: `web/src/app/routes.tsx`
- Create: `web/src/app/RequireAuth.tsx`
- Create: `web/src/styles/index.css`
- Create: `web/src/components/ui/BottomNav.tsx`
- Create: `web/src/components/ui/PageHeader.tsx`
- Test: `web/src/app/AppShell.test.tsx`

- [ ] **Step 1: Write the failing shell test**

```tsx
// web/src/app/AppShell.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders the bottom navigation with diary first", () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute("href", "/");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix web run test -- src/app/AppShell.test.tsx`
Expected: FAIL because `AppShell` and the navigation components do not exist yet.

- [ ] **Step 3: Write the minimal shell implementation**

```tsx
// web/src/app/AppShell.tsx
import { Link, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Today" },
  { to: "/charts", label: "Charts" },
  { to: "/yatras", label: "Yatras" },
  { to: "/settings", label: "Settings" }
];

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="page-header">
        <h1>Sadhana Pro</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <nav aria-label="Primary">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
```

```css
/* web/src/styles/index.css */
@import "tailwindcss";

:root {
  --bg: #f6efe4;
  --surface: rgba(255, 252, 248, 0.92);
  --text: #1d140f;
  --accent: #0f766e;
  --accent-strong: #115e59;
  --border: rgba(55, 32, 18, 0.14);
  --danger: #b42318;
  --success: #027a48;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(219, 167, 92, 0.35), transparent 38%),
    linear-gradient(180deg, #fbf6ee 0%, #f3eadf 100%);
  color: var(--text);
  font-family: "Montserrat", sans-serif;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}
```

```tsx
// web/src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./AppShell";

function Placeholder({ title }: { title: string }) {
  return <section><h2>{title}</h2></section>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder title="Today" /> },
      { path: "charts", element: <Placeholder title="Charts" /> },
      { path: "yatras", element: <Placeholder title="Yatras" /> },
      { path: "settings", element: <Placeholder title="Settings" /> }
    ]
  }
]);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm --prefix web run test -- src/app/AppShell.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add web/src/app/AppProviders.tsx web/src/app/AppShell.tsx web/src/app/routes.tsx web/src/app/RequireAuth.tsx web/src/styles/index.css web/src/components/ui/BottomNav.tsx web/src/components/ui/PageHeader.tsx web/src/app/AppShell.test.tsx
git commit -m "feat: add react app shell and route scaffold"
```

## Task 3: Add API Client, Auth State, And Public Auth Flows

**Files:**
- Create: `web/src/api/client.ts`
- Create: `web/src/api/errors.ts`
- Create: `web/src/api/auth.ts`
- Create: `web/src/features/auth/AuthProvider.tsx`
- Create: `web/src/features/auth/LoginPage.tsx`
- Create: `web/src/features/auth/RegisterRequestPage.tsx`
- Create: `web/src/features/auth/RegisterPage.tsx`
- Create: `web/src/features/auth/PasswordResetRequestPage.tsx`
- Create: `web/src/features/auth/PasswordResetPage.tsx`
- Test: `web/src/api/client.test.ts`
- Test: `web/src/features/auth/LoginPage.test.tsx`

- [ ] **Step 1: Write failing tests for token compatibility and login UI**

```ts
// web/src/api/client.test.ts
import { describe, expect, it } from "vitest";

import { getStoredToken, setStoredToken } from "./client";

describe("token storage", () => {
  it("uses the legacy yew.token key", () => {
    setStoredToken("abc");
    expect(localStorage.getItem("yew.token")).toBe("abc");
    expect(getStoredToken()).toBe("abc");
  });
});
```

```tsx
// web/src/features/auth/LoginPage.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("renders email and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm --prefix web run test -- src/api/client.test.ts src/features/auth/LoginPage.test.tsx`
Expected: FAIL because the API client and auth pages do not exist yet.

- [ ] **Step 3: Implement the auth foundation**

```ts
// web/src/api/client.ts
const TOKEN_KEY = "yew.token";

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", "application/json");
  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`/api${path}`, { ...init, headers });
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
```

```tsx
// web/src/features/auth/LoginPage.tsx
export function LoginPage() {
  return (
    <main>
      <h1>Welcome back</h1>
      <form aria-label="Login form">
        <label>
          Email
          <input name="email" type="email" autoComplete="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
```

```tsx
// web/src/features/auth/AuthProvider.tsx
import { createContext, useContext, useState } from "react";

type AuthContextValue = {
  token: string | null;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getStoredToken());

  function setToken(next: string | null) {
    setStoredToken(next);
    setTokenState(next);
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm --prefix web run test -- src/api/client.test.ts src/features/auth/LoginPage.test.tsx`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add web/src/api/client.ts web/src/api/errors.ts web/src/api/auth.ts web/src/features/auth/AuthProvider.tsx web/src/features/auth/LoginPage.tsx web/src/features/auth/RegisterRequestPage.tsx web/src/features/auth/RegisterPage.tsx web/src/features/auth/PasswordResetRequestPage.tsx web/src/features/auth/PasswordResetPage.tsx web/src/api/client.test.ts web/src/features/auth/LoginPage.test.tsx
git commit -m "feat: add auth client and public auth flows"
```

## Task 4: Implement The Mobile-First Diary Experience

**Files:**
- Create: `web/src/api/diary.ts`
- Create: `web/src/features/diary/TodayPage.tsx`
- Create: `web/src/features/diary/components/PracticeField.tsx`
- Create: `web/src/features/diary/components/DateSwitcher.tsx`
- Create: `web/src/features/diary/components/SaveStatus.tsx`
- Create: `web/src/features/diary/components/IncompleteDaysBadge.tsx`
- Test: `web/src/features/diary/TodayPage.test.tsx`

- [ ] **Step 1: Write the failing diary test**

```tsx
// web/src/features/diary/TodayPage.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TodayPage } from "./TodayPage";

describe("TodayPage", () => {
  it("shows the quick entry heading and save button", () => {
    render(<TodayPage />);
    expect(screen.getByRole("heading", { name: "Today" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix web run test -- src/features/diary/TodayPage.test.tsx`
Expected: FAIL because the diary feature does not exist yet.

- [ ] **Step 3: Implement the diary page and API wrapper**

```ts
// web/src/api/diary.ts
import { apiFetch } from "./client";

export type DiaryEntry = {
  practice: string;
  data_type: "Int" | "Bool" | "Time" | "Text" | "Duration";
  dropdown_variants: string | null;
  value: unknown;
};

export type DiaryDayResponse = {
  diary_day: DiaryEntry[];
};

export function getDiaryDay(cob: string) {
  return apiFetch<DiaryDayResponse>(`/diary/${cob}`);
}

export function saveDiaryEntry(cob: string, entry: DiaryEntry) {
  return apiFetch<void>(`/diary/${cob}/entry`, {
    method: "PUT",
    body: JSON.stringify({ entry })
  });
}
```

```tsx
// web/src/features/diary/TodayPage.tsx
import { useState } from "react";

export function TodayPage() {
  const [dirty, setDirty] = useState(false);

  return (
    <section aria-labelledby="today-heading">
      <header>
        <h1 id="today-heading">Today</h1>
        <p>Quickly capture your daily practice before you move on.</p>
      </header>
      <div aria-live="polite">{dirty ? "Unsaved changes" : "All changes saved"}</div>
      <button type="button" onClick={() => setDirty(false)}>
        Save changes
      </button>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix web run test -- src/features/diary/TodayPage.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add web/src/api/diary.ts web/src/features/diary/TodayPage.tsx web/src/features/diary/components/PracticeField.tsx web/src/features/diary/components/DateSwitcher.tsx web/src/features/diary/components/SaveStatus.tsx web/src/features/diary/components/IncompleteDaysBadge.tsx web/src/features/diary/TodayPage.test.tsx
git commit -m "feat: add mobile-first diary workflow"
```

## Task 5: Implement Practice Management And Accessible Reordering

**Files:**
- Create: `web/src/api/practices.ts`
- Create: `web/src/features/practices/PracticeListPage.tsx`
- Create: `web/src/features/practices/PracticeFormPage.tsx`
- Create: `web/src/features/practices/PracticeSortList.tsx`
- Test: `web/src/features/practices/PracticeListPage.test.tsx`

- [ ] **Step 1: Write the failing practice list test**

```tsx
// web/src/features/practices/PracticeListPage.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PracticeListPage } from "./PracticeListPage";

describe("PracticeListPage", () => {
  it("renders a create practice action", () => {
    render(<PracticeListPage />);
    expect(screen.getByRole("link", { name: "Add practice" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix web run test -- src/features/practices/PracticeListPage.test.tsx`
Expected: FAIL because the practice pages do not exist yet.

- [ ] **Step 3: Implement the practice management skeleton**

```ts
// web/src/api/practices.ts
import { apiFetch } from "./client";

export type UserPractice = {
  id: string;
  practice: string;
  data_type: string;
  is_active: boolean;
  is_required: boolean | null;
  dropdown_variants: string | null;
};

export type UserPracticesResponse = {
  user_practices: UserPractice[];
};

export function getUserPractices() {
  return apiFetch<UserPracticesResponse>("/user/practices");
}
```

```tsx
// web/src/features/practices/PracticeListPage.tsx
import { Link } from "react-router-dom";

export function PracticeListPage() {
  return (
    <section>
      <header>
        <h1>Practices</h1>
        <Link to="/user/practice/new">Add practice</Link>
      </header>
      <p>Manage what appears in daily entry.</p>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix web run test -- src/features/practices/PracticeListPage.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add web/src/api/practices.ts web/src/features/practices/PracticeListPage.tsx web/src/features/practices/PracticeFormPage.tsx web/src/features/practices/PracticeSortList.tsx web/src/features/practices/PracticeListPage.test.tsx
git commit -m "feat: add practice management flows"
```

## Task 6: Implement Reports, Shared Charts, And Plotly Integration

**Files:**
- Create: `web/src/api/reports.ts`
- Create: `web/src/features/charts/ChartsPage.tsx`
- Create: `web/src/features/charts/CreateReportPage.tsx`
- Create: `web/src/features/charts/SharedChartsPage.tsx`
- Create: `web/src/features/charts/ReportChart.tsx`
- Test: `web/src/features/charts/ChartsPage.test.tsx`

- [ ] **Step 1: Write the failing charts test**

```tsx
// web/src/features/charts/ChartsPage.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChartsPage } from "./ChartsPage";

describe("ChartsPage", () => {
  it("renders a heading for reports", () => {
    render(<ChartsPage />);
    expect(screen.getByRole("heading", { name: "Reports" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix web run test -- src/features/charts/ChartsPage.test.tsx`
Expected: FAIL because the chart feature does not exist yet.

- [ ] **Step 3: Implement the minimal chart feature scaffold**

```ts
// web/src/api/reports.ts
import { apiFetch } from "./client";

export type Report = {
  id: string;
  name: string;
  definition: unknown;
};

export type ReportsResponse = {
  reports: Report[];
};

export function getReports() {
  return apiFetch<ReportsResponse>("/reports");
}
```

```tsx
// web/src/features/charts/ChartsPage.tsx
import { Link } from "react-router-dom";

export function ChartsPage() {
  return (
    <section>
      <header>
        <h1>Reports</h1>
        <Link to="/charts/new">New report</Link>
      </header>
      <p>Review trends without slowing down daily entry.</p>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix web run test -- src/features/charts/ChartsPage.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add web/src/api/reports.ts web/src/features/charts/ChartsPage.tsx web/src/features/charts/CreateReportPage.tsx web/src/features/charts/SharedChartsPage.tsx web/src/features/charts/ReportChart.tsx web/src/features/charts/ChartsPage.test.tsx
git commit -m "feat: add reports and shared chart flows"
```

## Task 7: Implement Yatra Flows

**Files:**
- Create: `web/src/api/yatras.ts`
- Create: `web/src/features/yatras/YatrasPage.tsx`
- Create: `web/src/features/yatras/JoinYatraPage.tsx`
- Create: `web/src/features/yatras/YatraSettingsPage.tsx`
- Create: `web/src/features/yatras/YatraAdminPage.tsx`
- Test: `web/src/features/yatras/YatrasPage.test.tsx`

- [ ] **Step 1: Write the failing yatra test**

```tsx
// web/src/features/yatras/YatrasPage.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { YatrasPage } from "./YatrasPage";

describe("YatrasPage", () => {
  it("renders the yatra heading", () => {
    render(<YatrasPage />);
    expect(screen.getByRole("heading", { name: "Yatras" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix web run test -- src/features/yatras/YatrasPage.test.tsx`
Expected: FAIL because the yatra feature does not exist yet.

- [ ] **Step 3: Implement the minimal yatra scaffold**

```ts
// web/src/api/yatras.ts
import { apiFetch } from "./client";

export type Yatra = {
  id: string;
  name: string;
};

export type YatrasResponse = {
  yatras: Yatra[];
};

export function getYatras() {
  return apiFetch<YatrasResponse>("/yatras");
}
```

```tsx
// web/src/features/yatras/YatrasPage.tsx
export function YatrasPage() {
  return (
    <section>
      <h1>Yatras</h1>
      <p>Shared practice spaces and accountability live here.</p>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix web run test -- src/features/yatras/YatrasPage.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add web/src/api/yatras.ts web/src/features/yatras/YatrasPage.tsx web/src/features/yatras/JoinYatraPage.tsx web/src/features/yatras/YatraSettingsPage.tsx web/src/features/yatras/YatraAdminPage.tsx web/src/features/yatras/YatrasPage.test.tsx
git commit -m "feat: add yatra management flows"
```

## Task 8: Implement Settings, I18n, And PWA Support

**Files:**
- Create: `web/src/i18n/index.ts`
- Create: `web/src/features/settings/SettingsPage.tsx`
- Create: `web/src/features/settings/EditUserPage.tsx`
- Create: `web/src/features/settings/EditPasswordPage.tsx`
- Create: `web/src/features/settings/LanguagePage.tsx`
- Create: `web/src/features/settings/ImportPage.tsx`
- Create: `web/src/features/settings/SupportFormPage.tsx`
- Create: `web/src/pwa/registerServiceWorker.ts`
- Create: `web/src/pwa/useAppUpdate.ts`
- Create: `web/public/locales/en/translation.json`
- Create: `web/public/locales/ru/translation.json`
- Create: `web/public/locales/uk/translation.json`
- Test: `web/src/features/settings/LanguagePage.test.tsx`

- [ ] **Step 1: Write the failing language test**

```tsx
// web/src/features/settings/LanguagePage.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LanguagePage } from "./LanguagePage";

describe("LanguagePage", () => {
  it("renders all three supported languages", () => {
    render(<LanguagePage />);
    expect(screen.getByRole("radio", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Russian" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Ukrainian" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix web run test -- src/features/settings/LanguagePage.test.tsx`
Expected: FAIL because the settings and i18n feature does not exist yet.

- [ ] **Step 3: Implement the settings and i18n foundation**

```tsx
// web/src/features/settings/LanguagePage.tsx
const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Russian" },
  { code: "uk", label: "Ukrainian" }
];

export function LanguagePage() {
  return (
    <section>
      <h1>Language</h1>
      <form>
        <fieldset>
          <legend>Choose language</legend>
          {languages.map((language) => (
            <label key={language.code}>
              <input type="radio" name="language" value={language.code} />
              {language.label}
            </label>
          ))}
        </fieldset>
      </form>
    </section>
  );
}
```

```ts
// web/src/pwa/registerServiceWorker.ts
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  void navigator.serviceWorker.register("/service_worker.js", {
    updateViaCache: "none"
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix web run test -- src/features/settings/LanguagePage.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add web/src/i18n/index.ts web/src/features/settings/SettingsPage.tsx web/src/features/settings/EditUserPage.tsx web/src/features/settings/EditPasswordPage.tsx web/src/features/settings/LanguagePage.tsx web/src/features/settings/ImportPage.tsx web/src/features/settings/SupportFormPage.tsx web/src/pwa/registerServiceWorker.ts web/src/pwa/useAppUpdate.ts web/public/locales/en/translation.json web/public/locales/ru/translation.json web/public/locales/uk/translation.json web/src/features/settings/LanguagePage.test.tsx
git commit -m "feat: add settings, i18n, and pwa support"
```

## Task 9: Switch The Build Pipeline And Complete The Big Cutover

**Files:**
- Modify: `Cargo.toml`
- Modify: `Makefile`
- Modify: `Dockerfile`
- Modify: `README.md`
- Modify: `server/src/routes.rs`
- Delete: `frontend/`
- Test: `web/e2e/smoke.spec.ts`

- [ ] **Step 1: Write the failing build smoke test**

```ts
// web/e2e/smoke.spec.ts
import { expect, test } from "@playwright/test";

test("home page renders the React today view", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
});
```

- [ ] **Step 2: Run the build and smoke test to verify they fail**

Run: `npm --prefix web run build`
Expected: FAIL until all route imports, asset copies, and Vite output paths are complete.

Run: `npm --prefix web run e2e -- web/e2e/smoke.spec.ts`
Expected: FAIL until the server builds and serves the React app from `dist`.

- [ ] **Step 3: Switch the repo from Trunk to Vite**

```toml
# Cargo.toml
[workspace]
resolver = "2"
members = ["server", "common"]
default-members = ["server"]
```

```make
# Makefile
frontend-build:
	npm --prefix web install
	npm --prefix web run build
```

```dockerfile
# Dockerfile build stage fragment
RUN apt-get update && apt-get -y install --no-install-recommends \
        libpq5 \
        brotli \
        nodejs \
        npm \
    && rm -rf /var/lib/apt/lists/*

COPY web/package.json web/package-lock.json ./web/
RUN npm --prefix web install

COPY . .
RUN npm --prefix web run build
RUN cargo build --release --bin server
```

```rust
// server/src/routes.rs
fn dist_files() -> actix_files::Files {
    Files::new("/", "./dist")
        .index_file("index.html")
        .use_etag(true)
        .use_last_modified(true)
        .default_handler(|req: ServiceRequest| {
            let (http_req, _payload) = req.into_parts();
            async move {
                let response_file = NamedFile::open_async("./dist/index.html").await?;
                let response = response_file.into_response(&http_req);
                Ok(ServiceResponse::new(http_req, response))
            }
        })
}
```

- [ ] **Step 4: Run the build and smoke test to verify they pass**

Run: `npm --prefix web run build`
Expected: PASS with `dist/index.html` and hashed assets emitted.

Run: `cargo build --bin server`
Expected: PASS with the Rust workspace no longer trying to compile the Yew frontend.

Run: `npm --prefix web run e2e -- web/e2e/smoke.spec.ts`
Expected: PASS with the React today view visible.

- [ ] **Step 5: Commit**

```bash
git add Cargo.toml Makefile Dockerfile README.md server/src/routes.rs web/e2e/smoke.spec.ts
git rm -r frontend
git commit -m "feat: cut over frontend build from yew to react"
```

## Task 10: Accessibility, Regression, And Release Verification

**Files:**
- Create: `web/src/test/accessibility.test.tsx`
- Create: `web/e2e/diary.spec.ts`
- Create: `web/e2e/auth.spec.ts`
- Create: `web/e2e/charts.spec.ts`
- Create: `web/e2e/yatras.spec.ts`
- Modify: `README.md`

- [ ] **Step 1: Write the failing accessibility regression test**

```tsx
// web/src/test/accessibility.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TodayPage } from "../features/diary/TodayPage";

describe("TodayPage accessibility", () => {
  it("renders a single h1 and a save button", () => {
    const { container } = render(<TodayPage />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector('button[type="button"]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail if coverage is incomplete**

Run: `npm --prefix web run test -- src/test/accessibility.test.tsx`
Expected: FAIL until the verified `TodayPage` implementation is wired into the final app.

Run: `npm --prefix web run e2e`
Expected: FAIL until all critical route workflows are fully implemented.

- [ ] **Step 3: Finish verification coverage**

```ts
// web/e2e/diary.spec.ts
import { expect, test } from "@playwright/test";

test("user can enter a daily value and save it", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await page.getByLabel("Japa").fill("16");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("All changes saved")).toBeVisible();
});
```

```md
<!-- README.md verification section -->
## Verification

- `npm --prefix web run test`
- `npm --prefix web run e2e`
- `cargo test`
- `cargo build --bin server`
- `docker build -t sadhana-pro-react .`
```

- [ ] **Step 4: Run the full verification suite**

Run: `npm --prefix web run test`
Expected: PASS for unit and component tests.

Run: `npm --prefix web run e2e`
Expected: PASS for login, diary, charts, yatras, settings, and shared route flows.

Run: `cargo test`
Expected: PASS for backend tests.

Run: `docker build -t sadhana-pro-react .`
Expected: PASS with the React assets packaged into the final image.

- [ ] **Step 5: Commit**

```bash
git add web/src/test/accessibility.test.tsx web/e2e/diary.spec.ts web/e2e/auth.spec.ts web/e2e/charts.spec.ts web/e2e/yatras.spec.ts README.md
git commit -m "test: verify react cutover accessibility and parity"
```

## Self-Review Checklist

Spec coverage:

- React app in a separate path before cutover: covered by `web/` scaffolding and final workspace cleanup.
- Mobile-first diary-first UX: covered by Tasks 2 and 4.
- Auth, charts, yatras, settings, language, import, support, and shared routes: covered by Tasks 3 and 5 through 8.
- Accessibility and responsive behavior: covered by Tasks 2, 4, 8, and 10.
- PWA/offline/update behavior: covered by Task 8 and final verification in Task 10.
- Build, Docker, and big-cutover mechanics: covered by Task 9.

Type consistency:

- Preserve the existing auth token key as `yew.token`.
- Preserve `/api` route prefixes and current backend response wrapper shapes.
- Use `web/` consistently as the React app path.

Scope check:

- The plan remains focused on one big-cutover frontend migration and does not expand into backend redesign or native apps.
