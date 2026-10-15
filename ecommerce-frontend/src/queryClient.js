import { QueryClient } from '@tanstack/react-query'

// staleTime 60s: product catalogs change slowly — avoid refetching on every
// route revisit within a minute. retry 1: one automatic retry covers brief
// network blips without hammering a failing API.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})

export default queryClient
