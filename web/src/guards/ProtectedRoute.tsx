import { Navigate } from "react-router-dom";
import { useAuth } from "../components/store/AuthContext";

export default function ProtectedRoute({ allowedRoles = [], element }) {
  const { user } = useAuth();
 
  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
 
  // Logged in but wrong role → go to their own home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "Admin" ? "/admin/AdminDashboard" : "/dashboard"} replace />;
  }
 
  return element;
}