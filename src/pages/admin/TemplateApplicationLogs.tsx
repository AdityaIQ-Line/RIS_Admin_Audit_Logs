/**
 * TEMPLATE APPLICATION & CHANGES AUDIT LOG — Story 13
 *
 * Captures all template selection, application, and change events in radiology reports.
 *
 * SCOPE:
 * ✔ Template Applied (initial application to report)
 * ✔ Template Changed (switched to different template)
 * ✔ Template Removed (template detached from report)
 * ✔ Template Version Updated in Report (same template, newer version)
 *
 * COMPLIANCE:
 * - Reporting standardization governance
 * - Medico-legal documentation traceability
 * - ISO 27001 change logging
 * - Clinical quality assurance compliance
 *
 * RETENTION: ≥ 7–10 years
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/template-application — list with pagination
 * - Query params: auditId, accessionNumber, patientId, userId,
 *                 eventType, templateName, deviceType, dateFrom, dateTo
 * - GET /api/admin/audit-logs/template-application/export — CSV / PDF
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  LayoutTemplate,
  Layers,
  ArrowLeftRight,
  Trash2,
  Eye,
  Calendar,
  ArrowRight,
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
import { Separator } from "../../app/components/ui/separator";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../app/components/ui/tooltip";
import { PageShell } from "../../app/components/layouts/page-shell";
import { PageHeader } from "../../app/components/blocks/page-header";
import { BackButton } from "../../app/components/blocks/back-button";
import { StatCard } from "../../app/components/cards/stat-card";
import { Pagination } from "../../app/components/ui/pagination";
import { DateRangePicker } from "../../app/components/ui/date-range-picker";
import { ReportsTab } from "./ReportsTab";

// ─── Types ────────────────────────────────────────────────────────────────────

type TemplateEventType =
  | "Template Applied"
  | "Template Changed"
  | "Template Removed"
  | "Template Version Updated";

type DeviceType = "Web" | "Workstation";
type EventOutcome = "Success" | "Failed";

interface TemplateLog {
  auditId: string;
  eventType: TemplateEventType;
  accessionNumber: string;
  studyInstanceUid: string;
  patientId: string;
  userId: string;
  userRole: string;
  templateName: string;
  templateVersion: string;
  templateType: string;
  templateApplication: string;
  templateBefore: string | null;
  templateAfter: string | null;
  versionBefore: string | null;
  versionAfter: string | null;
  reportVersion: string;
  changeTimestamp: string;
  ipAddress: string;
  deviceType: DeviceType;
  status: EventOutcome;
  facilityId: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockLogs: TemplateLog[] = [
  // ── ACC-61001 · CT Chest · Applied → Version Updated ─────────────────────
  {
    auditId: "TMPL-A-10001", eventType: "Template Applied",
    accessionNumber: "ACC-61001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61001",
    patientId: "UHID-6001", userId: "RAD-001", userRole: "Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.0",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CT Chest Standard",
    versionBefore: null, versionAfter: "v1.0",
    reportVersion: "v1", changeTimestamp: "2025-02-01 09:00:00",
    ipAddress: "192.168.20.101", deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10002", eventType: "Template Version Updated",
    accessionNumber: "ACC-61001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61001",
    patientId: "UHID-6001", userId: "RAD-001", userRole: "Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.1",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: "CT Chest Standard", templateAfter: "CT Chest Standard",
    versionBefore: "v1.0", versionAfter: "v1.1",
    reportVersion: "v2", changeTimestamp: "2025-02-01 10:30:00",
    ipAddress: "192.168.20.101", deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61002 · MRI Brain → MRI Lumbar ───────────────────────────────────
  {
    auditId: "TMPL-A-10003", eventType: "Template Applied",
    accessionNumber: "ACC-61002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61002",
    patientId: "UHID-6002", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "MRI Brain Comprehensive", templateVersion: "v2.0",
    templateType: "MRI / Brain", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "MRI Brain Comprehensive",
    versionBefore: null, versionAfter: "v2.0",
    reportVersion: "v1", changeTimestamp: "2025-02-01 11:00:00",
    ipAddress: "192.168.20.102", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10004", eventType: "Template Changed",
    accessionNumber: "ACC-61002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61002",
    patientId: "UHID-6002", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "MRI Lumbar Spine", templateVersion: "v1.5",
    templateType: "MRI / Lumbar Spine", templateApplication: "Full Report",
    templateBefore: "MRI Brain Comprehensive", templateAfter: "MRI Lumbar Spine",
    versionBefore: "v2.0", versionAfter: "v1.5",
    reportVersion: "v2", changeTimestamp: "2025-02-02 09:15:00",
    ipAddress: "192.168.20.102", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61003 · CXR PA Routine → CT Chest Standard ───────────────────────
  {
    auditId: "TMPL-A-10005", eventType: "Template Applied",
    accessionNumber: "ACC-61003", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.61003",
    patientId: "UHID-6003", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "CXR PA Routine", templateVersion: "v1.3",
    templateType: "CR / Chest", templateApplication: "Findings Section",
    templateBefore: null, templateAfter: "CXR PA Routine",
    versionBefore: null, versionAfter: "v1.3",
    reportVersion: "v1", changeTimestamp: "2025-02-02 10:00:00",
    ipAddress: "192.168.20.103", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "TMPL-A-10006", eventType: "Template Changed",
    accessionNumber: "ACC-61003", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.61003",
    patientId: "UHID-6003", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.1",
    templateType: "CT / Chest", templateApplication: "Findings Section",
    templateBefore: "CXR PA Routine", templateAfter: "CT Chest Standard",
    versionBefore: "v1.3", versionAfter: "v1.1",
    reportVersion: "v2", changeTimestamp: "2025-02-02 11:30:00",
    ipAddress: "192.168.20.103", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── ACC-61004 · MRI Lumbar Spine → MRI Shoulder ──────────────────────────
  {
    auditId: "TMPL-A-10007", eventType: "Template Applied",
    accessionNumber: "ACC-61004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61004",
    patientId: "UHID-6004", userId: "RAD-004", userRole: "Radiologist",
    templateName: "MRI Lumbar Spine", templateVersion: "v1.5",
    templateType: "MRI / Lumbar Spine", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "MRI Lumbar Spine",
    versionBefore: null, versionAfter: "v1.5",
    reportVersion: "v1", changeTimestamp: "2025-02-02 13:00:00",
    ipAddress: "192.168.20.104", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10008", eventType: "Template Changed",
    accessionNumber: "ACC-61004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61004",
    patientId: "UHID-6004", userId: "RAD-004", userRole: "Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.0",
    templateType: "MRI / Shoulder", templateApplication: "Full Report",
    templateBefore: "MRI Lumbar Spine", templateAfter: "MRI Shoulder Rotator Cuff",
    versionBefore: "v1.5", versionAfter: "v1.0",
    reportVersion: "v2", changeTimestamp: "2025-02-03 09:00:00",
    ipAddress: "192.168.20.104", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61005 · CT Abdomen → Removed ─────────────────────────────────────
  {
    auditId: "TMPL-A-10009", eventType: "Template Applied",
    accessionNumber: "ACC-61005", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61005",
    patientId: "UHID-6005", userId: "RAD-005", userRole: "Senior Radiologist",
    templateName: "CT Abdomen Contrast", templateVersion: "v1.2",
    templateType: "CT / Abdomen", templateApplication: "Impression Section",
    templateBefore: null, templateAfter: "CT Abdomen Contrast",
    versionBefore: null, versionAfter: "v1.2",
    reportVersion: "v1", changeTimestamp: "2025-02-03 10:00:00",
    ipAddress: "192.168.20.105", deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "TMPL-A-10010", eventType: "Template Removed",
    accessionNumber: "ACC-61005", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61005",
    patientId: "UHID-6005", userId: "RAD-005", userRole: "Senior Radiologist",
    templateName: "CT Abdomen Contrast", templateVersion: "v1.2",
    templateType: "CT / Abdomen", templateApplication: "Impression Section",
    templateBefore: "CT Abdomen Contrast", templateAfter: null,
    versionBefore: "v1.2", versionAfter: null,
    reportVersion: "v2", changeTimestamp: "2025-02-03 11:30:00",
    ipAddress: "192.168.20.105", deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  // ── ACC-61006 · CT Head → CT Chest → Version Updated ─────────────────────
  {
    auditId: "TMPL-A-10011", eventType: "Template Applied",
    accessionNumber: "ACC-61006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61006",
    patientId: "UHID-6006", userId: "RAD-001", userRole: "Radiologist",
    templateName: "CT Head Non-Contrast", templateVersion: "v2.0",
    templateType: "CT / Head", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CT Head Non-Contrast",
    versionBefore: null, versionAfter: "v2.0",
    reportVersion: "v1", changeTimestamp: "2025-02-03 13:00:00",
    ipAddress: "192.168.20.101", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10012", eventType: "Template Changed",
    accessionNumber: "ACC-61006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61006",
    patientId: "UHID-6006", userId: "RAD-001", userRole: "Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.0",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: "CT Head Non-Contrast", templateAfter: "CT Chest Standard",
    versionBefore: "v2.0", versionAfter: "v1.0",
    reportVersion: "v2", changeTimestamp: "2025-02-04 09:00:00",
    ipAddress: "192.168.20.101", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10013", eventType: "Template Version Updated",
    accessionNumber: "ACC-61006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61006",
    patientId: "UHID-6006", userId: "RAD-001", userRole: "Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.1",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: "CT Chest Standard", templateAfter: "CT Chest Standard",
    versionBefore: "v1.0", versionAfter: "v1.1",
    reportVersion: "v3", changeTimestamp: "2025-02-04 10:15:00",
    ipAddress: "192.168.20.101", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61007 · MRI Shoulder → MRI Brain ─────────────────────────────────
  {
    auditId: "TMPL-A-10014", eventType: "Template Applied",
    accessionNumber: "ACC-61007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61007",
    patientId: "UHID-6007", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.0",
    templateType: "MRI / Shoulder", templateApplication: "Structured Fields",
    templateBefore: null, templateAfter: "MRI Shoulder Rotator Cuff",
    versionBefore: null, versionAfter: "v1.0",
    reportVersion: "v1", changeTimestamp: "2025-02-04 11:00:00",
    ipAddress: "192.168.20.102", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "TMPL-A-10015", eventType: "Template Changed",
    accessionNumber: "ACC-61007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61007",
    patientId: "UHID-6007", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "MRI Brain Comprehensive", templateVersion: "v2.0",
    templateType: "MRI / Brain", templateApplication: "Structured Fields",
    templateBefore: "MRI Shoulder Rotator Cuff", templateAfter: "MRI Brain Comprehensive",
    versionBefore: "v1.0", versionAfter: "v2.0",
    reportVersion: "v2", changeTimestamp: "2025-02-04 13:30:00",
    ipAddress: "192.168.20.102", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── ACC-61008 · CT Chest → CT Abdomen ────────────────────────────────────
  {
    auditId: "TMPL-A-10016", eventType: "Template Applied",
    accessionNumber: "ACC-61008", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61008",
    patientId: "UHID-6008", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.0",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CT Chest Standard",
    versionBefore: null, versionAfter: "v1.0",
    reportVersion: "v1", changeTimestamp: "2025-02-05 09:00:00",
    ipAddress: "192.168.20.103", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10017", eventType: "Template Changed",
    accessionNumber: "ACC-61008", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61008",
    patientId: "UHID-6008", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "CT Abdomen Contrast", templateVersion: "v1.2",
    templateType: "CT / Abdomen", templateApplication: "Full Report",
    templateBefore: "CT Chest Standard", templateAfter: "CT Abdomen Contrast",
    versionBefore: "v1.0", versionAfter: "v1.2",
    reportVersion: "v2", changeTimestamp: "2025-02-05 10:30:00",
    ipAddress: "192.168.20.103", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61009 · MRI Brain → MRI Lumbar ───────────────────────────────────
  {
    auditId: "TMPL-A-10018", eventType: "Template Applied",
    accessionNumber: "ACC-61009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61009",
    patientId: "UHID-6009", userId: "RAD-004", userRole: "Radiologist",
    templateName: "MRI Brain Comprehensive", templateVersion: "v2.0",
    templateType: "MRI / Brain", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "MRI Brain Comprehensive",
    versionBefore: null, versionAfter: "v2.0",
    reportVersion: "v1", changeTimestamp: "2025-02-05 11:00:00",
    ipAddress: "192.168.20.104", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "TMPL-A-10019", eventType: "Template Changed",
    accessionNumber: "ACC-61009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61009",
    patientId: "UHID-6009", userId: "RAD-004", userRole: "Radiologist",
    templateName: "MRI Lumbar Spine", templateVersion: "v1.5",
    templateType: "MRI / Lumbar Spine", templateApplication: "Full Report",
    templateBefore: "MRI Brain Comprehensive", templateAfter: "MRI Lumbar Spine",
    versionBefore: "v2.0", versionAfter: "v1.5",
    reportVersion: "v2", changeTimestamp: "2025-02-05 13:00:00",
    ipAddress: "192.168.20.104", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── ACC-61010 · CXR Version Updated ──────────────────────────────────────
  {
    auditId: "TMPL-A-10020", eventType: "Template Applied",
    accessionNumber: "ACC-61010", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.61010",
    patientId: "UHID-6010", userId: "RAD-005", userRole: "Senior Radiologist",
    templateName: "CXR PA Routine", templateVersion: "v1.3",
    templateType: "CR / Chest", templateApplication: "Findings Section",
    templateBefore: null, templateAfter: "CXR PA Routine",
    versionBefore: null, versionAfter: "v1.3",
    reportVersion: "v1", changeTimestamp: "2025-02-06 09:00:00",
    ipAddress: "192.168.20.105", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10021", eventType: "Template Version Updated",
    accessionNumber: "ACC-61010", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.61010",
    patientId: "UHID-6010", userId: "RAD-005", userRole: "Senior Radiologist",
    templateName: "CXR PA Routine", templateVersion: "v1.4",
    templateType: "CR / Chest", templateApplication: "Findings Section",
    templateBefore: "CXR PA Routine", templateAfter: "CXR PA Routine",
    versionBefore: "v1.3", versionAfter: "v1.4",
    reportVersion: "v2", changeTimestamp: "2025-02-06 10:00:00",
    ipAddress: "192.168.20.105", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61011 · CT Abdomen Version Updated ───────────────────────────────
  {
    auditId: "TMPL-A-10022", eventType: "Template Applied",
    accessionNumber: "ACC-61011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61011",
    patientId: "UHID-6011", userId: "RAD-001", userRole: "Radiologist",
    templateName: "CT Abdomen Contrast", templateVersion: "v1.2",
    templateType: "CT / Abdomen", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CT Abdomen Contrast",
    versionBefore: null, versionAfter: "v1.2",
    reportVersion: "v1", changeTimestamp: "2025-02-06 11:00:00",
    ipAddress: "192.168.20.101", deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "TMPL-A-10023", eventType: "Template Version Updated",
    accessionNumber: "ACC-61011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61011",
    patientId: "UHID-6011", userId: "RAD-001", userRole: "Radiologist",
    templateName: "CT Abdomen Contrast", templateVersion: "v1.3",
    templateType: "CT / Abdomen", templateApplication: "Full Report",
    templateBefore: "CT Abdomen Contrast", templateAfter: "CT Abdomen Contrast",
    versionBefore: "v1.2", versionAfter: "v1.3",
    reportVersion: "v2", changeTimestamp: "2025-02-06 13:30:00",
    ipAddress: "192.168.20.101", deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  // ── ACC-61012 · MRI Lumbar → MRI Shoulder → Removed ─────────────────────
  {
    auditId: "TMPL-A-10024", eventType: "Template Applied",
    accessionNumber: "ACC-61012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61012",
    patientId: "UHID-6012", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "MRI Lumbar Spine", templateVersion: "v1.5",
    templateType: "MRI / Lumbar Spine", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "MRI Lumbar Spine",
    versionBefore: null, versionAfter: "v1.5",
    reportVersion: "v1", changeTimestamp: "2025-02-07 09:00:00",
    ipAddress: "192.168.20.102", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10025", eventType: "Template Changed",
    accessionNumber: "ACC-61012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61012",
    patientId: "UHID-6012", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.1",
    templateType: "MRI / Shoulder", templateApplication: "Full Report",
    templateBefore: "MRI Lumbar Spine", templateAfter: "MRI Shoulder Rotator Cuff",
    versionBefore: "v1.5", versionAfter: "v1.1",
    reportVersion: "v2", changeTimestamp: "2025-02-07 10:00:00",
    ipAddress: "192.168.20.102", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10026", eventType: "Template Removed",
    accessionNumber: "ACC-61012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61012",
    patientId: "UHID-6012", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.1",
    templateType: "MRI / Shoulder", templateApplication: "Full Report",
    templateBefore: "MRI Shoulder Rotator Cuff", templateAfter: null,
    versionBefore: "v1.1", versionAfter: null,
    reportVersion: "v3", changeTimestamp: "2025-02-07 11:30:00",
    ipAddress: "192.168.20.102", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61013 · CT Head → MRI Brain ──────────────────────────────────────
  {
    auditId: "TMPL-A-10027", eventType: "Template Applied",
    accessionNumber: "ACC-61013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61013",
    patientId: "UHID-6013", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "CT Head Non-Contrast", templateVersion: "v2.0",
    templateType: "CT / Head", templateApplication: "Impression Section",
    templateBefore: null, templateAfter: "CT Head Non-Contrast",
    versionBefore: null, versionAfter: "v2.0",
    reportVersion: "v1", changeTimestamp: "2025-02-07 13:00:00",
    ipAddress: "192.168.20.103", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "TMPL-A-10028", eventType: "Template Changed",
    accessionNumber: "ACC-61013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61013",
    patientId: "UHID-6013", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "MRI Brain Comprehensive", templateVersion: "v2.1",
    templateType: "MRI / Brain", templateApplication: "Impression Section",
    templateBefore: "CT Head Non-Contrast", templateAfter: "MRI Brain Comprehensive",
    versionBefore: "v2.0", versionAfter: "v2.1",
    reportVersion: "v2", changeTimestamp: "2025-02-08 09:00:00",
    ipAddress: "192.168.20.103", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── ACC-61014 · MRI Shoulder Version Updated ─────────────────────────────
  {
    auditId: "TMPL-A-10029", eventType: "Template Applied",
    accessionNumber: "ACC-61014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61014",
    patientId: "UHID-6014", userId: "RAD-004", userRole: "Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.0",
    templateType: "MRI / Shoulder", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "MRI Shoulder Rotator Cuff",
    versionBefore: null, versionAfter: "v1.0",
    reportVersion: "v1", changeTimestamp: "2025-02-08 10:00:00",
    ipAddress: "192.168.20.104", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10030", eventType: "Template Version Updated",
    accessionNumber: "ACC-61014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61014",
    patientId: "UHID-6014", userId: "RAD-004", userRole: "Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.1",
    templateType: "MRI / Shoulder", templateApplication: "Full Report",
    templateBefore: "MRI Shoulder Rotator Cuff", templateAfter: "MRI Shoulder Rotator Cuff",
    versionBefore: "v1.0", versionAfter: "v1.1",
    reportVersion: "v2", changeTimestamp: "2025-02-08 11:30:00",
    ipAddress: "192.168.20.104", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61015 · CT Chest → Removed ───────────────────────────────────────
  {
    auditId: "TMPL-A-10031", eventType: "Template Applied",
    accessionNumber: "ACC-61015", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61015",
    patientId: "UHID-6015", userId: "RAD-005", userRole: "Senior Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.1",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CT Chest Standard",
    versionBefore: null, versionAfter: "v1.1",
    reportVersion: "v1", changeTimestamp: "2025-02-09 09:00:00",
    ipAddress: "192.168.20.105", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "TMPL-A-10032", eventType: "Template Removed",
    accessionNumber: "ACC-61015", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61015",
    patientId: "UHID-6015", userId: "RAD-005", userRole: "Senior Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.1",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: "CT Chest Standard", templateAfter: null,
    versionBefore: "v1.1", versionAfter: null,
    reportVersion: "v2", changeTimestamp: "2025-02-09 10:30:00",
    ipAddress: "192.168.20.105", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── ACC-61016 · MRI Brain → CT Head ──────────────────────────────────────
  {
    auditId: "TMPL-A-10033", eventType: "Template Applied",
    accessionNumber: "ACC-61016", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61016",
    patientId: "UHID-6016", userId: "RAD-001", userRole: "Radiologist",
    templateName: "MRI Brain Comprehensive", templateVersion: "v2.0",
    templateType: "MRI / Brain", templateApplication: "Structured Fields",
    templateBefore: null, templateAfter: "MRI Brain Comprehensive",
    versionBefore: null, versionAfter: "v2.0",
    reportVersion: "v1", changeTimestamp: "2025-02-09 11:00:00",
    ipAddress: "192.168.20.101", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10034", eventType: "Template Changed",
    accessionNumber: "ACC-61016", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61016",
    patientId: "UHID-6016", userId: "RAD-001", userRole: "Radiologist",
    templateName: "CT Head Non-Contrast", templateVersion: "v2.1",
    templateType: "CT / Head", templateApplication: "Structured Fields",
    templateBefore: "MRI Brain Comprehensive", templateAfter: "CT Head Non-Contrast",
    versionBefore: "v2.0", versionAfter: "v2.1",
    reportVersion: "v2", changeTimestamp: "2025-02-10 09:00:00",
    ipAddress: "192.168.20.101", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61017 · CXR → CT Chest Standard ──────────────────────────────────
  {
    auditId: "TMPL-A-10035", eventType: "Template Applied",
    accessionNumber: "ACC-61017", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.61017",
    patientId: "UHID-6017", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "CXR PA Routine", templateVersion: "v1.3",
    templateType: "CR / Chest", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CXR PA Routine",
    versionBefore: null, versionAfter: "v1.3",
    reportVersion: "v1", changeTimestamp: "2025-02-10 10:00:00",
    ipAddress: "192.168.20.102", deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "TMPL-A-10036", eventType: "Template Changed",
    accessionNumber: "ACC-61017", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.61017",
    patientId: "UHID-6017", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.2",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: "CXR PA Routine", templateAfter: "CT Chest Standard",
    versionBefore: "v1.3", versionAfter: "v1.2",
    reportVersion: "v2", changeTimestamp: "2025-02-10 11:30:00",
    ipAddress: "192.168.20.102", deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  // ── ACC-61018 · CT Abdomen Version Updated ───────────────────────────────
  {
    auditId: "TMPL-A-10037", eventType: "Template Applied",
    accessionNumber: "ACC-61018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61018",
    patientId: "UHID-6018", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "CT Abdomen Contrast", templateVersion: "v1.2",
    templateType: "CT / Abdomen", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CT Abdomen Contrast",
    versionBefore: null, versionAfter: "v1.2",
    reportVersion: "v1", changeTimestamp: "2025-02-11 09:00:00",
    ipAddress: "192.168.20.103", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10038", eventType: "Template Version Updated",
    accessionNumber: "ACC-61018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61018",
    patientId: "UHID-6018", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "CT Abdomen Contrast", templateVersion: "v1.3",
    templateType: "CT / Abdomen", templateApplication: "Full Report",
    templateBefore: "CT Abdomen Contrast", templateAfter: "CT Abdomen Contrast",
    versionBefore: "v1.2", versionAfter: "v1.3",
    reportVersion: "v2", changeTimestamp: "2025-02-11 10:30:00",
    ipAddress: "192.168.20.103", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61019 · CT Head Version Updated ──────────────────────────────────
  {
    auditId: "TMPL-A-10039", eventType: "Template Applied",
    accessionNumber: "ACC-61019", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61019",
    patientId: "UHID-6019", userId: "RAD-004", userRole: "Radiologist",
    templateName: "CT Head Non-Contrast", templateVersion: "v2.0",
    templateType: "CT / Head", templateApplication: "Findings Section",
    templateBefore: null, templateAfter: "CT Head Non-Contrast",
    versionBefore: null, versionAfter: "v2.0",
    reportVersion: "v1", changeTimestamp: "2025-02-11 11:00:00",
    ipAddress: "192.168.20.104", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "TMPL-A-10040", eventType: "Template Version Updated",
    accessionNumber: "ACC-61019", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61019",
    patientId: "UHID-6019", userId: "RAD-004", userRole: "Radiologist",
    templateName: "CT Head Non-Contrast", templateVersion: "v2.1",
    templateType: "CT / Head", templateApplication: "Findings Section",
    templateBefore: "CT Head Non-Contrast", templateAfter: "CT Head Non-Contrast",
    versionBefore: "v2.0", versionAfter: "v2.1",
    reportVersion: "v2", changeTimestamp: "2025-02-12 09:00:00",
    ipAddress: "192.168.20.104", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── ACC-61020 · MRI Lumbar → MRI Shoulder ────────────────────────────────
  {
    auditId: "TMPL-A-10041", eventType: "Template Applied",
    accessionNumber: "ACC-61020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61020",
    patientId: "UHID-6020", userId: "RAD-005", userRole: "Senior Radiologist",
    templateName: "MRI Lumbar Spine", templateVersion: "v1.5",
    templateType: "MRI / Lumbar Spine", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "MRI Lumbar Spine",
    versionBefore: null, versionAfter: "v1.5",
    reportVersion: "v1", changeTimestamp: "2025-02-12 10:00:00",
    ipAddress: "192.168.20.105", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10042", eventType: "Template Changed",
    accessionNumber: "ACC-61020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61020",
    patientId: "UHID-6020", userId: "RAD-005", userRole: "Senior Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.0",
    templateType: "MRI / Shoulder", templateApplication: "Full Report",
    templateBefore: "MRI Lumbar Spine", templateAfter: "MRI Shoulder Rotator Cuff",
    versionBefore: "v1.5", versionAfter: "v1.0",
    reportVersion: "v2", changeTimestamp: "2025-02-12 11:30:00",
    ipAddress: "192.168.20.105", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61021 · MRI Shoulder → Removed ───────────────────────────────────
  {
    auditId: "TMPL-A-10043", eventType: "Template Applied",
    accessionNumber: "ACC-61021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61021",
    patientId: "UHID-6001", userId: "RAD-001", userRole: "Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.0",
    templateType: "MRI / Shoulder", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "MRI Shoulder Rotator Cuff",
    versionBefore: null, versionAfter: "v1.0",
    reportVersion: "v1", changeTimestamp: "2025-02-13 09:00:00",
    ipAddress: "192.168.20.101", deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  {
    auditId: "TMPL-A-10044", eventType: "Template Removed",
    accessionNumber: "ACC-61021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61021",
    patientId: "UHID-6001", userId: "RAD-001", userRole: "Radiologist",
    templateName: "MRI Shoulder Rotator Cuff", templateVersion: "v1.0",
    templateType: "MRI / Shoulder", templateApplication: "Full Report",
    templateBefore: "MRI Shoulder Rotator Cuff", templateAfter: null,
    versionBefore: "v1.0", versionAfter: null,
    reportVersion: "v2", changeTimestamp: "2025-02-13 10:30:00",
    ipAddress: "192.168.20.101", deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
  },
  // ── ACC-61022 · CT Chest → US Abdomen ────────────────────────────────────
  {
    auditId: "TMPL-A-10045", eventType: "Template Applied",
    accessionNumber: "ACC-61022", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61022",
    patientId: "UHID-6002", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.0",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CT Chest Standard",
    versionBefore: null, versionAfter: "v1.0",
    reportVersion: "v1", changeTimestamp: "2025-02-13 11:00:00",
    ipAddress: "192.168.20.102", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10046", eventType: "Template Changed",
    accessionNumber: "ACC-61022", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.61022",
    patientId: "UHID-6002", userId: "RAD-002", userRole: "Senior Radiologist",
    templateName: "US Abdomen General", templateVersion: "v1.1",
    templateType: "US / Abdomen", templateApplication: "Full Report",
    templateBefore: "CT Chest Standard", templateAfter: "US Abdomen General",
    versionBefore: "v1.0", versionAfter: "v1.1",
    reportVersion: "v2", changeTimestamp: "2025-02-14 09:00:00",
    ipAddress: "192.168.20.102", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  // ── ACC-61023 · MRI Brain Version Updated ────────────────────────────────
  {
    auditId: "TMPL-A-10047", eventType: "Template Applied",
    accessionNumber: "ACC-61023", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61023",
    patientId: "UHID-6003", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "MRI Brain Comprehensive", templateVersion: "v2.0",
    templateType: "MRI / Brain", templateApplication: "Impression Section",
    templateBefore: null, templateAfter: "MRI Brain Comprehensive",
    versionBefore: null, versionAfter: "v2.0",
    reportVersion: "v1", changeTimestamp: "2025-02-14 10:00:00",
    ipAddress: "192.168.20.103", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  {
    auditId: "TMPL-A-10048", eventType: "Template Version Updated",
    accessionNumber: "ACC-61023", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.61023",
    patientId: "UHID-6003", userId: "RAD-003", userRole: "Senior Radiologist",
    templateName: "MRI Brain Comprehensive", templateVersion: "v2.1",
    templateType: "MRI / Brain", templateApplication: "Impression Section",
    templateBefore: "MRI Brain Comprehensive", templateAfter: "MRI Brain Comprehensive",
    versionBefore: "v2.0", versionAfter: "v2.1",
    reportVersion: "v2", changeTimestamp: "2025-02-14 11:30:00",
    ipAddress: "192.168.20.103", deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
  },
  // ── ACC-61024 · CXR → CT Chest Standard ──────────────────────────────────
  {
    auditId: "TMPL-A-10049", eventType: "Template Applied",
    accessionNumber: "ACC-61024", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.61024",
    patientId: "UHID-6004", userId: "RAD-004", userRole: "Radiologist",
    templateName: "CXR PA Routine", templateVersion: "v1.3",
    templateType: "CR / Chest", templateApplication: "Full Report",
    templateBefore: null, templateAfter: "CXR PA Routine",
    versionBefore: null, versionAfter: "v1.3",
    reportVersion: "v1", changeTimestamp: "2025-02-17 09:00:00",
    ipAddress: "192.168.20.104", deviceType: "Web", status: "Success", facilityId: "FAC-001",
  },
  {
    auditId: "TMPL-A-10050", eventType: "Template Changed",
    accessionNumber: "ACC-61024", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.61024",
    patientId: "UHID-6004", userId: "RAD-004", userRole: "Radiologist",
    templateName: "CT Chest Standard", templateVersion: "v1.1",
    templateType: "CT / Chest", templateApplication: "Full Report",
    templateBefore: "CXR PA Routine", templateAfter: "CT Chest Standard",
    versionBefore: "v1.3", versionAfter: "v1.1",
    reportVersion: "v2", changeTimestamp: "2025-02-17 10:30:00",
    ipAddress: "192.168.20.104", deviceType: "Web", status: "Success", facilityId: "FAC-001",
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

function getEventTypeBadge(eventType: TemplateEventType) {
  const map: Record<TemplateEventType, { label: string; className: string }> = {
    "Template Applied": {
      label: "Applied",
      className: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10",
    },
    "Template Changed": {
      label: "Changed",
      className: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary",
    },
    "Template Removed": {
      label: "Removed",
      className: "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/10",
    },
    "Template Version Updated": {
      label: "Ver. Updated",
      className: "bg-muted text-muted-foreground border border-border hover:bg-muted",
    },
  };
  const cfg = map[eventType];
  return <Badge className={`whitespace-nowrap ${cfg.className}`}>{cfg.label}</Badge>;
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

export function TemplateApplicationLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [templateNameFilter, setTemplateNameFilter] = React.useState("all");
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
  const [selectedLog, setSelectedLog] = React.useState<TemplateLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    applied: mockLogs.filter((l) => l.eventType === "Template Applied").length,
    changedOrUpdated: mockLogs.filter((l) =>
      l.eventType === "Template Changed" || l.eventType === "Template Version Updated"
    ).length,
    removed: mockLogs.filter((l) => l.eventType === "Template Removed").length,
  }), []);

  // ── Unique template names for filter ──────────────────────────────────────

  const uniqueTemplateNames = React.useMemo(() => {
    const names = new Set(mockLogs.map((l) => l.templateName));
    return Array.from(names).sort();
  }, []);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.accessionNumber, log.patientId, log.userId, log.templateName].some((v) => v.toLowerCase().includes(q))) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (templateNameFilter !== "all" && log.templateName !== templateNameFilter) return false;
      if (deviceFilter !== "all" && log.deviceType !== deviceFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.changeTimestamp);
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, eventTypeFilter, templateNameFilter, deviceFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, eventTypeFilter, templateNameFilter, deviceFilter, isDateRangeActive, dateRange]);

  const hasActiveFilters = eventTypeFilter !== "all" || templateNameFilter !== "all" || deviceFilter !== "all";

  function clearAllFilters() {
    setEventTypeFilter("all");
    setTemplateNameFilter("all");
    setDeviceFilter("all");
    setSearchFilter("");
    setCurrentPage(1);
  }

  function openDetail(log: TemplateLog) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  // ── Sub-components ─────────────────────────────────────────────────────────

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
        title="Template Application & Changes Audit Logs"
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
              title="Total Template Events"
              value={stats.total}
              description="All template audit events"
              icon={LayoutTemplate}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Templates Applied"
              value={stats.applied}
              description="Initial template applications"
              icon={Layers}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Changed / Version Updated"
              value={stats.changedOrUpdated}
              description="Template switches & version updates"
              icon={ArrowLeftRight}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Templates Removed"
              value={stats.removed}
              description="Template detached from report"
              icon={Trash2}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
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
                        placeholder="Search by audit ID, accession, UHID, user, template name"
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
                    <SelectTrigger className="h-8 w-52 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Template Applied">Applied</SelectItem>
                      <SelectItem value="Template Changed">Changed</SelectItem>
                      <SelectItem value="Template Removed">Removed</SelectItem>
                      <SelectItem value="Template Version Updated">Version Updated</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={templateNameFilter} onValueChange={setTemplateNameFilter}>
                    <SelectTrigger className="h-8 w-56 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Template Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Templates</SelectItem>
                      {uniqueTemplateNames.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
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
                    <TableHead className="whitespace-nowrap">User UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead className="whitespace-nowrap">Template Name</TableHead>
                    <TableHead className="whitespace-nowrap">Version</TableHead>
                    <TableHead className="whitespace-nowrap">Template Type</TableHead>
                    <TableHead className="whitespace-nowrap">Application</TableHead>
                    <TableHead className="whitespace-nowrap">Template Before</TableHead>
                    <TableHead className="whitespace-nowrap">Template After</TableHead>
                    <TableHead className="whitespace-nowrap">Ver. Before</TableHead>
                    <TableHead className="whitespace-nowrap">Ver. After</TableHead>
                    <TableHead className="whitespace-nowrap">Report Ver.</TableHead>
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
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.userId}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.userRole}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.templateName}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.templateVersion}</Badge>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.templateType}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          <Badge variant="secondary" className="text-xs whitespace-nowrap">{log.templateApplication}</Badge>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.templateBefore ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.templateAfter ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {log.versionBefore
                            ? <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.versionBefore}</Badge>
                            : <span className="text-muted-foreground text-sm">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {log.versionAfter
                            ? <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.versionAfter}</Badge>
                            : <span className="text-muted-foreground text-sm">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.reportVersion}</Badge>
                        </TableCell>
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
                          <LayoutTemplate className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">No template audit logs found matching your criteria</p>
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
          </Card>

        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Template Audit Record
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">{selectedLog.auditId}</span>
              )}
            </DialogTitle>
            <DialogDescription>Complete template audit record — read-only, immutable</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="max-h-[65vh] overflow-y-auto">
              {/* Core fields */}
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Audit ID</span>
                <span className="roboto-mono text-xs tabular-nums flex-1">{selectedLog.auditId}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Event Type</span>
                <span className="flex-1">{getEventTypeBadge(selectedLog.eventType)}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Accession Number</span>
                <span className="roboto-mono text-xs tabular-nums flex-1">{selectedLog.accessionNumber}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Study Instance UID</span>
                <span className="roboto-mono text-xs tabular-nums flex-1 break-all">{selectedLog.studyInstanceUid}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Patient UHID</span>
                <span className="roboto-mono text-xs tabular-nums flex-1">{selectedLog.patientId}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">User UHID</span>
                <span className="roboto-mono text-xs tabular-nums flex-1">{selectedLog.userId}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">User Role</span>
                <span className="text-sm flex-1">{selectedLog.userRole}</span>
              </div>

              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground mb-2">Template Details</p>

              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Template Name</span>
                <span className="text-sm flex-1">{selectedLog.templateName}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Template Version</span>
                <span className="flex-1">
                  <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.templateVersion}</Badge>
                </span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Template Type</span>
                <span className="text-sm flex-1">{selectedLog.templateType}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Application Scope</span>
                <span className="flex-1">
                  <Badge variant="secondary" className="text-xs">{selectedLog.templateApplication}</Badge>
                </span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Report Version</span>
                <span className="flex-1">
                  <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.reportVersion}</Badge>
                </span>
              </div>

              {/* Change tracking section — only shown for Changed / Removed / Version Updated */}
              {(selectedLog.templateBefore || selectedLog.templateAfter || selectedLog.versionBefore || selectedLog.versionAfter) && (
                <>
                  <Separator className="my-3" />
                  <p className="text-xs text-muted-foreground mb-2">Change Tracking</p>

                  {/* Template Before → After */}
                  <div className="flex items-start py-2.5 border-b border-border">
                    <span className="w-44 shrink-0 text-xs text-muted-foreground">Template Before</span>
                    <span className="text-sm flex-1">{selectedLog.templateBefore ?? <span className="text-muted-foreground">—</span>}</span>
                  </div>
                  <div className="flex items-start py-2.5 border-b border-border">
                    <span className="w-44 shrink-0 text-xs text-muted-foreground">Template After</span>
                    <span className="text-sm flex-1">{selectedLog.templateAfter ?? <span className="text-muted-foreground">—</span>}</span>
                  </div>

                  {/* Version Before → After visual */}
                  <div className="flex items-start py-2.5 border-b border-border">
                    <span className="w-44 shrink-0 text-xs text-muted-foreground">Version Change</span>
                    <span className="flex-1 flex items-center gap-2">
                      {selectedLog.versionBefore
                        ? <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.versionBefore}</Badge>
                        : <span className="text-muted-foreground text-xs">—</span>}
                      {(selectedLog.versionBefore || selectedLog.versionAfter) && (
                        <ArrowRight className="size-3.5 text-muted-foreground shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
                      )}
                      {selectedLog.versionAfter
                        ? <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.versionAfter}</Badge>
                        : <span className="text-muted-foreground text-xs">—</span>}
                    </span>
                  </div>
                </>
              )}

              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground mb-2">System Fields</p>

              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Change Timestamp</span>
                <span className="roboto-mono text-xs tabular-nums flex-1">{formatTimestamp(selectedLog.changeTimestamp)}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">IP Address</span>
                <span className="roboto-mono text-xs tabular-nums flex-1">{selectedLog.ipAddress}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Device Type</span>
                <span className="text-sm flex-1">{selectedLog.deviceType}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Status</span>
                <span className="flex-1">{getStatusCell(selectedLog.status)}</span>
              </div>
              <div className="flex items-start py-2.5 border-b border-border last:border-0">
                <span className="w-44 shrink-0 text-xs text-muted-foreground">Facility ID</span>
                <span className="roboto-mono text-xs tabular-nums flex-1">{selectedLog.facilityId}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Logs Sheet */}
      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Export Logs</SheetTitle>
            <SheetDescription>Generate and download compliance reports from immutable template application and change audit log data.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default TemplateApplicationLogs;
