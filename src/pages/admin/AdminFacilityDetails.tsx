import * as React from "react"
import {
  Building2,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
} from "lucide-react"
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
import { Textarea } from "../../app/components/ui/textarea"
import { Badge } from "../../app/components/ui/badge"
import { PageShell } from "../../app/components/layouts/page-shell"
import { PageHeader } from "../../app/components/blocks/page-header"
import { ICON_STROKE_WIDTH } from "../../lib/constants"
import { toast } from "sonner"

/**
 * ADMIN - FACILITY DETAILS
 * 
 * Admin can:
 * - View their facility details (set by Super Admin)
 * - Edit facility information, PACS/RIS integration
 * - Update letterhead and branding settings
 */

interface FacilityDetails {
  id: string
  facilityName: string
  facilityCode: string
  facilityType: "Hospital" | "Diagnostic Center" | "Clinic"
  facilityDescription?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  country: string
  pincode: string
  contactNumber: string
  email: string
  dualStageReportApproval: boolean // Whether junior radiologist reports need senior approval
  approvalRoutePreference?: "qc_technician" | "senior_radiologist" // Default verification route when dual approval is enabled
  pacsAeTitle?: string
  pacsIpAddress?: string
  pacsPort?: string
  risUrl?: string
  integrationStatus?: "Connected" | "Pending" | "Failed"
  letterheadLogo?: string
  headerText?: string
  footerText?: string
  status: "Active" | "Inactive" | "Suspended"
  createdBy: string
  createdDate: string
  modifiedBy?: string
  modifiedDate?: string
}

// Mock data - This would come from the logged-in admin's facility
const mockFacilityData: FacilityDetails = {
  id: "FAC-001",
  facilityName: "Apollo Diagnostics - Main Branch",
  facilityCode: "APL-MB",
  facilityType: "Diagnostic Center",
  facilityDescription: "Main diagnostic center with full modality support including CT, MRI, X-Ray, and Ultrasound capabilities",
  addressLine1: "123 MG Road",
  addressLine2: "Near City Hospital",
  city: "Bangalore",
  state: "Karnataka",
  country: "India",
  pincode: "560001",
  contactNumber: "+91 80 1234 5678",
  email: "main@apollodiagnostics.com",
  dualStageReportApproval: true,
  approvalRoutePreference: "senior_radiologist",
  pacsAeTitle: "APL_PACS_MB",
  pacsIpAddress: "192.168.1.100",
  pacsPort: "4242",
  risUrl: "https://ris.apollodiagnostics.com",
  integrationStatus: "Connected",
  letterheadLogo: "https://via.placeholder.com/200x80?text=Apollo+Logo",
  headerText: "Apollo Diagnostics - Excellence in Medical Imaging",
  footerText: "NABL Accredited | ISO 9001:2015 Certified | 24/7 Emergency Services",
  status: "Active",
  createdBy: "Super Admin",
  createdDate: "2024-01-10",
  modifiedBy: "Apollo Admin",
  modifiedDate: "2026-01-15",
}

