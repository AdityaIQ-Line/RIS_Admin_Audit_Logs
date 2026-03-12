// @refresh reset
import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Scan,
  AlertTriangle,
  Cpu,
  RefreshCw,
  Link2,
  Copy,
  Radio,
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
 * MODALITY WORKLIST EVENTS AUDIT LOG — Story 7
 *
 * SCOPE:
 * ✔ MWL Entry Created
 * ✔ MWL Entry Updated
 * ✔ MWL Entry Cancelled
 * ✔ MWL Query Received (from modality)
 * ✔ MWL Entry Retrieved by Modality
 * ✔ MWL Transmission Failed
 * ✔ Study Linked to MWL
 * ✔ Orphan Study Detected
 * ✔ Duplicate MWL Entry
 *
 * EXCLUDED: DICOM image storage audit, Report generation audit
 *
 * COMPLIANCE:
 * - DICOM MWL traceability
 * - NABH radiology audit compliance
 * - ISO 27001 integration monitoring
 * - Medico-legal defensibility for wrong-patient cases
 *
 * RETENTION: ≥ 7 years
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/mwl — list with pagination
 * - Query params: auditId, appointmentId, patientId, accessionNo, aeTitle,
 *                 modality, eventType, transmissionStatus, mwlStatus,
 *                 integrationDirection, dateFrom, dateTo
 * - GET /api/admin/audit-logs/mwl/export — CSV / PDF
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type MWLEventType =
  | "MWL Entry Created"
  | "MWL Entry Updated"
  | "MWL Entry Cancelled"
  | "MWL Query Received"
  | "MWL Entry Retrieved by Modality"
  | "MWL Transmission Failed"
  | "Study Linked to MWL"
  | "Orphan Study Detected"
  | "Duplicate MWL Entry";

type IntegrationDirection = "LIMS→RIS" | "RIS→PACS" | "Modality→RIS";
type MWLStatus = "Created" | "Updated" | "Cancelled" | "Fetched" | "Failed";
type TransmissionStatus = "Success" | "Failed" | "Partial";
type ModalityType = "CT" | "MRI" | "X-Ray" | "USG" | "PET-CT" | "Mammography";
type TriggeredBy = "System" | "User";

interface MWLAuditLog {
  auditId: string;
  eventType: MWLEventType;
  integrationDirection: IntegrationDirection;
  appointmentId: string;
  patientId: string;
  accessionNumber: string;
  studyInstanceUid: string;
  modality: ModalityType;
  aeTitle: string;
  modalityIp: string;
  scheduledDate: string;
  scheduledTime: string;
  bodyPart: string;
  procedureCode: string;
  referringPhysician: string;
  mwlStatus: MWLStatus;
  beforeSnapshot: string | null;
  afterSnapshot: string | null;
  triggeredBy: TriggeredBy;
  triggeredByUserId: string | null;
  changeTimestamp: string;
  responseTimeMs: number;
  retryCount: number;
  transmissionStatus: TransmissionStatus;
  errorCode: string | null;
  errorMessage: string | null;
  facilityId: string;
}

// ─── Mock Data (50 records) ───────────────────────────────────────────────────

