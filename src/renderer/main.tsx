import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './styles/global.scss'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <StrictMode>
            <App />
        </StrictMode>
    </QueryClientProvider>
)
