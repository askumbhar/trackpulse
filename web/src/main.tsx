import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './components/store/AuthContext.tsx';
import AppRoutes from './routes/Approutes.tsx';


createRoot(document.getElementById('root')!).render(

  <StrictMode>
  <BrowserRouter>

   <AuthProvider>
     <AppRoutes />
   </AuthProvider>
    {/* <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={<AppLayout />} />

      <Route path="/oddsManager" element={<AppLayout title="Race Management">
        <OddsManager />
      </AppLayout>} />

      <Route path="/fileUploader" element={<AppLayout title="File Uploader">
        <FileUploader />
      </AppLayout>} />


      <Route path="/depositApprove" element={<AppLayout title="Deposit Approvals">
        <DepositApprove />
      </AppLayout>} />
    </Routes>
    <Routes>
      <Route path="/UserDashboard" element={<AppLayout title="User Dashboard">
        <UserDashboard />
      </AppLayout>} />
    </Routes> */}

  </BrowserRouter>
  </StrictMode>
  ,
)
