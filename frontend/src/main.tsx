import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'
import App from './App.tsx'

// 1. IMPORT THE MSW WORKER
import { worker } from './mocks/browser.ts'

// 2. Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// 3. CREATE AN ASYNC FUNCTION TO START THE WORKER
async function enableMocking() {
  // 4. ONLY RUN MSW IN DEVELOPMENT
  if (import.meta.env.MODE !== 'development') {
    return
  }

  await worker.start({
    // This logs any unhandled requests to the console
    onUnhandledRequest: 'bypass',
  })
}

// 5. CALL THE FUNCTION BEFORE RENDERING YOUR APP
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
})