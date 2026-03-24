// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../guards/ProtectedRoute";

// Auth
import Login  from "../components/auth/Login";
import Unauthorized from "../components/auth/Unauthorized";
import Signup from "../components/auth/Signup";

// Admin pages  — ALL protected with allowedRoles={["admin"]}
import OddsManager from "../components/admin/OddsManager";
import { Reports } from "../components/admin/Reports";
import UserManager from "../components/admin/UserManager";
import DepositApprove from "../components/admin/DepositApprove";
import UserDashboard from "../components/user/Dashboard";
import BetSlip from "../components/user/BetSlip";
import BettingHistory from "../components/user/BettingHistory";
import FileUploader from "../components/admin/FileUploader";
import DepositFunds from "../components/user/DepositFunds";
import AppLayout from "../components/common/AppLayout";
import AdminDashboard from '../components/admin/AdminDashboard'
import ForgotPassword from '../components/auth/ForgotPassword'
import RaceStream        from '../components/shared/RaceStream'
import RaceStreamManager from '../components/admin/RaceStreamManager'


// Helper so we don't repeat allowedRoles={["admin"]} on every line
const AdminRoute = ({ element }: { element: React.ReactElement }) => (
  <ProtectedRoute allowedRoles={["Admin"]} element={element} />
);

// Helper for user-only routes
const UserRoute = ({ element }: { element: React.ReactElement }) => (
  <ProtectedRoute allowedRoles={["User"]} element={element} />
);

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>

      {/* ── Public: login / signup ───────────────────────────────────────── */}
      <Route
        path="/login"
        element={
          !user
            ? <Login />
            : <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/user/dashboard"} replace />
        }
      />
      <Route
        path="/signup"
        element={
          !user
            ? <Signup />
            : <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/user/dashboard"} replace />
        }
      />
      {/* ForgotPassword — always public, no redirect if logged in */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Admin-only routes ────────────────────────────────────────────── */}
      {/*    A user hitting ANY /admin/* path gets redirected to /dashboard   */}
      <Route path="/admin/dashboard" element={<AdminRoute element={<AppLayout title="Admin Dashboard"> <AdminDashboard /></AppLayout>} />} />
      <Route path="/admin/odds"      element={<AdminRoute element={<AppLayout title="Odds Manager"><OddsManager /></AppLayout>}         />} />
      <Route path="/admin/users"     element={<AdminRoute element={<AppLayout title="User Manager"><UserManager /></AppLayout>}          />} />
      <Route path="/admin/reports"   element={<AdminRoute element={<AppLayout title="Reports"><Reports /></AppLayout>}         />} />
      <Route path="/admin/deposits"  element={<AdminRoute element={<AppLayout title="Deposit Approvals"><DepositApprove /></AppLayout>}        />} />
      <Route path="/admin/fileUploader"  element={<AdminRoute element={<AppLayout title="File Uploader"><FileUploader /></AppLayout>}        />} />
      <Route path="/admin/streams/manage"  element={<AdminRoute element={<AppLayout title="Race Stream Manager"><RaceStreamManager /></AppLayout>}        />} />
      <Route path="/admin/streams" element= {<AdminRoute element={<AppLayout title="Race Streams"> <RaceStream /> </AppLayout>}   />} />
      {/* <Route path="/admin/settings"  element={<AdminRoute element={<AdminSettings />}        />} /> */}

      {/* ── User-only routes ─────────────────────────────────────────────── */}
    
      <Route path="/user/dashboard"       element={<UserRoute element={<AppLayout title="User Dashboard"><UserDashboard /></AppLayout>}  />} />
      <Route path="/user/betting"         element={<UserRoute element={<AppLayout title="Betting"><BetSlip /></AppLayout>}      />} />
      <Route path="/user/bettinghistory"         element={<UserRoute element={<AppLayout title="Betting History"><BettingHistory /></AppLayout>}        />} />
      <Route path="/user/depositfunds"    element={<UserRoute element={<AppLayout title="Deposit Funds"><DepositFunds /></AppLayout>}       />} />
      <Route path="/user/streams"  element ={<UserRoute element= { <AppLayout title="Race Streams"> <RaceStream /> </AppLayout>}   />} />
      {/* <Route path="/profile"         element={<UserRoute element={<UserProfile />}           />} />
      <Route path="/settings"        element={<UserRoute element={<UserSettings />}          />} /> */}

      {/* ── Fallbacks ────────────────────────────────────────────────────── */}
      
      <Route
        path="/"
        element={
          !user
            ? <Navigate to="/login" replace />
            : <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/user/dashboard"} replace />
        }
      />
      {/* Any unknown URL → back to role home */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}