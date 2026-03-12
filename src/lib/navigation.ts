/**
 * Navigation Utilities
 * 
 * Centralized navigation logic following the canonical guide's principle
 * of separating navigation concerns from UI components.
 */

export interface BreadcrumbItem {
  label: string
  href?: string
}

// Role type definition (duplicated here to avoid circular dependencies)
type UserRole = "radiologist" | "senior_radiologist" | "admin" | "technician" | "qc_technician" | "physician" | "superadmin"

/**
 * Get the current user role from session storage
 */
function getCurrentRole(): UserRole {
  const storedRole = sessionStorage.getItem("currentUserRole")
  return (storedRole as UserRole) || "radiologist"
}

/**
 * Get the proper role label for breadcrumbs
 */
function getRoleLabelForBreadcrumb(pathname: string): string {
  // For shared paths, use the current role from session storage
  const sharedPaths = ['/radiologist/templates', '/admin/audit-logs']
  if (sharedPaths.some(path => pathname.startsWith(path))) {
    const currentRole = getCurrentRole()
    switch (currentRole) {
      case "superadmin":
        return "Super Admin"
      case "senior_radiologist":
        return "Senior Radiologist"
      case "admin":
        return "Admin"
      case "radiologist":
        return "Radiologist"
      case "technician":
        return "Technician"
      case "qc_technician":
        return "QC Technician"
      case "physician":
        return "Physician"
      default:
        return "Radiologist"
    }
  }
  
  // For non-shared paths, extract role from the path
  if (pathname.startsWith("/dashboard/")) {
    if (pathname.startsWith("/dashboard/senior-radiologist")) return "Senior Radiologist"
    if (pathname.startsWith("/dashboard/radiologist")) return "Radiologist"
    if (pathname.startsWith("/dashboard/admin")) return "Admin"
    if (pathname.startsWith("/dashboard/technician")) return "Technician"
    if (pathname.startsWith("/dashboard/qc-technician")) return "QC Technician"
    if (pathname.startsWith("/dashboard/physician")) return "Physician"
  }
  if (pathname.startsWith("/superadmin")) return "Super Admin"
  if (pathname.startsWith("/senior-radiologist")) return "Senior Radiologist"
  if (pathname.startsWith("/radiologist")) return "Radiologist"
  if (pathname.startsWith("/admin")) return "Admin"
  if (pathname.startsWith("/technician")) return "Technician"
  if (pathname.startsWith("/qc-technician")) return "QC Technician"
  if (pathname.startsWith("/physician")) return "Physician"
  
  return ""
}

/**
 * Format a URL path segment into a human-readable label
 * 
 * @example
 * formatPathSegment("patient-details") // "Patient Details"
 * formatPathSegment("dashboard") // "Dashboard"
 */
export function formatPathSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Generate breadcrumbs from a pathname
 * 
 * @param pathname - Current pathname (e.g., "/dashboard/settings")
 * @param customBreadcrumbs - Optional custom breadcrumbs to override auto-generation
 * @returns Array of breadcrumb items
 * 
 * @example
 * generateBreadcrumbs("/dashboard/settings")
 * // Returns: [
 * //   { label: "Home", href: "/" },
 * //   { label: "Dashboard", href: "/dashboard" },
 * //   { label: "Settings" }
 * // ]
 */
export function generateBreadcrumbs(
  pathname: string,
  customBreadcrumbs?: BreadcrumbItem[]
): BreadcrumbItem[] {
  if (customBreadcrumbs) {
    return customBreadcrumbs
  }

  const pathSegments = pathname.split("/").filter(Boolean)
  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
  ]

  if (pathSegments.length === 0) {
    return [{ label: "Home" }]
  }

  // Check if this is a shared path (like /radiologist/templates)
  const sharedPaths = ['/radiologist/templates', '/admin/audit-logs']
  const isSharedPath = sharedPaths.some(path => pathname.startsWith(path))
  
  let currentPath = ""
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    // For shared paths, replace role-based segments with actual current role
    let label = formatPathSegment(segment)
    if (isSharedPath && index === 0) {
      // First segment is the role (radiologist, admin, etc.)
      // Replace it with the current user's role
      label = getRoleLabelForBreadcrumb(pathname)
    }
    
    items.push({
      label: label,
      href: isLast ? undefined : currentPath,
    })
  })

  return items
}

/**
 * Check if a route is currently active
 * 
 * @param currentPath - Current pathname
 * @param targetPath - Target path to check
 * @param exact - If true, requires exact match. If false, matches prefix (default: false)
 * @returns True if the route is active
 * 
 * @example
 * isActiveRoute("/dashboard", "/dashboard") // true
 * isActiveRoute("/dashboard/settings", "/dashboard") // true (prefix match)
 * isActiveRoute("/dashboard/settings", "/dashboard", true) // false (exact match)
 */
export function isActiveRoute(
  currentPath: string,
  targetPath: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return currentPath === targetPath
  }
  
  // Prefix match - useful for highlighting parent routes
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}

/**
 * Get a human-readable label for a route
 * 
 * @param pathname - Pathname to get label for
 * @returns Formatted label
 * 
 * @example
 * getRouteLabel("/dashboard") // "Dashboard"
 * getRouteLabel("/patient-details") // "Patient Details"
 */
export function getRouteLabel(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) {
    return "Home"
  }
  
  // Return the last segment formatted
  return formatPathSegment(segments[segments.length - 1])
}

/**
 * Safely build a path from segments
 * 
 * @param segments - Path segments to join
 * @returns Properly formatted path
 * 
 * @example
 * buildPath("dashboard", "settings") // "/dashboard/settings"
 * buildPath("/dashboard", "/settings") // "/dashboard/settings"
 * buildPath("dashboard/", "/settings") // "/dashboard/settings"
 */
export function buildPath(...segments: string[]): string {
  const normalized = segments
    .filter(Boolean)
    .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/")
  
  return normalized ? `/${normalized}` : "/"
}