import { createBrowserRouter, Navigate } from "react-router"
import { AppShell } from "./components/layouts/app-shell"
import { RootLayout } from "./components/layouts/root-layout"
import { StarterPage } from "../pages/StarterPage"
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../pages/templates/LoginPage"
import { SignupPage } from "../pages/templates/SignupPage"
import { PasswordResetPage } from "../pages/templates/PasswordResetPage"
import { NotFoundPage } from "../pages/templates/NotFoundPage"
import { AdminDashboard } from "../pages/dashboards/AdminDashboard"
import { ProfilePage } from "../pages/ProfilePage"
import { RouteErrorBoundary } from "./components/blocks/route-error-boundary"

// Admin Role Pages
import { UserManagement } from "../pages/admin/UserManagement"
import { AuditLogs } from "../pages/admin/AuditLogs"
import { LoginLogoutLogs } from "../pages/admin/LoginLogoutLogs"
import { RolePermissionLogs } from "../pages/admin/RolePermissionLogs"
import { PatientAuditLogs } from "../pages/admin/PatientAuditLogs"
import { PatientDocumentUploadLogs } from "../pages/admin/PatientDocumentUploadLogs"
import { AppointmentAuditLogs } from "../pages/admin/AppointmentAuditLogs"
import { ModalityWorklistLogs } from "../pages/admin/ModalityWorklistLogs"
import { ReportCreationLogs } from "../pages/admin/ReportCreationLogs"
import { ReportEditsRevisions } from "../pages/admin/ReportEditsRevisions"
import { ReportFinalizationSignatures } from "../pages/admin/ReportFinalizationSignatures"
import { CriticalResultFlaggingLogs } from "../pages/admin/CriticalResultFlaggingLogs"
import { AIDraftGenerationLogs } from "../pages/admin/AIDraftGenerationLogs"
import { TemplateApplicationLogs } from "../pages/admin/TemplateApplicationLogs"
import { ImageAccessViewingLogs } from "../pages/admin/ImageAccessViewingLogs"
import { SystemSettings } from "../pages/admin/SystemSettings"
import { AdminWorklist } from "../pages/admin/AdminWorklist"
import { AdminFacilityDetails } from "../pages/admin/AdminFacilityDetails"
import { AnalyticsDashboard } from "../pages/admin/AnalyticsDashboard"
import { AnalyticsCategoryDetail } from "../pages/admin/AnalyticsCategoryDetail"
import { ReportRevisionAnalytics } from "../pages/admin/ReportRevisionAnalytics"
import { ModalityReportingDurationAnalytics } from "../pages/admin/ModalityReportingDurationAnalytics"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Navigate to="/admin/audit-logs" replace />,
      },
      {
        path: "/login",
        element: <Navigate to="/admin/audit-logs" replace />,
      },
      {
        path: "/signup",
        element: <Navigate to="/admin/audit-logs" replace />,
      },
      {
        path: "/password-reset",
        element: <Navigate to="/admin/audit-logs" replace />,
      },
      {
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: "/starter", element: <Navigate to="/admin/audit-logs" replace /> },
          
          // Dashboard Route - redirect to audit logs
          { path: "/dashboard", element: <Navigate to="/admin/audit-logs" replace /> },
          { path: "/dashboard/admin", element: <Navigate to="/admin/audit-logs" replace /> },
          
          // Profile Route - redirect to audit logs
          { path: "/profile", element: <Navigate to="/admin/audit-logs" replace /> },
          
          // Admin Routes - only Audit Logs is accessible
          { path: "/admin/users", element: <Navigate to="/admin/audit-logs" replace /> },
          { path: "/admin/audit-logs", element: <AuditLogs /> },
          { path: "/admin/login-logout-logs", element: <LoginLogoutLogs /> },
          { path: "/admin/role-permission-logs", element: <RolePermissionLogs /> },
          { path: "/admin/patient-audit-logs", element: <PatientAuditLogs /> },
          { path: "/admin/patient-document-upload-logs", element: <PatientDocumentUploadLogs /> },
          { path: "/admin/appointment-audit-logs", element: <AppointmentAuditLogs /> },
          { path: "/admin/modality-worklist-logs", element: <ModalityWorklistLogs /> },
          { path: "/admin/report-creation-logs", element: <ReportCreationLogs /> },
          { path: "/admin/report-edits-revisions", element: <ReportEditsRevisions /> },
          { path: "/admin/report-finalization-signatures", element: <ReportFinalizationSignatures /> },
          { path: "/admin/critical-result-flagging-logs", element: <CriticalResultFlaggingLogs /> },
          { path: "/admin/ai-draft-generation-logs", element: <AIDraftGenerationLogs /> },
          { path: "/admin/template-application-logs", element: <TemplateApplicationLogs /> },
          { path: "/admin/image-access-viewing-logs", element: <ImageAccessViewingLogs /> },
          { path: "/admin/settings", element: <Navigate to="/admin/audit-logs" replace /> },
          { path: "/admin/worklist", element: <Navigate to="/admin/audit-logs" replace /> },
          { path: "/admin/facility", element: <Navigate to="/admin/audit-logs" replace /> },
          { path: "/admin/analytics", element: <Navigate to="/admin/audit-logs" replace /> },
          { path: "/admin/analytics/report-revision-analytics", element: <Navigate to="/admin/audit-logs" replace /> },
          { path: "/admin/analytics/modality-report-analytics", element: <Navigate to="/admin/audit-logs" replace /> },
          { path: "/admin/analytics/:categoryId", element: <Navigate to="/admin/audit-logs" replace /> },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/admin/audit-logs" replace />,
      },
    ],
  },
])

export default router