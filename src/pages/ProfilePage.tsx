import * as React from "react"
import { useLocation } from "react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../app/components/ui/card"
import { Button } from "../app/components/ui/button"
import { Input } from "../app/components/ui/input"
import { Label } from "../app/components/ui/label"
import { Separator } from "../app/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../app/components/ui/avatar"
import { Badge } from "../app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../app/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Key,
  Activity,
  Clock,
  FileText,
  Settings,
  Camera,
  Save,
  Edit,
} from "lucide-react"
import { ICON_STROKE_WIDTH } from "../lib/constants"
import type { UserRole } from "../lib/sidebar-config"
import { toast } from "sonner"

// Function to detect role from current path
function getRoleFromPath(pathname: string): UserRole {
  // Check for shared paths - prioritize session storage for these
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
  return "radiologist" // default
}

// Function to detect role from referrer or current path
function detectUserRole(): UserRole {
  // Check if we came from a specific role path
  const referrer = document.referrer
  if (referrer) {
    const referrerPath = new URL(referrer).pathname
    const roleFromReferrer = getRoleFromPath(referrerPath)
    if (roleFromReferrer !== "radiologist") return roleFromReferrer
  }
  
  // Check current path
  const currentPath = window.location.pathname
  const roleFromPath = getRoleFromPath(currentPath)
  if (roleFromPath !== "radiologist") return roleFromPath
  
  // Check session storage for last known role
  const storedRole = sessionStorage.getItem("currentUserRole")
  if (storedRole) return storedRole as UserRole
  
  return "radiologist" // default
}

// Role-specific user data
const userDataByRole: Record<UserRole, any> = {
  admin: {
    name: "James Park",
    email: "james.park@apollodiagnostics.com",
    phone: "+91 80 1234 5678",
    role: "Admin",
    facility: "Apollo Diagnostics - Main Branch",
    employeeId: "ADM-2024-001",
    department: "Administration",
    joinDate: "January 15, 2024",
    lastLogin: "Today at 9:30 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JamesPark",
    stats: {
      usersManaged: 45,
      reportsApproved: 234,
      systemUptime: "99.8%",
      activeUsers: 38,
    },
  },
  superadmin: {
    name: "Admin User",
    email: "admin@radiologyiq.com",
    phone: "+91 80 9999 0000",
    role: "Super Admin",
    facility: "All Facilities (Platform Level)",
    employeeId: "SADM-2024-001",
    department: "Platform Administration",
    joinDate: "January 1, 2024",
    lastLogin: "Today at 8:00 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser",
    stats: {
      totalFacilities: 24,
      totalUsers: 347,
      platformUptime: "99.9%",
      activeOrganizations: 18,
    },
  },
  radiologist: {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@apollodiagnostics.com",
    phone: "+91 80 2345 6789",
    role: "Radiologist",
    facility: "Apollo Diagnostics - Main Branch",
    employeeId: "RAD-2024-012",
    department: "Radiology",
    joinDate: "February 10, 2024",
    lastLogin: "Today at 9:00 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen",
    licenseNumber: "MCI-RAD-2019-45678",
    specialization: "Musculoskeletal Imaging",
    stats: {
      reportsCompleted: 1847,
      pendingCases: 12,
      avgTAT: "45 mins",
      accuracy: "98.5%",
    },
  },
  senior_radiologist: {
    name: "Dr. Michael Roberts",
    email: "michael.roberts@apollodiagnostics.com",
    phone: "+91 80 3456 7890",
    role: "Senior Radiologist",
    facility: "Apollo Diagnostics - Main Branch",
    employeeId: "SRAD-2024-003",
    department: "Radiology",
    joinDate: "January 20, 2024",
    lastLogin: "Today at 8:30 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelRoberts",
    licenseNumber: "MCI-RAD-2015-12345",
    specialization: "Neuroradiology",
    stats: {
      reportsReviewed: 456,
      reportsApproved: 423,
      pendingReviews: 8,
      avgReviewTime: "15 mins",
    },
  },
  technician: {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@apollodiagnostics.com",
    phone: "+91 80 4567 8901",
    role: "Technician",
    facility: "Apollo Diagnostics - Main Branch",
    employeeId: "TECH-2024-025",
    department: "Imaging Department",
    joinDate: "March 5, 2024",
    lastLogin: "Today at 7:45 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshKumar",
    certification: "DMRT, CT/MRI Certified",
    stats: {
      scansCompleted: 2134,
      pendingScans: 5,
      avgScanTime: "12 mins",
      qualityScore: "96%",
    },
  },
  physician: {
    name: "Dr. Anil Mehta",
    email: "anil.mehta@cityhospital.com",
    phone: "+91 80 6789 0123",
    role: "Referring Physician",
    facility: "City General Hospital",
    employeeId: "PHY-2024-042",
    department: "Internal Medicine",
    joinDate: "January 25, 2024",
    lastLogin: "Today at 10:00 AM",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnilMehta",
    licenseNumber: "MCI-PHY-2018-98765",
    specialization: "Internal Medicine",
    stats: {
      referralsSent: 234,
      reportsViewed: 189,
      pendingReports: 6,
      avgResponseTime: "2 hours",
    },
  },
}

