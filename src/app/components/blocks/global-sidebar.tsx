import React from "react"
import { Link, useLocation, useNavigate } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"
import { User } from "lucide-react"
import { getSidebarItemsForRole, type UserRole } from "../../../lib/sidebar-config"
import { RoleSwitcher } from "./role-switcher"
import LogoIcon from "../../../assets/Logo.svg?react"

interface GlobalSidebarProps {
  sidebarHeader?: React.ReactNode
  sidebarFooter?: React.ReactNode
  currentRole?: UserRole
}

// Function to detect role from current path ONLY (without sessionStorage)
function getRoleFromPathOnly(pathname: string): UserRole | null {
  // Check for shared paths - don't determine role from these
  const sharedPaths = ['/radiologist/templates', '/admin/audit-logs']
  if (sharedPaths.some(path => pathname.startsWith(path))) {
    return null // Return null for shared paths so sessionStorage is used
  }
  
  if (pathname.startsWith("/dashboard")) {
    if (pathname.startsWith("/dashboard/senior-radiologist")) return "senior_radiologist"
    if (pathname.startsWith("/dashboard/qc-technician")) return "qc_technician"
    if (pathname.startsWith("/dashboard/radiologist")) return "radiologist"
    if (pathname.startsWith("/dashboard/admin")) return "admin"
    if (pathname.startsWith("/dashboard/technician")) return "technician"
    if (pathname.startsWith("/dashboard/physician")) return "physician"
  }
  if (pathname.startsWith("/superadmin")) return "superadmin"
  if (pathname.startsWith("/senior-radiologist")) return "senior_radiologist"
  if (pathname.startsWith("/qc-technician")) return "qc_technician"
  if (pathname.startsWith("/radiologist")) return "radiologist"
  if (pathname.startsWith("/admin")) return "admin"
  if (pathname.startsWith("/technician")) return "technician"
  if (pathname.startsWith("/physician")) return "physician"
  
  return null
}

// Function to detect role from current path with sessionStorage fallback
function getRoleFromPath(pathname: string): UserRole {
  // Try to get role from path first
  const roleFromPath = getRoleFromPathOnly(pathname)
  if (roleFromPath) return roleFromPath
  
  // For non-role-specific paths (like /profile, /settings), return stored role
  const storedRole = sessionStorage.getItem("currentUserRole")
  if (storedRole) return storedRole as UserRole
  
  return "radiologist" // default
}

// Store current role in sessionStorage whenever path changes
function storeCurrentRole(pathname: string) {
  const roleFromPath = getRoleFromPathOnly(pathname)
  if (roleFromPath) {
    // Only update sessionStorage if we can determine role from path
    sessionStorage.setItem("currentUserRole", roleFromPath)
  }
  // If roleFromPath is null (e.g., /profile), keep the existing sessionStorage value
}

// Sidebar Header Content Component
function SidebarHeaderContent() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          size="lg" 
          className="!overflow-visible [&_svg]:!h-7 [&_svg]:!w-auto"
        >
          <div className="flex items-center h-7 gap-2 justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
            <LogoIcon className="h-7 w-auto shrink-0" />
            <span className="text-sm font-semibold whitespace-nowrap transition-[opacity,max-width] duration-200 ease-linear opacity-100 max-w-[200px] group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:hidden">
              RadiologyIQ
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function GlobalSidebar({ sidebarHeader, sidebarFooter, currentRole }: GlobalSidebarProps) {
  const { isMobile, setOpenMobile, toggleSidebar } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Detect role from current path
  const detectedRole = getRoleFromPath(location.pathname)
  const activeRole = currentRole || detectedRole

  // Store role in sessionStorage whenever location changes
  React.useEffect(() => {
    storeCurrentRole(location.pathname)
  }, [location.pathname])

  // Get sidebar items based on current role
  const sidebarItems = getSidebarItemsForRole(activeRole)

  // Handle role change
  const handleRoleChange = (newRole: UserRole) => {
    // Navigate to the home page of the new role
    const roleHomePaths: Record<UserRole, string> = {
      radiologist: "/dashboard/radiologist",
      senior_radiologist: "/dashboard/senior-radiologist",
      admin: "/dashboard/admin",
      superadmin: "/superadmin/dashboard",
      technician: "/dashboard/technician",
      qc_technician: "/dashboard/qc-technician",
      physician: "/dashboard/physician",
    }
    navigate(roleHomePaths[newRole])
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="cursor-pointer" onClick={toggleSidebar}>
        {sidebarHeader || <SidebarHeaderContent />}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const label = item.label
                const isDisabled = 'disabled' in item && item.disabled
                const isActive = !isDisabled && (item.href === location.pathname || 
                                 (item.href !== "/" && location.pathname.startsWith(item.href)))
                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      asChild={!!item.href && !isDisabled}
                      tooltip={label}
                      isActive={isActive}
                      onClick={
                        isDisabled
                          ? (e: React.MouseEvent) => e.preventDefault()
                          : item.href && isMobile
                            ? () => setOpenMobile(false)
                            : undefined
                      }
                      className={isDisabled ? "opacity-40 cursor-not-allowed select-none" : ""}
                    >
                      {item.href && !isDisabled ? (
                        <Link to={item.href}>
                          <Icon strokeWidth={ICON_STROKE_WIDTH} />
                          <span>{label}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Icon strokeWidth={ICON_STROKE_WIDTH} className="size-4 shrink-0" />
                          <span className="truncate group-data-[collapsible=icon]:hidden">{label}</span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {sidebarFooter || (
          <SidebarMenu>
            <SidebarMenuItem>
              <RoleSwitcher currentRole={activeRole} onRoleChange={handleRoleChange} />
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}