import * as React from "react"
import { Link, useNavigate } from "react-router"
import { LoginForm } from "../../app/components/blocks/login-form"
import { Sparkles } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../lib/constants"
import { ThemeToggle } from "../../app/components/theme-toggle"
import { useAuth } from "../../lib/auth-context"

/**
 * Login Page Template with Admin Access
 * 
 * A login page template for RadiologyIQ.
 * Features:
 * - Admin role only
 * - Email/password authentication
 * - Redirect to admin dashboard
 * - Responsive design
 */
interface LoginPageProps {
  onLogin?: (email: string, password: string, role: string) => void
  onGoogleLogin?: () => void
  showSignupLink?: boolean
  signupLink?: string
  showForgotPassword?: boolean
  forgotPasswordLink?: string
  logo?: React.ReactNode
  logoText?: string
}

export function LoginPage({
  onLogin,
  onGoogleLogin,
  showSignupLink = true,
  signupLink = "/signup",
  showForgotPassword = true,
  forgotPasswordLink = "/password-reset",
  logo,
  logoText = "RadiologyIQ",
}: LoginPageProps) {
  const navigate = useNavigate()
  const { login, isAuthenticated, userRole } = useAuth()

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && userRole === "admin") {
      navigate("/dashboard/admin", { replace: true })
    }
  }, [isAuthenticated, userRole, navigate])

  const handleLogin = (email: string, password: string, role: string) => {
    // Use auth context to log in
    login(email, password, "admin")
    
    // Call custom handler if provided
    if (onLogin) {
      onLogin(email, password, role)
    }
    
    // Redirect to admin dashboard
    navigate("/dashboard/admin")
  }

  const handleGoogleLogin = () => {
    // Call custom handler if provided
    if (onGoogleLogin) {
      onGoogleLogin()
    }
    // Redirect to admin dashboard
    navigate("/dashboard/admin")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <ThemeToggle />
        </div>

        {/* Logo Area */}
        {(logo || logoText) && (
          <div className="flex items-center justify-center gap-2">
            {logo || (
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
              </div>
            )}
            {logoText && (
              <span className="text-lg font-semibold">{logoText}</span>
            )}
          </div>
        )}

        {/* Login Form */}
        <LoginForm
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          showSignupLink={showSignupLink}
          signupLink={signupLink}
          showForgotPassword={showForgotPassword}
          forgotPasswordLink={forgotPasswordLink}
        />
      </div>
    </div>
  )
}