const mockMWLLogs: MWLAuditLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "MWL-10001",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5501",
    patientId: "UHID-4501",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-05",
    scheduledTime: "10:00",
    bodyPart: "Brain",
    procedureCode: "MRI-BRAIN-001",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20010", "patient": "UHID-4501", "modality": "MRI", "scheduledDate": "2025-02-05", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-01 09:06:00",
    responseTimeMs: 82,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10002",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5502",
    patientId: "UHID-4502",
    accessionNumber: "ACC-20011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20011",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-06",
    scheduledTime: "11:30",
    bodyPart: "Chest",
    procedureCode: "CT-CHEST-002",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20011", "patient": "UHID-4502", "modality": "CT", "scheduledDate": "2025-02-06", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-01 10:16:00",
    responseTimeMs: 74,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10003",
    eventType: "MWL Query Received",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5501",
    patientId: "UHID-4501",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-05",
    scheduledTime: "10:00",
    bodyPart: "Brain",
    procedureCode: "MRI-BRAIN-001",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: null,
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-01 11:00:00",
    responseTimeMs: 45,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10004",
    eventType: "MWL Transmission Failed",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-5503",
    patientId: "UHID-3310",
    accessionNumber: "ACC-20012",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20012",
    modality: "MRI",
    aeTitle: "MRI-UNIT-02",
    modalityIp: "192.168.10.21",
    scheduledDate: "2025-02-07",
    scheduledTime: "09:30",
    bodyPart: "Knee",
    procedureCode: "MRI-KNEE-003",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Failed",
    beforeSnapshot: '{ "status": "Created", "accession": "ACC-20012" }',
    afterSnapshot: '{ "status": "Failed", "error": "NETWORK_TIMEOUT" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-01 14:46:00",
    responseTimeMs: 5002,
    retryCount: 3,
    transmissionStatus: "Failed",
    errorCode: "ERR-DICOM-TIMEOUT",
    errorMessage: "DICOM C-FIND timeout after 5000ms — PACS unreachable on port 104",
    facilityId: "FAC-002",
  },
  {
    auditId: "MWL-10005",
    eventType: "MWL Entry Retrieved by Modality",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5502",
    patientId: "UHID-4502",
    accessionNumber: "ACC-20011",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20011",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-06",
    scheduledTime: "11:30",
    bodyPart: "Chest",
    procedureCode: "CT-CHEST-002",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "status": "Fetched", "aeTitle": "CT-SCANNER-01", "timestamp": "2025-02-01T15:30:00" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-01 15:31:00",
    responseTimeMs: 58,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "MWL-10006",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5504",
    patientId: "UHID-4503",
    accessionNumber: "ACC-20013",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20013",
    modality: "CT",
    aeTitle: "CT-SCANNER-02",
    modalityIp: "192.168.10.11",
    scheduledDate: "2025-02-10",
    scheduledTime: "16:00",
    bodyPart: "Abdomen",
    procedureCode: "CT-ABD-004",
    referringPhysician: "Dr. Priya Nair",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20013", "patient": "UHID-4503", "modality": "CT", "scheduledDate": "2025-02-10", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-03 09:01:00",
    responseTimeMs: 66,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10007",
    eventType: "MWL Entry Updated",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5200",
    patientId: "UHID-1105",
    accessionNumber: "ACC-20014",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20014",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-08",
    scheduledTime: "11:00",
    bodyPart: "Spine-Lumbar",
    procedureCode: "MRI-SPINE-005",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Updated",
    beforeSnapshot: '{ "radiologist": "Dr. Ramesh Iyer", "priority": "Routine" }',
    afterSnapshot: '{ "radiologist": "Dr. Kavita Sharma", "priority": "Urgent" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-RC-001",
    changeTimestamp: "2025-02-03 10:31:00",
    responseTimeMs: 91,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10008",
    eventType: "MWL Entry Cancelled",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5001",
    patientId: "UHID-3012",
    accessionNumber: "ACC-20015",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.7.20015",
    modality: "X-Ray",
    aeTitle: "XRAY-DR-01",
    modalityIp: "192.168.10.30",
    scheduledDate: "2025-02-04",
    scheduledTime: "15:00",
    bodyPart: "Knee",
    procedureCode: "XR-KNEE-006",
    referringPhysician: "Dr. Suresh Menon",
    mwlStatus: "Cancelled",
    beforeSnapshot: '{ "status": "Created", "scheduledDate": "2025-02-04", "scheduledTime": "15:00" }',
    afterSnapshot: '{ "status": "Cancelled", "reason": "Appointment cancelled — patient hospitalised" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-03 11:46:00",
    responseTimeMs: 79,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "MWL-10009",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5505",
    patientId: "UHID-4505",
    accessionNumber: "ACC-20016",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.20016",
    modality: "Mammography",
    aeTitle: "MAMMO-01",
    modalityIp: "192.168.10.60",
    scheduledDate: "2025-02-12",
    scheduledTime: "10:00",
    bodyPart: "Breast",
    procedureCode: "MAMMO-007",
    referringPhysician: "Dr. Priya Nair",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20016", "patient": "UHID-4505", "modality": "Mammography", "scheduledDate": "2025-02-12", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-03 14:01:00",
    responseTimeMs: 71,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-003",
  },
  {
    auditId: "MWL-10010",
    eventType: "Study Linked to MWL",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-5200",
    patientId: "UHID-1105",
    accessionNumber: "ACC-20014",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20014",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-08",
    scheduledTime: "11:00",
    bodyPart: "Spine-Lumbar",
    procedureCode: "MRI-SPINE-005",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "studyLinked": true, "studyInstanceUID": "1.2.840.10008.5.1.4.1.1.4.20014", "accession": "ACC-20014" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-03 15:31:00",
    responseTimeMs: 103,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "MWL-10011",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5506",
    patientId: "UHID-4506",
    accessionNumber: "ACC-20017",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20017",
    modality: "PET-CT",
    aeTitle: "PET-CT-01",
    modalityIp: "192.168.10.50",
    scheduledDate: "2025-02-14",
    scheduledTime: "08:00",
    bodyPart: "Whole-Body",
    procedureCode: "PETCT-WHOLE-008",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20017", "patient": "UHID-4506", "modality": "PET-CT", "scheduledDate": "2025-02-14", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-05 09:01:00",
    responseTimeMs: 88,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10012",
    eventType: "MWL Entry Updated",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5300",
    patientId: "UHID-1890",
    accessionNumber: "ACC-20018",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20018",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-09",
    scheduledTime: "12:00",
    bodyPart: "Brain",
    procedureCode: "CT-BRAIN-009",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Updated",
    beforeSnapshot: '{ "paymentStatus": "Pending" }',
    afterSnapshot: '{ "paymentStatus": "Paid", "mwlReleased": true }',
    triggeredBy: "User",
    triggeredByUserId: "USR-FD-002",
    changeTimestamp: "2025-02-05 10:21:00",
    responseTimeMs: 95,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10013",
    eventType: "MWL Query Received",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5504",
    patientId: "UHID-4503",
    accessionNumber: "ACC-20013",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20013",
    modality: "CT",
    aeTitle: "CT-SCANNER-02",
    modalityIp: "192.168.10.11",
    scheduledDate: "2025-02-10",
    scheduledTime: "16:00",
    bodyPart: "Abdomen",
    procedureCode: "CT-ABD-004",
    referringPhysician: "Dr. Priya Nair",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: null,
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-05 11:46:00",
    responseTimeMs: 51,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10014",
    eventType: "MWL Entry Updated",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5220",
    patientId: "UHID-4507",
    accessionNumber: "ACC-20019",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.7.20019",
    modality: "X-Ray",
    aeTitle: "XRAY-DR-01",
    modalityIp: "192.168.10.30",
    scheduledDate: "2025-02-20",
    scheduledTime: "11:00",
    bodyPart: "Spine-Lumbar",
    procedureCode: "XR-SPINE-010",
    referringPhysician: "Dr. Suresh Menon",
    mwlStatus: "Updated",
    beforeSnapshot: '{ "scheduledDate": "2025-02-08", "scheduledTime": "10:00" }',
    afterSnapshot: '{ "scheduledDate": "2025-02-20", "scheduledTime": "11:00" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-FD-003",
    changeTimestamp: "2025-02-05 13:31:00",
    responseTimeMs: 87,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-003",
  },
  {
    auditId: "MWL-10015",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5507",
    patientId: "UHID-2789",
    accessionNumber: "ACC-20020",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.20020",
    modality: "USG",
    aeTitle: "USG-UNIT-01",
    modalityIp: "192.168.10.40",
    scheduledDate: "2025-02-11",
    scheduledTime: "10:30",
    bodyPart: "Abdomen",
    procedureCode: "USG-OBS-011",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20020", "patient": "UHID-2789", "modality": "USG", "scheduledDate": "2025-02-11", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-05 15:01:00",
    responseTimeMs: 76,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  // ── Feb 07 ──────────────────────────────────────────
  {
    auditId: "MWL-10016",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5508",
    patientId: "UHID-4508",
    accessionNumber: "ACC-20021",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20021",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-14",
    scheduledTime: "13:00",
    bodyPart: "KUB",
    procedureCode: "CT-KUB-012",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20021", "patient": "UHID-4508", "modality": "CT", "scheduledDate": "2025-02-14", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-07 09:11:00",
    responseTimeMs: 64,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "MWL-10017",
    eventType: "MWL Entry Cancelled",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5102",
    patientId: "UHID-1234",
    accessionNumber: "ACC-20022",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20022",
    modality: "MRI",
    aeTitle: "MRI-UNIT-02",
    modalityIp: "192.168.10.21",
    scheduledDate: "2025-02-09",
    scheduledTime: "15:00",
    bodyPart: "Shoulder",
    procedureCode: "MRI-SHLDR-013",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Cancelled",
    beforeSnapshot: '{ "status": "Created", "scheduledDate": "2025-02-09", "scheduledTime": "15:00" }',
    afterSnapshot: '{ "status": "Cancelled", "reason": "Patient no longer requires scan" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-07 10:46:00",
    responseTimeMs: 72,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10018",
    eventType: "MWL Query Received",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5506",
    patientId: "UHID-4506",
    accessionNumber: "ACC-20017",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20017",
    modality: "PET-CT",
    aeTitle: "PET-CT-01",
    modalityIp: "192.168.10.50",
    scheduledDate: "2025-02-14",
    scheduledTime: "08:00",
    bodyPart: "Whole-Body",
    procedureCode: "PETCT-WHOLE-008",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: null,
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-07 12:01:00",
    responseTimeMs: 48,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10019",
    eventType: "MWL Entry Updated",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5250",
    patientId: "UHID-2010",
    accessionNumber: "ACC-20023",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.20023",
    modality: "USG",
    aeTitle: "USG-UNIT-01",
    modalityIp: "192.168.10.40",
    scheduledDate: "2025-02-12",
    scheduledTime: "09:30",
    bodyPart: "Pelvis",
    procedureCode: "USG-PELV-014",
    referringPhysician: "Dr. Priya Nair",
    mwlStatus: "Updated",
    beforeSnapshot: '{ "bookingSource": "Online" }',
    afterSnapshot: '{ "bookingSource": "Walk-in" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-FD-002",
    changeTimestamp: "2025-02-07 14:16:00",
    responseTimeMs: 83,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10020",
    eventType: "Orphan Study Detected",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-UNKNOWN",
    patientId: "UHID-UNKNOWN",
    accessionNumber: "ACC-99999",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.99999",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-07",
    scheduledTime: "15:30",
    bodyPart: "Unknown",
    procedureCode: "UNKNOWN",
    referringPhysician: "Unknown",
    mwlStatus: "Failed",
    beforeSnapshot: null,
    afterSnapshot: '{ "orphan": true, "studyUID": "1.2.840.10008.5.1.4.1.1.4.99999", "flagged": true, "requiresReconciliation": true }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-07 15:31:00",
    responseTimeMs: 112,
    retryCount: 0,
    transmissionStatus: "Failed",
    errorCode: "ERR-ORPHAN-001",
    errorMessage: "Study received without matching MWL entry — flagged for manual reconciliation",
    facilityId: "FAC-001",
  },
  // ── Feb 10 ──────────────────────────────────────────
  {
    auditId: "MWL-10021",
    eventType: "MWL Entry Cancelled",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5090",
    patientId: "UHID-3100",
    accessionNumber: "ACC-20024",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20024",
    modality: "CT",
    aeTitle: "CT-SCANNER-02",
    modalityIp: "192.168.10.11",
    scheduledDate: "2025-02-12",
    scheduledTime: "11:00",
    bodyPart: "Brain",
    procedureCode: "CT-BRAIN-015",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Cancelled",
    beforeSnapshot: '{ "status": "Created", "scheduledDate": "2025-02-12" }',
    afterSnapshot: '{ "status": "Cancelled", "reason": "Patient expired" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-ADM-001",
    changeTimestamp: "2025-02-10 09:01:00",
    responseTimeMs: 68,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-003",
  },
  {
    auditId: "MWL-10022",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5510",
    patientId: "UHID-4510",
    accessionNumber: "ACC-20025",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20025",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-18",
    scheduledTime: "14:00",
    bodyPart: "Wrist",
    procedureCode: "MRI-WRIST-016",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20025", "patient": "UHID-4510", "modality": "MRI", "scheduledDate": "2025-02-18", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-10 10:01:00",
    responseTimeMs: 80,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "MWL-10023",
    eventType: "MWL Entry Updated",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5310",
    patientId: "UHID-2345",
    accessionNumber: "ACC-20026",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20026",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-22",
    scheduledTime: "08:00",
    bodyPart: "Heart",
    procedureCode: "CT-ANGIO-017",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Updated",
    beforeSnapshot: '{ "scheduledDate": "2025-02-13", "scheduledTime": "09:00", "priority": "Routine" }',
    afterSnapshot: '{ "scheduledDate": "2025-02-22", "scheduledTime": "08:00", "priority": "Urgent" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-RC-001",
    changeTimestamp: "2025-02-10 11:16:00",
    responseTimeMs: 94,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10024",
    eventType: "MWL Transmission Failed",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-5511",
    patientId: "UHID-1678",
    accessionNumber: "ACC-20027",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.7.20027",
    modality: "X-Ray",
    aeTitle: "XRAY-DR-01",
    modalityIp: "192.168.10.30",
    scheduledDate: "2025-02-13",
    scheduledTime: "15:30",
    bodyPart: "Hand",
    procedureCode: "XR-HAND-018",
    referringPhysician: "Dr. Suresh Menon",
    mwlStatus: "Failed",
    beforeSnapshot: '{ "status": "Created" }',
    afterSnapshot: '{ "status": "Failed", "error": "CONNECTION_REFUSED" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-10 14:01:00",
    responseTimeMs: 3001,
    retryCount: 3,
    transmissionStatus: "Failed",
    errorCode: "ERR-DICOM-CONN",
    errorMessage: "PACS C-STORE connection refused — XRAY-DR-01 unreachable. Max retries (3) exceeded.",
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10025",
    eventType: "MWL Entry Retrieved by Modality",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5509",
    patientId: "UHID-4509",
    accessionNumber: "ACC-20028",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.20028",
    modality: "Mammography",
    aeTitle: "MAMMO-01",
    modalityIp: "192.168.10.60",
    scheduledDate: "2025-02-16",
    scheduledTime: "10:00",
    bodyPart: "Breast",
    procedureCode: "MAMMO-019",
    referringPhysician: "Dr. Priya Nair",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "status": "Fetched", "aeTitle": "MAMMO-01", "timestamp": "2025-02-10T15:00:00" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-10 15:01:00",
    responseTimeMs: 62,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  // ── Feb 12 ──────────────────────────────────────────
  {
    auditId: "MWL-10026",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5512",
    patientId: "UHID-2900",
    accessionNumber: "ACC-20029",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20029",
    modality: "MRI",
    aeTitle: "MRI-UNIT-02",
    modalityIp: "192.168.10.21",
    scheduledDate: "2025-02-19",
    scheduledTime: "09:00",
    bodyPart: "Spine-Cervical",
    procedureCode: "MRI-CSPINE-020",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20029", "patient": "UHID-2900", "modality": "MRI", "scheduledDate": "2025-02-19", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-12 08:51:00",
    responseTimeMs: 77,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10027",
    eventType: "MWL Query Received",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5510",
    patientId: "UHID-4510",
    accessionNumber: "ACC-20025",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20025",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-18",
    scheduledTime: "14:00",
    bodyPart: "Wrist",
    procedureCode: "MRI-WRIST-016",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: null,
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-12 10:01:00",
    responseTimeMs: 43,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "MWL-10028",
    eventType: "Study Linked to MWL",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-5508",
    patientId: "UHID-4508",
    accessionNumber: "ACC-20021",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20021",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-14",
    scheduledTime: "13:00",
    bodyPart: "KUB",
    procedureCode: "CT-KUB-012",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "studyLinked": true, "studyInstanceUID": "1.2.840.10008.5.1.4.1.1.2.20021", "accession": "ACC-20021" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-12 11:31:00",
    responseTimeMs: 99,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "MWL-10029",
    eventType: "MWL Entry Cancelled",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5031",
    patientId: "UHID-4512",
    accessionNumber: "ACC-20030",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.20030",
    modality: "USG",
    aeTitle: "USG-UNIT-01",
    modalityIp: "192.168.10.40",
    scheduledDate: "2025-02-14",
    scheduledTime: "09:00",
    bodyPart: "Abdomen",
    procedureCode: "USG-PED-021",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Cancelled",
    beforeSnapshot: '{ "status": "Created", "scheduledDate": "2025-02-14" }',
    afterSnapshot: '{ "status": "Cancelled", "reason": "Child unwell" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-FD-002",
    changeTimestamp: "2025-02-12 13:01:00",
    responseTimeMs: 74,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "MWL-10030",
    eventType: "Duplicate MWL Entry",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5513",
    patientId: "UHID-4513",
    accessionNumber: "ACC-20031",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20031",
    modality: "CT",
    aeTitle: "CT-SCANNER-02",
    modalityIp: "192.168.10.11",
    scheduledDate: "2025-02-20",
    scheduledTime: "15:00",
    bodyPart: "Sinuses",
    procedureCode: "CT-PNS-022",
    referringPhysician: "Dr. Suresh Menon",
    mwlStatus: "Failed",
    beforeSnapshot: '{ "existingAccession": "ACC-20031", "status": "Created" }',
    afterSnapshot: '{ "duplicateBlocked": true, "accession": "ACC-20031", "reason": "Duplicate accession number" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-12 15:11:00",
    responseTimeMs: 55,
    retryCount: 0,
    transmissionStatus: "Failed",
    errorCode: "ERR-DUPLICATE-001",
    errorMessage: "Duplicate accession number ACC-20031 — MWL creation blocked",
    facilityId: "FAC-003",
  },
  // ── Feb 14 ──────────────────────────────────────────
  {
    auditId: "MWL-10031",
    eventType: "MWL Entry Updated",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5500",
    patientId: "UHID-4501",
    accessionNumber: "ACC-20010",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20010",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-05",
    scheduledTime: "10:00",
    bodyPart: "Brain",
    procedureCode: "MRI-BRAIN-001",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Updated",
    beforeSnapshot: '{ "status": "Created" }',
    afterSnapshot: '{ "status": "Completed" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-TECH-001",
    changeTimestamp: "2025-02-14 09:01:00",
    responseTimeMs: 86,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10032",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5514",
    patientId: "UHID-2200",
    accessionNumber: "ACC-20032",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20032",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-21",
    scheduledTime: "10:00",
    bodyPart: "Ankle",
    procedureCode: "MRI-ANKLE-023",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20032", "patient": "UHID-2200", "modality": "MRI", "scheduledDate": "2025-02-21", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-14 10:06:00",
    responseTimeMs: 79,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10033",
    eventType: "MWL Entry Cancelled",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5044",
    patientId: "UHID-1560",
    accessionNumber: "ACC-20033",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20033",
    modality: "PET-CT",
    aeTitle: "PET-CT-01",
    modalityIp: "192.168.10.50",
    scheduledDate: "2025-02-16",
    scheduledTime: "08:00",
    bodyPart: "Whole-Body",
    procedureCode: "PETCT-LYMP-024",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Cancelled",
    beforeSnapshot: '{ "status": "Created", "scheduledDate": "2025-02-16" }',
    afterSnapshot: '{ "status": "Cancelled", "reason": "Isotope unavailable" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-ADM-001",
    changeTimestamp: "2025-02-14 11:31:00",
    responseTimeMs: 75,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10034",
    eventType: "MWL Entry Retrieved by Modality",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5260",
    patientId: "UHID-4099",
    accessionNumber: "ACC-20034",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.20034",
    modality: "USG",
    aeTitle: "USG-UNIT-01",
    modalityIp: "192.168.10.40",
    scheduledDate: "2025-02-24",
    scheduledTime: "14:00",
    bodyPart: "Kidney",
    procedureCode: "USG-KID-025",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "status": "Fetched", "aeTitle": "USG-UNIT-01", "timestamp": "2025-02-14T13:10:00" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-14 13:11:00",
    responseTimeMs: 56,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10035",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5515",
    patientId: "UHID-4514",
    accessionNumber: "ACC-20035",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20035",
    modality: "CT",
    aeTitle: "CT-SCANNER-02",
    modalityIp: "192.168.10.11",
    scheduledDate: "2025-02-22",
    scheduledTime: "11:00",
    bodyPart: "Spine-Lumbar",
    procedureCode: "CT-SPINE-026",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20035", "patient": "UHID-4514", "modality": "CT", "scheduledDate": "2025-02-22", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-14 15:31:00",
    responseTimeMs: 70,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  // ── Feb 17 ──────────────────────────────────────────
  {
    auditId: "MWL-10036",
    eventType: "MWL Transmission Failed",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-5070",
    patientId: "UHID-2780",
    accessionNumber: "ACC-20036",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20036",
    modality: "MRI",
    aeTitle: "MRI-UNIT-02",
    modalityIp: "192.168.10.21",
    scheduledDate: "2025-02-20",
    scheduledTime: "10:00",
    bodyPart: "Brain",
    procedureCode: "MRI-EPILEP-027",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Failed",
    beforeSnapshot: '{ "status": "Created" }',
    afterSnapshot: '{ "status": "Failed", "error": "PARTIAL_TRANSMISSION" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-17 09:31:00",
    responseTimeMs: 4200,
    retryCount: 2,
    transmissionStatus: "Partial",
    errorCode: "ERR-PARTIAL-001",
    errorMessage: "DICOM C-FIND partial response — only 2 of 5 attributes received. Retry scheduled.",
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10037",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5516",
    patientId: "UHID-3301",
    accessionNumber: "ACC-20037",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20037",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-24",
    scheduledTime: "09:00",
    bodyPart: "Chest",
    procedureCode: "CT-CHEST-028",
    referringPhysician: "Dr. Priya Nair",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20037", "patient": "UHID-3301", "modality": "CT", "scheduledDate": "2025-02-24", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-17 10:11:00",
    responseTimeMs: 73,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10038",
    eventType: "MWL Query Received",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5512",
    patientId: "UHID-2900",
    accessionNumber: "ACC-20029",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20029",
    modality: "MRI",
    aeTitle: "MRI-UNIT-02",
    modalityIp: "192.168.10.21",
    scheduledDate: "2025-02-19",
    scheduledTime: "09:00",
    bodyPart: "Spine-Cervical",
    procedureCode: "MRI-CSPINE-020",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: null,
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-17 11:31:00",
    responseTimeMs: 47,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10039",
    eventType: "Study Linked to MWL",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-5506",
    patientId: "UHID-4506",
    accessionNumber: "ACC-20017",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.130.20017",
    modality: "PET-CT",
    aeTitle: "PET-CT-01",
    modalityIp: "192.168.10.50",
    scheduledDate: "2025-02-14",
    scheduledTime: "08:00",
    bodyPart: "Whole-Body",
    procedureCode: "PETCT-WHOLE-008",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "studyLinked": true, "studyInstanceUID": "1.2.840.10008.5.1.4.1.1.130.20017", "accession": "ACC-20017" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-17 14:16:00",
    responseTimeMs: 108,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10040",
    eventType: "MWL Entry Updated",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5350",
    patientId: "UHID-3456",
    accessionNumber: "ACC-20038",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20038",
    modality: "CT",
    aeTitle: "CT-SCANNER-02",
    modalityIp: "192.168.10.11",
    scheduledDate: "2025-02-17",
    scheduledTime: "13:00",
    bodyPart: "Chest",
    procedureCode: "CT-CHEST-029",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Updated",
    beforeSnapshot: '{ "scheduledTime": "12:00", "slotMin": 30 }',
    afterSnapshot: '{ "scheduledTime": "13:00", "slotMin": 40 }',
    triggeredBy: "User",
    triggeredByUserId: "USR-ADM-001",
    changeTimestamp: "2025-02-17 15:31:00",
    responseTimeMs: 92,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  // ── Feb 19 ──────────────────────────────────────────
  {
    auditId: "MWL-10041",
    eventType: "MWL Entry Retrieved by Modality",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5516",
    patientId: "UHID-3301",
    accessionNumber: "ACC-20037",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20037",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-24",
    scheduledTime: "09:00",
    bodyPart: "Chest",
    procedureCode: "CT-CHEST-028",
    referringPhysician: "Dr. Priya Nair",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "status": "Fetched", "aeTitle": "CT-SCANNER-01", "timestamp": "2025-02-19T09:10:00" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-19 09:11:00",
    responseTimeMs: 53,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10042",
    eventType: "MWL Query Received",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5514",
    patientId: "UHID-2200",
    accessionNumber: "ACC-20032",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20032",
    modality: "MRI",
    aeTitle: "MRI-UNIT-01",
    modalityIp: "192.168.10.20",
    scheduledDate: "2025-02-21",
    scheduledTime: "10:00",
    bodyPart: "Ankle",
    procedureCode: "MRI-ANKLE-023",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: null,
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-19 10:06:00",
    responseTimeMs: 44,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10043",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5517",
    patientId: "UHID-4515",
    accessionNumber: "ACC-20039",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.7.20039",
    modality: "X-Ray",
    aeTitle: "XRAY-DR-01",
    modalityIp: "192.168.10.30",
    scheduledDate: "2025-02-26",
    scheduledTime: "11:00",
    bodyPart: "Chest",
    procedureCode: "XR-CHEST-030",
    referringPhysician: "Dr. Suresh Menon",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20039", "patient": "UHID-4515", "modality": "X-Ray", "scheduledDate": "2025-02-26", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-19 11:16:00",
    responseTimeMs: 68,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-003",
  },
  {
    auditId: "MWL-10044",
    eventType: "Study Linked to MWL",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-5512",
    patientId: "UHID-2900",
    accessionNumber: "ACC-20029",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20029",
    modality: "MRI",
    aeTitle: "MRI-UNIT-02",
    modalityIp: "192.168.10.21",
    scheduledDate: "2025-02-19",
    scheduledTime: "09:00",
    bodyPart: "Spine-Cervical",
    procedureCode: "MRI-CSPINE-020",
    referringPhysician: "Dr. Anand Pillai",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "studyLinked": true, "studyInstanceUID": "1.2.840.10008.5.1.4.1.1.4.20029", "accession": "ACC-20029" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-19 13:31:00",
    responseTimeMs: 97,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10045",
    eventType: "MWL Entry Updated",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5180",
    patientId: "UHID-1980",
    accessionNumber: "ACC-20040",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.20040",
    modality: "Mammography",
    aeTitle: "MAMMO-01",
    modalityIp: "192.168.10.60",
    scheduledDate: "2025-02-25",
    scheduledTime: "11:00",
    bodyPart: "Breast",
    procedureCode: "MAMMO-031",
    referringPhysician: "Dr. Priya Nair",
    mwlStatus: "Updated",
    beforeSnapshot: '{ "scheduledDate": "2025-02-14" }',
    afterSnapshot: '{ "scheduledDate": "2025-02-25" }',
    triggeredBy: "User",
    triggeredByUserId: "USR-FD-001",
    changeTimestamp: "2025-02-19 15:31:00",
    responseTimeMs: 85,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  // ── Feb 22 ──────────────────────────────────────────
  {
    auditId: "MWL-10046",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5518",
    patientId: "UHID-4516",
    accessionNumber: "ACC-20041",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20041",
    modality: "MRI",
    aeTitle: "MRI-UNIT-02",
    modalityIp: "192.168.10.21",
    scheduledDate: "2025-03-01",
    scheduledTime: "09:00",
    bodyPart: "Pelvis",
    procedureCode: "MRI-PELV-032",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20041", "patient": "UHID-4516", "modality": "MRI", "scheduledDate": "2025-03-01", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-22 09:01:00",
    responseTimeMs: 81,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10047",
    eventType: "MWL Query Received",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5515",
    patientId: "UHID-4514",
    accessionNumber: "ACC-20035",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20035",
    modality: "CT",
    aeTitle: "CT-SCANNER-02",
    modalityIp: "192.168.10.11",
    scheduledDate: "2025-02-22",
    scheduledTime: "11:00",
    bodyPart: "Spine-Lumbar",
    procedureCode: "CT-SPINE-026",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: null,
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-22 10:31:00",
    responseTimeMs: 49,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "MWL-10048",
    eventType: "MWL Entry Retrieved by Modality",
    integrationDirection: "Modality→RIS",
    appointmentId: "APPT-5518",
    patientId: "UHID-4516",
    accessionNumber: "ACC-20041",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.20041",
    modality: "MRI",
    aeTitle: "MRI-UNIT-02",
    modalityIp: "192.168.10.21",
    scheduledDate: "2025-03-01",
    scheduledTime: "09:00",
    bodyPart: "Pelvis",
    procedureCode: "MRI-PELV-032",
    referringPhysician: "Dr. Kavita Sharma",
    mwlStatus: "Fetched",
    beforeSnapshot: null,
    afterSnapshot: '{ "status": "Fetched", "aeTitle": "MRI-UNIT-02", "timestamp": "2025-02-22T11:30:00" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-22 11:31:00",
    responseTimeMs: 61,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10049",
    eventType: "Orphan Study Detected",
    integrationDirection: "RIS→PACS",
    appointmentId: "APPT-UNKNOWN",
    patientId: "UHID-UNKNOWN",
    accessionNumber: "ACC-88888",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.88888",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-02-22",
    scheduledTime: "13:00",
    bodyPart: "Unknown",
    procedureCode: "UNKNOWN",
    referringPhysician: "Unknown",
    mwlStatus: "Failed",
    beforeSnapshot: null,
    afterSnapshot: '{ "orphan": true, "studyUID": "1.2.840.10008.5.1.4.1.1.2.88888", "flagged": true, "requiresReconciliation": true }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-22 13:01:00",
    responseTimeMs: 120,
    retryCount: 0,
    transmissionStatus: "Failed",
    errorCode: "ERR-ORPHAN-002",
    errorMessage: "CT study received without MWL entry — accession mismatch. Flagged for manual reconciliation.",
    facilityId: "FAC-001",
  },
  {
    auditId: "MWL-10050",
    eventType: "MWL Entry Created",
    integrationDirection: "LIMS→RIS",
    appointmentId: "APPT-5520",
    patientId: "UHID-1770",
    accessionNumber: "ACC-20042",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.20042",
    modality: "CT",
    aeTitle: "CT-SCANNER-01",
    modalityIp: "192.168.10.10",
    scheduledDate: "2025-03-03",
    scheduledTime: "08:00",
    bodyPart: "Heart",
    procedureCode: "CT-CALCIUM-033",
    referringPhysician: "Dr. Ramesh Iyer",
    mwlStatus: "Created",
    beforeSnapshot: null,
    afterSnapshot: '{ "accession": "ACC-20042", "patient": "UHID-1770", "modality": "CT", "scheduledDate": "2025-03-03", "status": "Created" }',
    triggeredBy: "System",
    triggeredByUserId: null,
    changeTimestamp: "2025-02-22 15:31:00",
    responseTimeMs: 72,
    retryCount: 0,
    transmissionStatus: "Success",
    errorCode: null,
    errorMessage: null,
    facilityId: "FAC-001",
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Main Component ───────────────────────────────────────────────────────────

export function ModalityWorklistLogs() {
  const logs = mockMWLLogs;

  // --- Filter state ---
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [modalityFilter, setModalityFilter] = React.useState("all");
  const [integrationDirFilter, setIntegrationDirFilter] = React.useState("all");
  const [transmissionStatusFilter, setTransmissionStatusFilter] = React.useState("all");
  const [mwlStatusFilter, setMwlStatusFilter] = React.useState("all");
  const [facilityFilter, setFacilityFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = ITEMS_PER_PAGE;

  // Date range
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 450),
    to: new Date(),
  });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});

  // Detail dialog + export sheet
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<MWLAuditLog | null>(null);
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
    const createdUpdated = logs.filter(
      (l) => l.eventType === "MWL Entry Created" || l.eventType === "MWL Entry Updated"
    ).length;
    const queries = logs.filter(
      (l) => l.eventType === "MWL Query Received" || l.eventType === "MWL Entry Retrieved by Modality"
    ).length;
    const txFailed = logs.filter((l) => l.transmissionStatus === "Failed" || l.transmissionStatus === "Partial").length;
    const anomalies = logs.filter(
      (l) => l.eventType === "Orphan Study Detected" || l.eventType === "Duplicate MWL Entry"
    ).length;
    return { total, createdUpdated, queries, txFailed, anomalies };
  }, [logs]);

  // --- Filtered logs ---
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const sq = searchFilter.toLowerCase();
      const matchesSearch =
        !sq ||
        log.auditId.toLowerCase().includes(sq) ||
        log.patientId.toLowerCase().includes(sq) ||
        log.accessionNumber.toLowerCase().includes(sq) ||
        log.aeTitle.toLowerCase().includes(sq) ||
        log.studyInstanceUid.toLowerCase().includes(sq);

      const matchesEventType = eventTypeFilter === "all" || log.eventType === eventTypeFilter;
      const matchesModality = modalityFilter === "all" || log.modality === modalityFilter;
      const matchesDir = integrationDirFilter === "all" || log.integrationDirection === integrationDirFilter;
      const matchesTxStatus = transmissionStatusFilter === "all" || log.transmissionStatus === transmissionStatusFilter;
      const matchesMwlStatus = mwlStatusFilter === "all" || log.mwlStatus === mwlStatusFilter;
      const matchesFacility = facilityFilter === "all" || log.facilityId === facilityFilter;

      const logDate = new Date(log.changeTimestamp);
      const matchesDate =
        logDate >= startOfDay(dateRange.from) && logDate <= endOfDay(dateRange.to);

      return (
        matchesSearch &&
        matchesEventType &&
        matchesModality &&
        matchesDir &&
        matchesTxStatus &&
        matchesMwlStatus &&
        matchesFacility &&
        matchesDate
      );
    });
  }, [
    logs, searchFilter, eventTypeFilter, modalityFilter, integrationDirFilter,
    transmissionStatusFilter, mwlStatusFilter, facilityFilter, dateRange,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => { setCurrentPage(1); }, [
    searchFilter, eventTypeFilter, modalityFilter, integrationDirFilter,
    transmissionStatusFilter, mwlStatusFilter, facilityFilter, dateRange,
  ]);

  const hasActiveFilters =
    eventTypeFilter !== "all" || modalityFilter !== "all" || integrationDirFilter !== "all" ||
    transmissionStatusFilter !== "all" || mwlStatusFilter !== "all" || facilityFilter !== "all";

  const clearAllFilters = () => {
    setEventTypeFilter("all"); setModalityFilter("all"); setIntegrationDirFilter("all");
    setTransmissionStatusFilter("all"); setMwlStatusFilter("all"); setFacilityFilter("all");
    setSearchFilter("");
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
  const getEventTypeBadge = (et: MWLEventType) => {
    switch (et) {
      case "MWL Entry Created":
        return <Badge variant="default"><CheckCircle className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Created</Badge>;
      case "MWL Entry Updated":
        return <Badge variant="secondary"><RefreshCw className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Updated</Badge>;
      case "MWL Entry Cancelled":
        return <Badge variant="destructive"><XCircle className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Cancelled</Badge>;
      case "MWL Query Received":
        return <Badge variant="outline"><Radio className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Query Received</Badge>;
      case "MWL Entry Retrieved by Modality":
        return <Badge variant="outline"><CheckCircle className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Retrieved</Badge>;
      case "MWL Transmission Failed":
        return <Badge variant="destructive"><AlertTriangle className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />TX Failed</Badge>;
      case "Study Linked to MWL":
        return <Badge variant="secondary"><Link2 className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Study Linked</Badge>;
      case "Orphan Study Detected":
        return <Badge variant="destructive"><AlertTriangle className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Orphan Study</Badge>;
      case "Duplicate MWL Entry":
        return <Badge variant="destructive"><Copy className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />Duplicate</Badge>;
    }
  };

  const getMwlStatusBadge = (s: MWLStatus) => {
    switch (s) {
      case "Created":   return <Badge variant="default">Created</Badge>;
      case "Updated":   return <Badge variant="secondary">Updated</Badge>;
      case "Cancelled": return <Badge variant="destructive">Cancelled</Badge>;
      case "Fetched":   return <Badge variant="outline">Fetched</Badge>;
      case "Failed":    return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getTxStatusCell = (status: TransmissionStatus) => {
    if (status === "Success") {
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle className="size-4 text-primary" strokeWidth={ICON_STROKE_WIDTH} />
          <span className="text-sm">Success</span>
        </div>
      );
    }
    if (status === "Partial") {
      return (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="size-4 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
          <span className="text-sm text-muted-foreground">Partial</span>
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

  const getIntegrationDirBadge = (dir: IntegrationDirection) => {
    switch (dir) {
      case "LIMS→RIS":      return <Badge variant="secondary" className="roboto-mono text-xs">LIMS→RIS</Badge>;
      case "RIS→PACS":      return <Badge variant="outline" className="roboto-mono text-xs">RIS→PACS</Badge>;
      case "Modality→RIS":  return <Badge variant="default" className="roboto-mono text-xs">MOD→RIS</Badge>;
    }
  };

  const DetailRow = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
    <div className="flex items-start py-2.5 border-b border-border last:border-0">
      <span className="w-44 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm flex-1 ${mono ? "roboto-mono text-xs tabular-nums" : ""}`}>
        {value ?? <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );

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

  return (
    <PageShell>
      <PageHeader
        title="Modality Worklist Audit Logs"
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
              title="Total MWL Events"
              value={stats.total}
              description="All lifecycle events"
              icon={Scan}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Created & Updated"
              value={stats.createdUpdated}
              description="New entries & modifications"
              icon={RefreshCw}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Queries & Retrievals"
              value={stats.queries}
              description="Modality fetch events"
              icon={Radio}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="TX Failures"
              value={stats.txFailed}
              description="Failed / partial transmissions"
              icon={AlertTriangle}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-destructive"
            />
            <StatCard
              title="Anomalies"
              value={stats.anomalies}
              description="Orphan studies & duplicates"
              icon={Cpu}
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
                          <Scan className="size-4 text-muted-foreground shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
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
                        placeholder="Search by audit ID, accession, UHID, AE title, study UID"
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
                      <SelectItem value="MWL Entry Created">MWL Entry Created</SelectItem>
                      <SelectItem value="MWL Entry Updated">MWL Entry Updated</SelectItem>
                      <SelectItem value="MWL Entry Cancelled">MWL Entry Cancelled</SelectItem>
                      <SelectItem value="MWL Query Received">MWL Query Received</SelectItem>
                      <SelectItem value="MWL Entry Retrieved by Modality">MWL Retrieved by Modality</SelectItem>
                      <SelectItem value="MWL Transmission Failed">MWL Transmission Failed</SelectItem>
                      <SelectItem value="Study Linked to MWL">Study Linked to MWL</SelectItem>
                      <SelectItem value="Orphan Study Detected">Orphan Study Detected</SelectItem>
                      <SelectItem value="Duplicate MWL Entry">Duplicate MWL Entry</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={modalityFilter} onValueChange={setModalityFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Modality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modalities</SelectItem>
                      <SelectItem value="CT">CT</SelectItem>
                      <SelectItem value="MRI">MRI</SelectItem>
                      <SelectItem value="X-Ray">X-Ray</SelectItem>
                      <SelectItem value="USG">USG</SelectItem>
                      <SelectItem value="PET-CT">PET-CT</SelectItem>
                      <SelectItem value="Mammography">Mammography</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={integrationDirFilter} onValueChange={setIntegrationDirFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Directions</SelectItem>
                      <SelectItem value="LIMS→RIS">LIMS→RIS</SelectItem>
                      <SelectItem value="RIS→PACS">RIS→PACS</SelectItem>
                      <SelectItem value="Modality→RIS">Modality→RIS</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={transmissionStatusFilter} onValueChange={setTransmissionStatusFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="TX Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All TX Statuses</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={mwlStatusFilter} onValueChange={setMwlStatusFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="MWL Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All MWL Statuses</SelectItem>
                      <SelectItem value="Created">Created</SelectItem>
                      <SelectItem value="Updated">Updated</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Fetched">Fetched</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      <SelectItem value="FAC-001">FAC-001</SelectItem>
                      <SelectItem value="FAC-002">FAC-002</SelectItem>
                      <SelectItem value="FAC-003">FAC-003</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Direction</TableHead>
                    <TableHead className="whitespace-nowrap">Patient UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Accession No.</TableHead>
                    <TableHead className="whitespace-nowrap">Study Instance UID</TableHead>
                    <TableHead className="whitespace-nowrap">Modality</TableHead>
                    <TableHead className="whitespace-nowrap">AE Title</TableHead>
                    <TableHead className="whitespace-nowrap">Modality IP</TableHead>
                    <TableHead className="whitespace-nowrap">Scheduled Date</TableHead>
                    <TableHead className="whitespace-nowrap">Scheduled Time</TableHead>
                    <TableHead className="whitespace-nowrap">Body Part</TableHead>
                    <TableHead className="whitespace-nowrap">MWL Status</TableHead>
                    <TableHead className="whitespace-nowrap">Before Snapshot</TableHead>
                    <TableHead className="whitespace-nowrap">After Snapshot</TableHead>
                    <TableHead className="whitespace-nowrap">Triggered By</TableHead>
                    <TableHead className="whitespace-nowrap">Triggered By UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Response (ms)</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Retries</TableHead>
                    <TableHead className="whitespace-nowrap">TX Status</TableHead>
                    <TableHead className="whitespace-nowrap">Error Code</TableHead>
                    <TableHead className="whitespace-nowrap">Error Message</TableHead>
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
                        <TableCell className="whitespace-nowrap">{getIntegrationDirBadge(log.integrationDirection)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.patientId}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.accessionNumber}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums max-w-[160px] truncate" title={log.studyInstanceUid}>
                          {log.studyInstanceUid}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="secondary" className="roboto-mono text-xs tabular-nums">{log.modality}</Badge>
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.aeTitle}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.modalityIp}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.scheduledDate}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.scheduledTime}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.bodyPart}</TableCell>
                        <TableCell className="whitespace-nowrap">{getMwlStatusBadge(log.mwlStatus)}</TableCell>
                        <TableCell className="max-w-[120px]"><SnapshotCell value={log.beforeSnapshot} /></TableCell>
                        <TableCell className="max-w-[120px]"><SnapshotCell value={log.afterSnapshot} /></TableCell>
                        <TableCell className="whitespace-nowrap">
                          {log.triggeredBy === "System" ? (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Cpu className="size-3.5" strokeWidth={ICON_STROKE_WIDTH} />
                              <span className="text-xs">System</span>
                            </div>
                          ) : (
                            <span className="text-xs">User</span>
                          )}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.triggeredByUserId ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.changeTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap text-right">{log.responseTimeMs}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap text-right">{log.retryCount}</TableCell>
                        <TableCell className="whitespace-nowrap">{getTxStatusCell(log.transmissionStatus)}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">
                          {log.errorCode ? (
                            <span className="text-destructive">{log.errorCode}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm max-w-[180px] truncate" title={log.errorMessage ?? ""}>
                          {log.errorMessage ? (
                            <span className="text-destructive">{log.errorMessage}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={23}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <Scan className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">No MWL audit logs found matching your criteria</p>
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
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              MWL Audit Record Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">
                  {selectedLog.auditId}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>Complete MWL audit record — read-only, immutable</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow label="Event Type" value={getEventTypeBadge(selectedLog.eventType)} />
              <DetailRow label="Integration Direction" value={getIntegrationDirBadge(selectedLog.integrationDirection)} />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Accession Number" value={selectedLog.accessionNumber} mono />
              <DetailRow label="Study Instance UID" value={selectedLog.studyInstanceUid} mono />
              <DetailRow label="Modality" value={<Badge variant="secondary" className="roboto-mono text-xs tabular-nums">{selectedLog.modality}</Badge>} />
              <DetailRow label="AE Title" value={selectedLog.aeTitle} mono />
              <DetailRow label="Modality IP" value={selectedLog.modalityIp} mono />
              <DetailRow label="Scheduled Date" value={selectedLog.scheduledDate} mono />
              <DetailRow label="Scheduled Time" value={selectedLog.scheduledTime} mono />
              <DetailRow label="Body Part" value={selectedLog.bodyPart} />
              <DetailRow label="Procedure Code" value={selectedLog.procedureCode} mono />
              <DetailRow label="Referring Physician" value={selectedLog.referringPhysician} />
              <DetailRow label="MWL Status" value={getMwlStatusBadge(selectedLog.mwlStatus)} />
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
              <DetailRow label="Triggered By" value={
                selectedLog.triggeredBy === "System"
                  ? <div className="flex items-center gap-1.5 text-muted-foreground"><Cpu className="size-4" strokeWidth={ICON_STROKE_WIDTH} /><span>System</span></div>
                  : "User"
              } />
              <DetailRow label="Triggered By UHID" value={selectedLog.triggeredByUserId} mono />
              <DetailRow label="Timestamp" value={formatTimestamp(selectedLog.changeTimestamp)} mono />
              <DetailRow label="Response Time" value={`${selectedLog.responseTimeMs} ms`} mono />
              <DetailRow label="Retry Count" value={String(selectedLog.retryCount)} mono />
              <DetailRow label="Transmission Status" value={getTxStatusCell(selectedLog.transmissionStatus)} />
              <DetailRow label="Error Code" value={
                selectedLog.errorCode
                  ? <span className="text-destructive roboto-mono text-xs">{selectedLog.errorCode}</span>
                  : null
              } />
              <DetailRow label="Error Message" value={
                selectedLog.errorMessage
                  ? <span className="text-destructive">{selectedLog.errorMessage}</span>
                  : null
              } />
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
            <SheetDescription>Generate and download compliance reports from immutable MWL audit log data.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default ModalityWorklistLogs;
