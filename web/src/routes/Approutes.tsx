// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../components/store/AuthContext";
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
import BetConfirmation from "../components/user/BetConfirmation";
import FileUploader from "../components/admin/FileUploader";
import AppLayout from "../components/admin/AdminDashboard";
import DepositFunds from "../components/user/DepositFunds";

// Helper so we don't repeat allowedRoles={["admin"]} on every line
const AdminRoute = ({ element }) => (
  <ProtectedRoute allowedRoles={["Admin"]} element={element} />
);

// Helper for user-only routes
const UserRoute = ({ element }) => (
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
            : <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/dashboard"} replace />
        }
      />
      <Route
        path="/signup"
        element={
          !user
            ? <Signup />
            : <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/dashboard"} replace />
        }
      />

      {/* ── Admin-only routes ────────────────────────────────────────────── */}
      {/*    A user hitting ANY /admin/* path gets redirected to /dashboard   */}
      <Route path="/admin/dashboard" element={<AdminRoute element={<AppLayout children={undefined} />} />} />
      <Route path="/admin/odds"      element={<AdminRoute element={<AppLayout><OddsManager /></AppLayout>}         />} />
      <Route path="/admin/users"     element={<AdminRoute element={<AppLayout><UserManager /></AppLayout>}          />} />
      <Route path="/admin/reports"   element={<AdminRoute element={<AppLayout><Reports /></AppLayout>}         />} />
      <Route path="/admin/deposits"  element={<AdminRoute element={<AppLayout><DepositApprove /></AppLayout>}        />} />
      <Route path="/admin/fileUploader"  element={<AdminRoute element={<AppLayout><FileUploader /></AppLayout>}        />} />
      {/* <Route path="/admin/settings"  element={<AdminRoute element={<AdminSettings />}        />} /> */}

      {/* ── User-only routes ─────────────────────────────────────────────── */}
    
      <Route path="/user/dashboard"       element={<UserRoute element={<AppLayout><UserDashboard /></AppLayout>}  />} />
      <Route path="/user/betting"         element={<UserRoute element={<AppLayout><BetSlip /></AppLayout>}      />} />
      <Route path="/user/bettinghistory"         element={<UserRoute element={<AppLayout><BettingHistory /></AppLayout>}        />} />
      <Route path="/user/betconfirmation"element={<UserRoute element={<AppLayout><BetConfirmation /></AppLayout>}       />} />
      <Route path="/user/depositfunds"    element={<UserRoute element={<AppLayout><DepositFunds /></AppLayout>}       />} />
      
      {/* <Route path="/profile"         element={<UserRoute element={<UserProfile />}           />} />
      <Route path="/settings"        element={<UserRoute element={<UserSettings />}          />} /> */}

      {/* ── Fallbacks ────────────────────────────────────────────────────── */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/"
        element={
          !user
            ? <Navigate to="/login" replace />
            : <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/dashboard"} replace />
        }
      />
      {/* Any unknown URL → back to role home */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}