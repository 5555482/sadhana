import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./AppShell";
import { LoginPage } from "../features/auth/LoginPage";
import { PasswordResetPage } from "../features/auth/PasswordResetPage";
import { PasswordResetRequestPage } from "../features/auth/PasswordResetRequestPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { RegisterRequestPage } from "../features/auth/RegisterRequestPage";
import { TodayPage } from "../features/diary/TodayPage";
import { PracticeFormPage } from "../features/practices/PracticeFormPage";
import { PracticeListPage } from "../features/practices/PracticeListPage";

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
      { path: "settings", element: <Placeholder title="Settings" /> },
      { path: "user/practices", element: <PracticeListPage /> },
      { path: "user/practice/new", element: <PracticeFormPage mode="create" /> },
      { path: "user/practice/new/:practice", element: <PracticeFormPage mode="create" /> },
      { path: "user/practice/:id/edit", element: <PracticeFormPage mode="edit" /> }
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