export function ProfilePage() {
  const location = useLocation()
  const currentRole = detectUserRole()
  const userData = userDataByRole[currentRole]

  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  })

  const handleSave = () => {
    // Simulate save
    toast.success("Profile updated successfully!")
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    })
    setIsEditing(false)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "Admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "Senior Radiologist":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
      case "Radiologist":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Technician":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "Referring Physician":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile photo</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="size-32">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full size-10"
                  >
                    <Camera className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
                  </Button>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">{userData.name}</h3>
                  <Badge className={getRoleBadgeColor(userData.role)}>
                    {userData.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details Card */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm block">{userData.name}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm block">{userData.email}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm block">{userData.phone}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Shield className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Role
                    </Label>
                    <span className="text-sm block">{userData.role}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Facility
                    </Label>
                    <span className="text-sm block">{userData.facility}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Employee ID
                    </Label>
                    <span className="text-sm block">{userData.employeeId}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Department
                    </Label>
                    <span className="text-sm block">{userData.department}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Join Date
                    </Label>
                    <span className="text-sm block">{userData.joinDate}</span>
                  </div>

                  {userData.licenseNumber && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                        License Number
                      </Label>
                      <span className="text-sm block">{userData.licenseNumber}</span>
                    </div>
                  )}

                  {userData.specialization && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Activity className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                        Specialization
                      </Label>
                      <span className="text-sm block">{userData.specialization}</span>
                    </div>
                  )}

                  {userData.certification && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                        Certifications
                      </Label>
                      <span className="text-sm block">{userData.certification}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
              <CardDescription>Your key performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(userData.stats).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and login history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="size-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Activity className="size-5 text-green-700 dark:text-green-300" strokeWidth={ICON_STROKE_WIDTH} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Logged in successfully</p>
                  <p className="text-xs text-muted-foreground">{userData.lastLogin}</p>
                </div>
              </div>

              {currentRole === "radiologist" && (
                <>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FileText className="size-5 text-blue-700 dark:text-blue-300" strokeWidth={ICON_STROKE_WIDTH} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed report for Case #12345</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 5:45 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <FileText className="size-5 text-purple-700 dark:text-purple-300" strokeWidth={ICON_STROKE_WIDTH} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reviewed 8 cases</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 2:30 PM</p>
                    </div>
                  </div>
                </>
              )}

              {currentRole === "admin" && (
                <>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="size-5 text-blue-700 dark:text-blue-300" strokeWidth={ICON_STROKE_WIDTH} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Added new user: Dr. Emily Watson</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 4:20 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Settings className="size-5 text-purple-700 dark:text-purple-300" strokeWidth={ICON_STROKE_WIDTH} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Updated system settings</p>
                      <p className="text-xs text-muted-foreground">2 days ago at 11:15 AM</p>
                    </div>
                  </div>
                </>
              )}

              {currentRole === "superadmin" && (
                <>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Building2 className="size-5 text-blue-700 dark:text-blue-300" strokeWidth={ICON_STROKE_WIDTH} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Created new facility: RadCare Center</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 3:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Settings className="size-5 text-purple-700 dark:text-purple-300" strokeWidth={ICON_STROKE_WIDTH} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Updated platform configuration</p>
                      <p className="text-xs text-muted-foreground">2 days ago at 10:00 AM</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Key className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                Update Password
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
              <CardDescription>Details about your current session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Last Login</span>
                <span className="text-sm font-medium">{userData.lastLogin}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Session Started</span>
                <span className="text-sm font-medium">Today at 9:30 AM</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">IP Address</span>
                <span className="text-sm font-medium">192.168.1.45</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}