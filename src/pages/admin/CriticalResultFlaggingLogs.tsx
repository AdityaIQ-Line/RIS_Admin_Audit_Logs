/**
 * CRITICAL RESULT FLAGGING AUDIT LOG — Story 11
 *
 * Captures all critical result flagging events in RIS.
 *
 * SCOPE:
 * ✔ Critical Flag Added
 * ✔ Remarks Added
 * ✔ Critical Flag Removed
 *
 * EXCLUDED: Report creation / editing (Story 8), Finalization (Story 10)
 *
 * COMPLIANCE:
 * - NABH Critical Finding Documentation Policy
 * - Medico-legal defensibility
 * - ISO 27001 change tracking
 * - Clinical governance requirements
 *
 * RETENTION: ≥ 7–10 years
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/critical-result-flagging — list with pagination
 * - Query params: auditId, accessionNumber, patientId, radiologistId, eventType,
 *                 criticalStatusAfter, deviceType, dateFrom, dateTo
 * - GET /api/admin/audit-logs/critical-result-flagging/export — CSV / PDF
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Flag,
  FlagOff,
  MessageSquarePlus,
  Calendar,
  AlertTriangle,
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

type CriticalFlagEventType =
  | "Critical Flag Added"
  | "Remarks Added"
  | "Critical Flag Removed";

type CriticalStatus = "Yes" | "No";
type DeviceType = "Web" | "Workstation";
type EventOutcome = "Success" | "Failed";

interface CriticalFlagLog {
  auditId: string;
  eventType: CriticalFlagEventType;
  accessionNumber: string;
  studyInstanceUid: string;
  patientId: string;
  radiologistId: string;
  radiologistRole: string;
  reportVersion: string;
  criticalStatusBefore: CriticalStatus;
  criticalStatusAfter: CriticalStatus;
  changeReason: string | null;
  flagTimestamp: string;
  removalTimestamp: string | null;
  changeTimestamp: string;
  ipAddress: string;
  deviceType: DeviceType;
  status: EventOutcome;
  facilityId: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockLogs: CriticalFlagLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10001", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50001",
    patientId: "UHID-7001", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-01 09:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-01 09:15:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10002", eventType: "Remarks Added",
    accessionNumber: "ACC-50001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50001",
    patientId: "UHID-7001", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Suspected acute pulmonary embolism — right heart strain pattern on CT; urgent CTA pulmonary recommended",
    flagTimestamp: "2025-02-01 09:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-01 09:22:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10003", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50002",
    patientId: "UHID-7002", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-01 14:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-01 14:30:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 02 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10004", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50003", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50003",
    patientId: "UHID-7003", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    reportVersion: "v3", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-02 10:05:00", removalTimestamp: null,
    changeTimestamp: "2025-02-02 10:05:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "CRIT-A-10005", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50003", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50003",
    patientId: "UHID-7003", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    reportVersion: "v3", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Clinical correlation resolved critical concern — attending physician reviewed and confirmed benign finding after biopsy correlation",
    flagTimestamp: "2025-02-02 10:05:00", removalTimestamp: "2025-02-02 15:45:00",
    changeTimestamp: "2025-02-02 15:45:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10006", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.50004",
    patientId: "UHID-7004", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-03 09:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-03 09:30:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10007", eventType: "Remarks Added",
    accessionNumber: "ACC-50004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.50004",
    patientId: "UHID-7004", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Bilateral pleural effusion with mediastinal widening — urgent clinical correlation required; possible aortic dissection",
    flagTimestamp: "2025-02-03 09:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-03 09:40:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 04 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10008", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50005", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50005",
    patientId: "UHID-7005", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-04 11:00:00", removalTimestamp: null,
    changeTimestamp: "2025-02-04 11:00:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "CRIT-A-10009", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.50006",
    patientId: "UHID-7006", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-04 14:20:00", removalTimestamp: null,
    changeTimestamp: "2025-02-04 14:20:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10010", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.50006",
    patientId: "UHID-7006", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Erroneous flagging — patient misidentification corrected; accession reassigned to correct study",
    flagTimestamp: "2025-02-04 14:20:00", removalTimestamp: "2025-02-04 16:00:00",
    changeTimestamp: "2025-02-04 16:00:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10011", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50007",
    patientId: "UHID-7007", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    reportVersion: "v3", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-05 08:45:00", removalTimestamp: null,
    changeTimestamp: "2025-02-05 08:45:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "CRIT-A-10012", eventType: "Remarks Added",
    accessionNumber: "ACC-50007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50007",
    patientId: "UHID-7007", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    reportVersion: "v3", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Critical finding communicated to Dr. Singh (Cardiologist) at 08:52 — verbal acknowledgement received and documented",
    flagTimestamp: "2025-02-05 08:45:00", removalTimestamp: null,
    changeTimestamp: "2025-02-05 08:55:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── Feb 06 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10013", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50008", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50008",
    patientId: "UHID-7008", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-06 10:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-06 10:30:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10014", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50009",
    patientId: "UHID-7009", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-06 13:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-06 13:15:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  // ── Feb 07 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10015", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50009",
    patientId: "UHID-7009", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Referring clinician confirmed management already initiated — flag removed after clinical team acknowledgement per protocol",
    flagTimestamp: "2025-02-06 13:15:00", removalTimestamp: "2025-02-07 09:00:00",
    changeTimestamp: "2025-02-07 09:00:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "CRIT-A-10016", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50010", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50010",
    patientId: "UHID-7010", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    reportVersion: "v3", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-07 11:45:00", removalTimestamp: null,
    changeTimestamp: "2025-02-07 11:45:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 08 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10017", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50011",
    patientId: "UHID-7011", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-08 09:20:00", removalTimestamp: null,
    changeTimestamp: "2025-02-08 09:20:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "CRIT-A-10018", eventType: "Remarks Added",
    accessionNumber: "ACC-50011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50011",
    patientId: "UHID-7011", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Intracranial haemorrhage in left basal ganglia — neurosurgical consult urgently requested; STAT CT angiography recommended",
    flagTimestamp: "2025-02-08 09:20:00", removalTimestamp: null,
    changeTimestamp: "2025-02-08 09:30:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── Feb 09 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10019", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50012",
    patientId: "UHID-7012", radiologistId: "RAD-003", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-09 10:00:00", removalTimestamp: null,
    changeTimestamp: "2025-02-09 10:00:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10020", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50012",
    patientId: "UHID-7012", radiologistId: "RAD-003", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "MDT review confirmed non-critical threshold — significant but stable finding; reclassified from critical after multi-disciplinary review",
    flagTimestamp: "2025-02-09 10:00:00", removalTimestamp: "2025-02-09 14:30:00",
    changeTimestamp: "2025-02-09 14:30:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 10 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10021", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.20.50013",
    patientId: "UHID-7013", radiologistId: "RAD-004", radiologistRole: "Senior Radiologist",
    reportVersion: "v3", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-10 11:00:00", removalTimestamp: null,
    changeTimestamp: "2025-02-10 11:00:00", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  // ── Feb 11 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10022", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50014",
    patientId: "UHID-7014", radiologistId: "RAD-005", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-11 09:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-11 09:15:00", ipAddress: "192.168.20.105",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10023", eventType: "Remarks Added",
    accessionNumber: "ACC-50014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50014",
    patientId: "UHID-7014", radiologistId: "RAD-005", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Tension pneumothorax pattern identified — immediate decompression protocol activated; critical alert forwarded to ICU team",
    flagTimestamp: "2025-02-11 09:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-11 09:25:00", ipAddress: "192.168.20.105",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 12 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10024", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50015", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50015",
    patientId: "UHID-7015", radiologistId: "RAD-001", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-12 10:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-12 10:30:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "CRIT-A-10025", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50015", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50015",
    patientId: "UHID-7015", radiologistId: "RAD-001", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Duplicate flag detected — accession linked to referring order already flagged; duplicate removed per critical flag management SOP",
    flagTimestamp: "2025-02-12 10:30:00", removalTimestamp: "2025-02-12 14:00:00",
    changeTimestamp: "2025-02-12 14:00:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── Feb 13 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10026", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50016", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50016",
    patientId: "UHID-7016", radiologistId: "RAD-002", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-13 09:00:00", removalTimestamp: null,
    changeTimestamp: "2025-02-13 09:00:00", ipAddress: "192.168.20.102",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10027", eventType: "Remarks Added",
    accessionNumber: "ACC-50016", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50016",
    patientId: "UHID-7016", radiologistId: "RAD-002", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Critical communication: referred to Dr. Mehta (Pulmonology) via secure message at 09:08 — read receipt confirmed; verbal follow-up at 09:15",
    flagTimestamp: "2025-02-13 09:00:00", removalTimestamp: null,
    changeTimestamp: "2025-02-13 09:10:00", ipAddress: "192.168.20.102",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 14 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10028", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50017", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50017",
    patientId: "UHID-7017", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    reportVersion: "v3", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-14 11:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-14 11:30:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "CRIT-A-10029", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.50018",
    patientId: "UHID-7018", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-14 13:45:00", removalTimestamp: null,
    changeTimestamp: "2025-02-14 13:45:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 15 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10030", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.50018",
    patientId: "UHID-7018", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    reportVersion: "v1", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Post-procedure follow-up confirmed — no acute intervention required; treating consultant updated clinical context",
    flagTimestamp: "2025-02-14 13:45:00", removalTimestamp: "2025-02-15 09:20:00",
    changeTimestamp: "2025-02-15 09:20:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 17 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10031", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50019", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50019",
    patientId: "UHID-7019", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-17 10:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-17 10:15:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "CRIT-A-10032", eventType: "Remarks Added",
    accessionNumber: "ACC-50019", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50019",
    patientId: "UHID-7019", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Ruptured ectopic pregnancy suspected — urgent gynaecology consult initiated; haemoperitoneum confirmed on pelvic ultrasound",
    flagTimestamp: "2025-02-17 10:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-17 10:25:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  // ── Feb 19 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10033", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50020",
    patientId: "UHID-7020", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    reportVersion: "v3", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-19 09:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-19 09:30:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10034", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50021",
    patientId: "UHID-7021", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-19 11:00:00", removalTimestamp: null,
    changeTimestamp: "2025-02-19 11:00:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── Feb 20 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10035", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50021",
    patientId: "UHID-7021", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Revised interpretation by senior radiologist — critical classification downgraded to significant finding after departmental peer review",
    flagTimestamp: "2025-02-19 11:00:00", removalTimestamp: "2025-02-20 08:45:00",
    changeTimestamp: "2025-02-20 08:45:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "CRIT-A-10036", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50022", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50022",
    patientId: "UHID-7022", radiologistId: "RAD-003", radiologistRole: "Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-20 10:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-20 10:30:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 21 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10037", eventType: "Remarks Added",
    accessionNumber: "ACC-50022", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50022",
    patientId: "UHID-7022", radiologistId: "RAD-003", radiologistRole: "Radiologist",
    reportVersion: "v1", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Malignant cord compression at T8 — neurosurgery and oncology alerted; STAT MRI spine ordered; patient transferred to high-dependency unit",
    flagTimestamp: "2025-02-20 10:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-21 09:15:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 22 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10038", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50023", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50023",
    patientId: "UHID-7023", radiologistId: "RAD-004", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-22 10:00:00", removalTimestamp: null,
    changeTimestamp: "2025-02-22 10:00:00", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "CRIT-A-10039", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50024", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50024",
    patientId: "UHID-7024", radiologistId: "RAD-005", radiologistRole: "Radiologist",
    reportVersion: "v3", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-22 13:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-22 13:30:00", ipAddress: "192.168.20.105",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 23 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10040", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50024", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50024",
    patientId: "UHID-7024", radiologistId: "RAD-005", radiologistRole: "Radiologist",
    reportVersion: "v3", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Flag placed in error — findings do not meet NABH critical reporting criteria; corrected after multidisciplinary peer review",
    flagTimestamp: "2025-02-22 13:30:00", removalTimestamp: "2025-02-23 09:00:00",
    changeTimestamp: "2025-02-23 09:00:00", ipAddress: "192.168.20.105",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 24 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10041", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50025", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50025",
    patientId: "UHID-7025", radiologistId: "RAD-001", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-24 10:45:00", removalTimestamp: null,
    changeTimestamp: "2025-02-24 10:45:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── Feb 25 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10042", eventType: "Remarks Added",
    accessionNumber: "ACC-50025", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50025",
    patientId: "UHID-7025", radiologistId: "RAD-001", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Critical alert acknowledged by Dr. Patel (Emergency Medicine) at 09:02 — patient transferred to HDU; follow-up imaging scheduled",
    flagTimestamp: "2025-02-24 10:45:00", removalTimestamp: null,
    changeTimestamp: "2025-02-25 09:00:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "CRIT-A-10043", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50026", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50026",
    patientId: "UHID-7001", radiologistId: "RAD-002", radiologistRole: "Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-25 11:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-25 11:15:00", ipAddress: "192.168.20.102",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 26 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10044", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50027", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50027",
    patientId: "UHID-7002", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-26 09:30:00", removalTimestamp: null,
    changeTimestamp: "2025-02-26 09:30:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "CRIT-A-10045", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50027", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50027",
    patientId: "UHID-7002", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Referring team acknowledged and closed — formal clinical management documented; flag closure per institutional critical result reporting protocol",
    flagTimestamp: "2025-02-26 09:30:00", removalTimestamp: "2025-02-26 14:00:00",
    changeTimestamp: "2025-02-26 14:00:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── Feb 27 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10046", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50028", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50028",
    patientId: "UHID-7003", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    reportVersion: "v3", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-27 10:00:00", removalTimestamp: null,
    changeTimestamp: "2025-02-27 10:00:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── Feb 28 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10047", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50029", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50029",
    patientId: "UHID-7004", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-02-28 09:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-28 09:15:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "CRIT-A-10048", eventType: "Remarks Added",
    accessionNumber: "ACC-50029", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.50029",
    patientId: "UHID-7004", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    reportVersion: "v2", criticalStatusBefore: "Yes", criticalStatusAfter: "Yes",
    changeReason: "Carotid artery stenosis >70% bilateral — vascular surgery consult requested; duplex ultrasound correlation recommended; neurology alerted",
    flagTimestamp: "2025-02-28 09:15:00", removalTimestamp: null,
    changeTimestamp: "2025-02-28 09:25:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  // ── Mar 01 ──────────────────────────────────────────
  {
    auditId: "CRIT-A-10049", eventType: "Critical Flag Added",
    accessionNumber: "ACC-50030", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50030",
    patientId: "UHID-7005", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    reportVersion: "v1", criticalStatusBefore: "No", criticalStatusAfter: "Yes",
    changeReason: null, flagTimestamp: "2025-03-01 10:30:00", removalTimestamp: null,
    changeTimestamp: "2025-03-01 10:30:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "CRIT-A-10050", eventType: "Critical Flag Removed",
    accessionNumber: "ACC-50030", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.50030",
    patientId: "UHID-7005", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    reportVersion: "v1", criticalStatusBefore: "Yes", criticalStatusAfter: "No",
    changeReason: "Patient already on active treatment protocol for known malignancy — new finding not escalation-level critical after clinical review and oncology consultation",
    flagTimestamp: "2025-03-01 10:30:00", removalTimestamp: "2025-03-01 15:45:00",
    changeTimestamp: "2025-03-01 15:45:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
];

// ─── Quick date ranges ────────────────────────────────────────────────────────

const quickRanges = [
  { label: "Today", range: { from: startOfDay(new Date()), to: endOfDay(new Date()) } },
  { label: "Last 7 days", range: { from: subDays(new Date(), 6), to: new Date() } },
  { label: "Last 30 days", range: { from: subDays(new Date(), 29), to: new Date() } },
  { label: "This month", range: { from: startOfMonth(new Date()), to: new Date() } },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function getEventTypeBadge(eventType: CriticalFlagEventType) {
  if (eventType === "Critical Flag Added") {
    return (
      <Badge className="whitespace-nowrap bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/10">
        <Flag className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
        Flag Added
      </Badge>
    );
  }
  if (eventType === "Remarks Added") {
    return (
      <Badge variant="secondary" className="whitespace-nowrap">
        <MessageSquarePlus className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
        Remarks Added
      </Badge>
    );
  }
  // Critical Flag Removed
  return (
    <Badge variant="outline" className="whitespace-nowrap text-muted-foreground">
      <FlagOff className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
      Flag Removed
    </Badge>
  );
}

function getCriticalStatusBadge(status: CriticalStatus) {
  if (status === "Yes") {
    return (
      <Badge className="whitespace-nowrap bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/10">
        Yes
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="whitespace-nowrap text-muted-foreground">
      No
    </Badge>
  );
}

function getStatusCell(status: EventOutcome) {
  if (status === "Success") {
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircle className="size-4 text-primary" strokeWidth={ICON_STROKE_WIDTH} />
        <span className="text-sm text-primary">Success</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <XCircle className="size-4 text-destructive" strokeWidth={ICON_STROKE_WIDTH} />
      <span className="text-sm text-destructive">Failed</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CriticalResultFlaggingLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [criticalStatusAfterFilter, setCriticalStatusAfterFilter] = React.useState("all");
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
  const [selectedLog, setSelectedLog] = React.useState<CriticalFlagLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.accessionNumber, log.patientId, log.radiologistId, log.changeReason ?? ""].some((v) => v.toLowerCase().includes(q))) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (criticalStatusAfterFilter !== "all" && log.criticalStatusAfter !== criticalStatusAfterFilter) return false;
      if (deviceFilter !== "all" && log.deviceType !== deviceFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.changeTimestamp);
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, eventTypeFilter, criticalStatusAfterFilter, deviceFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, eventTypeFilter, criticalStatusAfterFilter, deviceFilter, isDateRangeActive, dateRange]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    flagsAdded: mockLogs.filter((l) => l.eventType === "Critical Flag Added").length,
    flagsRemoved: mockLogs.filter((l) => l.eventType === "Critical Flag Removed").length,
    remarksAdded: mockLogs.filter((l) => l.eventType === "Remarks Added").length,
  }), []);

  const hasActiveFilters = eventTypeFilter !== "all" || criticalStatusAfterFilter !== "all" || deviceFilter !== "all";

  function clearAllFilters() {
    setEventTypeFilter("all");
    setCriticalStatusAfterFilter("all");
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
        title="Critical Result Flagging Audit Logs"
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
              description="All critical flagging events"
              icon={AlertTriangle}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Flags Added"
              value={stats.flagsAdded}
              description="Critical flags raised"
              icon={Flag}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Flags Removed"
              value={stats.flagsRemoved}
              description="Removals with override reason"
              icon={FlagOff}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Remarks Added"
              value={stats.remarksAdded}
              description="Clinical communication notes"
              icon={MessageSquarePlus}
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
                        placeholder="Search by audit ID, accession no., UHID, radiologist"
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
                    <SelectTrigger className="h-8 w-48 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Critical Flag Added">Flag Added</SelectItem>
                      <SelectItem value="Remarks Added">Remarks Added</SelectItem>
                      <SelectItem value="Critical Flag Removed">Flag Removed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={criticalStatusAfterFilter} onValueChange={setCriticalStatusAfterFilter}>
                    <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Critical Status (After)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Yes">Critical — Yes</SelectItem>
                      <SelectItem value="No">Critical — No</SelectItem>
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
                      variant="ghost"
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
                    <TableHead className="whitespace-nowrap">Radiologist UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead className="whitespace-nowrap">Report Ver.</TableHead>
                    <TableHead className="whitespace-nowrap">Critical Before</TableHead>
                    <TableHead className="whitespace-nowrap">Critical After</TableHead>
                    <TableHead className="whitespace-nowrap">Override / Remark</TableHead>
                    <TableHead className="whitespace-nowrap">Flag Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">Removal Timestamp</TableHead>
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
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.radiologistId}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.radiologistRole}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.reportVersion}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getCriticalStatusBadge(log.criticalStatusBefore)}</TableCell>
                        <TableCell className="whitespace-nowrap">{getCriticalStatusBadge(log.criticalStatusAfter)}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate" title={log.changeReason ?? ""}>
                          {log.changeReason ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.flagTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.removalTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.changeTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.ipAddress}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.deviceType}</TableCell>
                        <TableCell className="whitespace-nowrap">{getStatusCell(log.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={17}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <Flag className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">No critical flagging audit logs found matching your criteria</p>
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
              Critical Flag Audit Record Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">{selectedLog.auditId}</span>
              )}
            </DialogTitle>
            <DialogDescription>Complete critical result flagging audit record — read-only, immutable</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="max-h-[60vh] overflow-y-auto">
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow label="Event Type" value={getEventTypeBadge(selectedLog.eventType)} />
              <DetailRow label="Accession Number" value={selectedLog.accessionNumber} mono />
              <DetailRow label="Study Instance UID" value={selectedLog.studyInstanceUid} mono />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Radiologist UHID" value={selectedLog.radiologistId} mono />
              <DetailRow label="Radiologist Role" value={selectedLog.radiologistRole} />
              <DetailRow label="Report Version" value={<Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.reportVersion}</Badge>} />
              <DetailRow label="Critical Status Before" value={getCriticalStatusBadge(selectedLog.criticalStatusBefore)} />
              <DetailRow label="Critical Status After" value={getCriticalStatusBadge(selectedLog.criticalStatusAfter)} />
              <DetailRow label="Override / Remark" value={selectedLog.changeReason} />
              <DetailRow label="Flag Timestamp" value={formatTimestamp(selectedLog.flagTimestamp)} mono />
              <DetailRow label="Removal Timestamp" value={formatTimestamp(selectedLog.removalTimestamp)} mono />
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
            <SheetDescription>Generate and download compliance reports from immutable critical result flagging audit log data.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default CriticalResultFlaggingLogs;
