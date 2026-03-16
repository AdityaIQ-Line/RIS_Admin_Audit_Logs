/**
 * Audit Logs Hub
 * Admin only — navigate to specific audit log modules
 */

import React from 'react'
import { useNavigate } from 'react-router'
import { PageShell } from '../../app/components/layouts/page-shell'
import { PageHeader } from '../../app/components/blocks/page-header'
import { HubCard } from '../../app/components/cards/hub-card'
import {
  LogIn,
  ShieldCheck,
  UserRoundPen,
  FileUp,
  CalendarClock,
  Scan,
  FilePen,
  History,
  FileCheck2,
  Flag,
  Bot,
  LayoutTemplate,
  Images,
  Download,
  Network,
  CreditCard,
  Unplug,
  GitMerge,
  FileSearch,
  FileDown,
  Shield,
} from 'lucide-react'

const HUB_ITEMS = [
  { title: 'Login & Logout Logs', description: 'Authentication and session activity', icon: LogIn, route: '/admin/login-logout-logs' },
  { title: 'Role & Permission Changes', description: 'Role assignments and access-control', icon: ShieldCheck, route: '/admin/role-permission-logs' },
  { title: 'Patient Creation & Edits', description: 'Registration and demographic changes', icon: UserRoundPen, route: '/admin/patient-audit-logs' },
  { title: 'Patient Document Uploads', description: 'Uploads, views, and metadata edits', icon: FileUp, route: '/admin/patient-document-upload-logs' },
  { title: 'Appointment Creation, Reschedule & Cancellation', description: 'Bookings, reschedules, cancellations', icon: CalendarClock, route: '/admin/appointment-audit-logs' },
  { title: 'Modality Worklist Events', description: 'MWL events across LIMS, RIS, PACS', icon: Scan, route: '/admin/modality-worklist-logs' },
  { title: 'Report Creation & Draft Saves', description: 'Report creation and draft history', icon: FilePen, route: '/admin/report-creation-logs' },
  { title: 'Report Edits & Revisions', description: 'Post-finalization edits and revisions', icon: History, route: '/admin/report-edits-revisions' },
  { title: 'Report Finalization & Signatures', description: 'Finalization and digital signatures', icon: FileCheck2, route: '/admin/report-finalization-signatures' },
  { title: 'Critical Result Flagging', description: 'Critical flag add/remove on reports', icon: Flag, route: '/admin/critical-result-flagging-logs' },
  { title: 'AI Draft Generation & Acceptance', description: 'AI drafts and radiologist acceptance', icon: Bot, route: '/admin/ai-draft-generation-logs' },
  { title: 'Template Application & Changes', description: 'Template selection and changes', icon: LayoutTemplate, route: '/admin/template-application-logs' },
  { title: 'Image Access & Viewing', description: 'Image access, views, downloads, prints', icon: Images, route: '/admin/image-access-viewing-logs' },
  { title: 'Image Download & Export', description: 'Study/series export and secure links', icon: Download, route: '/admin/image-download-export-logs' },
  { title: 'DICOM Ingest & Routing', description: 'DICOM receipt, validation, routing', icon: Network, route: '/admin/dicom-ingest-routing-logs' },
  { title: 'Payment Collection', description: 'Payments, discounts, refunds, voids', icon: CreditCard, route: '/admin/payment-collection-logs' },
  { title: 'Integration Failures (RIS–PACS–LIMS)', description: 'Failed DICOM, HL7, API events', icon: Unplug, route: '/admin/integration-failures-logs' },
  { title: 'Data Sync Conflicts', description: 'Sync conflicts and resolution status', icon: GitMerge, route: '/admin/data-sync-conflicts-logs' },
  { title: 'View Audit Logs (Search & Filter)', description: 'Search and filter with export', icon: FileSearch, route: '/admin/view-audit-logs-search-filter' },
  { title: 'Export Audit Logs', description: 'Export history and role-controlled export', icon: FileDown, route: '/admin/export-audit-logs' },
  { title: 'Role-based Audit Visibility', description: 'Visibility by role and facility', icon: Shield, route: '/admin/role-based-audit-visibility' },
]

export function AuditLogs() {
  const navigate = useNavigate()

  return (
    <PageShell>
      <PageHeader title="Audit Logs" />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HUB_ITEMS.map((item) => (
              <HubCard
                key={item.route}
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={() => navigate(item.route)}
              />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

export default AuditLogs