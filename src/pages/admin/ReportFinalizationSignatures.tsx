/**
 * REPORT FINALIZATION & SIGNATURES AUDIT LOG — Story 10
 *
 * Captures all report finalization events, digital signature applications,
 * approvals, rejections, and re-signs in RIS.
 *
 * SCOPE:
 * ✔ Report Finalized
 * ✔ Digital Signature Applied
 * ✔ Digital Signature Verified
 * ✔ Approval Requested
 * ✔ Approval Granted
 * ✔ Approval Rejected
 * ✔ Report Re-signed
 * ✔ Multi-Level Approval Completed
 *
 * EXCLUDED: Draft saves (Story 8), Report delivery audit (separate story)
 *
 * COMPLIANCE:
 * - NABH / ISO / IT Act compliance
 * - Medico-legal validity (digital signature chain)
 * - Prevents unauthorized report signing
 * - Multi-level approval workflow traceability
 *
 * RETENTION: ≥ 7–10 years
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/report-finalization — list with pagination
 * - Query params: auditId, reportId, accessionNumber, patientId, eventType,
 *                 reportStatus, approvalStatus, approvalLevel, signatureStatus,
 *                 dateFrom, dateTo
 * - GET /api/admin/audit-logs/report-finalization/export — CSV / PDF
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  FileCheck2,
  ShieldCheck,
  Stamp,
  Calendar,
  BadgeCheck,
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

type FinalizationEventType =
  | "Report Finalized"
  | "Digital Signature Applied"
  | "Digital Signature Verified"
  | "Approval Requested"
  | "Approval Granted"
  | "Approval Rejected"
  | "Report Re-signed"
  | "Multi-Level Approval Completed";

type ReportStatus = "Final" | "Approved" | "Rejected" | "Pending Approval";
type SignatureType = "Digital" | "e-Sign" | "DSC" | "N/A";
type ApprovalLevel = "L1" | "L2" | "N/A";
type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "N/A";
type SignatureStatus = "Valid" | "N/A";
type ActionTaken = "Signed" | "Approved" | "Rejected" | "Verified" | "Re-signed" | "Requested" | "Completed";
type DeviceType = "Web" | "Workstation";
type EventOutcome = "Success" | "Failed";

interface FinalizationLog {
  auditId: string;
  eventType: FinalizationEventType;
  reportId?: string;
  accessionNumber: string;
  studyInstanceUid: string;
  patientId: string;
  reportVersion: string;
  reportStatus: ReportStatus;
  signatureType: SignatureType;
  approvalWorkflowId: string | null;
  approvalLevel: ApprovalLevel;
  approvalStatus: ApprovalStatus;
  actionTaken: ActionTaken;
  rejectionReason: string | null;
  signatureStatusBefore: SignatureStatus;
  signatureStatusAfter: SignatureStatus;
  signedByUserId: string;
  signedByRole: string;
  finalizationTimestamp: string | null;
  approvalTimestamp: string | null;
  changeTimestamp: string;
  ipAddress: string;
  deviceType: DeviceType;
  status: EventOutcome;
  facilityId: string;
}

// ─── Mock Data (50 records) ───────────────────────────────────────────────────

const mockLogs: FinalizationLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10001", eventType: "Report Finalized", reportId: "RPT-70001",
    accessionNumber: "ACC-40001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40001",
    patientId: "UHID-6001", reportVersion: "v3", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-01 10:15:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-01 10:15:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10002", eventType: "Digital Signature Applied", reportId: "RPT-70001",
    accessionNumber: "ACC-40001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40001",
    patientId: "UHID-6001", reportVersion: "v3", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-01 10:15:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-01 10:15:02", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10003", eventType: "Digital Signature Verified", reportId: "RPT-70001",
    accessionNumber: "ACC-40001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40001",
    patientId: "UHID-6001", reportVersion: "v3", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Verified", rejectionReason: null,
    signatureStatusBefore: "Valid", signatureStatusAfter: "Valid",
    signedByUserId: "SYS-001", signedByRole: "System",
    finalizationTimestamp: "2025-02-01 10:15:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-01 10:15:05", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10004", eventType: "Approval Requested", reportId: "RPT-70002",
    accessionNumber: "ACC-40002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40002",
    patientId: "UHID-6002", reportVersion: "v2", reportStatus: "Pending Approval",
    signatureType: "DSC", approvalWorkflowId: "WF-2001", approvalLevel: "L1",
    approvalStatus: "Pending", actionTaken: "Requested", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "RAD-002", signedByRole: "Radiologist",
    finalizationTimestamp: null, approvalTimestamp: null,
    changeTimestamp: "2025-02-01 11:30:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10005", eventType: "Approval Granted", reportId: "RPT-70002",
    accessionNumber: "ACC-40002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40002",
    patientId: "UHID-6002", reportVersion: "v2", reportStatus: "Approved",
    signatureType: "DSC", approvalWorkflowId: "WF-2001", approvalLevel: "L1",
    approvalStatus: "Approved", actionTaken: "Approved", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "SRAD-001", signedByRole: "Senior Radiologist",
    finalizationTimestamp: "2025-02-01 14:00:00", approvalTimestamp: "2025-02-01 14:00:00",
    changeTimestamp: "2025-02-01 14:00:00", ipAddress: "192.168.20.110",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 02 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10006", eventType: "Report Finalized", reportId: "RPT-70003",
    accessionNumber: "ACC-40003", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40003",
    patientId: "UHID-6003", reportVersion: "v4", reportStatus: "Final",
    signatureType: "e-Sign", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-003", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-02 09:00:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-02 09:00:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10007", eventType: "Approval Rejected", reportId: "RPT-70004",
    accessionNumber: "ACC-40004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40004",
    patientId: "UHID-6004", reportVersion: "v2", reportStatus: "Rejected",
    signatureType: "Digital", approvalWorkflowId: "WF-2002", approvalLevel: "L1",
    approvalStatus: "Rejected", actionTaken: "Rejected",
    rejectionReason: "Impression incomplete — clinical correlation not documented",
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "SRAD-001", signedByRole: "Senior Radiologist",
    finalizationTimestamp: null, approvalTimestamp: "2025-02-02 11:45:00",
    changeTimestamp: "2025-02-02 11:45:00", ipAddress: "192.168.20.110",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10008", eventType: "Digital Signature Applied", reportId: "RPT-70005",
    accessionNumber: "ACC-40005", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40005",
    patientId: "UHID-6005", reportVersion: "v1", reportStatus: "Final",
    signatureType: "DSC", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-004", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-02 14:20:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-02 14:20:01", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10010", eventType: "Report Re-signed", reportId: "RPT-70001",
    accessionNumber: "ACC-40001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40001",
    patientId: "UHID-6001", reportVersion: "v4", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Re-signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-03 10:50:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-03 10:50:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 04 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10011", eventType: "Approval Requested", reportId: "RPT-70006",
    accessionNumber: "ACC-40006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40006",
    patientId: "UHID-6006", reportVersion: "v2", reportStatus: "Pending Approval",
    signatureType: "DSC", approvalWorkflowId: "WF-2003", approvalLevel: "L1",
    approvalStatus: "Pending", actionTaken: "Requested", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "RAD-005", signedByRole: "Radiologist",
    finalizationTimestamp: null, approvalTimestamp: null,
    changeTimestamp: "2025-02-04 08:15:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10012", eventType: "Approval Granted", reportId: "RPT-70006",
    accessionNumber: "ACC-40006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40006",
    patientId: "UHID-6006", reportVersion: "v2", reportStatus: "Pending Approval",
    signatureType: "DSC", approvalWorkflowId: "WF-2003", approvalLevel: "L1",
    approvalStatus: "Approved", actionTaken: "Approved", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "SRAD-002", signedByRole: "Senior Radiologist",
    finalizationTimestamp: null, approvalTimestamp: "2025-02-04 09:00:00",
    changeTimestamp: "2025-02-04 09:00:00", ipAddress: "192.168.20.111",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10013", eventType: "Approval Requested", reportId: "RPT-70006",
    accessionNumber: "ACC-40006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40006",
    patientId: "UHID-6006", reportVersion: "v2", reportStatus: "Pending Approval",
    signatureType: "DSC", approvalWorkflowId: "WF-2003", approvalLevel: "L2",
    approvalStatus: "Pending", actionTaken: "Requested", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "SRAD-002", signedByRole: "Senior Radiologist",
    finalizationTimestamp: null, approvalTimestamp: null,
    changeTimestamp: "2025-02-04 09:01:00", ipAddress: "192.168.20.111",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10014", eventType: "Multi-Level Approval Completed", reportId: "RPT-70006",
    accessionNumber: "ACC-40006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40006",
    patientId: "UHID-6006", reportVersion: "v2", reportStatus: "Approved",
    signatureType: "DSC", approvalWorkflowId: "WF-2003", approvalLevel: "L2",
    approvalStatus: "Approved", actionTaken: "Completed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "MDIR-001", signedByRole: "Medical Director",
    finalizationTimestamp: "2025-02-04 11:30:00", approvalTimestamp: "2025-02-04 11:30:00",
    changeTimestamp: "2025-02-04 11:30:00", ipAddress: "192.168.20.120",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10015", eventType: "Report Finalized", reportId: "RPT-70007",
    accessionNumber: "ACC-40007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40007",
    patientId: "UHID-6007", reportVersion: "v2", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-05 09:20:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-05 09:20:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10016", eventType: "Digital Signature Applied", reportId: "RPT-70007",
    accessionNumber: "ACC-40007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40007",
    patientId: "UHID-6007", reportVersion: "v2", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-05 09:20:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-05 09:20:02", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10017", eventType: "Digital Signature Applied", reportId: "RPT-70008",
    accessionNumber: "ACC-40008", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40008",
    patientId: "UHID-6008", reportVersion: "v3", reportStatus: "Final",
    signatureType: "e-Sign", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-002", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-05 11:00:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-05 11:00:01", ipAddress: "192.168.20.102",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 06 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10018", eventType: "Approval Rejected", reportId: "RPT-70009",
    accessionNumber: "ACC-40009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40009",
    patientId: "UHID-6009", reportVersion: "v1", reportStatus: "Rejected",
    signatureType: "Digital", approvalWorkflowId: "WF-2004", approvalLevel: "L1",
    approvalStatus: "Rejected", actionTaken: "Rejected",
    rejectionReason: "Findings section references wrong laterality",
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "SRAD-001", signedByRole: "Senior Radiologist",
    finalizationTimestamp: null, approvalTimestamp: "2025-02-06 10:00:00",
    changeTimestamp: "2025-02-06 10:00:00", ipAddress: "192.168.20.110",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10019", eventType: "Report Finalized", reportId: "RPT-70010",
    accessionNumber: "ACC-40010", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40010",
    patientId: "UHID-6010", reportVersion: "v2", reportStatus: "Final",
    signatureType: "DSC", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-003", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-06 14:30:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-06 14:30:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 07 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10021", eventType: "Report Re-signed", reportId: "RPT-70005",
    accessionNumber: "ACC-40005", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40005",
    patientId: "UHID-6005", reportVersion: "v2", reportStatus: "Final",
    signatureType: "DSC", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Re-signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-004", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-07 11:45:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-07 11:45:00", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 08 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10022", eventType: "Digital Signature Applied", reportId: "RPT-70011",
    accessionNumber: "ACC-40011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40011",
    patientId: "UHID-6011", reportVersion: "v2", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-005", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-08 08:30:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-08 08:30:01", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10023", eventType: "Digital Signature Verified", reportId: "RPT-70011",
    accessionNumber: "ACC-40011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40011",
    patientId: "UHID-6011", reportVersion: "v2", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Verified", rejectionReason: null,
    signatureStatusBefore: "Valid", signatureStatusAfter: "Valid",
    signedByUserId: "SYS-001", signedByRole: "System",
    finalizationTimestamp: "2025-02-08 08:30:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-08 08:30:04", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 10 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10024", eventType: "Report Finalized", reportId: "RPT-70012",
    accessionNumber: "ACC-40012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40012",
    patientId: "UHID-6012", reportVersion: "v3", reportStatus: "Final",
    signatureType: "e-Sign", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-10 09:00:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-10 09:00:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10025", eventType: "Approval Requested", reportId: "RPT-70013",
    accessionNumber: "ACC-40013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40013",
    patientId: "UHID-6013", reportVersion: "v1", reportStatus: "Pending Approval",
    signatureType: "DSC", approvalWorkflowId: "WF-2005", approvalLevel: "L1",
    approvalStatus: "Pending", actionTaken: "Requested", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "RAD-002", signedByRole: "Radiologist",
    finalizationTimestamp: null, approvalTimestamp: null,
    changeTimestamp: "2025-02-10 10:15:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 12 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10026", eventType: "Approval Granted", reportId: "RPT-70013",
    accessionNumber: "ACC-40013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40013",
    patientId: "UHID-6013", reportVersion: "v1", reportStatus: "Approved",
    signatureType: "DSC", approvalWorkflowId: "WF-2005", approvalLevel: "L1",
    approvalStatus: "Approved", actionTaken: "Approved", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "SRAD-001", signedByRole: "Senior Radiologist",
    finalizationTimestamp: "2025-02-12 11:00:00", approvalTimestamp: "2025-02-12 11:00:00",
    changeTimestamp: "2025-02-12 11:00:00", ipAddress: "192.168.20.110",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10027", eventType: "Digital Signature Applied", reportId: "RPT-70014",
    accessionNumber: "ACC-40014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40014",
    patientId: "UHID-6014", reportVersion: "v2", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-003", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-12 13:00:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-12 13:00:01", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 14 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10029", eventType: "Report Finalized", reportId: "RPT-70015",
    accessionNumber: "ACC-40015", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40015",
    patientId: "UHID-6015", reportVersion: "v5", reportStatus: "Final",
    signatureType: "DSC", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-005", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-14 14:00:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-14 14:00:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 17 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10030", eventType: "Multi-Level Approval Completed", reportId: "RPT-70016",
    accessionNumber: "ACC-40016", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40016",
    patientId: "UHID-6016", reportVersion: "v3", reportStatus: "Approved",
    signatureType: "DSC", approvalWorkflowId: "WF-2006", approvalLevel: "L2",
    approvalStatus: "Approved", actionTaken: "Completed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "MDIR-001", signedByRole: "Medical Director",
    finalizationTimestamp: "2025-02-17 15:30:00", approvalTimestamp: "2025-02-17 15:30:00",
    changeTimestamp: "2025-02-17 15:30:00", ipAddress: "192.168.20.120",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10031", eventType: "Approval Rejected", reportId: "RPT-70017",
    accessionNumber: "ACC-40017", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40017",
    patientId: "UHID-6017", reportVersion: "v2", reportStatus: "Rejected",
    signatureType: "e-Sign", approvalWorkflowId: "WF-2007", approvalLevel: "L1",
    approvalStatus: "Rejected", actionTaken: "Rejected",
    rejectionReason: "Modality and study date mismatch with referral order",
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "SRAD-002", signedByRole: "Senior Radiologist",
    finalizationTimestamp: null, approvalTimestamp: "2025-02-17 16:45:00",
    changeTimestamp: "2025-02-17 16:45:00", ipAddress: "192.168.20.111",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 18 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10032", eventType: "Digital Signature Applied", reportId: "RPT-70018",
    accessionNumber: "ACC-40018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40018",
    patientId: "UHID-6018", reportVersion: "v2", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-18 09:45:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-18 09:45:01", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10033", eventType: "Report Finalized", reportId: "RPT-70019",
    accessionNumber: "ACC-40019", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40019",
    patientId: "UHID-6019", reportVersion: "v1", reportStatus: "Final",
    signatureType: "e-Sign", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-004", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-18 11:30:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-18 11:30:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 20 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10035", eventType: "Report Re-signed", reportId: "RPT-70012",
    accessionNumber: "ACC-40012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40012",
    patientId: "UHID-6012", reportVersion: "v4", reportStatus: "Final",
    signatureType: "e-Sign", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Re-signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-20 11:15:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-20 11:15:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 21 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10036", eventType: "Digital Signature Applied", reportId: "RPT-70020",
    accessionNumber: "ACC-40020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40020",
    patientId: "UHID-6020", reportVersion: "v2", reportStatus: "Final",
    signatureType: "DSC", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-003", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-21 08:45:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-21 08:45:01", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10037", eventType: "Approval Requested", reportId: "RPT-70021",
    accessionNumber: "ACC-40021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40021",
    patientId: "UHID-6021", reportVersion: "v3", reportStatus: "Pending Approval",
    signatureType: "Digital", approvalWorkflowId: "WF-2008", approvalLevel: "L1",
    approvalStatus: "Pending", actionTaken: "Requested", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "RAD-002", signedByRole: "Radiologist",
    finalizationTimestamp: null, approvalTimestamp: null,
    changeTimestamp: "2025-02-21 10:30:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 24 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10038", eventType: "Approval Granted", reportId: "RPT-70021",
    accessionNumber: "ACC-40021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40021",
    patientId: "UHID-6021", reportVersion: "v3", reportStatus: "Approved",
    signatureType: "Digital", approvalWorkflowId: "WF-2008", approvalLevel: "L1",
    approvalStatus: "Approved", actionTaken: "Approved", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "SRAD-001", signedByRole: "Senior Radiologist",
    finalizationTimestamp: "2025-02-24 09:00:00", approvalTimestamp: "2025-02-24 09:00:00",
    changeTimestamp: "2025-02-24 09:00:00", ipAddress: "192.168.20.110",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10039", eventType: "Report Finalized", reportId: "RPT-70022",
    accessionNumber: "ACC-40022", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40022",
    patientId: "UHID-6022", reportVersion: "v2", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-005", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-24 13:00:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-24 13:00:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 25 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10040", eventType: "Digital Signature Verified", reportId: "RPT-70020",
    accessionNumber: "ACC-40020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40020",
    patientId: "UHID-6020", reportVersion: "v2", reportStatus: "Final",
    signatureType: "DSC", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Verified", rejectionReason: null,
    signatureStatusBefore: "Valid", signatureStatusAfter: "Valid",
    signedByUserId: "SYS-001", signedByRole: "System",
    finalizationTimestamp: "2025-02-21 08:45:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-25 08:00:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10041", eventType: "Approval Rejected", reportId: "RPT-70023",
    accessionNumber: "ACC-40023", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40023",
    patientId: "UHID-6023", reportVersion: "v1", reportStatus: "Rejected",
    signatureType: "Digital", approvalWorkflowId: "WF-2009", approvalLevel: "L2",
    approvalStatus: "Rejected", actionTaken: "Rejected",
    rejectionReason: "Radiologist not assigned to this patient — policy violation",
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "MDIR-001", signedByRole: "Medical Director",
    finalizationTimestamp: null, approvalTimestamp: "2025-02-25 10:30:00",
    changeTimestamp: "2025-02-25 10:30:00", ipAddress: "192.168.20.120",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 26 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10042", eventType: "Report Finalized", reportId: "RPT-70024",
    accessionNumber: "ACC-40024", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40024",
    patientId: "UHID-6024", reportVersion: "v3", reportStatus: "Final",
    signatureType: "e-Sign", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-001", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-26 09:10:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-26 09:10:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 27 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10044", eventType: "Multi-Level Approval Completed", reportId: "RPT-70025",
    accessionNumber: "ACC-40025", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40025",
    patientId: "UHID-6025", reportVersion: "v4", reportStatus: "Approved",
    signatureType: "DSC", approvalWorkflowId: "WF-2010", approvalLevel: "L2",
    approvalStatus: "Approved", actionTaken: "Completed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "MDIR-001", signedByRole: "Medical Director",
    finalizationTimestamp: "2025-02-27 10:00:00", approvalTimestamp: "2025-02-27 10:00:00",
    changeTimestamp: "2025-02-27 10:00:00", ipAddress: "192.168.20.120",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 28 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10045", eventType: "Digital Signature Applied", reportId: "RPT-70026",
    accessionNumber: "ACC-40026", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40026",
    patientId: "UHID-6026", reportVersion: "v2", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-003", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-28 11:00:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-28 11:00:01", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10046", eventType: "Report Re-signed", reportId: "RPT-70022",
    accessionNumber: "ACC-40022", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40022",
    patientId: "UHID-6022", reportVersion: "v3", reportStatus: "Final",
    signatureType: "Digital", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Re-signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-005", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-02-28 15:30:00", approvalTimestamp: null,
    changeTimestamp: "2025-02-28 15:30:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Mar 01 ──────────────────────────────────────────
  {
    auditId: "FIN-A-10047", eventType: "Report Finalized", reportId: "RPT-70027",
    accessionNumber: "ACC-40027", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40027",
    patientId: "UHID-6027", reportVersion: "v2", reportStatus: "Final",
    signatureType: "DSC", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Signed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "RAD-004", signedByRole: "Radiologist",
    finalizationTimestamp: "2025-03-01 08:30:00", approvalTimestamp: null,
    changeTimestamp: "2025-03-01 08:30:00", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10048", eventType: "Approval Rejected", reportId: "RPT-70028",
    accessionNumber: "ACC-40028", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40028",
    patientId: "UHID-6028", reportVersion: "v1", reportStatus: "Rejected",
    signatureType: "e-Sign", approvalWorkflowId: "WF-2011", approvalLevel: "L1",
    approvalStatus: "Rejected", actionTaken: "Rejected",
    rejectionReason: "Impression conflicts with prior study comparison",
    signatureStatusBefore: "N/A", signatureStatusAfter: "N/A",
    signedByUserId: "SRAD-002", signedByRole: "Senior Radiologist",
    finalizationTimestamp: null, approvalTimestamp: "2025-03-01 11:00:00",
    changeTimestamp: "2025-03-01 11:00:00", ipAddress: "192.168.20.111",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10049", eventType: "Digital Signature Verified", reportId: "RPT-70024",
    accessionNumber: "ACC-40024", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.40024",
    patientId: "UHID-6024", reportVersion: "v3", reportStatus: "Final",
    signatureType: "e-Sign", approvalWorkflowId: null, approvalLevel: "N/A",
    approvalStatus: "N/A", actionTaken: "Verified", rejectionReason: null,
    signatureStatusBefore: "Valid", signatureStatusAfter: "Valid",
    signedByUserId: "SYS-001", signedByRole: "System",
    finalizationTimestamp: "2025-02-26 09:10:00", approvalTimestamp: null,
    changeTimestamp: "2025-03-01 14:00:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "FIN-A-10050", eventType: "Multi-Level Approval Completed", reportId: "RPT-70029",
    accessionNumber: "ACC-40029", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.40029",
    patientId: "UHID-6029", reportVersion: "v3", reportStatus: "Approved",
    signatureType: "DSC", approvalWorkflowId: "WF-2012", approvalLevel: "L2",
    approvalStatus: "Approved", actionTaken: "Completed", rejectionReason: null,
    signatureStatusBefore: "N/A", signatureStatusAfter: "Valid",
    signedByUserId: "MDIR-001", signedByRole: "Medical Director",
    finalizationTimestamp: "2025-03-01 16:00:00", approvalTimestamp: "2025-03-01 16:00:00",
    changeTimestamp: "2025-03-01 16:00:00", ipAddress: "192.168.20.120",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const quickRanges = [
  { label: "Today", range: { from: startOfDay(new Date()), to: endOfDay(new Date()) } },
  { label: "Last 7 days", range: { from: subDays(new Date(), 6), to: new Date() } },
  { label: "Last 30 days", range: { from: subDays(new Date(), 29), to: new Date() } },
  { label: "This month", range: { from: startOfMonth(new Date()), to: new Date() } },
];

// ─── Badge helpers ─────────────────────────────────────────────────────────────

function getEventTypeBadge(eventType: FinalizationEventType) {
  const map: Record<FinalizationEventType, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    "Report Finalized":            { variant: "default",     label: "Finalized" },
    "Digital Signature Applied":   { variant: "default",     label: "Sig Applied" },
    "Digital Signature Verified":  { variant: "secondary",   label: "Sig Verified" },
    "Approval Requested":          { variant: "outline",     label: "Approval Req." },
    "Approval Granted":            { variant: "default",     label: "Approved" },
    "Approval Rejected":           { variant: "destructive", label: "Rejected" },
    "Report Re-signed":            { variant: "secondary",   label: "Re-signed" },
    "Multi-Level Approval Completed": { variant: "default",  label: "ML Approved" },
  };
  const cfg = map[eventType] ?? { variant: "outline", label: eventType };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

function getReportStatusBadge(status: ReportStatus) {
  const map: Record<ReportStatus, "default" | "secondary" | "outline" | "destructive"> = {
    "Final":           "default",
    "Approved":        "default",
    "Rejected":        "destructive",
    "Pending Approval":"outline",
  };
  return <Badge variant={map[status] ?? "outline"}>{status}</Badge>;
}

function getSignatureStatusBadge(status: SignatureStatus) {
  if (status === "Valid") return <Badge variant="default">Valid</Badge>;
  return <span className="text-muted-foreground text-sm">N/A</span>;
}

function getApprovalStatusBadge(status: ApprovalStatus) {
  if (status === "Approved") return <Badge variant="default">Approved</Badge>;
  if (status === "Rejected") return <Badge variant="destructive">Rejected</Badge>;
  if (status === "Pending")  return <Badge variant="outline">Pending</Badge>;
  return <span className="text-muted-foreground text-sm">N/A</span>;
}

function getStatusCell(status: EventOutcome) {
  if (status === "Success") return (
    <span className="flex items-center gap-1 text-sm">
      <CheckCircle className="size-3.5 text-primary" strokeWidth={ICON_STROKE_WIDTH} />
      Success
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-sm text-destructive">
      <XCircle className="size-3.5" strokeWidth={ICON_STROKE_WIDTH} />
      Failed
    </span>
  );
}

function formatTimestamp(ts: string | null): string {
  if (!ts) return "—";
  try {
    const [datePart, timePart] = ts.split(" ");
    const [y, m, d] = datePart.split("-");
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const month = months[parseInt(m, 10) - 1];
    const [hh, mm] = timePart.split(":");
    const hour = parseInt(hh, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${d}-${month}-${y.slice(2)}, ${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
  } catch { return ts; }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportFinalizationSignatures() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [reportStatusFilter, setReportStatusFilter] = React.useState("all");
  const [approvalStatusFilter, setApprovalStatusFilter] = React.useState("all");
  const [approvalLevelFilter, setApprovalLevelFilter] = React.useState("all");
  const [sigStatusFilter, setSigStatusFilter] = React.useState("all");
  const [deviceFilter, setDeviceFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    from: subDays(new Date(), 450),
    to: new Date(),
  });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<FinalizationLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.accessionNumber, log.patientId, log.approvalWorkflowId ?? "", log.rejectionReason ?? "", log.signedByUserId].some((v) => v.toLowerCase().includes(q))) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (reportStatusFilter !== "all" && log.reportStatus !== reportStatusFilter) return false;
      if (approvalStatusFilter !== "all" && log.approvalStatus !== approvalStatusFilter) return false;
      if (approvalLevelFilter !== "all" && log.approvalLevel !== approvalLevelFilter) return false;
      if (sigStatusFilter !== "all" && log.signatureStatusAfter !== sigStatusFilter) return false;
      if (deviceFilter !== "all" && log.deviceType !== deviceFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.changeTimestamp);
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, eventTypeFilter, reportStatusFilter, approvalStatusFilter, approvalLevelFilter, sigStatusFilter, deviceFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, eventTypeFilter, reportStatusFilter, approvalStatusFilter, approvalLevelFilter, sigStatusFilter, deviceFilter, isDateRangeActive, dateRange]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    finalized: mockLogs.filter((l) => l.eventType === "Report Finalized").length,
    sigApplied: mockLogs.filter((l) => l.eventType === "Digital Signature Applied").length,
    approvalsGranted: mockLogs.filter((l) => l.eventType === "Approval Granted" || l.eventType === "Multi-Level Approval Completed").length,
  }), []);

  const hasActiveFilters = eventTypeFilter !== "all" || reportStatusFilter !== "all" || approvalStatusFilter !== "all" || approvalLevelFilter !== "all" || sigStatusFilter !== "all" || deviceFilter !== "all";

  function clearAllFilters() {
    setEventTypeFilter("all");
    setReportStatusFilter("all");
    setApprovalStatusFilter("all");
    setApprovalLevelFilter("all");
    setSigStatusFilter("all");
    setDeviceFilter("all");
    setSearchFilter("");
    setCurrentPage(1);
  }

  // ── Sub-components ──────────────────────────────────────────────────────────

  const DetailRow = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
    <div className="flex items-start py-2.5 border-b border-border last:border-0">
      <span className="w-44 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm flex-1 ${mono ? "roboto-mono text-xs tabular-nums" : ""}`}>
        {value ?? <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageShell>
      <PageHeader
        title="Report Finalization & Signatures Audit Logs"
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
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Total Events"
              value={stats.total}
              description="All finalization & signature events"
              icon={FileCheck2}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Reports Finalized"
              value={stats.finalized}
              description="Finalization events recorded"
              icon={BadgeCheck}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Signatures Applied"
              value={stats.sigApplied}
              description="Digital signatures applied"
              icon={Stamp}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Approvals Granted"
              value={stats.approvalsGranted}
              description="L1 / L2 approvals completed"
              icon={ShieldCheck}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
          </div>

          {/* Logs Table */}
          <Card className="p-4">
            <div className="flex flex-col gap-3 p-0">

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
                  <div className="bg-background relative rounded-lg w-80">
                    <div className="flex items-center gap-2 px-3 py-[7.5px]">
                      <Search strokeWidth={ICON_STROKE_WIDTH} className="size-5 text-muted-foreground shrink-0" />
                      <input
                        placeholder="Search by audit ID, accession no., UHID, workflow ID"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      />
                    </div>
                    <div aria-hidden="true" className="absolute border border-border inset-[-1px] pointer-events-none rounded-sm" />
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
                    <SelectTrigger className="h-8 w-56 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Report Finalized">Report Finalized</SelectItem>
                      <SelectItem value="Digital Signature Applied">Digital Sig Applied</SelectItem>
                      <SelectItem value="Digital Signature Verified">Digital Sig Verified</SelectItem>
                      <SelectItem value="Approval Requested">Approval Requested</SelectItem>
                      <SelectItem value="Approval Granted">Approval Granted</SelectItem>
                      <SelectItem value="Approval Rejected">Approval Rejected</SelectItem>
                      <SelectItem value="Report Re-signed">Report Re-signed</SelectItem>
                      <SelectItem value="Multi-Level Approval Completed">ML Approval Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={reportStatusFilter} onValueChange={setReportStatusFilter}>
                    <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Report Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Final">Final</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={approvalStatusFilter} onValueChange={setApprovalStatusFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Approval Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Approval States</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={approvalLevelFilter} onValueChange={setApprovalLevelFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Approval Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="L1">L1</SelectItem>
                      <SelectItem value="L2">L2</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sigStatusFilter} onValueChange={setSigStatusFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Sig Status (After)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sig States</SelectItem>
                      <SelectItem value="Valid">Valid</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="Web">Web</SelectItem>
                      <SelectItem value="Workstation">Workstation</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 px-3 bg-card border-border text-foreground font-medium hover:bg-accent rounded-sm"
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

            <CardContent className="p-0">
              <Table className="mb-2">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Audit ID</TableHead>
                    <TableHead className="whitespace-nowrap">Event Type</TableHead>
                    <TableHead className="whitespace-nowrap">Accession No.</TableHead>
                    <TableHead className="whitespace-nowrap">Study Instance UID</TableHead>
                    <TableHead className="whitespace-nowrap">Patient UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Report Version</TableHead>
                    <TableHead className="whitespace-nowrap">Report Status</TableHead>
                    <TableHead className="whitespace-nowrap">Sig Type</TableHead>
                    <TableHead className="whitespace-nowrap">Approval Workflow</TableHead>
                    <TableHead className="whitespace-nowrap">Approval Level</TableHead>
                    <TableHead className="whitespace-nowrap">Approval Status</TableHead>
                    <TableHead className="whitespace-nowrap">Action Taken</TableHead>
                    <TableHead className="whitespace-nowrap">Rejection Reason</TableHead>
                    <TableHead className="whitespace-nowrap">Sig Before</TableHead>
                    <TableHead className="whitespace-nowrap">Sig After</TableHead>
                    <TableHead className="whitespace-nowrap">Signed By UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Signed By Role</TableHead>
                    <TableHead className="whitespace-nowrap">Finalization Time</TableHead>
                    <TableHead className="whitespace-nowrap">Approval Time</TableHead>
                    <TableHead className="whitespace-nowrap">Change Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="whitespace-nowrap">Device</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => (
                      <TableRow key={log.auditId} className="hover:bg-muted/50">
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.auditId}</TableCell>
                        <TableCell className="whitespace-nowrap">{getEventTypeBadge(log.eventType)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.accessionNumber}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums max-w-[160px] truncate" title={log.studyInstanceUid}>
                          {log.studyInstanceUid}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.patientId}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.reportVersion}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getReportStatusBadge(log.reportStatus)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="secondary">{log.signatureType}</Badge>
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.approvalWorkflowId ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {log.approvalLevel === "N/A"
                            ? <span className="text-muted-foreground text-sm">N/A</span>
                            : <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.approvalLevel}</Badge>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getApprovalStatusBadge(log.approvalStatus)}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.actionTaken}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate" title={log.rejectionReason ?? ""}>
                          {log.rejectionReason ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getSignatureStatusBadge(log.signatureStatusBefore)}</TableCell>
                        <TableCell className="whitespace-nowrap">{getSignatureStatusBadge(log.signatureStatusAfter)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.signedByUserId}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.signedByRole}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.finalizationTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.approvalTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.changeTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.ipAddress}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.deviceType}</TableCell>
                        <TableCell className="whitespace-nowrap">{getStatusCell(log.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={23}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <FileCheck2 className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">No finalization audit logs found matching your criteria</p>
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
                  itemsPerPage={ITEMS_PER_PAGE}
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
              Finalization Audit Record Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">{selectedLog.auditId}</span>
              )}
            </DialogTitle>
            <DialogDescription>Complete finalization & signature audit record — read-only, immutable</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow label="Event Type" value={getEventTypeBadge(selectedLog.eventType)} />
              <DetailRow label="Accession Number" value={selectedLog.accessionNumber} mono />
              <DetailRow label="Study Instance UID" value={selectedLog.studyInstanceUid} mono />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Report Version" value={<Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.reportVersion}</Badge>} />
              <DetailRow label="Report Status" value={getReportStatusBadge(selectedLog.reportStatus)} />
              <DetailRow label="Signature Type" value={<Badge variant="secondary">{selectedLog.signatureType}</Badge>} />
              <DetailRow label="Approval Workflow ID" value={selectedLog.approvalWorkflowId} mono />
              <DetailRow label="Approval Level" value={selectedLog.approvalLevel} />
              <DetailRow label="Approval Status" value={getApprovalStatusBadge(selectedLog.approvalStatus)} />
              <DetailRow label="Action Taken" value={selectedLog.actionTaken} />
              <DetailRow label="Rejection Reason" value={selectedLog.rejectionReason} />
              <DetailRow label="Sig Status Before" value={getSignatureStatusBadge(selectedLog.signatureStatusBefore)} />
              <DetailRow label="Sig Status After" value={getSignatureStatusBadge(selectedLog.signatureStatusAfter)} />
              <DetailRow label="Signed By UHID" value={selectedLog.signedByUserId} mono />
              <DetailRow label="Signed By Role" value={selectedLog.signedByRole} />
              <DetailRow label="Finalization Time" value={formatTimestamp(selectedLog.finalizationTimestamp)} mono />
              <DetailRow label="Approval Time" value={formatTimestamp(selectedLog.approvalTimestamp)} mono />
              <DetailRow label="Change Timestamp" value={formatTimestamp(selectedLog.changeTimestamp)} mono />
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
            <SheetDescription>Generate and download compliance reports from immutable report finalization & signature audit log data.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default ReportFinalizationSignatures;
