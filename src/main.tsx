import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { AppProviders } from './app/AppProviders'
import './styles.css'

async function bootstrap() {
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        const { mockWorker } = await import('./services/mock/browser')
        const workerStartup = mockWorker.start().catch((error: unknown) => console.error('Mock API worker could not start.', error))
        await Promise.race([workerStartup, new Promise<void>((resolve) => globalThis.setTimeout(resolve, 2500))])
    }

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <AppProviders><App /></AppProviders>
        </React.StrictMode>,
    )
}

void bootstrap()