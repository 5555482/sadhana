import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./AppShell";
import { LoginPage } from "../features/auth/LoginPage";
import { PasswordResetPage } from "../features/auth/PasswordResetPage";
import { PasswordResetRequestPage } from "../features/auth/PasswordResetRequestPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { RegisterRequestPage } from "../features/auth/RegisterRequestPage";
import { ChartsPage } from "../features/charts/ChartsPage";
import { CreateReportPage } from "../features/charts/CreateReportPage";
import { SharedChartsPage } from "../features/charts/SharedChartsPage";
import { TodayPage } from "../features/diary/TodayPage";
import { PracticeFormPage } from "../features/practices/PracticeFormPage";
import { PracticeListPage } from "../features/practices/PracticeListPage";
import { EditPasswordPage } from "../features/settings/EditPasswordPage";
import { EditUserPage } from "../features/settings/EditUserPage";
import { ImportPage } from "../features/settings/ImportPage";
import { LanguagePage } from "../features/settings/LanguagePage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { SupportFormPage } from "../features/settings/SupportFormPage";
import { JoinYatraPage } from "../features/yatras/JoinYatraPage";
import { YatraAdminPage } from "../features/yatras/YatraAdminPage";
import { YatraSettingsPage } from "../features/yatras/YatraSettingsPage";
import { YatrasPage } from "../features/yatras/YatrasPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: "charts", element: <ChartsPage /> },
      { path: "charts/new", element: <CreateReportPage /> },
      { path: "yatras", element: <YatrasPage /> },
      { path: "yatra/:id/settings", element: <YatraSettingsPage /> },
      { path: "yatra/:id/admin/settings", element: <YatraAdminPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "settings/edit-user", element: <EditUserPage /> },
      { path: "settings/edit-password", element: <EditPasswordPage /> },
      { path: "settings/language", element: <LanguagePage /> },
      { path: "settings/import", element: <ImportPage /> },
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
  },
  {
    path: "/shared/:id",
    element: <SharedChartsPage />
  },
  {
    path: "/yatra/:id/join",
    element: <JoinYatraPage />
  },
  {
    path: "/help/support-form",
    element: <SupportFormPage />
  }
]);
