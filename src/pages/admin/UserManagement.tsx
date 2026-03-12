import * as React from "react"
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  UserCog,
  Eye,
} from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../lib/constants"
import { Button } from "../../app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../app/components/ui/card"
import { Input } from "../../app/components/ui/input"
import { Label } from "../../app/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../app/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../app/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../app/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../app/components/ui/table"
import { Badge } from "../../app/components/ui/badge"
import { PageShell } from "../../app/components/layouts/page-shell"
import { PageHeader } from "../../app/components/blocks/page-header"
import { Switch } from "../../app/components/ui/switch"
import { MultiSelect } from "../../app/components/ui/multi-select"
import { ViewUserDetailsDialog } from "../../app/components/admin/ViewUserDetailsDialog"
import { WorklistFilterBar, FilterConfig } from "../../app/components/tables/worklist-filter-bar"
import { WorklistTable, WorklistTableHeader } from "../../app/components/tables/worklist-table"
import { StatCard } from "../../app/components/cards/stat-card"
import { Pagination } from "../../app/components/ui/pagination"

/**
 * ADMIN ONLY - USER MANAGEMENT
 * 
 * RBAC RULES:
 * - Only Admin role can access this screen
 * - Can create, edit, deactivate users
 * - Can assign/change user roles
 * - Can reset passwords
 * - Cannot delete users (deactivate only for audit trail)
 * 
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/users - List all users with pagination
 * - POST /api/admin/users - Create new user
 * - PUT /api/admin/users/:id - Update user
 * - PATCH /api/admin/users/:id/toggle - Toggle active status
 * - POST /api/admin/users/:id/reset-password - Send password reset
 * - Implement role-based filtering and search
 */

interface User {
  id: string
  employeeId: string
  fullName: string
  firstName: string
  lastName: string
  gender?: string
  dateOfBirth?: string
  email: string
  phone: string
  username: string
  role: "Admin" | "Radiologist" | "Senior Radiologist" | "Technician" | "Referring Physician" | "Super Admin"
  status: "Active" | "Inactive"
  lastLogin: string
  createdDate: string
  createdBy?: string
  lastModified?: string
  lastModifiedBy?: string
  department?: string
  
  // Technician specific
  shiftStart?: string
  shiftEnd?: string
  
  // Radiologist specific
  subRole?: string // Junior Radiologist or Senior Radiologist
  registrationNo?: string
  qualification?: string
  specialty?: string
  designation?: string
  modalityAccess?: string[]
  signature?: string
  availabilityHours?: string
  availabilityDays?: string[]
  
  // Common professional
  experience?: string
  licenseNumber?: string
}

