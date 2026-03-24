import { useAuth } from "../context/AuthContext";

interface RoleGuardProps {
  allowedRoles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGuard({ allowedRoles = [], children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
 
  // Not logged in or role not allowed → render fallback (default: nothing)
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }
 
  return children;
}


