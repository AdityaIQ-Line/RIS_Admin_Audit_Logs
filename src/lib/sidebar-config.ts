import { 
  Home, 
  FileText, 
  ClipboardList, 
  Users, 
  Building2,
  BarChart3,
  ScrollText,
} from "lucide-react"

/**
 * Role-Based Sidebar Configuration
 * 
 * Admin-only navigation items that appear in the sidebar.
 * This implements RBAC (Role-Based Access Control) at the UI level.
 */

// Admin Navigation
export const ADMIN_SIDEBAR_ITEMS = [
  {
    label: "Home",
    icon: Home,
    href: "/dashboard/admin",
    disabled: true,
  },
  {
    label: "Imaging Worklist",
    icon: ClipboardList,
    href: "/admin/worklist",
    disabled: true,
  },
  {
    label: "User Management",
    icon: Users,
    href: "/admin/users",
    disabled: true,
  },
  {
    label: "Facility Details",
    icon: Building2,
    href: "/admin/facility",
    disabled: true,
  },
  {
    label: "Analyzing & Monitoring",
    icon: BarChart3,
    href: "/admin/analytics",
    disabled: true,
  },
  {
    label: "Audit Logs",
    icon: ScrollText,
    href: "/admin/audit-logs",
    disabled: false,
  },
] as const

// Default sidebar items
export const SIDEBAR_ITEMS = ADMIN_SIDEBAR_ITEMS

// Role type definition
export type UserRole = "admin"

// Function to get sidebar items based on role
export function getSidebarItemsForRole(role: UserRole) {
  return ADMIN_SIDEBAR_ITEMS
}