import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/utils/style/index.css'
import App from './App.tsx'
import "@/lib/i18n.ts"; // import i18n config

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
