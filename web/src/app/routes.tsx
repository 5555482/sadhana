import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./AppShell";
import { LoginPage } from "../features/auth/LoginPage";
import { PasswordResetPage } from "../features/auth/PasswordResetPage";
import { PasswordResetRequestPage } from "../features/auth/PasswordResetRequestPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { RegisterRequestPage } from "../features/auth/RegisterRequestPage";
import { TodayPage } from "../features/diary/TodayPage";

function Placeholder({ title }: { title: string }) {
  return (
    <section className="page-section">
      <h1>{title}</h1>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: "charts", element: <Placeholder title="Charts" /> },
      { path: "yatras", element: <Placeholder title="Yatras" /> },
      { path: "settings", element: <Placeholder title="Settings" /> }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterRequestPage />
  },
  {
    path: "/register/:id",
    element: <RegisterPage />
  },
  {
    path: "/reset",
    element: <PasswordResetRequestPage />
  },
  {
    path: "/reset/:id",
    element: <PasswordResetPage />
  }
]);
