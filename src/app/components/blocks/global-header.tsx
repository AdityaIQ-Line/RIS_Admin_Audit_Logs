import * as React from "react"
import { Link, useLocation } from "react-router"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { SidebarTrigger } from "../ui/sidebar"
import { ThemeToggle } from "../theme-toggle"
import { cn } from "../ui/utils"
import { Bell, User, LogOut, Settings, AlertCircle, Info, AlertTriangle, Clock } from "lucide-react"
import { generateBreadcrumbs, type BreadcrumbItem as BreadcrumbItemType } from "../../../lib/navigation"
import type { UserRole } from "../../../lib/sidebar-config"

// Function to detect role from current path
function getRoleFromPath(pathname: string): UserRole {
  // Check session storage first for shared paths (templates, audit logs, etc.)
  // This prevents role switching when accessing shared resources
  const sharedPaths = ['/radiologist/templates', '/admin/audit-logs']
  if (sharedPaths.some(path => pathname.startsWith(path))) {
    const storedRole = sessionStorage.getItem("currentUserRole")
    if (storedRole) return storedRole as UserRole
  }
  
  if (pathname.startsWith("/dashboard")) {
    if (pathname.startsWith("/dashboard/senior-radiologist")) return "senior_radiologist"
    if (pathname.startsWith("/dashboard/radiologist")) return "radiologist"
    if (pathname.startsWith("/dashboard/admin")) return "admin"
    if (pathname.startsWith("/dashboard/technician")) return "technician"
    if (pathname.startsWith("/dashboard/physician")) return "physician"
  }
  if (pathname.startsWith("/superadmin")) return "superadmin"
  if (pathname.startsWith("/senior-radiologist")) return "senior_radiologist"
  if (pathname.startsWith("/radiologist")) return "radiologist"
  if (pathname.startsWith("/admin")) return "admin"
  if (pathname.startsWith("/technician")) return "technician"
  if (pathname.startsWith("/physician")) return "physician"
  
  // Check session storage for last known role
  const storedRole = sessionStorage.getItem("currentUserRole")
  if (storedRole) return storedRole as UserRole
  
  return "radiologist" // default
}

// Role-specific user data
const userDataByRole: Record<UserRole, { name: string; email: string; avatar: string }> = {
  admin: {
    name: "James Park",
    email: "james.park@apollodiagnostics.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JamesPark",
  },
  superadmin: {
    name: "Admin User",
    email: "admin@radiologyiq.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser",
  },
  radiologist: {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@apollodiagnostics.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen",
  },
  senior_radiologist: {
    name: "Dr. Michael Roberts",
    email: "michael.roberts@apollodiagnostics.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelRoberts",
  },
  technician: {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@apollodiagnostics.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshKumar",
  },
  physician: {
    name: "Dr. Anil Mehta",
    email: "anil.mehta@cityhospital.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnilMehta",
  },
}

// Role-specific notifications
type NotificationType = "critical" | "warning" | "info"

interface Notification {
  type: NotificationType
  title: string
  description: string
  time: string
}