export function AdminFacilityDetails() {
  const [isEditing, setIsEditing] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"basic" | "pacs" | "letterhead">("basic")
  const [facilityData, setFacilityData] = React.useState<FacilityDetails>(mockFacilityData)
  const [originalData, setOriginalData] = React.useState<FacilityDetails>(mockFacilityData)

  const handleEdit = () => {
    setIsEditing(true)
    setOriginalData(facilityData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFacilityData(originalData)
  }

  const handleSave = () => {
    // Validation
    if (!facilityData.facilityName || !facilityData.contactNumber || !facilityData.email) {
      toast.error("Please fill all required fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(facilityData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,15}$/
    if (!phoneRegex.test(facilityData.contactNumber)) {
      toast.error("Please enter a valid contact number")
      return
    }

    // Update modified fields
    const updatedData = {
      ...facilityData,
      modifiedBy: "Admin User", // This would be the logged-in user's name
      modifiedDate: new Date().toISOString().split("T")[0],
    }

    setFacilityData(updatedData)
    setIsEditing(false)
    toast.success("Facility details updated successfully")
  }

  const getIntegrationBadge = (status?: string) => {
    switch (status) {
      case "Connected":
        return (
          <Badge className="bg-green-600/20 text-green-700 border-green-500/30">
            <CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "Pending":
        return (
          <Badge className="bg-amber-600/20 text-amber-700 border-amber-500/30">
            <AlertCircle strokeWidth={ICON_STROKE_WIDTH} className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "Failed":
        return (
          <Badge className="bg-red-600/20 text-red-700 border-red-500/30">
            <XCircle strokeWidth={ICON_STROKE_WIDTH} className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge className="bg-gray-600/20 text-gray-700 border-gray-500/30">Not Configured</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-600/20 text-green-700 border-green-500/30">Active</Badge>
      case "Inactive":
        return <Badge className="bg-gray-600/20 text-gray-700 border-gray-500/30">Inactive</Badge>
      case "Suspended":
        return <Badge className="bg-red-600/20 text-red-700 border-red-500/30">Suspended</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Facility Details"
        actions={
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-8 space-y-6">
          {/* Facility Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 strokeWidth={ICON_STROKE_WIDTH} className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{facilityData.facilityName}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {facilityData.facilityCode} • {facilityData.facilityType}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(facilityData.status)}
                  {getIntegrationBadge(facilityData.integrationStatus)}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "basic"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("basic")}
            >
              Facility Details
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "pacs"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("pacs")}
            >
              PACS/RIS Integration
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "letterhead"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("letterhead")}
            >
              Letterhead & Branding
            </button>
          </div>

          {/* Facility Details Tab */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Facility Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={facilityData.facilityName}
                      onChange={(e) =>
                        setFacilityData({ ...facilityData, facilityName: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Facility Code</Label>
                    <Input value={facilityData.facilityCode} disabled />
                    <p className="text-xs text-muted-foreground mt-1">Code cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Facility Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={facilityData.facilityType}
                      onValueChange={(value) =>
                        setFacilityData({ ...facilityData, facilityType: value as any })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Diagnostic Center">Diagnostic Center</SelectItem>
                        <SelectItem value="Clinic">Clinic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Input value={facilityData.status} disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Status is managed by Super Admin
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Facility Description</Label>
                    <Textarea
                      value={facilityData.facilityDescription || ""}
                      onChange={(e) =>
                        setFacilityData({ ...facilityData, facilityDescription: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address & Contact */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Address & Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label>
                      Address Line 1 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={facilityData.addressLine1}
                      onChange={(e) =>
                        setFacilityData({ ...facilityData, addressLine1: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Address Line 2</Label>
                    <Input
                      value={facilityData.addressLine2 || ""}
                      onChange={(e) =>
                        setFacilityData({ ...facilityData, addressLine2: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={facilityData.city}
                      onChange={(e) => setFacilityData({ ...facilityData, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={facilityData.state}
                      onChange={(e) => setFacilityData({ ...facilityData, state: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={facilityData.country}
                      onChange={(e) => setFacilityData({ ...facilityData, country: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Pincode <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={facilityData.pincode}
                      onChange={(e) => setFacilityData({ ...facilityData, pincode: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={facilityData.contactNumber}
                      onChange={(e) =>
                        setFacilityData({ ...facilityData, contactNumber: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={facilityData.email}
                      onChange={(e) => setFacilityData({ ...facilityData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Report Approval Configuration</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dual Stage Report Approval</Label>
                    <Select
                      value={facilityData.dualStageReportApproval ? "true" : "false"}
                      onValueChange={(value) =>
                        setFacilityData({
                          ...facilityData,
                          dualStageReportApproval: value === "true",
                        })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {facilityData.dualStageReportApproval && (
                    <div className="space-y-2">
                      <Label htmlFor="seniorReviewRequired">
                        Senior Radiologist Review Required
                      </Label>
                      <Select
                        value={facilityData.approvalRoutePreference}
                        onValueChange={(value) =>
                          setFacilityData({
                            ...facilityData,
                            approvalRoutePreference: value as any,
                          })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="qc_technician">QC Technician</SelectItem>
                          <SelectItem value="senior_radiologist">Senior Radiologist</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select whether reports should be verified by QC Technician or Senior Radiologist
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* PACS/RIS Integration Tab */}
          {activeTab === "pacs" && (
            <Card>
              <CardHeader>
                <CardTitle>PACS/RIS Integration Settings</CardTitle>
                <CardDescription>
                  Configure Picture Archiving and Communication System (PACS) and Radiology Information
                  System (RIS) integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* PACS Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">PACS Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>PACS AE Title</Label>
                      <Input
                        placeholder="e.g., HOSPITAL_PACS"
                        value={facilityData.pacsAeTitle || ""}
                        onChange={(e) =>
                          setFacilityData({ ...facilityData, pacsAeTitle: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Application Entity Title for DICOM communication
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>PACS IP Address</Label>
                      <Input
                        placeholder="e.g., 192.168.1.100"
                        value={facilityData.pacsIpAddress || ""}
                        onChange={(e) =>
                          setFacilityData({ ...facilityData, pacsIpAddress: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>PACS Port</Label>
                      <Input
                        placeholder="e.g., 4242"
                        value={facilityData.pacsPort || ""}
                        onChange={(e) =>
                          setFacilityData({ ...facilityData, pacsPort: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Integration Status</Label>
                      <Select
                        value={facilityData.integrationStatus}
                        onValueChange={(value) =>
                          setFacilityData({ ...facilityData, integrationStatus: value as any })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Connected">Connected</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* RIS Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">RIS Configuration</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>RIS URL</Label>
                      <Input
                        placeholder="e.g., https://ris.hospital.com"
                        value={facilityData.risUrl || ""}
                        onChange={(e) => setFacilityData({ ...facilityData, risUrl: e.target.value })}
                        disabled={!isEditing}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        URL for Radiology Information System integration
                      </p>
                    </div>
                  </div>
                </div>

                {/* Integration Status Info */}
                {!isEditing && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Current Status:</span>
                      {getIntegrationBadge(facilityData.integrationStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {facilityData.integrationStatus === "Connected" &&
                        "PACS is successfully connected and operational."}
                      {facilityData.integrationStatus === "Pending" &&
                        "PACS connection is pending. Please verify configuration details."}
                      {facilityData.integrationStatus === "Failed" &&
                        "PACS connection failed. Please check configuration and network connectivity."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Letterhead & Branding Tab */}
          {activeTab === "letterhead" && (
            <Card>
              <CardHeader>
                <CardTitle>Letterhead & Branding</CardTitle>
                <CardDescription>
                  Configure facility logo, header, and footer text for reports and documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Facility Logo</Label>
                    <div className="mt-2">
                      {facilityData.letterheadLogo && (
                        <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                          <img
                            src={facilityData.letterheadLogo}
                            alt="Facility Logo"
                            className="h-20 object-contain"
                          />
                        </div>
                      )}
                      {isEditing && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Logo URL"
                            value={facilityData.letterheadLogo || ""}
                            onChange={(e) =>
                              setFacilityData({ ...facilityData, letterheadLogo: e.target.value })
                            }
                          />
                          <Button variant="outline">
                            <Upload strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended size: 200x80 pixels (PNG or JPG)
                    </p>
                  </div>
                </div>

                {/* Header Text */}
                <div className="space-y-2">
                  <Label>Header Text</Label>
                  <Input
                    placeholder="e.g., Excellence in Medical Imaging"
                    value={facilityData.headerText || ""}
                    onChange={(e) =>
                      setFacilityData({ ...facilityData, headerText: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This text appears at the top of reports
                  </p>
                </div>

                {/* Footer Text */}
                <div className="space-y-2">
                  <Label>Footer Text</Label>
                  <Textarea
                    placeholder="e.g., NABL Accredited | ISO 9001:2015 Certified | 24/7 Emergency Services"
                    value={facilityData.footerText || ""}
                    onChange={(e) =>
                      setFacilityData({ ...facilityData, footerText: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This text appears at the bottom of reports
                  </p>
                </div>

                {/* Preview */}
                {!isEditing && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Preview</h3>
                    <div className="border rounded-lg p-6 space-y-4 bg-white">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-4 border-b">
                        {facilityData.letterheadLogo && (
                          <img
                            src={facilityData.letterheadLogo}
                            alt="Logo"
                            className="h-16 object-contain"
                          />
                        )}
                        <div className="text-right">
                          <p className="text-sm font-medium">{facilityData.headerText}</p>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="py-8 text-center text-muted-foreground text-sm">
                        [Report Content Area]
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t text-center text-xs text-muted-foreground">
                        {facilityData.footerText}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  )
}