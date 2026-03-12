/**
 * IMAGE ACCESS & VIEWING AUDIT LOG — Story 14
 *
 * Captures all radiology image access and viewing events in RIS/PACS.
 *
 * SCOPE:
 * ✔ Study Accessed
 * ✔ Series Opened
 * ✔ Image Viewed
 * ✔ Image Downloaded
 * ✔ Image Printed
 * ✔ External Viewer Access
 * ✔ Access Denied
 *
 * EXCLUDED: DICOM storage audit, Report viewing audit
 *
 * COMPLIANCE:
 * - NABH patient privacy controls
 * - HIPAA-like access traceability
 * - ISO 27001 access logging
 * - Medico-legal defensibility
 *
 * RETENTION: ≥ 7–10 years
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/image-access — list with pagination
 * - Query params: auditId, accessionNumber, patientId, userId,
 *                 eventType, accessType, accessSource, status, dateFrom, dateTo
 * - GET /api/admin/audit-logs/image-access/export — CSV / PDF
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Eye,
  Printer,
  ExternalLink,
  FolderOpen,
  Images,
  AlertTriangle,
  ShieldX,
  Calendar,
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfMonth } from "date-fns";
import { ICON_STROKE_WIDTH } from "../../lib/constants";
import { Button } from "../../app/components/ui/button";
import { Card, CardContent } from "../../app/components/ui/card";
import { Separator } from "../../app/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../app/components/ui/popover";
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
import {
  DateRangePicker,
} from "../../app/components/ui/date-range-picker";
import { ReportsTab } from "./ReportsTab";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageAccessEventType =
  | "Study Accessed"
  | "Series Opened"
  | "Image Viewed"
  | "Image Downloaded"
  | "Image Printed"
  | "External Viewer Access"
  | "Access Denied";

type AccessType = "View" | "Download" | "Print" | "N/A";
type AccessSource = "RIS" | "PACS" | "External Link";
type AccessStatus = "Success" | "Denied";
type Modality = "CT" | "MRI" | "CR" | "US" | "MG" | "NM";

interface ImageAccessLog {
  auditId: string;
  eventType: ImageAccessEventType;
  accessionNumber: string;
  studyInstanceUid: string;
  seriesInstanceUid: string | null;
  sopInstanceUid: string | null;
  patientId: string;
  modality: Modality;
  studyDate: string;
  userId: string;
  userRole: string;
  accessType: AccessType;
  accessSource: AccessSource;
  accessTimestamp: string;
  sessionId: string;
  ipAddress: string;
  deviceBrowserInfo: string;
  status: AccessStatus;
  denialReason: string | null;
  facilityId: string;
  emergencyOverride: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockLogs: ImageAccessLog[] = [
  // ── Study ACC-60001 · CT Chest · RAD-001 ─────────────────────────────────
  {
    auditId: "IMAV-A-10001", eventType: "Study Accessed",
    accessionNumber: "ACC-60001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8001", modality: "CT", studyDate: "2025-01-28",
    userId: "RAD-001", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-01 08:15:00", sessionId: "SESS-A-001",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 121.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10002", eventType: "Series Opened",
    accessionNumber: "ACC-60001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001.1", sopInstanceUid: null,
    patientId: "UHID-8001", modality: "CT", studyDate: "2025-01-28",
    userId: "RAD-001", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-01 08:17:00", sessionId: "SESS-A-001",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 121.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10003", eventType: "Image Viewed",
    accessionNumber: "ACC-60001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001.1.001",
    patientId: "UHID-8001", modality: "CT", studyDate: "2025-01-28",
    userId: "RAD-001", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-01 08:20:00", sessionId: "SESS-A-001",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 121.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Study ACC-60002 · MRI Brain · RAD-002 ────────────────────────────────
  {
    auditId: "IMAV-A-10004", eventType: "Study Accessed",
    accessionNumber: "ACC-60002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60002",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8002", modality: "MRI", studyDate: "2025-01-30",
    userId: "RAD-002", userRole: "Senior Radiologist", accessType: "View", accessSource: "PACS",
    accessTimestamp: "2025-02-01 10:00:00", sessionId: "SESS-A-002",
    ipAddress: "192.168.20.102", deviceBrowserInfo: "DICOM Workstation (OsiriX)",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10005", eventType: "Image Downloaded",
    accessionNumber: "ACC-60002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60002",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60002.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60002.1.003",
    patientId: "UHID-8002", modality: "MRI", studyDate: "2025-01-30",
    userId: "RAD-002", userRole: "Senior Radiologist", accessType: "Download", accessSource: "PACS",
    accessTimestamp: "2025-02-01 10:35:00", sessionId: "SESS-A-002",
    ipAddress: "192.168.20.102", deviceBrowserInfo: "DICOM Workstation (OsiriX)",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Access Denied: Role Restriction ──────────────────────────────────────
  {
    auditId: "IMAV-A-10006", eventType: "Access Denied",
    accessionNumber: "ACC-60003", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60003",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8003", modality: "CT", studyDate: "2025-01-31",
    userId: "TECH-001", userRole: "Technician", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-01 11:45:00", sessionId: "SESS-A-003",
    ipAddress: "192.168.20.110", deviceBrowserInfo: "Chrome 121.0 / Windows 10",
    status: "Denied",
    denialReason: "Role restriction — Technician role does not have image viewing privileges. Access requires Radiologist or higher.",
    facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Study ACC-60004 · CXR · RAD-003 ──────────────────────────────────────
  {
    auditId: "IMAV-A-10007", eventType: "Study Accessed",
    accessionNumber: "ACC-60004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60004",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8004", modality: "CR", studyDate: "2025-02-01",
    userId: "RAD-003", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-02 09:00:00", sessionId: "SESS-A-004",
    ipAddress: "192.168.20.103", deviceBrowserInfo: "Firefox 122.0 / macOS 14.3",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10008", eventType: "Image Printed",
    accessionNumber: "ACC-60004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60004",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60004.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60004.1.001",
    patientId: "UHID-8004", modality: "CR", studyDate: "2025-02-01",
    userId: "RAD-003", userRole: "Radiologist", accessType: "Print", accessSource: "RIS",
    accessTimestamp: "2025-02-02 09:30:00", sessionId: "SESS-A-004",
    ipAddress: "192.168.20.103", deviceBrowserInfo: "Firefox 122.0 / macOS 14.3",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── External Viewer Access ────────────────────────────────────────────────
  {
    auditId: "IMAV-A-10009", eventType: "External Viewer Access",
    accessionNumber: "ACC-60005", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.60005",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8005", modality: "US", studyDate: "2025-02-02",
    userId: "REF-001", userRole: "Referring Physician", accessType: "View", accessSource: "External Link",
    accessTimestamp: "2025-02-02 14:00:00", sessionId: "SESS-EXT-001",
    ipAddress: "203.45.67.89", deviceBrowserInfo: "Safari 17.2 / macOS 14.3",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Access Denied: Cross-Facility ─────────────────────────────────────────
  {
    auditId: "IMAV-A-10010", eventType: "Access Denied",
    accessionNumber: "ACC-60006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60006",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8006", modality: "MRI", studyDate: "2025-02-02",
    userId: "ADMIN-001", userRole: "Admin", accessType: "View", accessSource: "PACS",
    accessTimestamp: "2025-02-03 10:15:00", sessionId: "SESS-A-005",
    ipAddress: "192.168.30.201", deviceBrowserInfo: "Edge 121.0 / Windows 10",
    status: "Denied",
    denialReason: "Cross-facility access restriction — Admin role is scoped to FAC-001. Study belongs to FAC-002. Super Admin privileges required.",
    facilityId: "FAC-002", emergencyOverride: false,
  },
  // ── Study ACC-60007 · Mammography · RAD-004 ───────────────────────────────
  {
    auditId: "IMAV-A-10011", eventType: "Study Accessed",
    accessionNumber: "ACC-60007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60007",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8007", modality: "MG", studyDate: "2025-02-03",
    userId: "RAD-004", userRole: "Senior Radiologist", accessType: "View", accessSource: "PACS",
    accessTimestamp: "2025-02-03 11:00:00", sessionId: "SESS-A-006",
    ipAddress: "192.168.20.104", deviceBrowserInfo: "DICOM Workstation (Hologic)",
    status: "Success", denialReason: null, facilityId: "FAC-002", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10012", eventType: "Series Opened",
    accessionNumber: "ACC-60007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60007",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60007.1", sopInstanceUid: null,
    patientId: "UHID-8007", modality: "MG", studyDate: "2025-02-03",
    userId: "RAD-004", userRole: "Senior Radiologist", accessType: "View", accessSource: "PACS",
    accessTimestamp: "2025-02-03 11:05:00", sessionId: "SESS-A-006",
    ipAddress: "192.168.20.104", deviceBrowserInfo: "DICOM Workstation (Hologic)",
    status: "Success", denialReason: null, facilityId: "FAC-002", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10013", eventType: "Image Downloaded",
    accessionNumber: "ACC-60007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60007",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60007.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60007.1.002",
    patientId: "UHID-8007", modality: "MG", studyDate: "2025-02-03",
    userId: "RAD-004", userRole: "Senior Radiologist", accessType: "Download", accessSource: "PACS",
    accessTimestamp: "2025-02-03 11:40:00", sessionId: "SESS-A-006",
    ipAddress: "192.168.20.104", deviceBrowserInfo: "DICOM Workstation (Hologic)",
    status: "Success", denialReason: null, facilityId: "FAC-002", emergencyOverride: false,
  },
  // ── Access Denied: Expired Token ─────────────────────────────────────────
  {
    auditId: "IMAV-A-10014", eventType: "Access Denied",
    accessionNumber: "ACC-60008", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60008",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8008", modality: "CT", studyDate: "2025-02-03",
    userId: "REF-002", userRole: "Referring Physician", accessType: "View", accessSource: "External Link",
    accessTimestamp: "2025-02-04 09:00:00", sessionId: "SESS-EXT-002",
    ipAddress: "110.33.45.67", deviceBrowserInfo: "Chrome 121.0 / Android 14",
    status: "Denied",
    denialReason: "External link token expired — sharing link was valid for 48 hours and has since lapsed. A new secure link must be generated by the radiologist.",
    facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Study ACC-60009 · CT Thorax · RAD-005 ────────────────────────────────
  {
    auditId: "IMAV-A-10015", eventType: "Study Accessed",
    accessionNumber: "ACC-60009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60009",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8009", modality: "CT", studyDate: "2025-02-04",
    userId: "RAD-005", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-04 10:30:00", sessionId: "SESS-A-007",
    ipAddress: "192.168.20.105", deviceBrowserInfo: "Chrome 121.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10016", eventType: "Image Viewed",
    accessionNumber: "ACC-60009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60009",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60009.2", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60009.2.011",
    patientId: "UHID-8009", modality: "CT", studyDate: "2025-02-04",
    userId: "RAD-005", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-04 10:45:00", sessionId: "SESS-A-007",
    ipAddress: "192.168.20.105", deviceBrowserInfo: "Chrome 121.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10017", eventType: "Image Printed",
    accessionNumber: "ACC-60009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60009",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60009.2", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60009.2.011",
    patientId: "UHID-8009", modality: "CT", studyDate: "2025-02-04",
    userId: "RAD-005", userRole: "Radiologist", accessType: "Print", accessSource: "RIS",
    accessTimestamp: "2025-02-04 11:00:00", sessionId: "SESS-A-007",
    ipAddress: "192.168.20.105", deviceBrowserInfo: "Chrome 121.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── External Viewer ───────────────────────────────────────────────────────
  {
    auditId: "IMAV-A-10018", eventType: "External Viewer Access",
    accessionNumber: "ACC-60010", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60010",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8010", modality: "MRI", studyDate: "2025-02-05",
    userId: "REF-003", userRole: "Referring Physician", accessType: "View", accessSource: "External Link",
    accessTimestamp: "2025-02-05 15:00:00", sessionId: "SESS-EXT-003",
    ipAddress: "122.87.34.56", deviceBrowserInfo: "Safari 17.3 / iOS 17",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Study ACC-60011 · CXR · RAD-001 ──────────────────────────────────────
  {
    auditId: "IMAV-A-10019", eventType: "Study Accessed",
    accessionNumber: "ACC-60011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60011",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8011", modality: "CR", studyDate: "2025-02-05",
    userId: "RAD-001", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-06 08:30:00", sessionId: "SESS-A-008",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 121.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10020", eventType: "Series Opened",
    accessionNumber: "ACC-60011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60011",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60011.1", sopInstanceUid: null,
    patientId: "UHID-8011", modality: "CR", studyDate: "2025-02-05",
    userId: "RAD-001", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-06 08:33:00", sessionId: "SESS-A-008",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 121.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Access Denied: Download Not Permitted ────────────────────────────────
  {
    auditId: "IMAV-A-10021", eventType: "Access Denied",
    accessionNumber: "ACC-60012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60012",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8012", modality: "MRI", studyDate: "2025-02-06",
    userId: "TECH-002", userRole: "Technician", accessType: "Download", accessSource: "PACS",
    accessTimestamp: "2025-02-06 13:20:00", sessionId: "SESS-A-009",
    ipAddress: "192.168.20.111", deviceBrowserInfo: "Firefox 122.0 / Windows 10",
    status: "Denied",
    denialReason: "Download not permitted — Technician role has view-only image access. Download requires Radiologist or Senior Radiologist privileges.",
    facilityId: "FAC-002", emergencyOverride: false,
  },
  // ── Study ACC-60013 · US Liver · RAD-002 ─────────────────────────────────
  {
    auditId: "IMAV-A-10022", eventType: "Study Accessed",
    accessionNumber: "ACC-60013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.60013",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8013", modality: "US", studyDate: "2025-02-06",
    userId: "RAD-002", userRole: "Senior Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-07 09:15:00", sessionId: "SESS-A-010",
    ipAddress: "192.168.20.102", deviceBrowserInfo: "Chrome 121.0 / macOS 14.3",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10023", eventType: "Image Viewed",
    accessionNumber: "ACC-60013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.60013",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.60013.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.60013.1.007",
    patientId: "UHID-8013", modality: "US", studyDate: "2025-02-06",
    userId: "RAD-002", userRole: "Senior Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-07 09:22:00", sessionId: "SESS-A-010",
    ipAddress: "192.168.20.102", deviceBrowserInfo: "Chrome 121.0 / macOS 14.3",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Emergency Override ─────────────────────────────────────────────────────
  {
    auditId: "IMAV-A-10024", eventType: "Study Accessed",
    accessionNumber: "ACC-60014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60014",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8014", modality: "CT", studyDate: "2025-02-07",
    userId: "RAD-003", userRole: "Radiologist", accessType: "View", accessSource: "PACS",
    accessTimestamp: "2025-02-07 23:45:00", sessionId: "SESS-A-011",
    ipAddress: "192.168.20.103", deviceBrowserInfo: "DICOM Workstation (OsiriX)",
    status: "Success", denialReason: null, facilityId: "FAC-003", emergencyOverride: true,
  },
  {
    auditId: "IMAV-A-10025", eventType: "Image Downloaded",
    accessionNumber: "ACC-60014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60014",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60014.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60014.1.005",
    patientId: "UHID-8014", modality: "CT", studyDate: "2025-02-07",
    userId: "RAD-003", userRole: "Radiologist", accessType: "Download", accessSource: "PACS",
    accessTimestamp: "2025-02-07 23:58:00", sessionId: "SESS-A-011",
    ipAddress: "192.168.20.103", deviceBrowserInfo: "DICOM Workstation (OsiriX)",
    status: "Success", denialReason: null, facilityId: "FAC-003", emergencyOverride: true,
  },
  // ── Access Denied: PACS Downtime ─────────────────────────────────────────
  {
    auditId: "IMAV-A-10026", eventType: "Access Denied",
    accessionNumber: "ACC-60015", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60015",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8015", modality: "CR", studyDate: "2025-02-08",
    userId: "REF-001", userRole: "Referring Physician", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-08 09:00:00", sessionId: "SESS-EXT-004",
    ipAddress: "203.45.67.91", deviceBrowserInfo: "Edge 121.0 / Windows 11",
    status: "Denied",
    denialReason: "PACS service unavailable — scheduled maintenance window 08:00–10:00. Image viewer could not retrieve study from PACS node.",
    facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Study ACC-60016 · MRI Brain · RAD-004 ────────────────────────────────
  {
    auditId: "IMAV-A-10027", eventType: "Study Accessed",
    accessionNumber: "ACC-60016", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60016",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8016", modality: "MRI", studyDate: "2025-02-09",
    userId: "RAD-004", userRole: "Senior Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-09 11:00:00", sessionId: "SESS-A-012",
    ipAddress: "192.168.20.104", deviceBrowserInfo: "Firefox 122.0 / macOS 14.3",
    status: "Success", denialReason: null, facilityId: "FAC-002", emergencyOverride: false,
  },
  // ── External Viewer ───────────────────────────────────────────────────────
  {
    auditId: "IMAV-A-10028", eventType: "External Viewer Access",
    accessionNumber: "ACC-60017", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60017",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8017", modality: "CT", studyDate: "2025-02-10",
    userId: "REF-002", userRole: "Referring Physician", accessType: "View", accessSource: "External Link",
    accessTimestamp: "2025-02-10 14:30:00", sessionId: "SESS-EXT-005",
    ipAddress: "117.56.78.90", deviceBrowserInfo: "Chrome 122.0 / Android 14",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Mammography Print ────────────────────────────────────────────────────
  {
    auditId: "IMAV-A-10029", eventType: "Image Printed",
    accessionNumber: "ACC-60018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60018",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60018.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.1.2.60018.1.004",
    patientId: "UHID-8018", modality: "MG", studyDate: "2025-02-11",
    userId: "RAD-005", userRole: "Senior Radiologist", accessType: "Print", accessSource: "PACS",
    accessTimestamp: "2025-02-11 10:00:00", sessionId: "SESS-A-013",
    ipAddress: "192.168.20.105", deviceBrowserInfo: "DICOM Workstation (Hologic)",
    status: "Success", denialReason: null, facilityId: "FAC-002", emergencyOverride: false,
  },
  // ── Access Denied: Session Timeout ───────────────────────────────────────
  {
    auditId: "IMAV-A-10030", eventType: "Access Denied",
    accessionNumber: "ACC-60019", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.60019",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8019", modality: "US", studyDate: "2025-02-12",
    userId: "ADMIN-002", userRole: "Admin", accessType: "View", accessSource: "External Link",
    accessTimestamp: "2025-02-12 16:00:00", sessionId: "SESS-EXT-006",
    ipAddress: "198.55.34.12", deviceBrowserInfo: "Chrome 122.0 / Windows 11",
    status: "Denied",
    denialReason: "Session timeout — external viewer session expired after 30 minutes of inactivity. User must re-authenticate to regain access.",
    facilityId: "FAC-003", emergencyOverride: false,
  },
  // ── Study ACC-60020 · CT Chest-Abdomen ────────────────────────────────────
  {
    auditId: "IMAV-A-10031", eventType: "Study Accessed",
    accessionNumber: "ACC-60020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8020", modality: "CT", studyDate: "2025-02-13",
    userId: "RAD-001", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-13 09:00:00", sessionId: "SESS-A-014",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 122.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10032", eventType: "Series Opened",
    accessionNumber: "ACC-60020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020.1", sopInstanceUid: null,
    patientId: "UHID-8020", modality: "CT", studyDate: "2025-02-13",
    userId: "RAD-001", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-13 09:04:00", sessionId: "SESS-A-014",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 122.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10033", eventType: "Image Viewed",
    accessionNumber: "ACC-60020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020.1.022",
    patientId: "UHID-8020", modality: "CT", studyDate: "2025-02-13",
    userId: "RAD-001", userRole: "Radiologist", accessType: "View", accessSource: "RIS",
    accessTimestamp: "2025-02-13 09:10:00", sessionId: "SESS-A-014",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 122.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  {
    auditId: "IMAV-A-10034", eventType: "Image Downloaded",
    accessionNumber: "ACC-60020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020",
    seriesInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020.1", sopInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60020.1.022",
    patientId: "UHID-8020", modality: "CT", studyDate: "2025-02-13",
    userId: "RAD-001", userRole: "Radiologist", accessType: "Download", accessSource: "RIS",
    accessTimestamp: "2025-02-13 09:45:00", sessionId: "SESS-A-014",
    ipAddress: "192.168.20.101", deviceBrowserInfo: "Chrome 122.0 / Windows 11",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
  // ── Nuclear Medicine · RAD-002 ────────────────────────────────────────────
  {
    auditId: "IMAV-A-10035", eventType: "Study Accessed",
    accessionNumber: "ACC-60021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.20.60021",
    seriesInstanceUid: null, sopInstanceUid: null,
    patientId: "UHID-8021", modality: "NM", studyDate: "2025-02-14",
    userId: "RAD-002", userRole: "Senior Radiologist", accessType: "View", accessSource: "PACS",
    accessTimestamp: "2025-02-14 13:00:00", sessionId: "SESS-A-015",
    ipAddress: "192.168.20.102", deviceBrowserInfo: "DICOM Workstation (OsiriX)",
    status: "Success", denialReason: null, facilityId: "FAC-001", emergencyOverride: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTs(ts: string): string {
  const d = new Date(ts.replace(" ", "T"));
  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const day  = String(d.getDate()).padStart(2, "0");
  const mon  = MONTHS[d.getMonth()];
  const yr   = String(d.getFullYear()).slice(2);
  const h24  = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, "0");
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12  = String(h24 % 12 || 12).padStart(2, "0");
  return `${day}-${mon}-${yr}, ${h12}:${mins} ${ampm}`;
}

function formatDateShort(ds: string): string {
  const [y, m, d] = ds.split("-");
  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${d}-${MONTHS[parseInt(m, 10) - 1]}-${y.slice(2)}`;
}

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

function eventTypeBadgeVariant(et: ImageAccessEventType): BadgeVariant {
  switch (et) {
    case "Study Accessed":
    case "Series Opened":
    case "Image Viewed":        return "outline";
    case "Image Downloaded":
    case "Image Printed":       return "secondary";
    case "External Viewer Access": return "default";
    case "Access Denied":       return "destructive";
  }
}

function accessTypeBadgeVariant(at: AccessType): BadgeVariant {
  switch (at) {
    case "View":     return "outline";
    case "Download": return "secondary";
    case "Print":    return "secondary";
    case "N/A":      return "outline";
  }
}

function accessSourceBadgeVariant(src: AccessSource): BadgeVariant {
  switch (src) {
    case "RIS":           return "outline";
    case "PACS":          return "secondary";
    case "External Link": return "default";
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ImageAccessViewingLogs() {
  // ── Filter State ────────────────────────────────────────────────────────────
  const [search, setSearch] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [accessTypeFilter, setAccessTypeFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Date range (same pattern as other audit log pages)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 450),
    to: new Date(),
  });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});

  const quickRanges = [
    { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
    { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: "Last 90 days", getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
    { label: "Month to date", getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  ];

  const handleCancelDateRange = () => {
    setTempDateRange({});
    setDatePickerOpen(false);
  };

  // ── Dialog / Sheet State ────────────────────────────────────────────────────
  const [selectedLog, setSelectedLog] = React.useState<ImageAccessLog | null>(null);
  const [exportOpen, setExportOpen] = React.useState(false);

  // ── Derived Stats ───────────────────────────────────────────────────────────
  const totalEvents       = mockLogs.length;
  const uniqueStudies     = new Set(mockLogs.map((l) => l.accessionNumber)).size;
  const dlPrintCount      = mockLogs.filter((l) => l.accessType === "Download" || l.accessType === "Print").length;
  const deniedCount       = mockLogs.filter((l) => l.status === "Denied").length;

  // ── Filtered Data ────────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const hit =
          log.auditId.toLowerCase().includes(q) ||
          log.accessionNumber.toLowerCase().includes(q) ||
          log.patientId.toLowerCase().includes(q) ||
          log.userId.toLowerCase().includes(q) ||
          log.sessionId.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (accessTypeFilter !== "all" && log.accessType !== accessTypeFilter) return false;
      if (sourceFilter !== "all" && log.accessSource !== sourceFilter) return false;
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      const logDate = new Date(log.accessTimestamp.replace(" ", "T"));
      const matchesDate =
        logDate >= startOfDay(dateRange.from) &&
        logDate <= endOfDay(dateRange.to);
      if (!matchesDate) return false;
      return true;
    });
  }, [search, eventTypeFilter, accessTypeFilter, sourceFilter, statusFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const hasActiveFilters =
    search !== "" ||
    eventTypeFilter !== "all" ||
    accessTypeFilter !== "all" ||
    sourceFilter !== "all" ||
    statusFilter !== "all" ||
    isDateRangeActive;

  function clearAllFilters() {
    setSearch("");
    setEventTypeFilter("all");
    setAccessTypeFilter("all");
    setSourceFilter("all");
    setStatusFilter("all");
    setDateRange({ from: subDays(new Date(), 450), to: new Date() });
    setTempDateRange({});
    setIsDateRangeActive(false);
    setCurrentPage(1);
  }

  function handlePageChange(p: number) {
    setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <PageShell>
      <PageHeader
        title="Image Access & Viewing Logs"
        noBorder
        leading={<BackButton href="/admin/audit-logs" />}
        actions={
          <Button onClick={() => setExportOpen(true)}>
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
              title="Total Access Events"
              value={totalEvents}
              description="All image access events"
              icon={Images}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Unique Studies Accessed"
              value={uniqueStudies}
              description="Distinct accession numbers"
              icon={FolderOpen}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Download & Print Events"
              value={dlPrintCount}
              description="Images downloaded or printed"
              icon={Printer}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Access Denied"
              value={deniedCount}
              description="Unauthorised access attempts"
              icon={ShieldX}
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
                          setDateRange(range as { from: Date; to: Date });
                          setTempDateRange(range);
                          setIsDateRangeActive(true);
                          setDatePickerOpen(false);
                          setCurrentPage(1);
                        }}
                        onCancel={handleCancelDateRange}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Search */}
                  <div className="bg-background relative rounded-[8px] w-80">
                    <div className="flex items-center gap-2 px-3 py-[7.5px]">
                      <Search strokeWidth={ICON_STROKE_WIDTH} className="size-5 text-muted-foreground shrink-0" />
                      <input
                        placeholder="Search by audit ID, accession, UHID, user…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
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

                  <Select value={eventTypeFilter} onValueChange={(v) => { setEventTypeFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-48 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="Study Accessed">Study Accessed</SelectItem>
                      <SelectItem value="Series Opened">Series Opened</SelectItem>
                      <SelectItem value="Image Viewed">Image Viewed</SelectItem>
                      <SelectItem value="Image Downloaded">Image Downloaded</SelectItem>
                      <SelectItem value="Image Printed">Image Printed</SelectItem>
                      <SelectItem value="External Viewer Access">External Viewer Access</SelectItem>
                      <SelectItem value="Access Denied">Access Denied</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={accessTypeFilter} onValueChange={(v) => { setAccessTypeFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Access Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="View">View</SelectItem>
                      <SelectItem value="Download">Download</SelectItem>
                      <SelectItem value="Print">Print</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="RIS">RIS</SelectItem>
                      <SelectItem value="PACS">PACS</SelectItem>
                      <SelectItem value="External Link">External Link</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-28 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                      <SelectItem value="Denied">Denied</SelectItem>
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
                    <TableHead className="text-right w-12 whitespace-nowrap">Sr.</TableHead>
                    <TableHead className="whitespace-nowrap">Audit ID</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">Event Type</TableHead>
                    <TableHead className="whitespace-nowrap">Accession No.</TableHead>
                    <TableHead className="whitespace-nowrap">UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Modality</TableHead>
                    <TableHead className="whitespace-nowrap">Access Type</TableHead>
                    <TableHead className="whitespace-nowrap">Source</TableHead>
                    <TableHead className="whitespace-nowrap">User ID</TableHead>
                    <TableHead className="whitespace-nowrap">User Role</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={14}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No records found matching the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((log, idx) => {
                      const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <TableRow key={log.auditId}>
                          {/* Sr. No. */}
                          <TableCell className="text-right whitespace-nowrap">
                            <span className="font-mono tabular-nums text-muted-foreground text-sm">
                              {srNo}
                            </span>
                          </TableCell>

                          {/* Audit ID */}
                          <TableCell className="whitespace-nowrap">
                            <span className="font-mono tabular-nums text-sm">
                              {log.auditId}
                            </span>
                          </TableCell>

                          {/* Timestamp */}
                          <TableCell className="whitespace-nowrap">
                            <span className="font-mono tabular-nums text-sm">
                              {formatTs(log.accessTimestamp)}
                            </span>
                          </TableCell>

                          {/* Event Type */}
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Badge variant={eventTypeBadgeVariant(log.eventType)} className="whitespace-nowrap">
                                {log.eventType}
                              </Badge>
                              {log.emergencyOverride && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertTriangle
                                      strokeWidth={ICON_STROKE_WIDTH}
                                      className="size-3.5 text-destructive shrink-0"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>Emergency Access Override</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>

                          {/* Accession No. */}
                          <TableCell className="whitespace-nowrap">
                            <span className="font-mono tabular-nums text-sm">
                              {log.accessionNumber}
                            </span>
                          </TableCell>

                          {/* UHID */}
                          <TableCell className="whitespace-nowrap">
                            <span className="font-mono tabular-nums text-sm">
                              {log.patientId}
                            </span>
                          </TableCell>

                          {/* Modality */}
                          <TableCell className="whitespace-nowrap">
                            <span className="text-sm">{log.modality}</span>
                          </TableCell>

                          {/* Access Type */}
                          <TableCell className="whitespace-nowrap">
                            <Badge variant={accessTypeBadgeVariant(log.accessType)}>
                              {log.accessType}
                            </Badge>
                          </TableCell>

                          {/* Source */}
                          <TableCell className="whitespace-nowrap">
                            <Badge variant={accessSourceBadgeVariant(log.accessSource)}>
                              {log.accessSource}
                            </Badge>
                          </TableCell>

                          {/* User ID */}
                          <TableCell className="whitespace-nowrap">
                            <span className="font-mono tabular-nums text-sm">
                              {log.userId}
                            </span>
                          </TableCell>

                          {/* User Role */}
                          <TableCell className="whitespace-nowrap">
                            <span className="text-sm">{log.userRole}</span>
                          </TableCell>

                          {/* IP Address */}
                          <TableCell className="whitespace-nowrap">
                            <span className="font-mono tabular-nums text-sm">
                              {log.ipAddress}
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="whitespace-nowrap">
                            {log.status === "Success" ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />
                                Success
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />
                                Denied
                              </Badge>
                            )}
                          </TableCell>

                          {/* Actions */}
                          
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {filtered.length > 0 && (
                <div className="px-4 py-3 border-t border-border">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filtered.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* ── Detail Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Image Access Event Details</DialogTitle>
            <DialogDescription>
              Audit ID:{" "}
              <span className="font-mono tabular-nums">
                {selectedLog?.auditId}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-5 pt-1">

              {/* Emergency Override Banner */}
              {selectedLog.emergencyOverride && (
                <div className="flex items-start gap-2.5 rounded-md border border-destructive/40 bg-destructive/10 p-3">
                  <AlertTriangle
                    strokeWidth={ICON_STROKE_WIDTH}
                    className="size-4 text-destructive mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-destructive font-medium">
                    Emergency Access Override — This event was accessed under an emergency
                    override protocol. Mandatory compliance review is required.
                  </p>
                </div>
              )}

              {/* Denial Reason Banner */}
              {selectedLog.status === "Denied" && selectedLog.denialReason && (
                <div className="flex items-start gap-2.5 rounded-md border border-destructive/40 bg-destructive/10 p-3">
                  <XCircle
                    strokeWidth={ICON_STROKE_WIDTH}
                    className="size-4 text-destructive mt-0.5 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-destructive">Access Denied</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.denialReason}</p>
                  </div>
                </div>
              )}

              {/* Event Summary */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Event Summary
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Event Type</p>
                    <Badge variant={eventTypeBadgeVariant(selectedLog.eventType)} className="mt-1">
                      {selectedLog.eventType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1">
                      {selectedLog.status === "Success" ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />
                          Denied
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Access Timestamp</p>
                    <p className="text-sm text-foreground font-mono tabular-nums mt-0.5">
                      {formatTs(selectedLog.accessTimestamp)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Facility</p>
                    <p className="text-sm text-foreground font-mono mt-0.5">
                      {selectedLog.facilityId}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Study & Image Details */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Study & Image Details
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Accession Number</p>
                    <p className="text-sm text-foreground font-mono tabular-nums mt-0.5">
                      {selectedLog.accessionNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">UHID</p>
                    <p className="text-sm text-foreground font-mono tabular-nums mt-0.5">
                      {selectedLog.patientId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Modality</p>
                    <p className="text-sm text-foreground mt-0.5">{selectedLog.modality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Study Date</p>
                    <p className="text-sm text-foreground font-mono tabular-nums mt-0.5">
                      {formatDateShort(selectedLog.studyDate)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Study Instance UID</p>
                    <p className="text-xs text-foreground font-mono tabular-nums mt-0.5 break-all">
                      {selectedLog.studyInstanceUid}
                    </p>
                  </div>
                  {selectedLog.seriesInstanceUid && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Series Instance UID</p>
                      <p className="text-xs text-foreground font-mono tabular-nums mt-0.5 break-all">
                        {selectedLog.seriesInstanceUid}
                      </p>
                    </div>
                  )}
                  {selectedLog.sopInstanceUid && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">SOP Instance UID (Image ID)</p>
                      <p className="text-xs text-foreground font-mono tabular-nums mt-0.5 break-all">
                        {selectedLog.sopInstanceUid}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* User & Access Details */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  User & Access Details
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="text-sm text-foreground font-mono tabular-nums mt-0.5">
                      {selectedLog.userId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">User Role</p>
                    <p className="text-sm text-foreground mt-0.5">{selectedLog.userRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Access Type</p>
                    <Badge variant={accessTypeBadgeVariant(selectedLog.accessType)} className="mt-1">
                      {selectedLog.accessType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Access Source</p>
                    <Badge variant={accessSourceBadgeVariant(selectedLog.accessSource)} className="mt-1">
                      {selectedLog.accessSource}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Session ID</p>
                    <p className="text-sm text-foreground font-mono tabular-nums mt-0.5">
                      {selectedLog.sessionId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IP Address</p>
                    <p className="text-sm text-foreground font-mono tabular-nums mt-0.5">
                      {selectedLog.ipAddress}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Device / Browser</p>
                    <p className="text-sm text-foreground mt-0.5">
                      {selectedLog.deviceBrowserInfo}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Export Sheet ───────────────────────────────────────────────────── */}
      <Sheet open={exportOpen} onOpenChange={setExportOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Export Image Access Logs</SheetTitle>
            <SheetDescription>
              Export audit records for Image Access &amp; Viewing (Story 14) in CSV or PDF format.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default ImageAccessViewingLogs;