// Mock users data
const mockUsersData: User[] = [
  {
    id: "USR-001",
    employeeId: "EMP-001",
    fullName: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@radiq.com",
    phone: "+1 (555) 123-4567",
    username: "sarah.johnson",
    role: "Radiologist",
    status: "Active",
    lastLogin: "2025-01-14 08:45",
    createdDate: "2024-01-10",
    createdBy: "Admin",
    lastModified: "2025-01-10 10:30",
    lastModifiedBy: "Admin",
    department: "Radiology",
    licenseNumber: "RAD-12345",
    subRole: "Senior Radiologist",
    registrationNo: "REG-12345",
    qualification: "MD",
    specialty: "Neurology",
    designation: "Radiologist",
    modalityAccess: ["CT", "MRI"],
    signature: "signature1.png",
    availabilityHours: "8:00 AM - 5:00 PM",
    availabilityDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    experience: "5 years",
  },
  {
    id: "USR-002",
    employeeId: "EMP-002",
    fullName: "Michael Chen",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@radiq.com",
    phone: "+1 (555) 123-4568",
    username: "michael.chen",
    role: "Radiologist",
    status: "Active",
    lastLogin: "2025-01-14 09:12",
    createdDate: "2024-01-08",
    createdBy: "Admin",
    lastModified: "2025-01-12 14:20",
    lastModifiedBy: "Super Admin",
    department: "Radiology",
    licenseNumber: "RAD-12346",
    subRole: "Junior Radiologist",
    registrationNo: "REG-12346",
    qualification: "MD",
    specialty: "Cardiology",
    designation: "Radiologist",
    modalityAccess: ["CT", "MRI"],
    signature: "signature2.png",
    availabilityHours: "8:00 AM - 5:00 PM",
    availabilityDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    experience: "3 years",
  },
  {
    id: "USR-003",
    employeeId: "EMP-003",
    fullName: "Emily Wong",
    firstName: "Emily",
    lastName: "Wong",
    email: "emily.wong@radiq.com",
    phone: "+1 (555) 123-4569",
    username: "emily.wong",
    role: "Radiologist",
    status: "Active",
    lastLogin: "2025-01-13 16:30",
    createdDate: "2024-01-05",
    createdBy: "Admin",
    lastModified: "2025-01-05 11:00",
    lastModifiedBy: "Admin",
    department: "Radiology",
    licenseNumber: "RAD-12347",
    subRole: "Senior Radiologist",
    registrationNo: "REG-12347",
    qualification: "MD",
    specialty: "Orthopedics",
    designation: "Consultant Radiologist",
    modalityAccess: ["CT", "MRI"],
    signature: "signature3.png",
    availabilityHours: "8:00 AM - 5:00 PM",
    availabilityDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    experience: "4 years",
  },
  {
    id: "USR-004",
    employeeId: "EMP-004",
    fullName: "David Kumar",
    firstName: "David",
    lastName: "Kumar",
    email: "david.kumar@radiq.com",
    phone: "+1 (555) 123-4570",
    username: "david.kumar",
    role: "Technician",
    status: "Active",
    lastLogin: "2025-01-14 07:30",
    createdDate: "2024-01-07",
    createdBy: "Admin",
    lastModified: "2024-12-20 09:15",
    lastModifiedBy: "Admin",
    department: "Imaging",
    licenseNumber: "TECH-78901",
    shiftStart: "8:00 AM",
    shiftEnd: "4:00 PM",
  },
  {
    id: "USR-005",
    employeeId: "EMP-005",
    fullName: "Lisa Martinez",
    firstName: "Lisa",
    lastName: "Martinez",
    email: "lisa.martinez@radiq.com",
    phone: "+1 (555) 123-4571",
    username: "lisa.martinez",
    role: "Technician",
    status: "Active",
    lastLogin: "2025-01-14 08:15",
    createdDate: "2024-01-09",
    createdBy: "Admin",
    lastModified: "2025-01-08 16:45",
    lastModifiedBy: "Admin",
    department: "Imaging",
    licenseNumber: "TECH-78902",
    shiftStart: "8:00 AM",
    shiftEnd: "4:00 PM",
  },
  {
    id: "USR-007",
    employeeId: "EMP-007",
    fullName: "Jennifer Lee",
    firstName: "Jennifer",
    lastName: "Lee",
    email: "jennifer.lee@hospital.com",
    phone: "+1 (555) 123-4573",
    username: "jennifer.lee",
    role: "Referring Physician",
    status: "Active",
    lastLogin: "2025-01-13 14:20",
    createdDate: "2024-01-15",
    createdBy: "Admin",
    lastModified: "2025-01-11 10:00",
    lastModifiedBy: "Super Admin",
    department: "Cardiology",
    licenseNumber: "MD-56789",
  },
  {
    id: "USR-008",
    employeeId: "EMP-008",
    fullName: "James Park",
    firstName: "James",
    lastName: "Park",
    email: "james.park@radiq.com",
    phone: "+1 (555) 123-4574",
    username: "james.park",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-01-14 09:00",
    createdDate: "2024-01-01",
    createdBy: "Super Admin",
    lastModified: "2024-06-15 12:00",
    lastModifiedBy: "Super Admin",
    department: "IT",
  },
  {
    id: "USR-009",
    employeeId: "EMP-009",
    fullName: "Maria Garcia",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@radiq.com",
    phone: "+1 (555) 123-4575",
    username: "maria.garcia",
    role: "Radiologist",
    status: "Inactive",
    lastLogin: "2024-12-20 17:45",
    createdDate: "2024-01-11",
    createdBy: "Admin",
    lastModified: "2024-12-22 10:30",
    lastModifiedBy: "Admin",
    department: "Radiology",
    licenseNumber: "RAD-12348",
    registrationNo: "REG-12348",
    qualification: "MD",
    specialty: "Radiology",
    designation: "Radiologist",
    modalityAccess: ["CT", "MRI"],
    signature: "signature4.png",
    availabilityHours: "8:00 AM - 5:00 PM",
    availabilityDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    experience: "6 years",
  },
]

