// @refresh reset
/**
 * REPORT EDITS & REVISIONS AUDIT LOG — Story 9
 *
 * This is one of the most medico-legally sensitive audit controls in RIS.
 * Report edits and revisions directly affect diagnosis traceability,
 * liability exposure, and peer review integrity.
 *
 * SCOPE:
 * ✔ Report Edited (Pre-Final)
 * ✔ Report Finalized
 * ✔ Report Reopened
 * ✔ Report Revised
 * ✔ Impression Modified
 * ✔ Addendum Added
 * ✔ Template Switched
 * ✔ Digital Signature Invalidated
 * ✔ Digital Signature Reapplied
 *
 * EXCLUDED: Initial report creation (Story 8), Report delivery audit (separate)
 *
 * COMPLIANCE:
 * - NABH documentation traceability
 * - Medico-legal defensibility
 * - ISO 27001 change management
 * - Peer review audit compliance
 * - Healthcare digital signature standards
 *
 * RETENTION: ≥ 7–10 years
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/report-revisions — list with pagination
 * - Query params: auditId, reportId, accessionNumber, patientId, changedBy,
 *                 eventType, reportStatus, signatureStatus, impactLevel,
 *                 dateFrom, dateTo
 * - GET /api/admin/audit-logs/report-revisions/export — CSV / PDF
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FilePlus,
  ShieldAlert,
  Shield,
  PenLine,
  BookOpen,
  History,
  Lock,
  Unlock,
  FileCheck,
  Pencil,
  Calendar,
} from "lucide-react";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
} from "date-fns";
import { ICON_STROKE_WIDTH } from "../../lib/constants";
import { Button } from "../../app/components/ui/button";
import { Card, CardContent } from "../../app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../app/components/ui/table";
import { Badge } from "../../app/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../app/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../app/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../app/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../app/components/ui/sheet";
import { PageShell } from "../../app/components/layouts/page-shell";
import { PageHeader } from "../../app/components/blocks/page-header";
import { BackButton } from "../../app/components/blocks/back-button";
import { StatCard } from "../../app/components/cards/stat-card";
import { Pagination } from "../../app/components/ui/pagination";
import { DateRangePicker } from "../../app/components/ui/date-range-picker";
import { ReportsTab } from "./ReportsTab";

// ─── Types ────────────────────────────────────────────────────────────────────

type RevisionEventType =
  | "Report Edited"
  | "Report Finalized"
  | "Report Reopened"
  | "Report Revised"
  | "Impression Modified"
  | "Addendum Added"
  | "Template Switched"
  | "Digital Signature Invalidated"
  | "Digital Signature Reapplied";

type ReportStatus = "Draft" | "Final" | "Reopened" | "Revised";
type SignatureStatus = "Valid" | "Invalidated" | "N/A";
type ChangeImpactLevel = "Minor" | "Major" | null;
type DeviceType = "Web" | "Workstation";
type EventOutcome = "Success" | "Failed";

interface ReportRevisionLog {
  auditId: string;
  eventType: RevisionEventType;
  reportId: string;
  accessionNumber: string;
  studyInstanceUid: string;
  patientId: string;
  reportStatus: ReportStatus;
  versionBefore: string;
  versionAfter: string;
  beforeSnapshot: string | null;
  afterSnapshot: string | null;
  changedSections: string[];
  changedByUserId: string;
  changedByRole: string;
  changeTimestamp: string;
  ipAddress: string;
  deviceType: DeviceType;
  revisionReason: string | null;
  signatureStatusBefore: SignatureStatus;
  signatureStatusAfter: SignatureStatus;
  changeImpactLevel: ChangeImpactLevel;
  status: EventOutcome;
  facilityId: string;
}

// ─── Mock Data (50 records) ───────────────────────────────────────────────────

const mockRevisionLogs: ReportRevisionLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "REV-A-20001",
    eventType: "Report Edited",
    reportId: "RPT-60001",
    accessionNumber: "ACC-30001",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30001",
    patientId: "UHID-5001",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "", "impression": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "Axial T2 brain MRI: 8mm periventricular hyperintense lesion right frontal white matter. No mass effect or midline shift." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-01 09:15:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20002",
    eventType: "Impression Modified",
    reportId: "RPT-60001",
    accessionNumber: "ACC-30001",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30001",
    patientId: "UHID-5001",
    reportStatus: "Draft",
    versionBefore: "v2",
    versionAfter: "v3",
    beforeSnapshot: '{ "version": "v2", "impression": "" }',
    afterSnapshot: '{ "version": "v3", "impression": "Single small periventricular T2 hyperintensity right frontal lobe. Differential: early demyelination vs microvascular change. Clinical correlation advised." }',
    changedSections: ["Impression"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-01 09:40:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20003",
    eventType: "Report Edited",
    reportId: "RPT-60002",
    accessionNumber: "ACC-30002",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30002",
    patientId: "UHID-5002",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "", "template": "TMPL-CHEST-01" }',
    afterSnapshot: '{ "version": "v2", "findings": "CT chest HRCT protocol: Bilateral lower lobe GGOs with peripheral distribution. No pleural effusion or consolidation." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-01 11:00:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20004",
    eventType: "Report Finalized",
    reportId: "RPT-60001",
    accessionNumber: "ACC-30001",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30001",
    patientId: "UHID-5001",
    reportStatus: "Final",
    versionBefore: "v3",
    versionAfter: "v3",
    beforeSnapshot: '{ "status": "Draft", "version": "v3" }',
    afterSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-01T14:20:00", "signatureHash": "SHA256:a8f5f167f44f4964e6c998dee827110c" }',
    changedSections: [],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-01 14:20:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 02 ──────────────────────────────────────────
  {
    auditId: "REV-A-20005",
    eventType: "Template Switched",
    reportId: "RPT-60002",
    accessionNumber: "ACC-30002",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30002",
    patientId: "UHID-5002",
    reportStatus: "Draft",
    versionBefore: "v2",
    versionAfter: "v3",
    beforeSnapshot: '{ "templateId": "TMPL-CHEST-01", "templateName": "Standard Chest CT" }',
    afterSnapshot: '{ "templateId": "TMPL-HRCT-02", "templateName": "HRCT Interstitial Lung Template" }',
    changedSections: ["Template"],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-02 09:30:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20006",
    eventType: "Report Edited",
    reportId: "RPT-60003",
    accessionNumber: "ACC-30003",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30003",
    patientId: "UHID-5003",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "CT abdomen with IV contrast: Hepatic parenchyma shows homogeneous enhancement. No focal lesions. CBD measures 5mm. Pancreas, spleen, kidneys unremarkable." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-02 11:45:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20007",
    eventType: "Impression Modified",
    reportId: "RPT-60002",
    accessionNumber: "ACC-30002",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30002",
    patientId: "UHID-5002",
    reportStatus: "Draft",
    versionBefore: "v3",
    versionAfter: "v4",
    beforeSnapshot: '{ "version": "v3", "impression": "" }',
    afterSnapshot: '{ "version": "v4", "impression": "Bilateral peribronchovascular GGOs consistent with organising pneumonia pattern. Correlation with clinical history and BAL results recommended." }',
    changedSections: ["Impression"],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-02 13:10:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "REV-A-20008",
    eventType: "Digital Signature Invalidated",
    reportId: "RPT-60001",
    accessionNumber: "ACC-30001",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30001",
    patientId: "UHID-5001",
    reportStatus: "Reopened",
    versionBefore: "v3",
    versionAfter: "v4",
    beforeSnapshot: '{ "status": "Final", "version": "v3", "signatureHash": "SHA256:a8f5f167f44f4964e6c998dee827110c" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "signatureHash": null, "signatureInvalidatedAt": "2025-02-03T10:05:00" }',
    changedSections: [],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-03 10:05:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: "Referring physician noted laterality discrepancy — right vs left frontal lobe requires DICOM re-review",
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20009",
    eventType: "Report Reopened",
    reportId: "RPT-60001",
    accessionNumber: "ACC-30001",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30001",
    patientId: "UHID-5001",
    reportStatus: "Reopened",
    versionBefore: "v3",
    versionAfter: "v4",
    beforeSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-01T14:20:00" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "reopenedAt": "2025-02-03T10:05:00" }',
    changedSections: [],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-03 10:05:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: "Referring physician noted laterality discrepancy — right vs left frontal lobe requires DICOM re-review",
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 04 ──────────────────────────────────────────
  {
    auditId: "REV-A-20010",
    eventType: "Report Finalized",
    reportId: "RPT-60002",
    accessionNumber: "ACC-30002",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30002",
    patientId: "UHID-5002",
    reportStatus: "Final",
    versionBefore: "v4",
    versionAfter: "v4",
    beforeSnapshot: '{ "status": "Draft", "version": "v4" }',
    afterSnapshot: '{ "status": "Final", "version": "v4", "finalizedAt": "2025-02-04T08:30:00", "signatureHash": "SHA256:c4ca4238a0b923820dcc509a6f75849b" }',
    changedSections: [],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-04 08:30:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20011",
    eventType: "Report Finalized",
    reportId: "RPT-60003",
    accessionNumber: "ACC-30003",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30003",
    patientId: "UHID-5003",
    reportStatus: "Final",
    versionBefore: "v2",
    versionAfter: "v2",
    beforeSnapshot: '{ "status": "Draft", "version": "v2" }',
    afterSnapshot: '{ "status": "Final", "version": "v2", "finalizedAt": "2025-02-04T11:00:00", "signatureHash": "SHA256:eccbc87e4b5ce2fe28308fd9f2a7baf3" }',
    changedSections: [],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-04 11:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20012",
    eventType: "Report Revised",
    reportId: "RPT-60001",
    accessionNumber: "ACC-30001",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30001",
    patientId: "UHID-5001",
    reportStatus: "Revised",
    versionBefore: "v4",
    versionAfter: "v5",
    beforeSnapshot: '{ "version": "v4", "findings": "Axial T2: 8mm hyperintense lesion right frontal white matter.", "impression": "T2 hyperintensity right frontal lobe." }',
    afterSnapshot: '{ "version": "v5", "findings": "Axial T2: 8mm hyperintense lesion LEFT frontal white matter (corrected after DICOM re-review).", "impression": "T2 hyperintensity LEFT frontal lobe. Laterality corrected post DICOM verification." }',
    changedSections: ["Findings", "Impression"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-04 14:30:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: "Laterality corrected — lesion confirmed in LEFT frontal white matter on DICOM series re-review",
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "REV-A-20013",
    eventType: "Digital Signature Reapplied",
    reportId: "RPT-60001",
    accessionNumber: "ACC-30001",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30001",
    patientId: "UHID-5001",
    reportStatus: "Revised",
    versionBefore: "v5",
    versionAfter: "v5",
    beforeSnapshot: '{ "status": "Revised", "version": "v5", "signatureHash": null }',
    afterSnapshot: '{ "status": "Revised", "version": "v5", "signatureHash": "SHA256:1679091c5a880faf6fb5e6087eb1b2dc", "resignedAt": "2025-02-05T08:15:00" }',
    changedSections: [],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-05 08:15:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20014",
    eventType: "Addendum Added",
    reportId: "RPT-60003",
    accessionNumber: "ACC-30003",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30003",
    patientId: "UHID-5003",
    reportStatus: "Final",
    versionBefore: "v2",
    versionAfter: "v2",
    beforeSnapshot: '{ "status": "Final", "addendumCount": 0 }',
    afterSnapshot: '{ "status": "Final", "addendumCount": 1, "addendum": "Correlation with LFT results: addendum to note mildly elevated ALT. Liver parenchyma findings unchanged.", "addendumAt": "2025-02-05T10:30:00" }',
    changedSections: [],
    changedByUserId: "RAD-004",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-05 10:30:00",
    ipAddress: "192.168.20.104",
    deviceType: "Web",
    revisionReason: null,
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Valid",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 06 ──────────────────────────────────────────
  {
    auditId: "REV-A-20015",
    eventType: "Report Edited",
    reportId: "RPT-60004",
    accessionNumber: "ACC-30004",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30004",
    patientId: "UHID-5004",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "MRI lumbar spine: L4-L5 disc shows moderate posterior protrusion with bilateral neural foraminal narrowing. L5-S1 disc desiccation with mild posterior bulge." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-06 09:00:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20016",
    eventType: "Impression Modified",
    reportId: "RPT-60004",
    accessionNumber: "ACC-30004",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30004",
    patientId: "UHID-5004",
    reportStatus: "Draft",
    versionBefore: "v2",
    versionAfter: "v3",
    beforeSnapshot: '{ "version": "v2", "impression": "L4-L5 disc protrusion." }',
    afterSnapshot: '{ "version": "v3", "impression": "L4-L5 moderate posterior disc protrusion with bilateral foraminal stenosis. L5-S1 desiccation. Clinical correlation with radicular symptoms recommended." }',
    changedSections: ["Impression"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-06 10:15:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-002",
  },
  // ── Feb 07 ──────────────────────────────────────────
  {
    auditId: "REV-A-20017",
    eventType: "Report Finalized",
    reportId: "RPT-60004",
    accessionNumber: "ACC-30004",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30004",
    patientId: "UHID-5004",
    reportStatus: "Final",
    versionBefore: "v3",
    versionAfter: "v3",
    beforeSnapshot: '{ "status": "Draft", "version": "v3" }',
    afterSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-07T09:45:00", "signatureHash": "SHA256:8f14e45fceea167a5a36dedd4bea2543" }',
    changedSections: [],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-07 09:45:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  // ── Feb 08 ──────────────────────────────────────────
  {
    auditId: "REV-A-20018",
    eventType: "Digital Signature Invalidated",
    reportId: "RPT-60004",
    accessionNumber: "ACC-30004",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30004",
    patientId: "UHID-5004",
    reportStatus: "Reopened",
    versionBefore: "v3",
    versionAfter: "v4",
    beforeSnapshot: '{ "status": "Final", "version": "v3", "signatureHash": "SHA256:8f14e45fceea167a5a36dedd4bea2543" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "signatureHash": null, "signatureInvalidatedAt": "2025-02-08T11:00:00" }',
    changedSections: [],
    changedByUserId: "RAD-005",
    changedByRole: "Medical Director",
    changeTimestamp: "2025-02-08 11:00:00",
    ipAddress: "192.168.20.105",
    deviceType: "Web",
    revisionReason: "Peer review flagged incorrect vertebral level — L3-L4 disc is the symptomatic level per clinical history, not L4-L5",
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20019",
    eventType: "Report Reopened",
    reportId: "RPT-60004",
    accessionNumber: "ACC-30004",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30004",
    patientId: "UHID-5004",
    reportStatus: "Reopened",
    versionBefore: "v3",
    versionAfter: "v4",
    beforeSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-07T09:45:00" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "reopenedAt": "2025-02-08T11:00:00" }',
    changedSections: [],
    changedByUserId: "RAD-005",
    changedByRole: "Medical Director",
    changeTimestamp: "2025-02-08 11:00:00",
    ipAddress: "192.168.20.105",
    deviceType: "Web",
    revisionReason: "Peer review flagged incorrect vertebral level — L3-L4 disc is the symptomatic level per clinical history, not L4-L5",
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-002",
  },
  // ── Feb 09-10 ──────────────────────────────────────────
  {
    auditId: "REV-A-20020",
    eventType: "Report Revised",
    reportId: "RPT-60004",
    accessionNumber: "ACC-30004",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30004",
    patientId: "UHID-5004",
    reportStatus: "Revised",
    versionBefore: "v4",
    versionAfter: "v5",
    beforeSnapshot: '{ "version": "v4", "findings": "L4-L5 disc moderate posterior protrusion.", "impression": "L4-L5 foraminal stenosis." }',
    afterSnapshot: '{ "version": "v5", "findings": "L3-L4 disc moderate posterior protrusion with bilateral foraminal narrowing. L4-L5 shows mild bulge only. Corrected after clinical correlation.", "impression": "L3-L4 disc protrusion is the clinically symptomatic level. Previous vertebral level assignment corrected." }',
    changedSections: ["Findings", "Impression"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-09 09:30:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: "Vertebral level corrected — L3-L4 is symptomatic per clinical and neurological exam correlation",
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20021",
    eventType: "Digital Signature Reapplied",
    reportId: "RPT-60004",
    accessionNumber: "ACC-30004",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30004",
    patientId: "UHID-5004",
    reportStatus: "Revised",
    versionBefore: "v5",
    versionAfter: "v5",
    beforeSnapshot: '{ "status": "Revised", "version": "v5", "signatureHash": null }',
    afterSnapshot: '{ "status": "Revised", "version": "v5", "signatureHash": "SHA256:45c48cce2e2d7fbdea1afc51c7c6ad26", "resignedAt": "2025-02-10T08:00:00" }',
    changedSections: [],
    changedByUserId: "RAD-005",
    changedByRole: "Medical Director",
    changeTimestamp: "2025-02-10 08:00:00",
    ipAddress: "192.168.20.105",
    deviceType: "Web",
    revisionReason: null,
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20022",
    eventType: "Report Edited",
    reportId: "RPT-60005",
    accessionNumber: "ACC-30005",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30005",
    patientId: "UHID-5005",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "MRI pelvis: 4.2cm well-defined T2 hypointense fibroid in posterior uterine body. No septations or solid components. Bilateral ovaries normal." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-10 10:30:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 11-12 ──────────────────────────────────────────
  {
    auditId: "REV-A-20023",
    eventType: "Report Finalized",
    reportId: "RPT-60005",
    accessionNumber: "ACC-30005",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30005",
    patientId: "UHID-5005",
    reportStatus: "Final",
    versionBefore: "v2",
    versionAfter: "v2",
    beforeSnapshot: '{ "status": "Draft", "version": "v2" }',
    afterSnapshot: '{ "status": "Final", "version": "v2", "finalizedAt": "2025-02-11T09:00:00", "signatureHash": "SHA256:d3d9446802a44259755d38e6d163e820" }',
    changedSections: [],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-11 09:00:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20024",
    eventType: "Addendum Added",
    reportId: "RPT-60005",
    accessionNumber: "ACC-30005",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30005",
    patientId: "UHID-5005",
    reportStatus: "Final",
    versionBefore: "v2",
    versionAfter: "v2",
    beforeSnapshot: '{ "status": "Final", "addendumCount": 0 }',
    afterSnapshot: '{ "status": "Final", "addendumCount": 1, "addendum": "Gynaecologist review noted: fibroid measures 4.2cm (correcting 4.0cm from ultrasound). No change to diagnostic conclusion.", "addendumAt": "2025-02-12T11:00:00" }',
    changedSections: [],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-12 11:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Web",
    revisionReason: null,
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Valid",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20025",
    eventType: "Report Edited",
    reportId: "RPT-60006",
    accessionNumber: "ACC-30006",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30006",
    patientId: "UHID-5006",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "MRI right knee: Anterior cruciate ligament shows discontinuity at mid-substance. Medial meniscus posterior horn radial tear. Moderate joint effusion." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-12 13:00:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 13 ──────────────────────────────────────────
  {
    auditId: "REV-A-20026",
    eventType: "Impression Modified",
    reportId: "RPT-60006",
    accessionNumber: "ACC-30006",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30006",
    patientId: "UHID-5006",
    reportStatus: "Draft",
    versionBefore: "v2",
    versionAfter: "v3",
    beforeSnapshot: '{ "version": "v2", "impression": "ACL tear." }',
    afterSnapshot: '{ "version": "v3", "impression": "Complete ACL tear at mid-substance with medial meniscus posterior horn radial tear. Surgical consultation recommended." }',
    changedSections: ["Impression"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-13 09:20:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20027",
    eventType: "Report Finalized",
    reportId: "RPT-60006",
    accessionNumber: "ACC-30006",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30006",
    patientId: "UHID-5006",
    reportStatus: "Final",
    versionBefore: "v3",
    versionAfter: "v3",
    beforeSnapshot: '{ "status": "Draft", "version": "v3" }',
    afterSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-13T14:00:00", "signatureHash": "SHA256:6512bd43d9caa6e02c990b0a82652dca" }',
    changedSections: [],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-13 14:00:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 14 ──────────────────────────────────────────
  {
    auditId: "REV-A-20028",
    eventType: "Digital Signature Invalidated",
    reportId: "RPT-60006",
    accessionNumber: "ACC-30006",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30006",
    patientId: "UHID-5006",
    reportStatus: "Reopened",
    versionBefore: "v3",
    versionAfter: "v4",
    beforeSnapshot: '{ "status": "Final", "version": "v3", "signatureHash": "SHA256:6512bd43d9caa6e02c990b0a82652dca" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "signatureHash": null }',
    changedSections: [],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-14 10:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: "Orthopedic surgeon noted incomplete meniscal tear grading — Stoller grade not documented",
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20029",
    eventType: "Report Reopened",
    reportId: "RPT-60006",
    accessionNumber: "ACC-30006",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30006",
    patientId: "UHID-5006",
    reportStatus: "Reopened",
    versionBefore: "v3",
    versionAfter: "v4",
    beforeSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-13T14:00:00" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "reopenedAt": "2025-02-14T10:00:00" }',
    changedSections: [],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-14 10:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: "Orthopedic surgeon noted incomplete meniscal tear grading — Stoller grade not documented",
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20030",
    eventType: "Report Revised",
    reportId: "RPT-60006",
    accessionNumber: "ACC-30006",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30006",
    patientId: "UHID-5006",
    reportStatus: "Revised",
    versionBefore: "v4",
    versionAfter: "v5",
    beforeSnapshot: '{ "version": "v4", "impression": "Complete ACL tear at mid-substance." }',
    afterSnapshot: '{ "version": "v5", "impression": "Complete ACL tear at mid-substance. Medial meniscus posterior horn radial tear — Stoller Grade 3. Surgical consultation recommended." }',
    changedSections: ["Impression"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-14 15:00:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: "Stoller grading added to meniscal tear as requested by orthopedic consultant",
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 15 ──────────────────────────────────────────
  {
    auditId: "REV-A-20031",
    eventType: "Digital Signature Reapplied",
    reportId: "RPT-60006",
    accessionNumber: "ACC-30006",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30006",
    patientId: "UHID-5006",
    reportStatus: "Revised",
    versionBefore: "v5",
    versionAfter: "v5",
    beforeSnapshot: '{ "status": "Revised", "version": "v5", "signatureHash": null }',
    afterSnapshot: '{ "status": "Revised", "version": "v5", "signatureHash": "SHA256:c20ad4d76fe97759aa27a0c99bff6710", "resignedAt": "2025-02-15T08:30:00" }',
    changedSections: [],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-15 08:30:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20032",
    eventType: "Report Edited",
    reportId: "RPT-60007",
    accessionNumber: "ACC-30007",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.30007",
    patientId: "UHID-5007",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "PA chest X-ray: Cardiac silhouette within normal limits. Bilateral lung fields clear. No pleural effusion or pneumothorax. Mediastinum not widened." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-004",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-15 10:00:00",
    ipAddress: "192.168.20.104",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  // ── Feb 16 ──────────────────────────────────────────
  {
    auditId: "REV-A-20033",
    eventType: "Report Finalized",
    reportId: "RPT-60007",
    accessionNumber: "ACC-30007",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.30007",
    patientId: "UHID-5007",
    reportStatus: "Final",
    versionBefore: "v2",
    versionAfter: "v2",
    beforeSnapshot: '{ "status": "Draft", "version": "v2" }',
    afterSnapshot: '{ "status": "Final", "version": "v2", "finalizedAt": "2025-02-16T09:00:00", "signatureHash": "SHA256:aab3238922bcc25a6f606eb525ffdc56" }',
    changedSections: [],
    changedByUserId: "RAD-004",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-16 09:00:00",
    ipAddress: "192.168.20.104",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20034",
    eventType: "Report Edited",
    reportId: "RPT-60008",
    accessionNumber: "ACC-30008",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30008",
    patientId: "UHID-5008",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "CT brain plain: No acute haemorrhage or infarct. Mild cortical atrophy. Periventricular white matter hypodensities consistent with chronic small vessel disease." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-16 11:30:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 17 ──────────────────────────────────────────
  {
    auditId: "REV-A-20035",
    eventType: "Report Finalized",
    reportId: "RPT-60008",
    accessionNumber: "ACC-30008",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30008",
    patientId: "UHID-5008",
    reportStatus: "Final",
    versionBefore: "v2",
    versionAfter: "v2",
    beforeSnapshot: '{ "status": "Draft", "version": "v2" }',
    afterSnapshot: '{ "status": "Final", "version": "v2", "finalizedAt": "2025-02-17T09:15:00", "signatureHash": "SHA256:9bf31c7ff062936a96d3c8bd1f8f2ff3" }',
    changedSections: [],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-17 09:15:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 18 ──────────────────────────────────────────
  {
    auditId: "REV-A-20036",
    eventType: "Digital Signature Invalidated",
    reportId: "RPT-60008",
    accessionNumber: "ACC-30008",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30008",
    patientId: "UHID-5008",
    reportStatus: "Reopened",
    versionBefore: "v2",
    versionAfter: "v3",
    beforeSnapshot: '{ "status": "Final", "version": "v2", "signatureHash": "SHA256:9bf31c7ff062936a96d3c8bd1f8f2ff3" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v3", "signatureHash": null, "signatureInvalidatedAt": "2025-02-18T10:30:00" }',
    changedSections: [],
    changedByUserId: "RAD-005",
    changedByRole: "Medical Director",
    changeTimestamp: "2025-02-18 10:30:00",
    ipAddress: "192.168.20.105",
    deviceType: "Web",
    revisionReason: "Report delivered to referring doctor; neurology noted impression did not quantify white matter burden — Fazekas score required",
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20037",
    eventType: "Report Reopened",
    reportId: "RPT-60008",
    accessionNumber: "ACC-30008",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30008",
    patientId: "UHID-5008",
    reportStatus: "Reopened",
    versionBefore: "v2",
    versionAfter: "v3",
    beforeSnapshot: '{ "status": "Final", "version": "v2", "finalizedAt": "2025-02-17T09:15:00" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v3", "reopenedAt": "2025-02-18T10:30:00", "postDeliveryFlag": true }',
    changedSections: [],
    changedByUserId: "RAD-005",
    changedByRole: "Medical Director",
    changeTimestamp: "2025-02-18 10:30:00",
    ipAddress: "192.168.20.105",
    deviceType: "Web",
    revisionReason: "Report delivered to referring doctor; neurology noted impression did not quantify white matter burden — Fazekas score required",
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 19-20 ──────────────────────────────────────────
  {
    auditId: "REV-A-20038",
    eventType: "Impression Modified",
    reportId: "RPT-60008",
    accessionNumber: "ACC-30008",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30008",
    patientId: "UHID-5008",
    reportStatus: "Revised",
    versionBefore: "v3",
    versionAfter: "v4",
    beforeSnapshot: '{ "version": "v3", "impression": "Mild cortical atrophy. Chronic small vessel disease." }',
    afterSnapshot: '{ "version": "v4", "impression": "Mild cortical atrophy. Fazekas Grade 2 periventricular and subcortical white matter changes — moderate chronic small vessel disease. Neurology follow-up advised." }',
    changedSections: ["Impression"],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-19 09:00:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: "Fazekas scoring added per neurology request — quantifies WM burden for management planning",
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20039",
    eventType: "Report Revised",
    reportId: "RPT-60008",
    accessionNumber: "ACC-30008",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30008",
    patientId: "UHID-5008",
    reportStatus: "Revised",
    versionBefore: "v4",
    versionAfter: "v5",
    beforeSnapshot: '{ "version": "v4", "findings": "Periventricular hypodensities." }',
    afterSnapshot: '{ "version": "v5", "findings": "CT brain: Periventricular and subcortical hypodensities with Fazekas Grade 2 pattern. No acute haemorrhage or infarct. Mild generalised cortical atrophy consistent with age." }',
    changedSections: ["Findings", "Impression"],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-20 10:00:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: "Findings section updated to align with revised impression; Fazekas grading explicitly stated",
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Invalidated",
    changeImpactLevel: "Major",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20040",
    eventType: "Digital Signature Reapplied",
    reportId: "RPT-60008",
    accessionNumber: "ACC-30008",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30008",
    patientId: "UHID-5008",
    reportStatus: "Revised",
    versionBefore: "v5",
    versionAfter: "v5",
    beforeSnapshot: '{ "status": "Revised", "version": "v5", "signatureHash": null }',
    afterSnapshot: '{ "status": "Revised", "version": "v5", "signatureHash": "SHA256:d67d8ab4f4c10bf22aa353e27879133c", "resignedAt": "2025-02-20T14:00:00" }',
    changedSections: [],
    changedByUserId: "RAD-005",
    changedByRole: "Medical Director",
    changeTimestamp: "2025-02-20 14:00:00",
    ipAddress: "192.168.20.105",
    deviceType: "Web",
    revisionReason: null,
    signatureStatusBefore: "Invalidated",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 21 ──────────────────────────────────────────
  {
    auditId: "REV-A-20041",
    eventType: "Report Edited",
    reportId: "RPT-60009",
    accessionNumber: "ACC-30009",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30009",
    patientId: "UHID-5009",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "MRI shoulder: Supraspinatus tendon shows full-thickness tear at insertion with 1.5cm retraction. Subscapularis tendon intact." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-21 09:00:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20042",
    eventType: "Template Switched",
    reportId: "RPT-60009",
    accessionNumber: "ACC-30009",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30009",
    patientId: "UHID-5009",
    reportStatus: "Draft",
    versionBefore: "v2",
    versionAfter: "v3",
    beforeSnapshot: '{ "templateId": "TMPL-MSK-01", "templateName": "Standard MSK MRI" }',
    afterSnapshot: '{ "templateId": "TMPL-SHOULDER-02", "templateName": "Shoulder MRI — Rotator Cuff Protocol" }',
    changedSections: ["Template"],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-21 09:45:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20043",
    eventType: "Report Finalized",
    reportId: "RPT-60009",
    accessionNumber: "ACC-30009",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30009",
    patientId: "UHID-5009",
    reportStatus: "Final",
    versionBefore: "v3",
    versionAfter: "v3",
    beforeSnapshot: '{ "status": "Draft", "version": "v3" }',
    afterSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-21T14:30:00", "signatureHash": "SHA256:735b90b4568125ed6c3f678819b6e058" }',
    changedSections: [],
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-21 14:30:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  // ── Feb 22 ──────────────────────────────────────────
  {
    auditId: "REV-A-20044",
    eventType: "Report Edited",
    reportId: "RPT-60010",
    accessionNumber: "ACC-30010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30010",
    patientId: "UHID-5010",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "CT urogram: Right renal pelvis shows a 7mm calculus with mild pelviectasis. Left kidney and urinary system normal. No hydronephrosis." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-22 10:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "REV-A-20045",
    eventType: "Impression Modified",
    reportId: "RPT-60010",
    accessionNumber: "ACC-30010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30010",
    patientId: "UHID-5010",
    reportStatus: "Draft",
    versionBefore: "v2",
    versionAfter: "v3",
    beforeSnapshot: '{ "version": "v2", "impression": "Right renal calculus." }',
    afterSnapshot: '{ "version": "v3", "impression": "7mm right renal pelvic calculus with mild pelviectasis. HU 850 — consistent with calcium oxalate stone. Urological follow-up recommended." }',
    changedSections: ["Impression"],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-22 11:30:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 23 ──────────────────────────────────────────
  {
    auditId: "REV-A-20046",
    eventType: "Report Finalized",
    reportId: "RPT-60010",
    accessionNumber: "ACC-30010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30010",
    patientId: "UHID-5010",
    reportStatus: "Final",
    versionBefore: "v3",
    versionAfter: "v3",
    beforeSnapshot: '{ "status": "Draft", "version": "v3" }',
    afterSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-23T09:00:00", "signatureHash": "SHA256:14bfa6bb14875e45bba028a21ed38046" }',
    changedSections: [],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-23 09:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 24-25 ──────────────────────────────────────────
  {
    auditId: "REV-A-20047",
    eventType: "Report Edited",
    reportId: "RPT-60011",
    accessionNumber: "ACC-30011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30011",
    patientId: "UHID-5011",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v2",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "MRI wrist: Triangular fibrocartilage complex shows central perforation with ulnar styloid impaction. Scapholunate ligament intact." }',
    changedSections: ["Findings"],
    changedByUserId: "RAD-004",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-24 10:00:00",
    ipAddress: "192.168.20.104",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20048",
    eventType: "Report Finalized",
    reportId: "RPT-60011",
    accessionNumber: "ACC-30011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30011",
    patientId: "UHID-5011",
    reportStatus: "Final",
    versionBefore: "v2",
    versionAfter: "v2",
    beforeSnapshot: '{ "status": "Draft", "version": "v2" }',
    afterSnapshot: '{ "status": "Final", "version": "v2", "finalizedAt": "2025-02-24T14:00:00", "signatureHash": "SHA256:7cbbc409ec990f19c78c075bd69f4de3" }',
    changedSections: [],
    changedByUserId: "RAD-004",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-24 14:00:00",
    ipAddress: "192.168.20.104",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "Valid",
    changeImpactLevel: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "REV-A-20049",
    eventType: "Addendum Added",
    reportId: "RPT-60011",
    accessionNumber: "ACC-30011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.30011",
    patientId: "UHID-5011",
    reportStatus: "Final",
    versionBefore: "v2",
    versionAfter: "v2",
    beforeSnapshot: '{ "status": "Final", "addendumCount": 0 }',
    afterSnapshot: '{ "status": "Final", "addendumCount": 1, "addendum": "Addendum: Ulnar variance measured at +2mm — positive ulnar variance noted. Supports TFCC tear mechanism. Original findings unchanged.", "addendumAt": "2025-02-25T09:30:00" }',
    changedSections: [],
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-25 09:30:00",
    ipAddress: "192.168.20.102",
    deviceType: "Web",
    revisionReason: null,
    signatureStatusBefore: "Valid",
    signatureStatusAfter: "Valid",
    changeImpactLevel: "Minor",
    status: "Success",
    facilityId: "FAC-002",
  },
  // ── Feb 27 ──────────────────────────────────────────
  {
    auditId: "REV-A-20050",
    eventType: "Report Edited",
    reportId: "RPT-60012",
    accessionNumber: "ACC-30012",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.30012",
    patientId: "UHID-5012",
    reportStatus: "Draft",
    versionBefore: "v1",
    versionAfter: "v1",
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: null,
    changedSections: [],
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-27 13:00:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    revisionReason: null,
    signatureStatusBefore: "N/A",
    signatureStatusAfter: "N/A",
    changeImpactLevel: null,
    status: "Failed",
    facilityId: "FAC-001",
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Main Component ───────────────────────────────────────────────────────────

export function ReportEditsRevisions() {
  const logs = mockRevisionLogs;

  // --- Filter state ---
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [reportStatusFilter, setReportStatusFilter] = React.useState("all");
  const [signatureStatusFilter, setSignatureStatusFilter] = React.useState("all");
  const [impactLevelFilter, setImpactLevelFilter] = React.useState("all");
  const [actorFilter, setActorFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = ITEMS_PER_PAGE;

  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 450),
    to: new Date(),
  });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<ReportRevisionLog | null>(null);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const quickRanges = [
    { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
    { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: "Last 90 days", getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
    { label: "Month to date", getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  ];

  // --- Stats ---
  const stats = React.useMemo(() => {
    const total = logs.length;
    const postFinalChanges = logs.filter(
      (l) =>
        l.eventType === "Report Reopened" ||
        l.eventType === "Report Revised" ||
        l.eventType === "Digital Signature Invalidated"
    ).length;
    const addenda = logs.filter((l) => l.eventType === "Addendum Added").length;
    const signatureEvents = logs.filter(
      (l) =>
        l.eventType === "Digital Signature Invalidated" ||
        l.eventType === "Digital Signature Reapplied"
    ).length;
    const majorImpact = logs.filter((l) => l.changeImpactLevel === "Major").length;
    return { total, postFinalChanges, addenda, signatureEvents, majorImpact };
  }, [logs]);

  // --- Filtered logs ---
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const sq = searchFilter.toLowerCase();
      const matchesSearch =
        !sq ||
        log.auditId.toLowerCase().includes(sq) ||
        log.reportId.toLowerCase().includes(sq) ||
        log.accessionNumber.toLowerCase().includes(sq) ||
        log.patientId.toLowerCase().includes(sq) ||
        log.changedByUserId.toLowerCase().includes(sq) ||
        log.studyInstanceUid.toLowerCase().includes(sq) ||
        (log.revisionReason?.toLowerCase().includes(sq) ?? false);

      const matchesEventType = eventTypeFilter === "all" || log.eventType === eventTypeFilter;
      const matchesStatus = reportStatusFilter === "all" || log.reportStatus === reportStatusFilter;
      const matchesSig =
        signatureStatusFilter === "all" ||
        log.signatureStatusAfter === signatureStatusFilter;
      const matchesImpact =
        impactLevelFilter === "all" ||
        (impactLevelFilter === "Major" && log.changeImpactLevel === "Major") ||
        (impactLevelFilter === "Minor" && log.changeImpactLevel === "Minor") ||
        (impactLevelFilter === "N/A" && log.changeImpactLevel === null);
      const matchesActor = actorFilter === "all" || log.changedByUserId === actorFilter;

      const logDate = new Date(log.changeTimestamp);
      const matchesDate =
        logDate >= startOfDay(dateRange.from) && logDate <= endOfDay(dateRange.to);

      return (
        matchesSearch && matchesEventType && matchesStatus &&
        matchesSig && matchesImpact && matchesActor && matchesDate
      );
    });
  }, [logs, searchFilter, eventTypeFilter, reportStatusFilter, signatureStatusFilter, impactLevelFilter, actorFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => { setCurrentPage(1); }, [
    searchFilter, eventTypeFilter, reportStatusFilter, signatureStatusFilter, impactLevelFilter, actorFilter, dateRange,
  ]);

  const hasActiveFilters =
    eventTypeFilter !== "all" || reportStatusFilter !== "all" ||
    signatureStatusFilter !== "all" || impactLevelFilter !== "all" || actorFilter !== "all";

  const clearAllFilters = () => {
    setEventTypeFilter("all"); setReportStatusFilter("all");
    setSignatureStatusFilter("all"); setImpactLevelFilter("all");
    setActorFilter("all"); setSearchFilter("");
  };

  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts);
      const day = String(d.getDate()).padStart(2, "0");
      const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const year = String(d.getFullYear()).slice(2);
      const hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const h12 = String(hours % 12 || 12).padStart(2, "0");
      return `${day}-${month}-${year}, ${h12}:${minutes} ${ampm}`;
    } catch { return ts; }
  };

  // --- Badge helpers ---
  const getEventTypeBadge = (et: RevisionEventType) => {
    switch (et) {
      case "Report Edited":
        return <Badge variant="secondary"><Pencil className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Edited</Badge>;
      case "Report Finalized":
        return <Badge variant="default"><FileCheck className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Finalized</Badge>;
      case "Report Reopened":
        return <Badge variant="destructive"><RotateCcw className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Reopened</Badge>;
      case "Report Revised":
        return <Badge variant="destructive"><PenLine className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Revised</Badge>;
      case "Impression Modified":
        return <Badge variant="secondary"><PenLine className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Impression</Badge>;
      case "Addendum Added":
        return <Badge variant="outline"><FilePlus className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Addendum</Badge>;
      case "Template Switched":
        return <Badge variant="outline"><BookOpen className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Template</Badge>;
      case "Digital Signature Invalidated":
        return <Badge variant="destructive"><ShieldAlert className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Sig Invalidated</Badge>;
      case "Digital Signature Reapplied":
        return <Badge variant="default"><Shield className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Sig Reapplied</Badge>;
    }
  };

  const getReportStatusBadge = (s: ReportStatus) => {
    switch (s) {
      case "Draft":    return <Badge variant="outline">Draft</Badge>;
      case "Final":    return <Badge variant="default">Final</Badge>;
      case "Reopened": return <Badge variant="destructive">Reopened</Badge>;
      case "Revised":  return <Badge variant="destructive">Revised</Badge>;
    }
  };

  const getSignatureStatusBadge = (s: SignatureStatus) => {
    if (s === "Valid")       return <Badge variant="default"><Lock className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Valid</Badge>;
    if (s === "Invalidated") return <Badge variant="destructive"><Unlock className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Invalidated</Badge>;
    return <span className="text-muted-foreground text-sm">—</span>;
  };

  const getImpactBadge = (level: ChangeImpactLevel) => {
    if (level === "Major") return <Badge variant="destructive">Major</Badge>;
    if (level === "Minor") return <Badge variant="outline">Minor</Badge>;
    return <span className="text-muted-foreground text-sm">—</span>;
  };

  const getStatusCell = (s: EventOutcome) => {
    if (s === "Success") {
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle className="size-4 text-primary" strokeWidth={ICON_STROKE_WIDTH} />
          <span className="text-sm">Success</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5">
        <XCircle className="size-4 text-destructive" strokeWidth={ICON_STROKE_WIDTH} />
        <span className="text-sm text-destructive">Failed</span>
      </div>
    );
  };

  const SnapshotCell = ({ value }: { value: string | null }) => {
    if (!value) return <span className="text-muted-foreground">—</span>;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="roboto-mono text-xs tabular-nums text-muted-foreground truncate block cursor-default max-w-[120px]">
            {value}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6} className="max-w-[360px] p-0 overflow-hidden">
          <pre className="roboto-mono text-xs tabular-nums p-3 whitespace-pre-wrap break-all leading-relaxed">
            {(() => { try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; } })()}
          </pre>
        </TooltipContent>
      </Tooltip>
    );
  };

  const DetailRow = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
    <div className="flex items-start py-2.5 border-b border-border last:border-0">
      <span className="w-44 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm flex-1 ${mono ? "roboto-mono text-xs tabular-nums" : ""}`}>
        {value ?? <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );

  return (
    <PageShell>
      <PageHeader
        title="Report Edits & Revisions Audit Logs"
        noBorder
        leading={<BackButton href="/admin/audit-logs" />}
        actions={
          <Button onClick={() => setReportSheetOpen(true)}>
            <Download strokeWidth={ICON_STROKE_WIDTH} className="mr-2 size-4" />
            Export Logs
          </Button>
        }
      />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">

          {/* Stat Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <StatCard
              title="Total Events"
              value={stats.total}
              description="All revision audit events"
              icon={History}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Post-Final Changes"
              value={stats.postFinalChanges}
              description="Reopens, revisions & sig invalidations"
              icon={RotateCcw}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-destructive"
            />
            <StatCard
              title="Addenda Added"
              value={stats.addenda}
              description="Addendums without reopening"
              icon={FilePlus}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Signature Events"
              value={stats.signatureEvents}
              description="Invalidations & reapplications"
              icon={ShieldAlert}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Major Impact"
              value={stats.majorImpact}
              description="High-severity change classifications"
              icon={AlertTriangle}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-destructive"
            />
          </div>

          {/* Logs Table */}
          <Card className="p-[16px]">
            <div className="flex flex-col gap-3 p-[0px]">

              {/* Row 1: Date + Search | Filter icon */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">

                  {/* Date Range Picker */}
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={[
                          "w-48 justify-between gap-2 font-normal",
                          isDateRangeActive
                            ? "bg-primary/10 border-primary text-primary hover:bg-primary/15"
                            : "bg-background border-border",
                        ].join(" ")}
                      >
                        <span className={["text-sm", isDateRangeActive ? "text-primary" : "text-muted-foreground"].join(" ")}>
                          {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd")}
                        </span>
                        {isDateRangeActive ? (
                          <span
                            className="flex items-center"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              clearAllFilters();
                              setDateRange({ from: subDays(new Date(), 450), to: new Date() });
                              setTempDateRange({});
                              setIsDateRangeActive(false);
                              setCurrentPage(1);
                            }}
                          >
                            <X className="size-4 text-primary shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
                          </span>
                        ) : (
                          <Calendar className="size-4 text-muted-foreground shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-none bg-transparent" align="start" sideOffset={4}>
                      <DateRangePicker
                        value={tempDateRange}
                        quickRanges={quickRanges}
                        onApply={(range) => {
                          setDateRange(range);
                          setTempDateRange(range);
                          setIsDateRangeActive(true);
                          setDatePickerOpen(false);
                        }}
                        onCancel={() => { setTempDateRange({}); setDatePickerOpen(false); }}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Search */}
                  <div className="bg-background relative rounded-[8px] w-80">
                    <div className="flex items-center gap-2 px-3 py-[7.5px]">
                      <Search strokeWidth={ICON_STROKE_WIDTH} className="size-5 text-muted-foreground shrink-0" />
                      <input
                        placeholder="Search by audit ID, accession, UHID, reason"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      />
                    </div>
                    <div aria-hidden="true" className="absolute border border-border inset-[-1px] pointer-events-none rounded-[4px]" />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Filter options"
                  aria-pressed={showFilters}
                  onClick={() => setShowFilters((v) => !v)}
                  className={showFilters ? "bg-accent text-accent-foreground border-border" : ""}
                >
                  <Filter className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
                </Button>
              </div>

              {/* Row 2: Filter chips */}
              {showFilters && (
                <div className="flex items-center gap-2 flex-wrap">

                  <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                    <SelectTrigger className="h-8 w-56 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Report Edited">Report Edited</SelectItem>
                      <SelectItem value="Report Finalized">Report Finalized</SelectItem>
                      <SelectItem value="Report Reopened">Report Reopened</SelectItem>
                      <SelectItem value="Report Revised">Report Revised</SelectItem>
                      <SelectItem value="Impression Modified">Impression Modified</SelectItem>
                      <SelectItem value="Addendum Added">Addendum Added</SelectItem>
                      <SelectItem value="Template Switched">Template Switched</SelectItem>
                      <SelectItem value="Digital Signature Invalidated">Sig Invalidated</SelectItem>
                      <SelectItem value="Digital Signature Reapplied">Sig Reapplied</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={reportStatusFilter} onValueChange={setReportStatusFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Report Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Final">Final</SelectItem>
                      <SelectItem value="Reopened">Reopened</SelectItem>
                      <SelectItem value="Revised">Revised</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={signatureStatusFilter} onValueChange={setSignatureStatusFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Signature Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sig States</SelectItem>
                      <SelectItem value="Valid">Valid</SelectItem>
                      <SelectItem value="Invalidated">Invalidated</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={impactLevelFilter} onValueChange={setImpactLevelFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Impact Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Impact</SelectItem>
                      <SelectItem value="Major">Major</SelectItem>
                      <SelectItem value="Minor">Minor</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={actorFilter} onValueChange={setActorFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Actor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="RAD-001">RAD-001</SelectItem>
                      <SelectItem value="RAD-002">RAD-002</SelectItem>
                      <SelectItem value="RAD-003">RAD-003</SelectItem>
                      <SelectItem value="RAD-004">RAD-004</SelectItem>
                      <SelectItem value="RAD-005">RAD-005</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 px-3 bg-card border-border text-foreground font-medium hover:bg-accent rounded-[4px]"
                      onClick={clearAllFilters}
                      aria-label="Clear all filters"
                    >
                      <X className="size-3.5 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                      Clear All
                    </Button>
                  )}
                </div>
              )}
            </div>

            <CardContent className="p-[0px]">
              <Table className="mb-2">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Audit ID</TableHead>
                    <TableHead className="whitespace-nowrap">Event Type</TableHead>
                    <TableHead className="whitespace-nowrap">Accession No.</TableHead>
                    <TableHead className="whitespace-nowrap">Study Instance UID</TableHead>
                    <TableHead className="whitespace-nowrap">Patient UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Report Status</TableHead>
                    <TableHead className="whitespace-nowrap">Ver. Before</TableHead>
                    <TableHead className="whitespace-nowrap">Ver. After</TableHead>
                    <TableHead className="whitespace-nowrap">Changed Sections</TableHead>
                    <TableHead className="whitespace-nowrap">Before Snapshot</TableHead>
                    <TableHead className="whitespace-nowrap">After Snapshot</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By Role</TableHead>
                    <TableHead className="whitespace-nowrap">Revision Reason</TableHead>
                    <TableHead className="whitespace-nowrap">Sig Before</TableHead>
                    <TableHead className="whitespace-nowrap">Sig After</TableHead>
                    <TableHead className="whitespace-nowrap">Impact</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="whitespace-nowrap">Device</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => (
                      <TableRow
                        key={log.auditId}

                      >
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.auditId}</TableCell>
                        <TableCell className="whitespace-nowrap">{getEventTypeBadge(log.eventType)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.accessionNumber}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums max-w-[160px] truncate" title={log.studyInstanceUid}>
                          {log.studyInstanceUid}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.patientId}</TableCell>
                        <TableCell className="whitespace-nowrap">{getReportStatusBadge(log.reportStatus)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.versionBefore}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={log.versionAfter !== log.versionBefore ? "default" : "outline"} className="roboto-mono text-xs tabular-nums">
                            {log.versionAfter}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.changedSections.length > 0
                            ? log.changedSections.join(", ")
                            : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="max-w-[120px]"><SnapshotCell value={log.beforeSnapshot} /></TableCell>
                        <TableCell className="max-w-[120px]"><SnapshotCell value={log.afterSnapshot} /></TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.changedByUserId}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.changedByRole}</TableCell>
                        <TableCell className="text-sm max-w-[180px] truncate" title={log.revisionReason ?? ""}>
                          {log.revisionReason
                            ? <span>{log.revisionReason}</span>
                            : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getSignatureStatusBadge(log.signatureStatusBefore)}</TableCell>
                        <TableCell className="whitespace-nowrap">{getSignatureStatusBadge(log.signatureStatusAfter)}</TableCell>
                        <TableCell className="whitespace-nowrap">{getImpactBadge(log.changeImpactLevel)}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.changeTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.ipAddress}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.deviceType}</TableCell>
                        <TableCell className="whitespace-nowrap">{getStatusCell(log.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={21}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <History className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">No revision audit logs found matching your criteria</p>
                          <p className="text-xs text-muted-foreground">Try adjusting your filters or date range.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="mt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredLogs.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </CardContent>

            {/* Compliance Notice */}
            
          </Card>

        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Revision Audit Record Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">{selectedLog.auditId}</span>
              )}
            </DialogTitle>
            <DialogDescription>Complete revision audit record — read-only, immutable</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow label="Event Type" value={getEventTypeBadge(selectedLog.eventType)} />
              <DetailRow label="Accession Number" value={selectedLog.accessionNumber} mono />
              <DetailRow label="Study Instance UID" value={selectedLog.studyInstanceUid} mono />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Report Status" value={getReportStatusBadge(selectedLog.reportStatus)} />
              <DetailRow label="Version Before" value={<Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.versionBefore}</Badge>} />
              <DetailRow label="Version After" value={<Badge variant={selectedLog.versionAfter !== selectedLog.versionBefore ? "default" : "outline"} className="roboto-mono text-xs tabular-nums">{selectedLog.versionAfter}</Badge>} />
              <DetailRow label="Changed Sections" value={selectedLog.changedSections.length > 0 ? selectedLog.changedSections.join(", ") : null} />
              <DetailRow label="Before Snapshot" value={
                selectedLog.beforeSnapshot
                  ? <span className="roboto-mono text-xs tabular-nums text-muted-foreground break-all">{selectedLog.beforeSnapshot}</span>
                  : null
              } />
              <DetailRow label="After Snapshot" value={
                selectedLog.afterSnapshot
                  ? <span className="roboto-mono text-xs tabular-nums break-all">{selectedLog.afterSnapshot}</span>
                  : null
              } />
              <DetailRow label="Changed By UHID" value={selectedLog.changedByUserId} mono />
              <DetailRow label="Changed By Role" value={selectedLog.changedByRole} />
              <DetailRow label="Revision Reason" value={selectedLog.revisionReason} />
              <DetailRow label="Sig Status Before" value={getSignatureStatusBadge(selectedLog.signatureStatusBefore)} />
              <DetailRow label="Sig Status After" value={getSignatureStatusBadge(selectedLog.signatureStatusAfter)} />
              <DetailRow label="Change Impact" value={getImpactBadge(selectedLog.changeImpactLevel)} />
              <DetailRow label="Timestamp" value={formatTimestamp(selectedLog.changeTimestamp)} mono />
              <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
              <DetailRow label="Device Type" value={selectedLog.deviceType} />
              <DetailRow label="Status" value={getStatusCell(selectedLog.status)} />
              <DetailRow label="Facility ID" value={selectedLog.facilityId} mono />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Logs Sheet */}
      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Export Logs</SheetTitle>
            <SheetDescription>Generate and download compliance reports from immutable report revision audit log data.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default ReportEditsRevisions;
