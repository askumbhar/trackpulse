import { createContext, useState, useContext, type ReactNode } from "react";

// Define the user type (customize as needed)
type User = {
  id: string;
  username: string;
  role: string;
} | null;

// Define the context type
interface AuthContextType {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
}

// Provide a default value for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}