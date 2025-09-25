import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import Home from './routes/Home'
import CoinDetail from './routes/CoinDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'coin/:id', element: <CoinDetail /> },
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false
        if (error?.status === 429) return failureCount < 3 // Retry rate limits up to 3 times
        return failureCount < 2
      },
      retryDelay: (attempt, error) => {
        // Exponential backoff with longer delays for rate limits
        if (error?.status === 429) {
          return Math.min(10000 * Math.pow(2, attempt), 60000) // 10s, 20s, 40s, 60s max
        }
        return Math.min(3000 * attempt, 15000)
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
