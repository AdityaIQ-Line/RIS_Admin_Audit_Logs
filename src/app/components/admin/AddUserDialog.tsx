import * as React from "react"
import { Plus } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { MultiSelect } from "../ui/multi-select"

export interface AddUserFormData {
  employeeId: string
  fullName: string
  gender: string
  dateOfBirth: string
  firstName: string
  lastName: string
  email: string
  phone: string
  username: string
  password: string
  role: string
  status: "Active" | "Inactive"
  department: string
  
  // Technician specific
  shiftStart: string
  shiftEnd: string
  
  // Radiologist specific
  subRole: string
  designation: string
  registrationNo: string
  qualification: string
  specialty: string
  modalityAccess: string[]
  signature: File | null
  availabilityHours: string[]
  availabilityDays: string[]
  
  // Common professional
  experience: string
  licenseNumber: string
}

interface AddUserDialogProps {
  trigger?: React.ReactNode
  onUserCreated?: (userData: AddUserFormData) => void
  facilityId?: string
}

export function AddUserDialog({ trigger, onUserCreated, facilityId }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Form state
  const [formData, setFormData] = React.useState<AddUserFormData>({
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
    status: "Active",
    department: "",
    
    // Technician specific
    shiftStart: "",
    shiftEnd: "",
    
    // Radiologist specific
    subRole: "",
    designation: "",
    registrationNo: "",
    qualification: "",
    specialty: "",
    modalityAccess: [],
    signature: null,
    availabilityHours: [],
    availabilityDays: [],
    
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
      status: "Active",
      department: "",
      
      // Technician specific
      shiftStart: "",
      shiftEnd: "",
      
      // Radiologist specific
      subRole: "",
      designation: "",
      registrationNo: "",
      qualification: "",
      specialty: "",
      modalityAccess: [],
      signature: null,
      availabilityHours: [],
      availabilityDays: [],
      
      // Common professional
      experience: "",
      licenseNumber: "",
    })
  }

  // Handle create user
  const handleCreateUser = () => {
    if (onUserCreated) {
      onUserCreated(formData)
    }
    setIsOpen(false)
    resetForm()
  }

  // Handle dialog open change
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in the required fields below.
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
                <SelectItem value="QC Technician">QC Technician</SelectItem>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
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
  )
}