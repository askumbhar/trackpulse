import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// ── Global styles (all bootstrap imports live here only) ──────────────────────
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/Approutes'
import './styles/theme.css'
import { NotificationProvider } from './components/common/Notification'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
        <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
      
    </BrowserRouter>
  </StrictMode>
)
