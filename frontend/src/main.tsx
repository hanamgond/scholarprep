import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 1. IMPORT THE MSW WORKER
import { worker } from './mocks/browser.ts'

// 2. CREATE AN ASYNC FUNCTION TO START THE WORKER
async function enableMocking() {
  // 3. ONLY RUN MSW IN DEVELOPMENT
  if (import.meta.env.MODE !== 'development') {
    return
  }

  await worker.start({
    // This logs any unhandled requests to the console
    onUnhandledRequest: 'bypass',
  })
}

// 4. CALL THE FUNCTION BEFORE RENDERING YOUR APP
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})