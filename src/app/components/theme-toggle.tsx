import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { ICON_STROKE_WIDTH } from "../../lib/constants"
import { cn } from "./ui/utils"

interface ThemeToggleProps {
  /** Extra classes applied to the trigger button */
  triggerClassName?: string
}

export function ThemeToggle({ triggerClassName }: ThemeToggleProps) {
  const { setTheme, resolvedTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Render a placeholder during SSR / first paint to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        disabled
        className={cn("size-8", triggerClassName)}
      >
        <Sun strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={cn("relative size-8", triggerClassName)}
        >
          {/* Sun icon — visible in light mode */}
          <Sun
            strokeWidth={ICON_STROKE_WIDTH}
            className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          {/* Moon icon — visible in dark mode */}
          <Moon
            strokeWidth={ICON_STROKE_WIDTH}
            className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="gap-2"
          aria-selected={theme === "light"}
        >
          <Sun strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
          <span>Light</span>
          {theme === "light" && (
            <span className="ml-auto text-xs text-muted-foreground">Active</span>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="gap-2"
          aria-selected={theme === "dark"}
        >
          <Moon strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <span className="ml-auto text-xs text-muted-foreground">Active</span>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="gap-2"
          aria-selected={theme === "system"}
        >
          <Monitor strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
          <span>System</span>
          {theme === "system" && (
            <span className="ml-auto text-xs text-muted-foreground">Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}