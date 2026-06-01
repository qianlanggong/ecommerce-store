import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initI18n } from '@/lib/i18n/config'
import './index.css'

async function bootstrap() {
  await initI18n()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        }
      >
        <App />
      </Suspense>
    </StrictMode>,
  )
}

bootstrap()
