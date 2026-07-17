import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { GuestRoute } from './components/layout/GuestRoute'
import { HomePage } from './pages/home/HomePage'
import { ChartsPage } from './pages/charts/ChartsPage'
import { YatrasPage } from './pages/yatras/YatrasPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ConfirmationPage } from './pages/auth/ConfirmationPage'
import { PwdResetRequestPage } from './pages/auth/PwdResetRequestPage'
import { PwdResetPage } from './pages/auth/PwdResetPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/:id', element: <ConfirmationPage /> },
      { path: '/reset', element: <PwdResetRequestPage /> },
      { path: '/reset/:id', element: <PwdResetPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/charts', element: <ChartsPage /> },
          { path: '/yatras', element: <YatrasPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '/shared/:id', element: <div>Shared chart — Phase 4</div> },
  { path: '*', element: <NotFoundPage /> },
])
