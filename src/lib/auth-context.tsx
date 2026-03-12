import React, { createContext, useState, useEffect, useContext } from "react"

export type UserRole = "admin"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: UserRole | null
  userName: string | null
  login: (email: string, password: string, role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null
    const storedName = localStorage.getItem("userName")
    if (storedRole && storedName) {
      setIsAuthenticated(true)
      setUserRole(storedRole)
      setUserName(storedName)
    }
  }, [])

  const login = (email: string, password: string, role: UserRole) => {
    // Mock login - in real app, this would call an API
    const roleNames: Record<UserRole, string> = {
      admin: "James Park",
    }

    setIsAuthenticated(true)
    setUserRole(role)
    setUserName(roleNames[role])
    
    // Store in localStorage
    localStorage.setItem("userRole", role)
    localStorage.setItem("userName", roleNames[role])
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserName(null)
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}