export function UserManagement() {
  const [users, setUsers] = React.useState<User[]>(mockUsersData)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage] = React.useState(10)

  // Form state
  const [formData, setFormData] = React.useState({
    employeeId: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    role: "",
    status: "Active" as "Active" | "Inactive",
    department: "",
    
    // Technician specific
    shiftStart: "",
    shiftEnd: "",
    
    // Radiologist specific
    subRole: "", // Junior/Senior Radiologist selection
    designation: "", // Custom designation input
    registrationNo: "",
    qualification: "",
    specialty: "",
    modalityAccess: [] as string[],
    signature: null as File | null,
    availabilityHours: [] as string[], // Changed to array for multi-select
    availabilityDays: [] as string[],
    
    // Common professional
    experience: "",
    licenseNumber: "",
  })

  // Phone validation handler
  const handlePhoneChange = (value: string) => {
    // Only allow digits and limit to 10
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
    setFormData({ ...formData, phone: digitsOnly })
  }

  // Filter logic
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))
  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }, [filteredUsers, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, roleFilter, statusFilter])

  // Handle create user
  const handleCreateUser = () => {
    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      employeeId: `EMP-${String(users.length + 1).padStart(3, '0')}`,
      fullName: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      username: formData.email.split('@')[0],
      role: formData.role as User["role"],
      status: "Active",
      lastLogin: "Never",
      createdDate: new Date().toISOString().split('T')[0],
      department: formData.department,
      licenseNumber: formData.licenseNumber || undefined,
      subRole: formData.subRole || undefined,
      registrationNo: formData.registrationNo || undefined,
      qualification: formData.qualification || undefined,
      specialty: formData.specialty || undefined,
      designation: formData.designation || undefined,
      modalityAccess: formData.modalityAccess || undefined,
      signature: formData.signature ? formData.signature.name : undefined,
      availabilityHours: formData.availabilityHours || undefined,
      availabilityDays: formData.availabilityDays || undefined,
      experience: formData.experience || undefined,
    }

    setUsers([...users, newUser])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  // Handle edit user
  const handleEditUser = () => {
    if (!selectedUser) return

    const updatedUsers = users.map(u => 
      u.id === selectedUser.id 
        ? {
            ...u,
            fullName: formData.fullName,
            firstName: formData.fullName.split(' ')[0] || formData.firstName,
            lastName: formData.fullName.split(' ').slice(1).join(' ') || formData.lastName,
            gender: formData.gender || undefined,
            dateOfBirth: formData.dateOfBirth || undefined,
            email: formData.email,
            phone: formData.phone,
            role: formData.role as User["role"],
            status: formData.status,
            department: formData.department || undefined,
            licenseNumber: formData.licenseNumber || undefined,
            subRole: formData.subRole || undefined,
            shiftStart: formData.shiftStart || undefined,
            shiftEnd: formData.shiftEnd || undefined,
            registrationNo: formData.registrationNo || undefined,
            qualification: formData.qualification || undefined,
            specialty: formData.specialty || undefined,
            designation: formData.designation || undefined,
            modalityAccess: formData.modalityAccess.length > 0 ? formData.modalityAccess : undefined,
            signature: formData.signature ? formData.signature.name : u.signature,
            availabilityHours: formData.availabilityHours.length > 0 ? formData.availabilityHours.join(', ') : undefined,
            availabilityDays: formData.availabilityDays.length > 0 ? formData.availabilityDays : undefined,
            experience: formData.experience || undefined,
            lastModified: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            lastModifiedBy: 'Admin', // In real app, this would be the current logged-in user
          }
        : u
    )

    setUsers(updatedUsers)
    setIsEditDialogOpen(false)
    setSelectedUser(null)
    resetForm()
  }

  // Handle toggle user status
  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" as User["status"] }
        : u
    ))
  }

  // Handle delete user (soft delete - mark as inactive)
  const handleDeleteUser = () => {
    if (!userToDelete) return

    setUsers(users.map(u => 
      u.id === userToDelete 
        ? { ...u, status: "Inactive" as User["status"] }
        : u
    ))
    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  // Open edit dialog
  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormData({
      employeeId: user.employeeId,
      fullName: user.fullName,
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth || "",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      password: "",
      role: user.role,
      status: user.status,
      department: user.department || "",
      shiftStart: user.shiftStart || "",
      shiftEnd: user.shiftEnd || "",
      licenseNumber: user.licenseNumber || "",
      subRole: user.subRole || "",
      registrationNo: user.registrationNo || "",
      qualification: user.qualification || "",
      specialty: user.specialty || "",
      designation: user.designation || "",
      modalityAccess: user.modalityAccess || [],
      signature: null,
      availabilityHours: user.availabilityHours ? (typeof user.availabilityHours === 'string' ? user.availabilityHours.split(', ').filter(Boolean) : user.availabilityHours) : [],
      availabilityDays: user.availabilityDays || [],
      experience: user.experience || "",
    })
    setIsEditDialogOpen(true)
  }

  // Open view details dialog
  const openViewDialog = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      employeeId: "",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      role: "",
      status: "Active" as "Active" | "Inactive",
      department: "",
      
      // Technician specific
      shiftStart: "",
      shiftEnd: "",
      
      // Radiologist specific
      subRole: "", // Junior/Senior Radiologist selection
      designation: "", // Custom designation input
      registrationNo: "",
      qualification: "",
      specialty: "",
      modalityAccess: [] as string[],
      signature: null,
      availabilityHours: [] as string[],
      availabilityDays: [] as string[],
      
      // Common professional
      experience: "",
      licenseNumber: "",
    })
  }

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "default"
      case "Radiologist":
        return "secondary"
      case "Technician":
        return "outline"
      case "Referring Physician":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <PageShell>
      <PageHeader 
        title="User Management" 
        subtitle="Manage system users, roles, and permissions (Admin Only)"
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new user account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Role Selection - First */}
                <div className="space-y-2">
                  <Label htmlFor="create-role" className="text-base font-semibold">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => {
                      setFormData({ 
                        ...formData, 
                        role: value,
                        // Clear designation when changing from Radiologist to another role
                        designation: value === "Radiologist" ? formData.designation : ""
                      })
                    }}
                  >
                    <SelectTrigger id="create-role">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technician">Technician</SelectItem>
                      <SelectItem value="Radiologist">Radiologist</SelectItem>
                      <SelectItem value="Referring Physician">Referring Physician</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub-role Selection - Only for Radiologist */}
                {formData.role === "Radiologist" && (
                  <div className="space-y-2">
                    <Label htmlFor="create-subrole" className="text-base font-semibold">Sub-role *</Label>
                    <Select
                      value={formData.subRole}
                      onValueChange={(value) => setFormData({ ...formData, subRole: value })}
                    >
                      <SelectTrigger id="create-subrole">
                        <SelectValue placeholder="Select Sub-role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior Radiologist">Junior Radiologist</SelectItem>
                        <SelectItem value="Senior Radiologist">Senior Radiologist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* General Details Section */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-base font-semibold">General Details</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-employeeId">Employee ID *</Label>
                      <Input
                        id="create-employeeId"
                        placeholder="EMP-001"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-fullName">Full Name *</Label>
                      <Input
                        id="create-fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger id="create-gender">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-dob">Date of Birth *</Label>
                      <Input
                        id="create-dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-email">Email *</Label>
                      <Input
                        id="create-email"
                        type="email"
                        placeholder="john.doe@radiq.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-mobile">Mobile No. *</Label>
                      <div className="flex gap-2">
                        <Input value="+91" disabled className="w-16" />
                        <Input
                          id="create-mobile"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-username">Username *</Label>
                      <Input
                        id="create-username"
                        placeholder="john.doe"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-password">Password *</Label>
                      <Input
                        id="create-password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as "Active" | "Inactive" })}
                    >
                      <SelectTrigger id="create-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Technician Professional Credentials */}
                {formData.role === "Technician" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-base font-semibold">Professional Credentials</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="create-shiftStart">Shift start at *</Label>
                        <Input
                          id="create-shiftStart"
                          type="time"
                          value={formData.shiftStart}
                          onChange={(e) => setFormData({ ...formData, shiftStart: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create-shiftEnd">Shift end at *</Label>
                        <Input
                          id="create-shiftEnd"
                          type="time"
                          value={formData.shiftEnd}
                          onChange={(e) => setFormData({ ...formData, shiftEnd: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-tech-experience">Experience</Label>
                      <Input
                        id="create-tech-experience"
                        placeholder="e.g., 5 years"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Radiologist Professional Credentials */}
                {formData.role === "Radiologist" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-base font-semibold">Professional Credentials</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="create-designation">Designation *</Label>
                        <Input
                          id="create-designation"
                          placeholder="e.g., Junior Radiologist, Senior Radiologist, Consultant"
                          value={formData.designation}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create-registrationNo">Registration No. *</Label>
                        <Input
                          id="create-registrationNo"
                          placeholder="REG-12345"
                          value={formData.registrationNo}
                          onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create-qualification">Qualification *</Label>
                        <Input
                          id="create-qualification"
                          placeholder="MD"
                          value={formData.qualification}
                          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create-rad-experience">Experience</Label>
                        <Input
                          id="create-rad-experience"
                          placeholder="e.g., 5 years"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="create-specialty">Specialty</Label>
                        <Input
                          id="create-specialty"
                          placeholder="Neurology"
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create-modalityAccess">Reporting Modality Access *</Label>
                        <MultiSelect
                          selected={formData.modalityAccess}
                          onChange={(selected) => setFormData({ ...formData, modalityAccess: selected })}
                          options={[
                            { value: "CT", label: "CT" },
                            { value: "MRI", label: "MRI" },
                            { value: "X-Ray", label: "X-Ray" },
                            { value: "Ultrasound", label: "Ultrasound" },
                            { value: "CT,MRI", label: "CT & MRI" },
                            { value: "CT,MRI,X-Ray", label: "All Modalities" },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-signature">Signature *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="create-signature"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, signature: e.target.files?.[0] || null })}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" size="sm">
                          Upload
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formData.signature ? formData.signature.name : "No file selected"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-availabilityHours">Availability Hours</Label>
                      <MultiSelect
                        options={[
                          { value: "12:00 AM - 2:00 AM", label: "12:00 AM - 2:00 AM" },
                          { value: "2:00 AM - 4:00 AM", label: "2:00 AM - 4:00 AM" },
                          { value: "4:00 AM - 6:00 AM", label: "4:00 AM - 6:00 AM" },
                          { value: "6:00 AM - 8:00 AM", label: "6:00 AM - 8:00 AM" },
                          { value: "8:00 AM - 10:00 AM", label: "8:00 AM - 10:00 AM" },
                          { value: "10:00 AM - 12:00 PM", label: "10:00 AM - 12:00 PM" },
                          { value: "12:00 PM - 2:00 PM", label: "12:00 PM - 2:00 PM" },
                          { value: "2:00 PM - 4:00 PM", label: "2:00 PM - 4:00 PM" },
                          { value: "4:00 PM - 6:00 PM", label: "4:00 PM - 6:00 PM" },
                          { value: "6:00 PM - 8:00 PM", label: "6:00 PM - 8:00 PM" },
                          { value: "8:00 PM - 10:00 PM", label: "8:00 PM - 10:00 PM" },
                          { value: "10:00 PM - 12:00 AM", label: "10:00 PM - 12:00 AM" },
                        ]}
                        selected={formData.availabilityHours}
                        onChange={(selected) => setFormData({ ...formData, availabilityHours: selected })}
                        placeholder="Select availability hours"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Availability Days</Label>
                      <div className="flex gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                          const shortDay = ["M", "T", "W", "T", "F", "S", "S"][index]
                          const isSelected = formData.availabilityDays.includes(day)
                          return (
                            <Button
                              key={day}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="w-10 h-10 p-0"
                              onClick={() => {
                                if (isSelected) {
                                  setFormData({ 
                                    ...formData, 
                                    availabilityDays: formData.availabilityDays.filter(d => d !== day) 
                                  })
                                } else {
                                  setFormData({ 
                                    ...formData, 
                                    availabilityDays: [...formData.availabilityDays, day] 
                                  })
                                }
                              }}
                            >
                              {shortDay}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateUser}
                  disabled={
                    !formData.role || 
                    !formData.employeeId || 
                    !formData.fullName || 
                    !formData.gender || 
                    !formData.dateOfBirth || 
                    !formData.email || 
                    !formData.phone || 
                    formData.phone.length !== 10 || 
                    !formData.username || 
                    !formData.password ||
                    (formData.role === "Radiologist" && (!formData.subRole || !formData.designation))
                  }
                >
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-8 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard
              title="Total Users"
              value={users.length}
              description={`${users.filter(u => u.status === "Active").length} active`}
              icon={Users}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-blue-600"
            />

            <StatCard
              title="Radiologists"
              value={users.filter(u => u.role === "Radiologist" && u.status === "Active").length}
              description="Active clinical staff"
              icon={Shield}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-green-600"
            />

            <StatCard
              title="Technologists"
              value={users.filter(u => u.role === "Technician" && u.status === "Active").length}
              description="Imaging technologists"
              icon={UserCog}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-purple-600"
            />

            <StatCard
              title="Inactive Users"
              value={users.filter(u => u.status === "Inactive").length}
              description="Deactivated accounts"
              icon={XCircle}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-red-600"
            />
          </div>

          {/* Filters and Table - 4px spacing */}
          <div className="space-y-1">
            {/* Filters - Standardized */}
            <WorklistFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by name, email, or phone..."
            filters={[
              {
                id: "role",
                label: "Roles",
                placeholder: "All Roles",
                value: roleFilter,
                onChange: setRoleFilter,
                width: "w-[180px]",
                options: [
                  { value: "all", label: "All Roles" },
                  { value: "Admin", label: "Admin" },
                  { value: "Radiologist", label: "Radiologist" },
                  { value: "Technician", label: "Technician" },
                  { value: "Referring Physician", label: "Referring Physician" },
                ],
              },
              {
                id: "status",
                label: "Statuses",
                placeholder: "All Statuses",
                value: statusFilter,
                onChange: setStatusFilter,
                width: "w-[180px]",
                options: [
                  { value: "all", label: "All Statuses" },
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ],
              },
            ]}
          />

          {/* Users Table - Standardized */}
          {/* Users Table - No Card Wrapper */}
          <div className="space-y-4">
            <WorklistTable emptyColSpan={12}>
                <WorklistTableHeader>
                  <TableRow>
                      <TableHead className="w-[60px]">Sl.No</TableHead>
                      <TableHead className="w-[80px]">Active</TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email ID</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created at</TableHead>
                      <TableHead>Last Modified By</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </WorklistTableHeader>
                  <TableBody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell className="text-center">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={user.status === "Active"}
                              onCheckedChange={() => handleToggleStatus(user.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.employeeId}
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.phone}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.email}
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.createdBy || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.createdDate}
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.lastModifiedBy || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.lastModified || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openViewDialog(user)}
                              >
                                <Eye strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openEditDialog(user)}
                              >
                                <Edit strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Mail strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                                    Change Password
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                          No users found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
              </WorklistTable>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Role Selection - First */}
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-base font-semibold">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Radiologist">Radiologist</SelectItem>
                  <SelectItem value="Referring Physician">Referring Physician</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sub-role Selection - Only for Radiologist */}
            {formData.role === "Radiologist" && (
              <div className="space-y-2">
                <Label htmlFor="edit-subrole" className="text-base font-semibold">Sub-role *</Label>
                <Select
                  value={formData.subRole}
                  onValueChange={(value) => setFormData({ ...formData, subRole: value })}
                >
                  <SelectTrigger id="edit-subrole">
                    <SelectValue placeholder="Select Sub-role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior Radiologist">Junior Radiologist</SelectItem>
                    <SelectItem value="Senior Radiologist">Senior Radiologist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* General Details Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-base font-semibold">General Details</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-employeeId">Employee ID *</Label>
                  <Input
                    id="edit-employeeId"
                    placeholder="EMP-001"
                    value={formData.employeeId}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name *</Label>
                  <Input
                    id="edit-fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dob">Date of Birth *</Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="john.doe@radiq.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mobile">Mobile No. *</Label>
                  <div className="flex gap-2">
                    <Input value="+91" disabled className="w-16" />
                    <Input
                      id="edit-mobile"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username *</Label>
                  <Input
                    id="edit-username"
                    placeholder="john.doe"
                    value={formData.username}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    placeholder="e.g., Radiology"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as "Active" | "Inactive" })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technician Professional Credentials */}
            {formData.role === "Technician" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-base font-semibold">Professional Credentials</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-shiftStart">Shift start at *</Label>
                    <Input
                      id="edit-shiftStart"
                      type="time"
                      value={formData.shiftStart}
                      onChange={(e) => setFormData({ ...formData, shiftStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-shiftEnd">Shift end at *</Label>
                    <Input
                      id="edit-shiftEnd"
                      type="time"
                      value={formData.shiftEnd}
                      onChange={(e) => setFormData({ ...formData, shiftEnd: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-tech-experience">Experience</Label>
                  <Input
                    id="edit-tech-experience"
                    placeholder="e.g., 5 years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-tech-license">License Number</Label>
                  <Input
                    id="edit-tech-license"
                    placeholder="TECH-12345"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Radiologist Professional Credentials */}
            {formData.role === "Radiologist" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-base font-semibold">Professional Credentials</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-designation">Designation *</Label>
                    <Input
                      id="edit-designation"
                      placeholder="e.g., Junior Radiologist, Senior Radiologist, Consultant"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-registrationNo">Registration No. *</Label>
                    <Input
                      id="edit-registrationNo"
                      placeholder="REG-12345"
                      value={formData.registrationNo}
                      onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-qualification">Qualification *</Label>
                    <Input
                      id="edit-qualification"
                      placeholder="e.g., MD, MBBS"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-experience">Experience</Label>
                    <Input
                      id="edit-experience"
                      placeholder="e.g., 5 years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-specialty">Specialty *</Label>
                    <Select
                      value={formData.specialty}
                      onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                    >
                      <SelectTrigger id="edit-specialty">
                        <SelectValue placeholder="Select Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Oncology">Oncology</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="General Radiology">General Radiology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-licenseNumber">License Number</Label>
                    <Input
                      id="edit-licenseNumber"
                      placeholder="RAD-12345"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-modalityAccess">Modality Access *</Label>
                  <MultiSelect
                    options={[
                      { value: "CT", label: "CT" },
                      { value: "MRI", label: "MRI" },
                      { value: "X-Ray", label: "X-Ray" },
                      { value: "Ultrasound", label: "Ultrasound" },
                      { value: "PET", label: "PET" },
                      { value: "Mammography", label: "Mammography" },
                    ]}
                    selected={formData.modalityAccess}
                    onChange={(selected) => setFormData({ ...formData, modalityAccess: selected })}
                    placeholder="Select modalities"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-signature">Upload Signature</Label>
                  <Input
                    id="edit-signature"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setFormData({ ...formData, signature: file })
                    }}
                  />
                  {selectedUser?.signature && (
                    <p className="text-xs text-muted-foreground">
                      Current signature: {selectedUser.signature}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-availabilityHours">Availability Hours</Label>
                  <MultiSelect
                    options={[
                      { value: "12:00 AM - 2:00 AM", label: "12:00 AM - 2:00 AM" },
                      { value: "2:00 AM - 4:00 AM", label: "2:00 AM - 4:00 AM" },
                      { value: "4:00 AM - 6:00 AM", label: "4:00 AM - 6:00 AM" },
                      { value: "6:00 AM - 8:00 AM", label: "6:00 AM - 8:00 AM" },
                      { value: "8:00 AM - 10:00 AM", label: "8:00 AM - 10:00 AM" },
                      { value: "10:00 AM - 12:00 PM", label: "10:00 AM - 12:00 PM" },
                      { value: "12:00 PM - 2:00 PM", label: "12:00 PM - 2:00 PM" },
                      { value: "2:00 PM - 4:00 PM", label: "2:00 PM - 4:00 PM" },
                      { value: "4:00 PM - 6:00 PM", label: "4:00 PM - 6:00 PM" },
                      { value: "6:00 PM - 8:00 PM", label: "6:00 PM - 8:00 PM" },
                      { value: "8:00 PM - 10:00 PM", label: "8:00 PM - 10:00 PM" },
                      { value: "10:00 PM - 12:00 AM", label: "10:00 PM - 12:00 AM" },
                    ]}
                    selected={formData.availabilityHours}
                    onChange={(selected) => setFormData({ ...formData, availabilityHours: selected })}
                    placeholder="Select availability hours"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Availability Days</Label>
                  <div className="flex gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                      const shortDay = ["M", "T", "W", "T", "F", "S", "S"][index]
                      const isSelected = formData.availabilityDays.includes(day)
                      return (
                        <Button
                          key={day}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="w-10 h-10 p-0"
                          onClick={() => {
                            if (isSelected) {
                              setFormData({ 
                                ...formData, 
                                availabilityDays: formData.availabilityDays.filter(d => d !== day) 
                              })
                            } else {
                              setFormData({ 
                                ...formData, 
                                availabilityDays: [...formData.availabilityDays, day] 
                              })
                            }
                          }}
                        >
                          {shortDay}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Other Roles - License Number Only */}
            {formData.role !== "Technician" && formData.role !== "Radiologist" && formData.role !== "" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-base font-semibold">Professional Credentials</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-other-license">License Number</Label>
                  <Input
                    id="edit-other-license"
                    placeholder="LIC-12345"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the user as inactive and prevent them from logging in.
              User data will be retained for audit purposes. This action can be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deactivate User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View User Details Dialog */}
      <ViewUserDetailsDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        user={selectedUser}
        onEdit={openEditDialog}
        getRoleBadgeVariant={getRoleBadgeVariant}
      />
    </PageShell>
  )
}

export default UserManagement