const notificationsByRole: Record<UserRole, Notification[]> = {
  radiologist: [
    {
      type: "critical",
      title: "STAT Case Alert",
      description: "STAT CT Brain - Suspected stroke (Patient: John Doe, MRN: 45678)",
      time: "5 mins ago",
    },
    {
      type: "critical",
      title: "STAT Case Alert",
      description: "STAT Chest X-Ray - Trauma case (Patient: Jane Smith, MRN: 78901)",
      time: "12 mins ago",
    },
    {
      type: "info",
      title: "Peer Review Feedback",
      description: "Dr. Sarah Johnson provided feedback on Case #23456",
      time: "1 hour ago",
    },
    {
      type: "warning",
      title: "Overdue Report Reminder",
      description: "MRI Lumbar Spine (MRN: 34567) - Due 2 hours ago",
      time: "2 hours ago",
    },
  ],
  senior_radiologist: [
    {
      type: "warning",
      title: "Reports Pending Review",
      description: "3 reports awaiting your authorization",
      time: "10 mins ago",
    },
    {
      type: "critical",
      title: "STAT Case Alert",
      description: "STAT CT Chest - Critical finding requires senior review",
      time: "25 mins ago",
    },
    {
      type: "info",
      title: "Quality Metrics Update",
      description: "Monthly quality scorecard is now available",
      time: "3 hours ago",
    },
  ],
  admin: [
    {
      type: "warning",
      title: "System Alert",
      description: "PACS storage at 85% capacity",
      time: "30 mins ago",
    },
    {
      type: "critical",
      title: "Unassigned Studies",
      description: "5 urgent studies need radiologist assignment",
      time: "1 hour ago",
    },
    {
      type: "info",
      title: "New User Registration",
      description: "Dr. Emily Rodriguez has been added to the system",
      time: "2 hours ago",
    },
  ],
  superadmin: [
    {
      type: "critical",
      title: "Facility Alert",
      description: "Apollo Diagnostics - PACS connection failed",
      time: "15 mins ago",
    },
    {
      type: "warning",
      title: "License Expiring",
      description: "City Hospital license expires in 7 days",
      time: "2 hours ago",
    },
    {
      type: "info",
      title: "New Facility Request",
      description: "Metro Imaging Center requested onboarding",
      time: "4 hours ago",
    },
  ],
  technician: [
    {
      type: "critical",
      title: "STAT Study Request",
      description: "STAT CT Chest - Patient in ER (Room: CT-1)",
      time: "8 mins ago",
    },
    {
      type: "warning",
      title: "Equipment Alert",
      description: "MRI-2 maintenance due in 2 days",
      time: "1 hour ago",
    },
    {
      type: "info",
      title: "Schedule Update",
      description: "Tomorrow's schedule updated with 3 new appointments",
      time: "3 hours ago",
    },
  ],
  physician: [
    {
      type: "critical",
      title: "Critical Report Available",
      description: "STAT CT Brain - John Doe (MRN: 45678)",
      time: "10 mins ago",
    },
    {
      type: "info",
      title: "Report Available",
      description: "Chest X-Ray - Jane Smith (MRN: 78901)",
      time: "2 hours ago",
    },
    {
      type: "info",
      title: "Report Available",
      description: "MRI Lumbar Spine - Robert Lee (MRN: 34567)",
      time: "5 hours ago",
    },
  ],
}

interface GlobalHeaderProps {
  breadcrumbs?: BreadcrumbItemType[]
  onLogout?: () => void
  userName?: string
  userEmail?: string
  userAvatar?: string
}

export function GlobalHeader({
  breadcrumbs,
  onLogout,
  userName = "Dr. Sarah Chen",
  userEmail = "s.chen@radiologyiq.com",
  userAvatar,
}: GlobalHeaderProps) {
  const location = useLocation()

  // Generate breadcrumbs from route if not provided
  const getBreadcrumbs = React.useMemo(() => {
    return generateBreadcrumbs(location.pathname, breadcrumbs)
  }, [breadcrumbs, location.pathname])

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      console.log("Logout clicked")
    }
  }

  // Detect role from path
  const role = getRoleFromPath(location.pathname)

  // Get user data based on role
  const userData = userDataByRole[role] || {
    name: "Dr. Sarah Chen",
    email: "s.chen@radiologyiq.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen",
  }

  // Get notifications for current role
  const notifications = notificationsByRole[role] || []
  const unreadCount = notifications.length

  // Default state for all header icon buttons (muted pill — consistent across Notifications, ThemeToggle, User, SidebarTrigger)
  const headerIconButtonClass =
    "size-8 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-[var(--radius-button)]"

  // Get icon and color for notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "critical":
        return <AlertCircle strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 text-destructive flex-shrink-0" />
      case "warning":
        return <AlertTriangle strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      case "info":
        return <Info strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="w-full flex h-10 items-center gap-4 px-4">
        {/* Sidebar toggle (collapsible) */}
        <SidebarTrigger className={cn("md:flex", headerIconButtonClass)} />
        {/* Left Side - Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {getBreadcrumbs.map((item, index) => {
                const isLast = index === getBreadcrumbs.length - 1
                return [
                  <BreadcrumbItem key={`item-${index}`}>
                    {isLast || !item.href ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>,
                  !isLast && <BreadcrumbSeparator key={`sep-${index}`} />,
                ]
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Side - Icons & User Menu */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className={cn("relative", headerIconButtonClass)}
              >
                <Bell strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-medium pointer-events-none"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>
                <div className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <DropdownMenuItem 
                      key={index}
                      className="flex items-start gap-3 p-3 cursor-pointer"
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock strokeWidth={ICON_STROKE_WIDTH} className="h-3 w-3" />
                          {notification.time}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle triggerClassName={headerIconButtonClass} />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn("flex items-center gap-2 h-8 px-2.5", headerIconButtonClass)}
              >
                <Avatar className="size-6">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-muted-foreground/20 text-muted-foreground">
                    <User strokeWidth={ICON_STROKE_WIDTH} className="size-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium max-w-[120px] truncate">
                  {userData.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userData.name}</p>
                  <p className="text-xs text-muted-foreground">{userData.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut strokeWidth={ICON_STROKE_WIDTH} className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}