import * as React from "react"
import {
  Settings,
  Save,
  Database,
  Mail,
  Shield,
  Globe,
  Clock,
  Bell,
  Lock,
  Server,
  HardDrive,
  Wifi,
  GitBranch,
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
import { Textarea } from "../../app/components/ui/textarea"
import { Switch } from "../../app/components/ui/switch"
import { PageShell } from "../../app/components/layouts/page-shell"
import { PageHeader } from "../../app/components/blocks/page-header"
import { Badge } from "../../app/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../app/components/ui/tabs"

/**
 * ADMIN ONLY - SYSTEM SETTINGS
 * 
 * RBAC RULES:
 * - Only Admin role can access this screen
 * - Can configure system-wide settings
 * - Can modify PACS/DICOM integration settings
 * - Can configure email and notification settings
 * - Can set security policies and session timeouts
 * - Changes require Admin authentication confirmation
 * 
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/settings - Get all system settings
 * - PUT /api/admin/settings - Update system settings
 * - POST /api/admin/settings/test-connection - Test PACS/Email connectivity
 * - Settings changes should be logged in audit trail
 * - Sensitive settings (passwords) should never be returned in responses
 */

export function SystemSettings() {
  // General Settings
  const [facilityName, setFacilityName] = React.useState("RadiologyIQ Medical Center")
  const [timezone, setTimezone] = React.useState("America/New_York")
  const [dateFormat, setDateFormat] = React.useState("MM/DD/YYYY")
  const [timeFormat, setTimeFormat] = React.useState("12h")

  // PACS Settings
  const [pacsHost, setPacsHost] = React.useState("pacs.radiq.local")
  const [pacsPort, setPacsPort] = React.useState("4242")
  const [pacsAETitle, setPacsAETitle] = React.useState("RADIQ_PACS")
  const [pacsEnabled, setPacsEnabled] = React.useState(true)

  // Email Settings
  const [smtpHost, setSmtpHost] = React.useState("smtp.radiq.com")
  const [smtpPort, setSmtpPort] = React.useState("587")
  const [smtpUsername, setSmtpUsername] = React.useState("notifications@radiq.com")
  const [smtpEncryption, setSmtpEncryption] = React.useState("tls")
  const [emailEnabled, setEmailEnabled] = React.useState(true)

  // Security Settings
  const [sessionTimeout, setSessionTimeout] = React.useState("30")
  const [passwordExpiry, setPasswordExpiry] = React.useState("90")
  const [mfaRequired, setMfaRequired] = React.useState(false)
  const [autoLogoutEnabled, setAutoLogoutEnabled] = React.useState(true)

  // Notification Settings
  const [reportSignedNotif, setReportSignedNotif] = React.useState(true)
  const [criticalFindingsNotif, setCriticalFindingsNotif] = React.useState(true)
  const [systemAlertsNotif, setSystemAlertsNotif] = React.useState(true)

  // Data Retention
  const [reportRetention, setReportRetention] = React.useState("7")
  const [imageRetention, setImageRetention] = React.useState("10")
  const [logRetention, setLogRetention] = React.useState("7")

  // Workflow Settings - Dual Approval
  const [dualApprovalEnabled, setDualApprovalEnabled] = React.useState(false)

  const [isSaving, setIsSaving] = React.useState(false)

  // Load dual approval setting on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('dualApprovalEnabled')
    if (stored) {
      setDualApprovalEnabled(JSON.parse(stored))
    }
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    // Save dual approval setting to localStorage for access across the app
    localStorage.setItem('dualApprovalEnabled', JSON.stringify(dualApprovalEnabled))
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert("Settings saved successfully!")
    }, 1000)
  }

  const handleTestPACS = () => {
    alert("Testing PACS connection...\nConnection successful!")
  }

  const handleTestEmail = () => {
    alert("Sending test email...\nTest email sent successfully!")
  }

  return (
    <PageShell>
      <PageHeader 
        title="System Settings" 
        subtitle="Configure system-wide settings and integrations (Admin Only)"
        actions={
          <Button onClick={handleSave} disabled={isSaving}>
            <Save strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        }
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-6xl px-6 py-8 space-y-6">
          
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="general">
                <Settings strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="workflow">
                <GitBranch strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                Workflow
              </TabsTrigger>
              <TabsTrigger value="pacs">
                <Server strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                PACS
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="retention">
                <HardDrive strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                Data
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure basic system settings and regional preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="facilityName">Facility Name</Label>
                    <Input
                      id="facilityName"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This name will appear on reports and system headers
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select value={dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger id="dateFormat">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select value={timeFormat} onValueChange={setTimeFormat}>
                        <SelectTrigger id="timeFormat">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24-hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workflow Settings */}
            <TabsContent value="workflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Settings</CardTitle>
                  <CardDescription>
                    Configure reporting workflow and approval processes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="dualApprovalEnabled" className="text-base font-medium">
                        Dual Approval Workflow
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, radiologists can choose to send reports for verification by either a QC Technician or Senior Radiologist before final approval
                      </p>
                    </div>
                    <Switch
                      id="dualApprovalEnabled"
                      checked={dualApprovalEnabled}
                      onCheckedChange={setDualApprovalEnabled}
                    />
                  </div>

                  {dualApprovalEnabled && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                      <div className="flex items-start gap-3">
                        <GitBranch strokeWidth={ICON_STROKE_WIDTH} className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Dual Approval Enabled
                          </h4>
                          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Radiologists will now see a dropdown when finalizing reports to select their preferred verification route:
                            <br />• <strong>QC Technician</strong> - For quality control review
                            <br />• <strong>Senior Radiologist</strong> - For senior review and authorization
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* PACS Settings */}
            <TabsContent value="pacs" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>PACS Integration</CardTitle>
                      <CardDescription>
                        Configure DICOM connection to Picture Archiving and Communication System
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={pacsEnabled}
                        onCheckedChange={setPacsEnabled}
                      />
                      <Label>Enabled</Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pacsHost">PACS Server Host</Label>
                      <Input
                        id="pacsHost"
                        value={pacsHost}
                        onChange={(e) => setPacsHost(e.target.value)}
                        disabled={!pacsEnabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pacsPort">DICOM Port</Label>
                      <Input
                        id="pacsPort"
                        value={pacsPort}
                        onChange={(e) => setPacsPort(e.target.value)}
                        disabled={!pacsEnabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pacsAETitle">AE Title</Label>
                      <Input
                        id="pacsAETitle"
                        value={pacsAETitle}
                        onChange={(e) => setPacsAETitle(e.target.value)}
                        disabled={!pacsEnabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        Application Entity title for DICOM communication
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleTestPACS}
                      disabled={!pacsEnabled}
                    >
                      <Wifi strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                      Test Connection
                    </Button>
                    {pacsEnabled && (
                      <Badge variant="outline" className="text-green-600">
                        <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                        Connected
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Email Configuration</CardTitle>
                      <CardDescription>
                        Configure SMTP settings for system notifications and reports
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={emailEnabled}
                        onCheckedChange={setEmailEnabled}
                      />
                      <Label>Enabled</Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Server</Label>
                      <Input
                        id="smtpHost"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        disabled={!emailEnabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        disabled={!emailEnabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">Username / Email</Label>
                      <Input
                        id="smtpUsername"
                        type="email"
                        value={smtpUsername}
                        onChange={(e) => setSmtpUsername(e.target.value)}
                        disabled={!emailEnabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        placeholder="••••••••"
                        disabled={!emailEnabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpEncryption">Encryption</Label>
                      <Select value={smtpEncryption} onValueChange={setSmtpEncryption} disabled={!emailEnabled}>
                        <SelectTrigger id="smtpEncryption">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleTestEmail}
                    disabled={!emailEnabled}
                  >
                    <Mail strokeWidth={ICON_STROKE_WIDTH} className="mr-2 h-4 w-4" />
                    Send Test Email
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Authentication</CardTitle>
                  <CardDescription>
                    Configure security policies and session management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Auto-logout after inactivity
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        value={passwordExpiry}
                        onChange={(e) => setPasswordExpiry(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Force password change after this period
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Multi-Factor Authentication (MFA)</Label>
                        <p className="text-xs text-muted-foreground">
                          Require MFA for all user logins
                        </p>
                      </div>
                      <Switch
                        checked={mfaRequired}
                        onCheckedChange={setMfaRequired}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Automatic Logout</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically log out users after session timeout
                        </p>
                      </div>
                      <Switch
                        checked={autoLogoutEnabled}
                        onCheckedChange={setAutoLogoutEnabled}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lock strokeWidth={ICON_STROKE_WIDTH} className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          Security Recommendation
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          For HIPAA compliance, we recommend enabling MFA and setting session timeout to 15 minutes or less.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure system-wide notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Report Signed Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify referring physicians when reports are finalized
                      </p>
                    </div>
                    <Switch
                      checked={reportSignedNotif}
                      onCheckedChange={setReportSignedNotif}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Critical Findings Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Immediate notification for critical or urgent findings
                      </p>
                    </div>
                    <Switch
                      checked={criticalFindingsNotif}
                      onCheckedChange={setCriticalFindingsNotif}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Notifications for system errors and maintenance
                      </p>
                    </div>
                    <Switch
                      checked={systemAlertsNotif}
                      onCheckedChange={setSystemAlertsNotif}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Retention Settings */}
            <TabsContent value="retention" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Retention Policies</CardTitle>
                  <CardDescription>
                    Configure data retention periods for compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="reportRetention">Reports (years)</Label>
                      <Input
                        id="reportRetention"
                        type="number"
                        value={reportRetention}
                        onChange={(e) => setReportRetention(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        HIPAA minimum: 6 years
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageRetention">DICOM Images (years)</Label>
                      <Input
                        id="imageRetention"
                        type="number"
                        value={imageRetention}
                        onChange={(e) => setImageRetention(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 10 years
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logRetention">Audit Logs (years)</Label>
                      <Input
                        id="logRetention"
                        type="number"
                        value={logRetention}
                        onChange={(e) => setLogRetention(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        HIPAA minimum: 7 years
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Database strokeWidth={ICON_STROKE_WIDTH} className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Compliance Note
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Data retention policies must comply with HIPAA, state regulations, and accreditation requirements.
                          Consult with your legal and compliance team before modifying these settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageShell>
  )
}

export default SystemSettings