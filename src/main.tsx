import { StrictMode } from 'react'
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
      staleTime: 10 * 60 * 1000, // 10 minutes - longer default stale time
      gcTime: 20 * 60 * 1000, // 20 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Disable reconnect refetch to reduce API calls
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false
        if (error?.status === 429) return failureCount < 1 // Only retry rate limits once
        return failureCount < 1 // Reduce overall retry attempts
      },
      retryDelay: (attempt, error) => {
        // Much longer delays for rate limits
        if (error?.status === 429) {
          return Math.min(30000 * Math.pow(2, attempt), 120000) // 30s, 60s, 120s max
        }
        return Math.min(5000 * attempt, 30000)
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
