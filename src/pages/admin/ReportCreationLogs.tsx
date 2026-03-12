// @refresh reset
import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  FilePen,
  Save,
  RefreshCw,
  PenLine,
  AlertTriangle,
  BookOpen,
  FileX,
  Plus,
  Cpu,
  RotateCcw,
  FileText,
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
import {
  Card,
  CardContent,
} from "../../app/components/ui/card";
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

/**
 * REPORT CREATION & DRAFT SAVES AUDIT LOG — Story 8
 *
 * SCOPE:
 * ✔ Report Created
 * ✔ Draft Saved (Manual)
 * ✔ Draft Auto-Saved
 * ✔ Report Edited
 * ✔ Impression Updated
 * ✔ Template Changed
 * ✔ Addendum Added
 * ✔ Report Reopened
 * ✔ Report Deleted (Soft Delete Only)
 *
 * EXCLUDED: Final approval audit (separate story), Report delivery audit (separate)
 *
 * COMPLIANCE:
 * - NABH radiology documentation standards
 * - Medico-legal defensibility
 * - ISO 27001 change logging
 * - Peer review traceability
 *
 * RETENTION: ≥ 7–10 years
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/reports — list with pagination
 * - Query params: auditId, accessionNumber, patientId, changedBy, eventType,
 *                 reportStatus, saveType, deviceType, dateFrom, dateTo
 * - GET /api/admin/audit-logs/reports/export — CSV / PDF
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportEventType =
  | "Report Created"
  | "Draft Saved (Manual)"
  | "Draft Auto-Saved"
  | "Report Edited"
  | "Impression Updated"
  | "Template Changed"
  | "Addendum Added"
  | "Report Reopened"
  | "Report Deleted";

type ReportStatus = "Draft" | "Final" | "Reopened" | "Deleted";
type SaveType = "Manual" | "Auto" | "N/A";
type DeviceType = "Web" | "Workstation";
type EventStatus = "Success" | "Failed";

interface ReportAuditLog {
  auditId: string;
  eventType: ReportEventType;
  reportId: string;
  accessionNumber: string;
  studyInstanceUid: string;
  patientId: string;
  reportStatus: ReportStatus;
  versionNumber: string;
  saveType: SaveType;
  wordCount: number | null;
  changedSections: string[];
  beforeSnapshot: string | null;
  afterSnapshot: string | null;
  changedByUserId: string;
  changedByRole: string;
  changeTimestamp: string;
  ipAddress: string;
  deviceType: DeviceType;
  changeReason: string | null;
  finalizationTimestamp: string | null;
  status: EventStatus;
  facilityId: string;
}

// ─── Mock Data (50 records) ───────────────────────────────────────────────────

const mockReportLogs: ReportAuditLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10001",
    eventType: "Report Created",
    reportId: "RPT-50001",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    patientId: "UHID-4501",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50001", "accession": "ACC-20010", "status": "Draft", "version": "v1", "createdAt": "2025-02-01T09:10:00" }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-01 09:10:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10002",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50001",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    patientId: "UHID-4501",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 142,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "", "impression": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "Axial T2 images reveal a 12mm hyperintense lesion in the right frontal lobe.", "impression": "" }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-01 09:15:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10003",
    eventType: "Report Created",
    reportId: "RPT-50002",
    accessionNumber: "ACC-20011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20011",
    patientId: "UHID-4502",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50002", "accession": "ACC-20011", "status": "Draft", "version": "v1", "createdAt": "2025-02-01T10:30:00" }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-01 10:30:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10004",
    eventType: "Draft Saved (Manual)",
    reportId: "RPT-50001",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    patientId: "UHID-4501",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 298,
    changedSections: ["Findings", "Impression"],
    beforeSnapshot: '{ "version": "v2", "impression": "" }',
    afterSnapshot: '{ "version": "v3", "impression": "Findings are suggestive of a low-grade glioma. MR spectroscopy recommended." }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-01 11:05:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10005",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50002",
    accessionNumber: "ACC-20011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20011",
    patientId: "UHID-4502",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 185,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "HRCT chest shows bilateral ground-glass opacities predominantly in lower lobes." }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-01 11:31:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10006",
    eventType: "Report Created",
    reportId: "RPT-50003",
    accessionNumber: "ACC-20013",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20013",
    patientId: "UHID-4503",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50003", "accession": "ACC-20013", "status": "Draft", "version": "v1", "createdAt": "2025-02-03T09:05:00" }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-03 09:05:00",
    ipAddress: "192.168.20.103",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10007",
    eventType: "Impression Updated",
    reportId: "RPT-50002",
    accessionNumber: "ACC-20011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20011",
    patientId: "UHID-4502",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 312,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v2", "impression": "Ground-glass opacities noted. Clinical correlation required." }',
    afterSnapshot: '{ "version": "v3", "impression": "Bilateral GGOs with peripheral distribution — pattern consistent with COVID-19 pneumonia. PCR confirmation advised." }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-03 10:21:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10008",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50003",
    accessionNumber: "ACC-20013",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20013",
    patientId: "UHID-4503",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 174,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "Axial CT abdomen: 2.3cm hypodense lesion in segment VI of liver. No satellite nodules." }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-03 11:01:00",
    ipAddress: "192.168.20.103",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10009",
    eventType: "Template Changed",
    reportId: "RPT-50003",
    accessionNumber: "ACC-20013",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20013",
    patientId: "UHID-4503",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 174,
    changedSections: ["Template"],
    beforeSnapshot: '{ "template": "CT-Abdomen-Basic", "version": "v2" }',
    afterSnapshot: '{ "template": "CT-Abdomen-Liver-Protocol", "version": "v3" }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-03 11:46:00",
    ipAddress: "192.168.20.103",
    deviceType: "Web",
    changeReason: "Switched to liver protocol template for better structured reporting",
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10010",
    eventType: "Report Created",
    reportId: "RPT-50004",
    accessionNumber: "ACC-20016",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.20016",
    patientId: "UHID-4505",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50004", "accession": "ACC-20016", "status": "Draft", "version": "v1", "createdAt": "2025-02-03T14:15:00" }',
    changedByUserId: "RAD-004",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-03 14:15:00",
    ipAddress: "192.168.20.104",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-003",
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10011",
    eventType: "Report Edited",
    reportId: "RPT-50001",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    patientId: "UHID-4501",
    reportStatus: "Draft",
    versionNumber: "v4",
    saveType: "Manual",
    wordCount: 340,
    changedSections: ["Findings", "Clinical History"],
    beforeSnapshot: '{ "version": "v3", "clinicalHistory": "" }',
    afterSnapshot: '{ "version": "v4", "clinicalHistory": "Patient presents with 3-week history of headaches and mild cognitive change." }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-05 09:16:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10012",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50004",
    accessionNumber: "ACC-20016",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.20016",
    patientId: "UHID-4505",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 210,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "Right CC and MLO views show a 9mm irregular spiculated mass in the upper outer quadrant." }',
    changedByUserId: "RAD-004",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-05 10:01:00",
    ipAddress: "192.168.20.104",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-003",
  },
  {
    auditId: "RPT-A-10013",
    eventType: "Impression Updated",
    reportId: "RPT-50003",
    accessionNumber: "ACC-20013",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20013",
    patientId: "UHID-4503",
    reportStatus: "Draft",
    versionNumber: "v4",
    saveType: "Manual",
    wordCount: 295,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v3", "impression": "Hypodense lesion noted — likely haemangioma." }',
    afterSnapshot: '{ "version": "v4", "impression": "2.3cm hepatic lesion in segment VI with enhancement pattern suspicious for HCC. Triple phase CT correlation or MRI liver recommended." }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-05 11:31:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "Senior radiologist review — impression revised",
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10014",
    eventType: "Report Created",
    reportId: "RPT-50005",
    accessionNumber: "ACC-20017",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20017",
    patientId: "UHID-4506",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50005", "accession": "ACC-20017", "status": "Draft", "version": "v1", "createdAt": "2025-02-05T13:00:00" }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-05 13:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10015",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50001",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    patientId: "UHID-4501",
    reportStatus: "Draft",
    versionNumber: "v5",
    saveType: "Auto",
    wordCount: 367,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v4", "findings": "...lesion in right frontal lobe." }',
    afterSnapshot: '{ "version": "v5", "findings": "...lesion in right frontal lobe. Perilesional oedema present. Midline shift not appreciated." }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-05 14:30:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 07 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10016",
    eventType: "Draft Saved (Manual)",
    reportId: "RPT-50004",
    accessionNumber: "ACC-20016",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.20016",
    patientId: "UHID-4505",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 280,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v2", "impression": "" }',
    afterSnapshot: '{ "version": "v3", "impression": "BI-RADS 4C: Highly suspicious mass. Core needle biopsy recommended." }',
    changedByUserId: "RAD-004",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-07 09:01:00",
    ipAddress: "192.168.20.104",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-003",
  },
  {
    auditId: "RPT-A-10017",
    eventType: "Report Created",
    reportId: "RPT-50006",
    accessionNumber: "ACC-20020",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.20020",
    patientId: "UHID-2789",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50006", "accession": "ACC-20020", "status": "Draft", "version": "v1", "createdAt": "2025-02-07T10:00:00" }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-07 10:00:00",
    ipAddress: "192.168.20.103",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10018",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50005",
    accessionNumber: "ACC-20017",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20017",
    patientId: "UHID-4506",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 155,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "FDG-PET CT: Intense FDG uptake in bilateral mediastinal and hilar lymph nodes (SUVmax 12.4)." }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-07 11:01:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10019",
    eventType: "Report Edited",
    reportId: "RPT-50003",
    accessionNumber: "ACC-20013",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20013",
    patientId: "UHID-4503",
    reportStatus: "Draft",
    versionNumber: "v5",
    saveType: "Manual",
    wordCount: 330,
    changedSections: ["Findings", "Impression"],
    beforeSnapshot: '{ "version": "v4", "findings": "2.3cm hepatic lesion in segment VI." }',
    afterSnapshot: '{ "version": "v5", "findings": "2.3cm hepatic lesion in segment VI with arterial enhancement and portal phase washout." }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-07 12:31:00",
    ipAddress: "192.168.20.103",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10020",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50006",
    accessionNumber: "ACC-20020",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.20020",
    patientId: "UHID-2789",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 192,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "USG obstetrics: Single live intrauterine foetus. GA 28w2d. EFW 1170g. Placenta anterior, grade I." }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-07 14:06:00",
    ipAddress: "192.168.20.103",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 10 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10021",
    eventType: "Addendum Added",
    reportId: "RPT-50001",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    patientId: "UHID-4501",
    reportStatus: "Final",
    versionNumber: "v6",
    saveType: "Manual",
    wordCount: 420,
    changedSections: ["Addendum"],
    beforeSnapshot: '{ "version": "v5", "addendum": null }',
    afterSnapshot: '{ "version": "v6", "addendum": "Post-contrast MR spectroscopy correlation performed. Elevated choline:NAA ratio confirms high-grade glioma. Neurosurgery referral placed." }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-10 09:01:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "Addendum following MRS correlation",
    finalizationTimestamp: "2025-02-08 17:00:00",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10022",
    eventType: "Draft Saved (Manual)",
    reportId: "RPT-50005",
    accessionNumber: "ACC-20017",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20017",
    patientId: "UHID-4506",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 275,
    changedSections: ["Findings", "Impression"],
    beforeSnapshot: '{ "version": "v2", "impression": "" }',
    afterSnapshot: '{ "version": "v3", "impression": "PET findings consistent with active lymphoma involving mediastinal lymph nodes. Suggest biopsy for confirmation." }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-10 10:16:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10023",
    eventType: "Report Created",
    reportId: "RPT-50007",
    accessionNumber: "ACC-20021",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20021",
    patientId: "UHID-4508",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50007", "accession": "ACC-20021", "status": "Draft", "version": "v1", "createdAt": "2025-02-10T11:00:00" }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-10 11:00:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "RPT-A-10024",
    eventType: "Report Reopened",
    reportId: "RPT-50002",
    accessionNumber: "ACC-20011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20011",
    patientId: "UHID-4502",
    reportStatus: "Reopened",
    versionNumber: "v4",
    saveType: "N/A",
    wordCount: 312,
    changedSections: [],
    beforeSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-04T15:00:00" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "reopenedAt": "2025-02-10T13:00:00" }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-10 13:00:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "Clinician requested clarification on extent of GGOs — needs quantification",
    finalizationTimestamp: "2025-02-04 15:00:00",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10025",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50007",
    accessionNumber: "ACC-20021",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20021",
    patientId: "UHID-4508",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 163,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "CT KUB: 4mm calculus in the right ureterovesical junction causing mild proximal ureteric dilatation." }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-10 14:31:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  // ── Feb 12 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10026",
    eventType: "Impression Updated",
    reportId: "RPT-50002",
    accessionNumber: "ACC-20011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20011",
    patientId: "UHID-4502",
    reportStatus: "Reopened",
    versionNumber: "v5",
    saveType: "Manual",
    wordCount: 345,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v4", "impression": "Bilateral GGOs — pattern consistent with COVID-19 pneumonia." }',
    afterSnapshot: '{ "version": "v5", "impression": "Bilateral GGOs involving approximately 40% of lung parenchyma bilaterally — CT severity score 14/25. Pattern consistent with COVID-19 pneumonia." }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-12 09:01:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "Clinician requested quantification of GGO extent",
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10027",
    eventType: "Draft Saved (Manual)",
    reportId: "RPT-50007",
    accessionNumber: "ACC-20021",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20021",
    patientId: "UHID-4508",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 240,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v2", "impression": "" }',
    afterSnapshot: '{ "version": "v3", "impression": "4mm right UVJ calculus with mild hydronephrosis. Likely to pass spontaneously. USG KUB follow-up advised in 2 weeks." }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-12 10:16:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "RPT-A-10028",
    eventType: "Report Created",
    reportId: "RPT-50008",
    accessionNumber: "ACC-20025",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20025",
    patientId: "UHID-4510",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50008", "accession": "ACC-20025", "status": "Draft", "version": "v1", "createdAt": "2025-02-12T11:00:00" }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-12 11:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "RPT-A-10029",
    eventType: "Addendum Added",
    reportId: "RPT-50003",
    accessionNumber: "ACC-20013",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20013",
    patientId: "UHID-4503",
    reportStatus: "Final",
    versionNumber: "v6",
    saveType: "Manual",
    wordCount: 380,
    changedSections: ["Addendum"],
    beforeSnapshot: '{ "version": "v5", "addendum": null }',
    afterSnapshot: '{ "version": "v6", "addendum": "Post-biopsy correlation: HCC confirmed on histopathology. Radiological findings consistent with biopsy result." }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-12 13:31:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "Post-biopsy correlation addendum",
    finalizationTimestamp: "2025-02-07 16:00:00",
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10030",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50008",
    accessionNumber: "ACC-20025",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20025",
    patientId: "UHID-4510",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 198,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "MRI wrist: Partial thickness tear of the TFCC at its radial attachment. Mild distal radioulnar joint effusion." }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-12 14:46:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  // ── Feb 14 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10031",
    eventType: "Report Edited",
    reportId: "RPT-50006",
    accessionNumber: "ACC-20020",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.20020",
    patientId: "UHID-2789",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 258,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v2", "findings": "...GA 28w2d. EFW 1170g." }',
    afterSnapshot: '{ "version": "v3", "findings": "...GA 28w2d. EFW 1170g. Amniotic fluid index 14cm (normal range). Foetal biophysical profile 8/8." }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-14 09:01:00",
    ipAddress: "192.168.20.103",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10032",
    eventType: "Template Changed",
    reportId: "RPT-50008",
    accessionNumber: "ACC-20025",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20025",
    patientId: "UHID-4510",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 198,
    changedSections: ["Template"],
    beforeSnapshot: '{ "template": "MRI-Wrist-Basic", "version": "v2" }',
    afterSnapshot: '{ "template": "MRI-Wrist-TFCC-Protocol", "version": "v3" }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-14 10:31:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: "TFCC injury identified — specialist template applied",
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "RPT-A-10033",
    eventType: "Report Created",
    reportId: "RPT-50009",
    accessionNumber: "ACC-20026",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20026",
    patientId: "UHID-2345",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50009", "accession": "ACC-20026", "status": "Draft", "version": "v1", "createdAt": "2025-02-14T11:00:00" }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-14 11:00:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10034",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50009",
    accessionNumber: "ACC-20026",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20026",
    patientId: "UHID-2345",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 210,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "CT Coronary Angiography: LAD shows 60–70% stenosis in the proximal segment. LCX and RCA normal." }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-14 12:01:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10035",
    eventType: "Addendum Added",
    reportId: "RPT-50004",
    accessionNumber: "ACC-20016",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.20016",
    patientId: "UHID-4505",
    reportStatus: "Final",
    versionNumber: "v4",
    saveType: "Manual",
    wordCount: 315,
    changedSections: ["Addendum"],
    beforeSnapshot: '{ "version": "v3", "addendum": null }',
    afterSnapshot: '{ "version": "v4", "addendum": "Post-biopsy: IDC Grade 2 confirmed. Radiological appearance correlates with histopathology." }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-14 14:31:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "Post-biopsy histopathology addendum",
    finalizationTimestamp: "2025-02-10 14:00:00",
    status: "Success",
    facilityId: "FAC-003",
  },
  // ── Feb 17 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10036",
    eventType: "Draft Saved (Manual)",
    reportId: "RPT-50009",
    accessionNumber: "ACC-20026",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20026",
    patientId: "UHID-2345",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 289,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v2", "impression": "" }',
    afterSnapshot: '{ "version": "v3", "impression": "Significant LAD stenosis (60–70%). Functional imaging or cardiac catheterisation advised for haemodynamic significance assessment." }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-17 09:01:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10037",
    eventType: "Report Edited",
    reportId: "RPT-50008",
    accessionNumber: "ACC-20025",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20025",
    patientId: "UHID-4510",
    reportStatus: "Draft",
    versionNumber: "v4",
    saveType: "Manual",
    wordCount: 260,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v3", "impression": "" }',
    afterSnapshot: '{ "version": "v4", "impression": "Partial TFCC tear at radial attachment. Conservative management recommended; surgical opinion if no improvement in 6 weeks." }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-17 10:16:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "RPT-A-10038",
    eventType: "Report Created",
    reportId: "RPT-50010",
    accessionNumber: "ACC-20029",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20029",
    patientId: "UHID-2900",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50010", "accession": "ACC-20029", "status": "Draft", "version": "v1", "createdAt": "2025-02-17T11:00:00" }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-17 11:00:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10039",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50010",
    accessionNumber: "ACC-20029",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20029",
    patientId: "UHID-2900",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 188,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "MRI C-spine: Posterior disc osteophyte complex at C5-C6 causing moderate bilateral neural foraminal narrowing." }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-17 12:01:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10040",
    eventType: "Report Reopened",
    reportId: "RPT-50005",
    accessionNumber: "ACC-20017",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20017",
    patientId: "UHID-4506",
    reportStatus: "Reopened",
    versionNumber: "v4",
    saveType: "N/A",
    wordCount: 275,
    changedSections: [],
    beforeSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-12T16:00:00" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "reopenedAt": "2025-02-17T14:00:00" }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-17 14:00:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "Oncologist requested additional lymph node characterisation for staging",
    finalizationTimestamp: "2025-02-12 16:00:00",
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 19 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10041",
    eventType: "Draft Saved (Manual)",
    reportId: "RPT-50010",
    accessionNumber: "ACC-20029",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20029",
    patientId: "UHID-2900",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 265,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v2", "impression": "" }',
    afterSnapshot: '{ "version": "v3", "impression": "C5-C6 disc-osteophyte complex with bilateral foraminal stenosis. Clinical correlation with radiculopathy symptoms. Physiotherapy trial before surgical review." }',
    changedByUserId: "RAD-003",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-19 09:01:00",
    ipAddress: "192.168.20.103",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10042",
    eventType: "Impression Updated",
    reportId: "RPT-50009",
    accessionNumber: "ACC-20026",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20026",
    patientId: "UHID-2345",
    reportStatus: "Draft",
    versionNumber: "v4",
    saveType: "Manual",
    wordCount: 310,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v3", "impression": "Significant LAD stenosis (60–70%). Cardiac catheterisation advised." }',
    afterSnapshot: '{ "version": "v4", "impression": "LAD stenosis 60–70%. FFR-CT calculated value 0.71 — haemodynamically significant. Cardiology referral for intervention planning." }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-19 10:31:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "FFR-CT post-processing result added to impression",
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10043",
    eventType: "Report Created",
    reportId: "RPT-50011",
    accessionNumber: "ACC-20032",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20032",
    patientId: "UHID-2200",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50011", "accession": "ACC-20032", "status": "Draft", "version": "v1", "createdAt": "2025-02-19T11:00:00" }',
    changedByUserId: "RAD-004",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-19 11:00:00",
    ipAddress: "192.168.20.104",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10044",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50011",
    accessionNumber: "ACC-20032",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20032",
    patientId: "UHID-2200",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 172,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "MRI ankle: Partial tear of the anterior talofibular ligament. Bone marrow oedema at the lateral malleolus. No fracture." }',
    changedByUserId: "RAD-004",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-19 12:01:00",
    ipAddress: "192.168.20.104",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10045",
    eventType: "Report Deleted",
    reportId: "RPT-50012",
    accessionNumber: "ACC-20033",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20033",
    patientId: "UHID-1560",
    reportStatus: "Deleted",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: '{ "status": "Draft", "version": "v1", "findings": "" }',
    afterSnapshot: '{ "status": "Deleted (Soft)", "deletedAt": "2025-02-19T14:00:00", "deletedBy": "USR-ADM-001" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Admin",
    changeTimestamp: "2025-02-19 14:00:00",
    ipAddress: "10.0.5.20",
    deviceType: "Web",
    changeReason: "Duplicate report created in error — isotope availability cancellation",
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  // ── Feb 22 ──────────────────────────────────────────
  {
    auditId: "RPT-A-10046",
    eventType: "Draft Saved (Manual)",
    reportId: "RPT-50011",
    accessionNumber: "ACC-20032",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20032",
    patientId: "UHID-2200",
    reportStatus: "Draft",
    versionNumber: "v3",
    saveType: "Manual",
    wordCount: 240,
    changedSections: ["Impression"],
    beforeSnapshot: '{ "version": "v2", "impression": "" }',
    afterSnapshot: '{ "version": "v3", "impression": "Partial ATFL tear with lateral malleolus BME — grade 1 ligamentous injury. Conservative management and ankle physiotherapy." }',
    changedByUserId: "RAD-004",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-22 09:16:00",
    ipAddress: "192.168.20.104",
    deviceType: "Web",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10047",
    eventType: "Report Edited",
    reportId: "RPT-50005",
    accessionNumber: "ACC-20017",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20017",
    patientId: "UHID-4506",
    reportStatus: "Reopened",
    versionNumber: "v5",
    saveType: "Manual",
    wordCount: 340,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v4", "findings": "...bilateral mediastinal and hilar lymph nodes (SUVmax 12.4)." }',
    afterSnapshot: '{ "version": "v5", "findings": "...bilateral mediastinal (SUVmax 12.4) and hilar lymph nodes (SUVmax 9.8). No distant metastatic disease. Ann Arbor Stage IIA." }',
    changedByUserId: "RAD-002",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-22 10:16:00",
    ipAddress: "192.168.20.102",
    deviceType: "Workstation",
    changeReason: "Oncologist request — lymphoma staging characterisation added",
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10048",
    eventType: "Report Created",
    reportId: "RPT-50013",
    accessionNumber: "ACC-20037",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20037",
    patientId: "UHID-3301",
    reportStatus: "Draft",
    versionNumber: "v1",
    saveType: "N/A",
    wordCount: 0,
    changedSections: [],
    beforeSnapshot: null,
    afterSnapshot: '{ "reportId": "RPT-50013", "accession": "ACC-20037", "status": "Draft", "version": "v1", "createdAt": "2025-02-22T11:00:00" }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-22 11:00:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPT-A-10049",
    eventType: "Report Reopened",
    reportId: "RPT-50007",
    accessionNumber: "ACC-20021",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20021",
    patientId: "UHID-4508",
    reportStatus: "Reopened",
    versionNumber: "v4",
    saveType: "N/A",
    wordCount: 240,
    changedSections: [],
    beforeSnapshot: '{ "status": "Final", "version": "v3", "finalizedAt": "2025-02-13T12:00:00" }',
    afterSnapshot: '{ "status": "Reopened", "version": "v4", "reopenedAt": "2025-02-22T13:00:00" }',
    changedByUserId: "RAD-005",
    changedByRole: "Senior Radiologist",
    changeTimestamp: "2025-02-22 13:00:00",
    ipAddress: "192.168.20.105",
    deviceType: "Workstation",
    changeReason: "Urologist review — stone density (HU) not documented, required for management planning",
    finalizationTimestamp: "2025-02-13 12:00:00",
    status: "Success",
    facilityId: "FAC-002",
  },
  {
    auditId: "RPT-A-10050",
    eventType: "Draft Auto-Saved",
    reportId: "RPT-50013",
    accessionNumber: "ACC-20037",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20037",
    patientId: "UHID-3301",
    reportStatus: "Draft",
    versionNumber: "v2",
    saveType: "Auto",
    wordCount: 195,
    changedSections: ["Findings"],
    beforeSnapshot: '{ "version": "v1", "findings": "" }',
    afterSnapshot: '{ "version": "v2", "findings": "CT chest with contrast: 2.1cm spiculated nodule in RUL with pleural tethering. Mediastinal nodes not enlarged. No pleural effusion." }',
    changedByUserId: "RAD-001",
    changedByRole: "Radiologist",
    changeTimestamp: "2025-02-22 14:31:00",
    ipAddress: "192.168.20.101",
    deviceType: "Workstation",
    changeReason: null,
    finalizationTimestamp: null,
    status: "Success",
    facilityId: "FAC-001",
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Main Component ───────────────────────────────────────────────────────────

export function ReportCreationLogs() {
  const logs = mockReportLogs;

  // --- Filter state ---
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [reportStatusFilter, setReportStatusFilter] = React.useState("all");
  const [saveTypeFilter, setSaveTypeFilter] = React.useState("all");
  const [deviceTypeFilter, setDeviceTypeFilter] = React.useState("all");
  const [radiologistFilter, setRadiologistFilter] = React.useState("all");
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
  const [selectedLog, setSelectedLog] = React.useState<ReportAuditLog | null>(null);
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
    const draftSaves = logs.filter(
      (l) => l.eventType === "Draft Saved (Manual)" || l.eventType === "Draft Auto-Saved"
    ).length;
    const editsImpressions = logs.filter(
      (l) => l.eventType === "Report Edited" || l.eventType === "Impression Updated"
    ).length;
    const addendaReopens = logs.filter(
      (l) => l.eventType === "Addendum Added" || l.eventType === "Report Reopened"
    ).length;
    const deleted = logs.filter((l) => l.eventType === "Report Deleted").length;
    return { total, draftSaves, editsImpressions, addendaReopens, deleted };
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
        log.studyInstanceUid.toLowerCase().includes(sq);

      const matchesEventType = eventTypeFilter === "all" || log.eventType === eventTypeFilter;
      const matchesStatus = reportStatusFilter === "all" || log.reportStatus === reportStatusFilter;
      const matchesSaveType = saveTypeFilter === "all" || log.saveType === saveTypeFilter;
      const matchesDevice = deviceTypeFilter === "all" || log.deviceType === deviceTypeFilter;
      const matchesRad = radiologistFilter === "all" || log.changedByUserId === radiologistFilter;

      const logDate = new Date(log.changeTimestamp);
      const matchesDate =
        logDate >= startOfDay(dateRange.from) && logDate <= endOfDay(dateRange.to);

      return (
        matchesSearch && matchesEventType && matchesStatus &&
        matchesSaveType && matchesDevice && matchesRad && matchesDate
      );
    });
  }, [logs, searchFilter, eventTypeFilter, reportStatusFilter, saveTypeFilter, deviceTypeFilter, radiologistFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => { setCurrentPage(1); }, [
    searchFilter, eventTypeFilter, reportStatusFilter, saveTypeFilter, deviceTypeFilter, radiologistFilter, dateRange,
  ]);

  const hasActiveFilters =
    eventTypeFilter !== "all" || reportStatusFilter !== "all" || saveTypeFilter !== "all" ||
    deviceTypeFilter !== "all" || radiologistFilter !== "all";

  const clearAllFilters = () => {
    setEventTypeFilter("all"); setReportStatusFilter("all"); setSaveTypeFilter("all");
    setDeviceTypeFilter("all"); setRadiologistFilter("all"); setSearchFilter("");
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
  const getEventTypeBadge = (et: ReportEventType) => {
    switch (et) {
      case "Report Created":
        return <Badge variant="default"><CheckCircle className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Created</Badge>;
      case "Draft Saved (Manual)":
        return <Badge variant="secondary"><Save className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Draft (Manual)</Badge>;
      case "Draft Auto-Saved":
        return <Badge variant="outline"><RefreshCw className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Auto-Saved</Badge>;
      case "Report Edited":
        return <Badge variant="secondary"><PenLine className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Edited</Badge>;
      case "Impression Updated":
        return <Badge variant="outline"><FilePen className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Impression</Badge>;
      case "Template Changed":
        return <Badge variant="secondary"><BookOpen className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Template</Badge>;
      case "Addendum Added":
        return <Badge variant="secondary"><Plus className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Addendum</Badge>;
      case "Report Reopened":
        return <Badge variant="destructive"><RotateCcw className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Reopened</Badge>;
      case "Report Deleted":
        return <Badge variant="destructive"><FileX className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Deleted</Badge>;
    }
  };

  const getReportStatusBadge = (s: ReportStatus) => {
    switch (s) {
      case "Draft":    return <Badge variant="outline">Draft</Badge>;
      case "Final":    return <Badge variant="default">Final</Badge>;
      case "Reopened": return <Badge variant="destructive">Reopened</Badge>;
      case "Deleted":  return <Badge variant="destructive">Deleted</Badge>;
    }
  };

  const getStatusCell = (s: EventStatus) => {
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
        title="Report Creation & Draft Saves Audit Logs"
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
              description="All report audit events"
              icon={FileText}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Draft Saves"
              value={stats.draftSaves}
              description="Manual & auto-saved drafts"
              icon={Save}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Edits & Impressions"
              value={stats.editsImpressions}
              description="Content edits & impression updates"
              icon={PenLine}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Addenda & Reopens"
              value={stats.addendaReopens}
              description="Addendums added & reports reopened"
              icon={RotateCcw}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Deletions"
              value={stats.deleted}
              description="Soft-deleted reports only"
              icon={FileX}
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
                        placeholder="Search by audit ID, accession, UHID, radiologist"
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
                    <SelectTrigger className="h-8 w-52 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Report Created">Report Created</SelectItem>
                      <SelectItem value="Draft Saved (Manual)">Draft Saved (Manual)</SelectItem>
                      <SelectItem value="Draft Auto-Saved">Draft Auto-Saved</SelectItem>
                      <SelectItem value="Report Edited">Report Edited</SelectItem>
                      <SelectItem value="Impression Updated">Impression Updated</SelectItem>
                      <SelectItem value="Template Changed">Template Changed</SelectItem>
                      <SelectItem value="Addendum Added">Addendum Added</SelectItem>
                      <SelectItem value="Report Reopened">Report Reopened</SelectItem>
                      <SelectItem value="Report Deleted">Report Deleted</SelectItem>
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
                      <SelectItem value="Deleted">Deleted</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={saveTypeFilter} onValueChange={setSaveTypeFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Save Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Save Types</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Auto">Auto</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="Workstation">Workstation</SelectItem>
                      <SelectItem value="Web">Web</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={radiologistFilter} onValueChange={setRadiologistFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Radiologist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="RAD-001">RAD-001</SelectItem>
                      <SelectItem value="RAD-002">RAD-002</SelectItem>
                      <SelectItem value="RAD-003">RAD-003</SelectItem>
                      <SelectItem value="RAD-004">RAD-004</SelectItem>
                      <SelectItem value="RAD-005">RAD-005</SelectItem>
                      <SelectItem value="USR-ADM-001">USR-ADM-001</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Version</TableHead>
                    <TableHead className="whitespace-nowrap">Save Type</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Word Count</TableHead>
                    <TableHead className="whitespace-nowrap">Changed Sections</TableHead>
                    <TableHead className="whitespace-nowrap">Before Snapshot</TableHead>
                    <TableHead className="whitespace-nowrap">After Snapshot</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By Role</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="whitespace-nowrap">Device</TableHead>
                    <TableHead className="whitespace-nowrap">Change Reason</TableHead>
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
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.versionNumber}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {log.saveType === "N/A"
                            ? <span className="text-sm text-muted-foreground">—</span>
                            : <span className="text-sm">{log.saveType}</span>}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap text-right">
                          {log.wordCount !== null && log.wordCount > 0
                            ? log.wordCount
                            : <span className="text-muted-foreground">—</span>}
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
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.changeTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.ipAddress}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.deviceType === "Workstation"
                            ? <div className="flex items-center gap-1"><span>Workstation</span></div>
                            : <span>Web</span>}
                        </TableCell>
                        <TableCell className="text-sm max-w-[180px] truncate" title={log.changeReason ?? ""}>
                          {log.changeReason
                            ? <span>{log.changeReason}</span>
                            : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getStatusCell(log.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={19}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <FilePen className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">No report audit logs found matching your criteria</p>
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
          </Card>

          {/* Compliance Notice */}
          
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Report Audit Record Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">{selectedLog.auditId}</span>
              )}
            </DialogTitle>
            <DialogDescription>Complete report audit record — read-only, immutable</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow label="Event Type" value={getEventTypeBadge(selectedLog.eventType)} />
              <DetailRow label="Accession Number" value={selectedLog.accessionNumber} mono />
              <DetailRow label="Study Instance UID" value={selectedLog.studyInstanceUid} mono />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Report Status" value={getReportStatusBadge(selectedLog.reportStatus)} />
              <DetailRow label="Version" value={<Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.versionNumber}</Badge>} />
              <DetailRow label="Save Type" value={selectedLog.saveType !== "N/A" ? selectedLog.saveType : null} />
              <DetailRow label="Word Count" value={selectedLog.wordCount ? String(selectedLog.wordCount) : null} mono />
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
              <DetailRow label="Timestamp" value={formatTimestamp(selectedLog.changeTimestamp)} mono />
              <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
              <DetailRow label="Device Type" value={selectedLog.deviceType} />
              <DetailRow label="Change Reason" value={selectedLog.changeReason} />
              <DetailRow label="Finalization TS" value={selectedLog.finalizationTimestamp ? formatTimestamp(selectedLog.finalizationTimestamp) : null} mono />
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
            <SheetDescription>Generate and download compliance reports from immutable report audit log data.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default ReportCreationLogs;
