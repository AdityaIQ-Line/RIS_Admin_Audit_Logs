import { RouterProvider } from "react-router"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { ErrorBoundary } from "./components/blocks/error-boundary"
import { AuthProvider } from "../lib/auth-context"
import { router } from "./router"

export function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ErrorBoundary>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="bottom-right" />
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App