import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AsyncStorage from '@react-native-async-storage/async-storage'
import App from './App.tsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Data is fresh for 24hours
      refetchOnWindowFocus: false, //No refetch on tab switch
      refetchOnMount: false, //optional: Prevent refetch on tab switch:
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <App />
    </PersistQueryClientProvider>
  </StrictMode>
)
