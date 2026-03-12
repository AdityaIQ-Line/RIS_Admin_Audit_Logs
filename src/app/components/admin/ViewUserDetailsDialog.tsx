import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { CheckCircle, XCircle, Edit } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../../lib/constants"

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
  subRole?: string
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

interface ViewUserDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onEdit: (user: User) => void
  getRoleBadgeVariant: (role: string) => "default" | "secondary" | "outline"
}

export function ViewUserDetailsDialog({
  isOpen,
  onClose,
  user,
  onEdit,
  getRoleBadgeVariant,
}: ViewUserDetailsDialogProps) {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold border-b pb-2">General Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Employee ID</Label>
                <p className="text-sm">{user.employeeId}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <p className="text-sm">{user.fullName}</p>
              </div>
              {user.gender && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <p className="text-sm">{user.gender}</p>
                </div>
              )}
              {user.dateOfBirth && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                  <p className="text-sm">{user.dateOfBirth}</p>
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                <p className="text-sm">{user.phone}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Username</Label>
                <p className="text-sm">{user.username}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Role</Label>
                <div>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="flex items-center gap-2">
                  {user.status === "Active" ? (
                    <CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">{user.status}</span>
                </div>
              </div>
              {user.department && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Department</Label>
                  <p className="text-sm">{user.department}</p>
                </div>
              )}
            </div>
          </div>

          {/* Professional Credentials for Radiologist */}
          {user.role === "Radiologist" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Professional Credentials</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {user.subRole && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Sub-role</Label>
                    <p className="text-sm">{user.subRole}</p>
                  </div>
                )}
                {user.designation && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Designation</Label>
                    <p className="text-sm">{user.designation}</p>
                  </div>
                )}
                {user.registrationNo && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Registration No.</Label>
                    <p className="text-sm">{user.registrationNo}</p>
                  </div>
                )}
                {user.qualification && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Qualification</Label>
                    <p className="text-sm">{user.qualification}</p>
                  </div>
                )}
                {user.experience && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Experience</Label>
                    <p className="text-sm">{user.experience}</p>
                  </div>
                )}
                {user.specialty && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Specialty</Label>
                    <p className="text-sm">{user.specialty}</p>
                  </div>
                )}
                {user.licenseNumber && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">License Number</Label>
                    <p className="text-sm">{user.licenseNumber}</p>
                  </div>
                )}
                {user.modalityAccess && user.modalityAccess.length > 0 && (
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Modality Access</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.modalityAccess.map((modality) => (
                        <Badge key={modality} variant="outline">
                          {modality}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {user.signature && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Signature</Label>
                    <p className="text-sm">{user.signature}</p>
                  </div>
                )}
                {user.availabilityHours && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Availability Hours</Label>
                    <p className="text-sm">{user.availabilityHours}</p>
                  </div>
                )}
                {user.availabilityDays && user.availabilityDays.length > 0 && (
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Availability Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.availabilityDays.map((day) => (
                        <Badge key={day} variant="secondary">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Credentials for Technician */}
          {user.role === "Technician" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Professional Credentials</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {user.shiftStart && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Shift Start</Label>
                    <p className="text-sm">{user.shiftStart}</p>
                  </div>
                )}
                {user.shiftEnd && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Shift End</Label>
                    <p className="text-sm">{user.shiftEnd}</p>
                  </div>
                )}
                {user.experience && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Experience</Label>
                    <p className="text-sm">{user.experience}</p>
                  </div>
                )}
                {user.licenseNumber && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">License Number</Label>
                    <p className="text-sm">{user.licenseNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Credentials for Other Roles */}
          {user.licenseNumber && user.role !== "Radiologist" && user.role !== "Technician" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Professional Credentials</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">License Number</Label>
                  <p className="text-sm">{user.licenseNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold border-b pb-2">System Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Created Date</Label>
                <p className="text-sm">{user.createdDate}</p>
              </div>
              {user.createdBy && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Created By</Label>
                  <p className="text-sm">{user.createdBy}</p>
                </div>
              )}
              {user.lastModified && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Last Modified</Label>
                  <p className="text-sm">{user.lastModified}</p>
                </div>
              )}
              {user.lastModifiedBy && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Last Modified By</Label>
                  <p className="text-sm">{user.lastModifiedBy}</p>
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Last Login</Label>
                <p className="text-sm">{user.lastLogin}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => {
            onClose()
            onEdit(user)
          }}>
            <Edit strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
            Edit User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}