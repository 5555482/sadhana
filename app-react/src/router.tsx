import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { GuestRoute } from './components/layout/GuestRoute'

const HomePage = lazy(() => import('./pages/home/HomePage').then(m => ({ default: m.HomePage })))
const ChartsPage = lazy(() => import('./pages/charts/ChartsPage').then(m => ({ default: m.ChartsPage })))
const YatrasPage = lazy(() => import('./pages/yatras/YatrasPage').then(m => ({ default: m.YatrasPage })))
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })))
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ConfirmationPage = lazy(() => import('./pages/auth/ConfirmationPage').then(m => ({ default: m.ConfirmationPage })))
const PwdResetRequestPage = lazy(() => import('./pages/auth/PwdResetRequestPage').then(m => ({ default: m.PwdResetRequestPage })))
const PwdResetPage = lazy(() => import('./pages/auth/PwdResetPage').then(m => ({ default: m.PwdResetPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

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
