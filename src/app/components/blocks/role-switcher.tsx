import * as React from "react"
import { useNavigate } from "react-router"
import { Shield, LogOut } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"
import type { UserRole } from "../../../lib/sidebar-config"
import { Button } from "../ui/button"
import { useAuth } from "../../../lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface RoleSwitcherProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
}

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Shield,
    description: "James Park",
  },
} as const

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const role = currentRole || "admin"
  const config = roleConfig[role] || roleConfig.admin // Fallback to admin config
  const CurrentIcon = config.icon
  const { logout, userName } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full px-2 py-2 cursor-pointer hover:bg-accent rounded-md transition-colors">
          <div className="flex items-center gap-2 w-full">
            <CurrentIcon strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 shrink-0" />
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-sm font-medium truncate w-full">{userName || config.description}</span>
              <span className="text-xs text-muted-foreground truncate w-full">{config.label}</span>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}