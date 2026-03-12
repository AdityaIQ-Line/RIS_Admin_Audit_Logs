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
} from 'lucide-react'

const HUB_ITEMS = [
  {
    title: 'Login & Logout Logs',
    description: 'Track user authentication events, session activity, and access patterns',
    icon: LogIn,
    route: '/admin/login-logout-logs',
  },
  {
    title: 'Role & Permission Changes',
    description: 'Audit role assignments, permission changes, and access-control modifications',
    icon: ShieldCheck,
    route: '/admin/role-permission-logs',
  },
  {
    title: 'Patient Creation & Edits',
    description: 'Track patient registration, demographic changes, and identifier updates',
    icon: UserRoundPen,
    route: '/admin/patient-audit-logs',
  },
  {
    title: 'Patient Document Uploads',
    description: 'Audit document uploads, re-uploads, views, and metadata edits with file hash verification',
    icon: FileUp,
    route: '/admin/patient-document-upload-logs',
  },
  {
    title: 'Appointment Creation, Reschedule & Cancellation',
    description: 'Track appointment bookings, reschedules, cancellations, and slot utilisation changes',
    icon: CalendarClock,
    route: '/admin/appointment-audit-logs',
  },
  {
    title: 'Modality Worklist Events',
    description: 'Audit MWL lifecycle events between LIMS, RIS, and PACS — sync accuracy, transmission failures, and DICOM traceability',
    icon: Scan,
    route: '/admin/modality-worklist-logs',
  },
  {
    title: 'Report Creation & Draft Saves',
    description: 'Audit report creation, draft saves, content edits, impression updates, addenda, and reopens with full version history',
    icon: FilePen,
    route: '/admin/report-creation-logs',
  },
  {
    title: 'Report Edits & Revisions',
    description: 'Audit post-finalization edits, reopens, revisions, digital signature invalidations, addenda, and version history for medico-legal defensibility',
    icon: History,
    route: '/admin/report-edits-revisions',
  },
  {
    title: 'Report Finalization & Signatures',
    description: 'Audit report finalization events, digital signature applications, multi-level approval workflows, and signature invalidations for legal authenticity',
    icon: FileCheck2,
    route: '/admin/report-finalization-signatures',
  },
  {
    title: 'Critical Result Flagging',
    description: 'Audit critical flag additions, remarks, and removals on radiology reports — ensuring traceability of high-risk findings and medico-legal defensibility',
    icon: Flag,
    route: '/admin/critical-result-flagging-logs',
  },
  {
    title: 'AI Draft Generation & Acceptance',
    description: 'Audit AI-generated report drafts, radiologist acceptance, modifications, rejections, and content overrides for responsible AI governance and medico-legal traceability',
    icon: Bot,
    route: '/admin/ai-draft-generation-logs',
  },
  {
    title: 'Template Application & Changes',
    description: 'Audit template selection, application, and changes in radiology reports — ensuring reporting consistency, content origin traceability, and medico-legal defensibility',
    icon: LayoutTemplate,
    route: '/admin/template-application-logs',
  },
  {
    title: 'Image Access & Viewing',
    description: 'Audit all radiology image access, series views, downloads, prints, and external viewer access — ensuring patient data privacy, detecting unauthorized access, and maintaining medico-legal traceability',
    icon: Images,
    route: '/admin/image-access-viewing-logs',
  },
  {
    title: 'Image Download & Export',
    description: 'Audit study downloads, series/image exports, DICOM and non-DICOM exports, CD/DVD burns, secure links, and denied export attempts for compliance and traceability',
    icon: Download,
    route: '/admin/image-download-export-logs',
  },
  {
    title: 'DICOM Ingest & Routing',
    description: 'Audit DICOM study receipt, validation, rejection, routing, retries, merge/split events between modalities and PACS for data integrity and troubleshooting',
    icon: Network,
    route: '/admin/dicom-ingest-routing-logs',
  },
  {
    title: 'Payment Collection',
    description: 'Audit payment collection, discounts, adjustments, refunds, voids, and collection failures — ensuring financial accountability and reconciliation',
    icon: CreditCard,
    route: '/admin/payment-collection-logs',
  },
  {
    title: 'Integration Failures (RIS–PACS–LIMS)',
    description: 'Track failed integration events between RIS, PACS, and LIMS — DICOM, HL7, API failures for quick identification and resolution',
    icon: Unplug,
    route: '/admin/integration-failures-logs',
  },
]

export function AuditLogs() {
  const navigate = useNavigate()

  return (
    <PageShell>
      <PageHeader title="Audit Logs" />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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