import '@testing-library/jest-dom'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './handlers/auth.handlers'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          nav: { home: 'Home', charts: 'Charts', yatras: 'Yatras', settings: 'Settings' },
          auth: {
            login: 'Sign In',
            register: 'Create Account',
            email: 'Email',
            password: 'Password',
            name: 'Your name',
            forgotPassword: 'Forgot password?',
            noAccount: "Don't have an account?",
            hasAccount: 'Already have an account?',
            signUp: 'Sign up',
            signIn: 'Sign in',
            sendLink: 'Send reset link',
            newPassword: 'New password',
            confirmPassword: 'Confirm password',
            setPassword: 'Set new password',
            checkEmail: 'Check your email for a confirmation link.',
            passwordMismatch: 'Passwords do not match',
            resetSent: 'Reset link sent — check your email.',
            confirmationExpired: 'This link has expired.',
          },
          common: {
            loading: 'Loading…',
            error: 'Something went wrong',
            save: 'Save',
            cancel: 'Cancel',
            back: 'Back',
            add: 'Add',
          },
          home: {
            noPractices: 'No practices yet',
            addStarters: 'Add starter practices',
            addCustom: 'or create a custom one',
            addFirst: 'Add your first practice',
            offline: "You're offline — changes will sync when reconnected",
            addMinutes: 'Add minutes',
            addMinutesPlaceholder: 'e.g. 30',
            optional: 'Optional',
          },
        },
      },
    },
    interpolation: { escapeValue: false },
  })
}

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => { cleanup(); server.resetHandlers() })
afterAll(() => server.close())
