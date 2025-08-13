/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_DEV_TOOLS: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}