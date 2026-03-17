import { useAuth } from "../components/store/AuthContext";

export default function RoleGuard({ allowedRoles = [], children, fallback = null }) {
  const { user } = useAuth();
 
  // Not logged in or role not allowed → render fallback (default: nothing)
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }
 
  return children;
}


