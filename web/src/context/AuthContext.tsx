// src/context/AuthContext.tsx
import { createContext, useState, useContext, type ReactNode } from 'react'

type User = {
  id: string
  username: string
  name: string
  email: string
  role: string
} | null

interface AuthContextType {
  user: User
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {

  // ── Read from localStorage on first load ──────────────────────────────
  const [user, setUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem('tp_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('tp_user', JSON.stringify(userData))  // ← persist
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tp_user')                         // ← clear
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}