// @refresh reset
import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Calendar,
  CalendarPlus,
  CalendarClock,
  CalendarX,
  CalendarCheck,
  ClipboardList,
  AlertTriangle,
  Cpu,
  Ban,
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
 * APPOINTMENT CREATION, RESCHEDULE & CANCELLATION AUDIT LOG — Story 6
 *
 * SCOPE:
 * ✔ Appointment Created
 * ✔ Appointment Updated (date/time)
 * ✔ Appointment Rescheduled
 * ✔ Appointment Cancelled
 *
 * EXCLUDED: Patient demographic changes, report edits (separate audits)
 *
 * KEY VALIDATIONS:
 * - Cancel/reschedule reason mandatory
 * - Cannot cancel or reschedule completed appointments
 * - Cancellation after study started → requires admin approval
 * - Slot conflict → first success, second rejected (both logged)
 * - System auto-cancellations flagged as System Triggered
 * - Before & after snapshot mandatory for all updates
 *
 * COMPLIANCE:
 * - NABH scheduling traceability
 * - Revenue integrity tracking
 * - ISO 27001 change logging
 * - Medico-legal defensibility
 *
 * RETENTION: 5–7 years (configurable)
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/appointments — list with pagination
 * - Query params: appointmentId, patientId, eventType, modality, priority,
 *                 bookingSource, status, facilityId, systemTriggered, dateFrom, dateTo
 * - GET /api/admin/audit-logs/appointments/export — CSV / PDF
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type ApptEventType =
  | "Appointment Created"
  | "Appointment Updated"
  | "Appointment Rescheduled"
  | "Appointment Cancelled";

type ApptStatus = "Success" | "Failed";
type Modality = "CT" | "MRI" | "X-Ray" | "USG" | "PET-CT" | "Mammography";
type Priority = "Routine" | "Urgent" | "VIP";
type BookingSource = "Walk-in" | "Online" | "Referral" | "Call Center";
type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled" | "No-Show";
type ChangedByRole =
  | "Front Desk"
  | "Radiology Coordinator"
  | "Call Center Agent"
  | "Facility Admin"
  | "System";

interface ApptAuditLog {
  auditId: string;
  eventType: ApptEventType;
  appointmentId: string;
  patientId: string;
  patientName: string;
  visitId: string | null;
  modality: Modality;
  testName: string;
  appointmentDate: string;
  appointmentTime: string;
  slotDurationMin: number;
  priority: Priority;
  bookingSource: BookingSource;
  paymentStatus: "Paid" | "Pending";
  appointmentStatus: AppointmentStatus;
  radiologistAssigned: string | null;
  changedFields: string;
  beforeValue: string | null;
  afterValue: string | null;
  changedByUserId: string;
  changedByRole: ChangedByRole;
  facilityId: string;
  changeTimestamp: string;
  ipAddress: string;
  changeReason: string | null;
  systemTriggered: boolean;
  status: ApptStatus;
  failureReason: string | null;
}

// ─── Mock Data (50 records) ───────────────────────────────────────────────────

const mockApptAuditLogs: ApptAuditLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "APT-30001",
    eventType: "Appointment Created",
    appointmentId: "APPT-5501",
    patientId: "UHID-4501",
    patientName: "Arjun Mehta",
    visitId: "VIS-8801",
    modality: "MRI",
    testName: "MRI Brain with Contrast",
    appointmentDate: "2025-02-05",
    appointmentTime: "10:00",
    slotDurationMin: 45,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-05", "time": "10:00", "modality": "MRI", "status": "Scheduled" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 09:05:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30002",
    eventType: "Appointment Created",
    appointmentId: "APPT-5502",
    patientId: "UHID-4502",
    patientName: "Priya Sharma",
    visitId: "VIS-8802",
    modality: "CT",
    testName: "CT Chest HRCT",
    appointmentDate: "2025-02-06",
    appointmentTime: "11:30",
    slotDurationMin: 30,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-06", "time": "11:30", "modality": "CT", "status": "Scheduled" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 10:15:00",
    ipAddress: "192.168.1.22",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30003",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5100",
    patientId: "UHID-3892",
    patientName: "Ramesh Nair",
    visitId: "VIS-7700",
    modality: "X-Ray",
    testName: "X-Ray Chest PA View",
    appointmentDate: "2025-02-03",
    appointmentTime: "09:00",
    slotDurationMin: 15,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: null,
    changedFields: "Appointment Status, Cancellation Reason",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-03", "time": "09:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Patient unable to attend" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 11:30:00",
    ipAddress: "192.168.1.21",
    changeReason: "Patient unable to attend — rescheduled for next week",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30004",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5050",
    patientId: "UHID-2201",
    patientName: "Sunita Verma",
    visitId: "VIS-7601",
    modality: "USG",
    testName: "USG Abdomen",
    appointmentDate: "2025-02-10",
    appointmentTime: "14:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Date, Appointment Time",
    beforeValue: '{ "date": "2025-02-04", "time": "10:00" }',
    afterValue: '{ "date": "2025-02-10", "time": "14:00" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 13:00:00",
    ipAddress: "192.168.1.20",
    changeReason: "Patient requested later date",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30005",
    eventType: "Appointment Created",
    appointmentId: "APPT-5503",
    patientId: "UHID-3310",
    patientName: "Mohammed Ansari",
    visitId: null,
    modality: "MRI",
    testName: "MRI Knee Joint",
    appointmentDate: "2025-02-07",
    appointmentTime: "09:30",
    slotDurationMin: 45,
    priority: "Routine",
    bookingSource: "Call Center",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-07", "time": "09:30", "modality": "MRI", "status": "Scheduled" }',
    changedByUserId: "USR-CC-001",
    changedByRole: "Call Center Agent",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-01 14:45:00",
    ipAddress: "192.168.2.50",
    changeReason: null,
    systemTriggered: false,
    status: "Failed",
    failureReason: "Slot conflict — slot already booked by another patient",
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "APT-30006",
    eventType: "Appointment Created",
    appointmentId: "APPT-5504",
    patientId: "UHID-4503",
    patientName: "Kavitha Rajan",
    visitId: "VIS-8804",
    modality: "CT",
    testName: "CT Abdomen Pelvis",
    appointmentDate: "2025-02-10",
    appointmentTime: "16:00",
    slotDurationMin: 30,
    priority: "VIP",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-10", "time": "16:00", "modality": "CT", "priority": "VIP" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 09:00:00",
    ipAddress: "192.168.1.10",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30007",
    eventType: "Appointment Updated",
    appointmentId: "APPT-5200",
    patientId: "UHID-1105",
    patientName: "Anita Krishnan",
    visitId: "VIS-7200",
    modality: "MRI",
    testName: "MRI Lumbar Spine",
    appointmentDate: "2025-02-08",
    appointmentTime: "11:00",
    slotDurationMin: 45,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Radiologist Assigned, Priority",
    beforeValue: '{ "radiologist": "Dr. Ramesh Iyer", "priority": "Routine" }',
    afterValue: '{ "radiologist": "Dr. Kavita Sharma", "priority": "Urgent" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 10:30:00",
    ipAddress: "192.168.1.22",
    changeReason: "Radiologist swap due to schedule conflict — priority upgraded per referral",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30008",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5001",
    patientId: "UHID-3012",
    patientName: "Sanjay Pillai",
    visitId: "VIS-6100",
    modality: "X-Ray",
    testName: "X-Ray Knee AP/Lateral",
    appointmentDate: "2025-02-04",
    appointmentTime: "15:00",
    slotDurationMin: 15,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: null,
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-04", "time": "15:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Patient hospitalised" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-03 11:45:00",
    ipAddress: "192.168.2.10",
    changeReason: "Patient hospitalised — cannot attend",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30009",
    eventType: "Appointment Created",
    appointmentId: "APPT-5505",
    patientId: "UHID-4505",
    patientName: "Rekha Singh",
    visitId: "VIS-8806",
    modality: "Mammography",
    testName: "Digital Mammography Bilateral",
    appointmentDate: "2025-02-12",
    appointmentTime: "10:00",
    slotDurationMin: 30,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-12", "time": "10:00", "modality": "Mammography" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-03 14:00:00",
    ipAddress: "192.168.3.5",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30010",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5120",
    patientId: "UHID-2456",
    patientName: "Geeta Menon",
    visitId: "VIS-5500",
    modality: "USG",
    testName: "USG Thyroid",
    appointmentDate: "2025-02-15",
    appointmentTime: "09:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Call Center",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Date, Appointment Time, Slot Duration",
    beforeValue: '{ "date": "2025-02-06", "time": "11:00", "slotMin": 20 }',
    afterValue: '{ "date": "2025-02-15", "time": "09:00", "slotMin": 20 }',
    changedByUserId: "USR-CC-001",
    changedByRole: "Call Center Agent",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 15:30:00",
    ipAddress: "192.168.2.50",
    changeReason: "Machine maintenance on original date — patient informed and rescheduled",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "APT-30011",
    eventType: "Appointment Created",
    appointmentId: "APPT-5506",
    patientId: "UHID-4506",
    patientName: "Vikram Chandra",
    visitId: "VIS-8807",
    modality: "PET-CT",
    testName: "PET-CT Whole Body",
    appointmentDate: "2025-02-14",
    appointmentTime: "08:00",
    slotDurationMin: 90,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-14", "time": "08:00", "modality": "PET-CT", "priority": "Urgent" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 09:00:00",
    ipAddress: "192.168.1.10",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30012",
    eventType: "Appointment Updated",
    appointmentId: "APPT-5300",
    patientId: "UHID-1890",
    patientName: "Harish Iyer",
    visitId: "VIS-8808",
    modality: "CT",
    testName: "CT Brain Plain",
    appointmentDate: "2025-02-09",
    appointmentTime: "12:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "Payment Status",
    beforeValue: '{ "paymentStatus": "Pending" }',
    afterValue: '{ "paymentStatus": "Paid" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 10:20:00",
    ipAddress: "192.168.1.21",
    changeReason: "Payment collected at counter",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30013",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5080",
    patientId: "UHID-3345",
    patientName: "Fatima Shaikh",
    visitId: "VIS-7450",
    modality: "MRI",
    testName: "MRI Pelvis",
    appointmentDate: "2025-02-07",
    appointmentTime: "14:30",
    slotDurationMin: 45,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-07", "time": "14:30" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Insurance pre-auth denied" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-05 11:45:00",
    ipAddress: "192.168.2.11",
    changeReason: "Insurance pre-authorisation denied — appointment cannot proceed",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30014",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5220",
    patientId: "UHID-4507",
    patientName: "Suresh Babu",
    visitId: "VIS-8809",
    modality: "X-Ray",
    testName: "X-Ray Spine Lumbar",
    appointmentDate: "2025-02-20",
    appointmentTime: "11:00",
    slotDurationMin: 15,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: null,
    changedFields: "Appointment Date, Appointment Time",
    beforeValue: '{ "date": "2025-02-08", "time": "10:00" }',
    afterValue: '{ "date": "2025-02-20", "time": "11:00" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-05 13:30:00",
    ipAddress: "192.168.3.5",
    changeReason: "X-Ray machine under maintenance on original date",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30015",
    eventType: "Appointment Created",
    appointmentId: "APPT-5507",
    patientId: "UHID-2789",
    patientName: "Nisha Kapoor",
    visitId: "VIS-8810",
    modality: "USG",
    testName: "USG Obstetric",
    appointmentDate: "2025-02-11",
    appointmentTime: "10:30",
    slotDurationMin: 25,
    priority: "Routine",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-11", "time": "10:30", "modality": "USG" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 15:00:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 07 ──────────────────────────────────────────
  {
    auditId: "APT-30016",
    eventType: "Appointment Created",
    appointmentId: "APPT-5508",
    patientId: "UHID-4508",
    patientName: "Arun Prakash",
    visitId: "VIS-8811",
    modality: "CT",
    testName: "CT KUB Plain",
    appointmentDate: "2025-02-14",
    appointmentTime: "13:00",
    slotDurationMin: 20,
    priority: "Urgent",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-14", "time": "13:00", "modality": "CT", "priority": "Urgent" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-07 09:10:00",
    ipAddress: "192.168.2.12",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30017",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5102",
    patientId: "UHID-1234",
    patientName: "Meena Pillai",
    visitId: "VIS-8811",
    modality: "MRI",
    testName: "MRI Shoulder",
    appointmentDate: "2025-02-09",
    appointmentTime: "15:00",
    slotDurationMin: 45,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-09", "time": "15:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Patient no longer requires scan" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 10:45:00",
    ipAddress: "192.168.1.20",
    changeReason: "Patient no longer requires scan — condition resolved",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30018",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5400",
    patientId: "UHID-3789",
    patientName: "Ravi Kumar",
    visitId: "VIS-7890",
    modality: "PET-CT",
    testName: "PET-CT Brain",
    appointmentDate: "2025-02-18",
    appointmentTime: "08:30",
    slotDurationMin: 90,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "Appointment Date, Appointment Time, Radiologist Assigned",
    beforeValue: '{ "date": "2025-02-10", "time": "08:00", "radiologist": "Dr. Anand Pillai" }',
    afterValue: '{ "date": "2025-02-18", "time": "08:30", "radiologist": "Dr. Ramesh Iyer" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-07 12:00:00",
    ipAddress: "192.168.2.10",
    changeReason: "Radiologist leave on original date — rescheduled with alternate",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30019",
    eventType: "Appointment Updated",
    appointmentId: "APPT-5250",
    patientId: "UHID-2010",
    patientName: "Lalitha Devi",
    visitId: "VIS-5800",
    modality: "USG",
    testName: "USG Pelvis",
    appointmentDate: "2025-02-12",
    appointmentTime: "09:30",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Booking Source",
    beforeValue: '{ "bookingSource": "Online" }',
    afterValue: '{ "bookingSource": "Walk-in" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 14:15:00",
    ipAddress: "192.168.1.21",
    changeReason: "Booking source correction — patient walked in at counter",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30020",
    eventType: "Appointment Created",
    appointmentId: "APPT-5509",
    patientId: "UHID-4509",
    patientName: "Pooja Desai",
    visitId: null,
    modality: "Mammography",
    testName: "Mammography + USG Bilateral",
    appointmentDate: "2025-02-16",
    appointmentTime: "10:00",
    slotDurationMin: 45,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-16", "time": "10:00", "modality": "Mammography" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 15:30:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 10 ──────────────────────────────────────────
  {
    auditId: "APT-30021",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5090",
    patientId: "UHID-3100",
    patientName: "Kiran Shah",
    visitId: "VIS-7100",
    modality: "CT",
    testName: "CT Brain Contrast",
    appointmentDate: "2025-02-12",
    appointmentTime: "11:00",
    slotDurationMin: 30,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-12", "time": "11:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Patient expired" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-10 09:00:00",
    ipAddress: "192.168.3.10",
    changeReason: "Patient expired — appointment cancelled with admin approval",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30022",
    eventType: "Appointment Created",
    appointmentId: "APPT-5510",
    patientId: "UHID-4510",
    patientName: "Tarun Bose",
    visitId: "VIS-8812",
    modality: "MRI",
    testName: "MRI Wrist",
    appointmentDate: "2025-02-18",
    appointmentTime: "14:00",
    slotDurationMin: 30,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-18", "time": "14:00", "modality": "MRI" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-10 10:00:00",
    ipAddress: "192.168.2.11",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30023",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5310",
    patientId: "UHID-2345",
    patientName: "Sudha Rao",
    visitId: "VIS-6800",
    modality: "CT",
    testName: "CT Coronary Angio",
    appointmentDate: "2025-02-22",
    appointmentTime: "08:00",
    slotDurationMin: 60,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "Appointment Date, Appointment Time, Priority",
    beforeValue: '{ "date": "2025-02-13", "time": "09:00", "priority": "Routine" }',
    afterValue: '{ "date": "2025-02-22", "time": "08:00", "priority": "Urgent" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 11:15:00",
    ipAddress: "192.168.1.22",
    changeReason: "Referring physician requested urgent slot — original date not feasible",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30024",
    eventType: "Appointment Created",
    appointmentId: "APPT-5511",
    patientId: "UHID-1678",
    patientName: "Naresh Gupta",
    visitId: "VIS-8813",
    modality: "X-Ray",
    testName: "X-Ray Hand AP View",
    appointmentDate: "2025-02-13",
    appointmentTime: "15:30",
    slotDurationMin: 10,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: null,
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-13", "time": "15:30", "modality": "X-Ray" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 14:00:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30025",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5060",
    patientId: "UHID-4511",
    patientName: "Amrita Sood",
    visitId: "VIS-8814",
    modality: "USG",
    testName: "USG Abdomen + Pelvis",
    appointmentDate: "2025-02-12",
    appointmentTime: "10:00",
    slotDurationMin: 30,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-12", "time": "10:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Self-cancellation via portal" }',
    changedByUserId: "SYS-AUTO",
    changedByRole: "System",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 15:00:00",
    ipAddress: "127.0.0.1",
    changeReason: "Patient cancelled via online portal — no confirmation received",
    systemTriggered: true,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 12 ──────────────────────────────────────────
  {
    auditId: "APT-30026",
    eventType: "Appointment Created",
    appointmentId: "APPT-5512",
    patientId: "UHID-2900",
    patientName: "Balaji Reddy",
    visitId: "VIS-8815",
    modality: "MRI",
    testName: "MRI Cervical Spine",
    appointmentDate: "2025-02-19",
    appointmentTime: "09:00",
    slotDurationMin: 45,
    priority: "Routine",
    bookingSource: "Referral",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-19", "time": "09:00", "modality": "MRI" }',
    changedByUserId: "USR-CC-001",
    changedByRole: "Call Center Agent",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-12 08:50:00",
    ipAddress: "192.168.2.50",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30027",
    eventType: "Appointment Updated",
    appointmentId: "APPT-5350",
    patientId: "UHID-3456",
    patientName: "Chetan Bhatt",
    visitId: "VIS-8817",
    modality: "CT",
    testName: "CT Chest + Abdomen",
    appointmentDate: "2025-02-17",
    appointmentTime: "13:00",
    slotDurationMin: 40,
    priority: "VIP",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "Slot Duration, Appointment Time",
    beforeValue: '{ "time": "12:00", "slotMin": 30 }',
    afterValue: '{ "time": "13:00", "slotMin": 40 }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-12 10:00:00",
    ipAddress: "192.168.2.10",
    changeReason: "Additional contrast protocol required — slot extended",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30028",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5180",
    patientId: "UHID-1980",
    patientName: "Divya Venkatesh",
    visitId: "VIS-5850",
    modality: "Mammography",
    testName: "Mammography Screening",
    appointmentDate: "2025-02-25",
    appointmentTime: "11:00",
    slotDurationMin: 30,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "Appointment Date",
    beforeValue: '{ "date": "2025-02-14" }',
    afterValue: '{ "date": "2025-02-25" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-12 11:30:00",
    ipAddress: "192.168.1.20",
    changeReason: "Patient requested later date due to travel",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30029",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5031",
    patientId: "UHID-4512",
    patientName: "Sheela Nambiar",
    visitId: "VIS-8816",
    modality: "USG",
    testName: "USG Pediatric Abdomen",
    appointmentDate: "2025-02-14",
    appointmentTime: "09:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-14", "time": "09:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Child unwell — cannot proceed with scan" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-12 13:00:00",
    ipAddress: "192.168.2.11",
    changeReason: "Child unwell — guardian requested cancellation",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30030",
    eventType: "Appointment Created",
    appointmentId: "APPT-5513",
    patientId: "UHID-4513",
    patientName: "Mahesh Trivedi",
    visitId: "VIS-8818",
    modality: "CT",
    testName: "CT Paranasal Sinuses",
    appointmentDate: "2025-02-20",
    appointmentTime: "15:00",
    slotDurationMin: 15,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: null,
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-20", "time": "15:00", "modality": "CT" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-12 15:10:00",
    ipAddress: "192.168.3.5",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 14 ──────────────────────────────────────────
  {
    auditId: "APT-30031",
    eventType: "Appointment Updated",
    appointmentId: "APPT-5500",
    patientId: "UHID-4501",
    patientName: "Arjun Mehta",
    visitId: "VIS-8801",
    modality: "MRI",
    testName: "MRI Brain with Contrast",
    appointmentDate: "2025-02-05",
    appointmentTime: "10:00",
    slotDurationMin: 45,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Completed",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled" }',
    afterValue: '{ "status": "Completed" }',
    changedByUserId: "USR-TECH-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 09:00:00",
    ipAddress: "192.168.1.35",
    changeReason: "Scan completed successfully",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30032",
    eventType: "Appointment Created",
    appointmentId: "APPT-5514",
    patientId: "UHID-2200",
    patientName: "Anjali Bhat",
    visitId: "VIS-8820",
    modality: "MRI",
    testName: "MRI Ankle",
    appointmentDate: "2025-02-21",
    appointmentTime: "10:00",
    slotDurationMin: 30,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-21", "time": "10:00", "modality": "MRI" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 10:05:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30033",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5044",
    patientId: "UHID-1560",
    patientName: "Ramakrishnan Pillai",
    visitId: "VIS-7600",
    modality: "PET-CT",
    testName: "PET-CT Lymphoma",
    appointmentDate: "2025-02-16",
    appointmentTime: "08:00",
    slotDurationMin: 90,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-16", "time": "08:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "PET-CT isotope unavailable" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 11:30:00",
    ipAddress: "192.168.1.10",
    changeReason: "PET-CT isotope supply failure — appointment cancelled with admin approval",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30034",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5260",
    patientId: "UHID-4099",
    patientName: "Savita Kumari",
    visitId: "VIS-8819",
    modality: "USG",
    testName: "USG Kidney",
    appointmentDate: "2025-02-24",
    appointmentTime: "14:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Date, Appointment Time",
    beforeValue: '{ "date": "2025-02-17", "time": "11:00" }',
    afterValue: '{ "date": "2025-02-24", "time": "14:00" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 13:10:00",
    ipAddress: "192.168.1.21",
    changeReason: "Patient requested week extension — awaiting lab results before scan",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30035",
    eventType: "Appointment Created",
    appointmentId: "APPT-5515",
    patientId: "UHID-4514",
    patientName: "Prakash Iyer",
    visitId: "VIS-8820",
    modality: "CT",
    testName: "CT Spine Lumbar",
    appointmentDate: "2025-02-22",
    appointmentTime: "11:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Referral",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-22", "time": "11:00", "modality": "CT" }',
    changedByUserId: "USR-CC-001",
    changedByRole: "Call Center Agent",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-14 15:30:00",
    ipAddress: "192.168.2.50",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 17 ──────────────────────────────────────────
  {
    auditId: "APT-30036",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5070",
    patientId: "UHID-2780",
    patientName: "Usha Prabhu",
    visitId: "VIS-5950",
    modality: "MRI",
    testName: "MRI Brain Epilepsy Protocol",
    appointmentDate: "2025-02-19",
    appointmentTime: "10:00",
    slotDurationMin: 60,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Pending",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-19", "time": "10:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Payment not received — auto-cancelled" }',
    changedByUserId: "SYS-AUTO",
    changedByRole: "System",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 09:00:00",
    ipAddress: "127.0.0.1",
    changeReason: "No payment confirmation within 48 hours — system auto-cancelled",
    systemTriggered: true,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30037",
    eventType: "Appointment Created",
    appointmentId: "APPT-5516",
    patientId: "UHID-4515",
    patientName: "Venkat Subramanian",
    visitId: "VIS-8821",
    modality: "X-Ray",
    testName: "X-Ray Chest PA + Lateral",
    appointmentDate: "2025-02-24",
    appointmentTime: "09:00",
    slotDurationMin: 15,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: null,
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-24", "time": "09:00", "modality": "X-Ray" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-17 10:15:00",
    ipAddress: "192.168.3.5",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30038",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5420",
    patientId: "UHID-3321",
    patientName: "Leela Rao",
    visitId: "VIS-8822",
    modality: "CT",
    testName: "CT Abdomen Triple Phase",
    appointmentDate: "2025-02-26",
    appointmentTime: "08:00",
    slotDurationMin: 45,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "Appointment Date, Appointment Time, Priority",
    beforeValue: '{ "date": "2025-02-20", "time": "14:00", "priority": "Routine" }',
    afterValue: '{ "date": "2025-02-26", "time": "08:00", "priority": "Urgent" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 11:30:00",
    ipAddress: "192.168.1.10",
    changeReason: "Referring physician upgraded urgency — earliest available slot assigned",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30039",
    eventType: "Appointment Updated",
    appointmentId: "APPT-5360",
    patientId: "UHID-4516",
    patientName: "Karthik Srinivasan",
    visitId: "VIS-8823",
    modality: "USG",
    testName: "USG Scrotum",
    appointmentDate: "2025-02-21",
    appointmentTime: "11:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "Radiologist Assigned",
    beforeValue: '{ "radiologist": null }',
    afterValue: '{ "radiologist": "Dr. Anand Pillai" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 14:00:00",
    ipAddress: "192.168.1.22",
    changeReason: "Radiologist assignment completed after slot allocation",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30040",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5025",
    patientId: "UHID-2555",
    patientName: "Padma Nair",
    visitId: "VIS-8824",
    modality: "MRI",
    testName: "MRI Breast Bilateral",
    appointmentDate: "2025-02-19",
    appointmentTime: "09:00",
    slotDurationMin: 60,
    priority: "Routine",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-19", "time": "09:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Implant contraindication identified" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-17 15:30:00",
    ipAddress: "192.168.2.10",
    changeReason: "MRI contraindicated — metallic implant found during screening",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 19 ──────────────────────────────────────────
  {
    auditId: "APT-30041",
    eventType: "Appointment Created",
    appointmentId: "APPT-5517",
    patientId: "UHID-4517",
    patientName: "Bhavna Chouhan",
    visitId: "VIS-8825",
    modality: "Mammography",
    testName: "3D Tomosynthesis",
    appointmentDate: "2025-02-26",
    appointmentTime: "10:00",
    slotDurationMin: 30,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-26", "time": "10:00", "modality": "Mammography" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 09:00:00",
    ipAddress: "192.168.1.21",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30042",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5280",
    patientId: "UHID-1432",
    patientName: "Dinesh Mohan",
    visitId: "VIS-6400",
    modality: "PET-CT",
    testName: "PET-CT Prostate",
    appointmentDate: "2025-02-28",
    appointmentTime: "08:00",
    slotDurationMin: 90,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "Appointment Date",
    beforeValue: '{ "date": "2025-02-22" }',
    afterValue: '{ "date": "2025-02-28" }',
    changedByUserId: "USR-ADM-002",
    changedByRole: "Facility Admin",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-19 10:00:00",
    ipAddress: "192.168.3.10",
    changeReason: "Isotope preparation delay — appointment moved by 6 days",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30043",
    eventType: "Appointment Updated",
    appointmentId: "APPT-5440",
    patientId: "UHID-3890",
    patientName: "Hema Malini",
    visitId: "VIS-7920",
    modality: "CT",
    testName: "CT Chest Lung HRCT",
    appointmentDate: "2025-02-23",
    appointmentTime: "10:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Payment Status",
    beforeValue: '{ "paymentStatus": "Pending" }',
    afterValue: '{ "paymentStatus": "Paid" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 11:30:00",
    ipAddress: "192.168.1.20",
    changeReason: "Payment collected in advance at counter",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30044",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5012",
    patientId: "UHID-4518",
    patientName: "Jyoti Patel",
    visitId: "VIS-8826",
    modality: "USG",
    testName: "USG Follicular Study",
    appointmentDate: "2025-02-21",
    appointmentTime: "08:30",
    slotDurationMin: 15,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-21", "time": "08:30" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Patient no confirmation — no-show window exceeded" }',
    changedByUserId: "SYS-AUTO",
    changedByRole: "System",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-19 13:00:00",
    ipAddress: "127.0.0.1",
    changeReason: "Auto-cancelled — no-show window exceeded, patient did not confirm",
    systemTriggered: true,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30045",
    eventType: "Appointment Created",
    appointmentId: "APPT-5518",
    patientId: "UHID-2100",
    patientName: "Santosh Hegde",
    visitId: "VIS-8827",
    modality: "MRI",
    testName: "MRI Prostate Multiparametric",
    appointmentDate: "2025-02-27",
    appointmentTime: "08:00",
    slotDurationMin: 60,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-27", "time": "08:00", "modality": "MRI", "priority": "Urgent" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 15:00:00",
    ipAddress: "192.168.1.22",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 22 ──────────────────────────────────────────
  {
    auditId: "APT-30046",
    eventType: "Appointment Created",
    appointmentId: "APPT-5519",
    patientId: "UHID-4519",
    patientName: "Rohan Saxena",
    visitId: "VIS-8828",
    modality: "X-Ray",
    testName: "X-Ray Shoulder AP View",
    appointmentDate: "2025-02-26",
    appointmentTime: "14:00",
    slotDurationMin: 10,
    priority: "Routine",
    bookingSource: "Walk-in",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: null,
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-02-26", "time": "14:00", "modality": "X-Ray" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 09:00:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30047",
    eventType: "Appointment Rescheduled",
    appointmentId: "APPT-5480",
    patientId: "UHID-3600",
    patientName: "Indira Thomas",
    visitId: "VIS-7300",
    modality: "USG",
    testName: "USG Liver + Spleen",
    appointmentDate: "2025-03-02",
    appointmentTime: "09:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Call Center",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Kavita Sharma",
    changedFields: "Appointment Date",
    beforeValue: '{ "date": "2025-02-24" }',
    afterValue: '{ "date": "2025-03-02" }',
    changedByUserId: "USR-CC-001",
    changedByRole: "Call Center Agent",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-22 10:05:00",
    ipAddress: "192.168.2.50",
    changeReason: "Patient travelling — rescheduled on patient request",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30048",
    eventType: "Appointment Updated",
    appointmentId: "APPT-5540",
    patientId: "UHID-2877",
    patientName: "Sunil Deshpande",
    visitId: "VIS-8829",
    modality: "CT",
    testName: "CT Angiography Brain",
    appointmentDate: "2025-02-27",
    appointmentTime: "13:00",
    slotDurationMin: 30,
    priority: "Urgent",
    bookingSource: "Referral",
    paymentStatus: "Paid",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "Priority, Appointment Time",
    beforeValue: '{ "priority": "Routine", "time": "15:00" }',
    afterValue: '{ "priority": "Urgent", "time": "13:00" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 11:30:00",
    ipAddress: "192.168.1.10",
    changeReason: "Neurologist escalated to urgent — earlier slot allocated",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30049",
    eventType: "Appointment Cancelled",
    appointmentId: "APPT-5005",
    patientId: "UHID-4520",
    patientName: "Varsha Gaikwad",
    visitId: "VIS-8830",
    modality: "MRI",
    testName: "MRI Abdomen MRCP",
    appointmentDate: "2025-02-25",
    appointmentTime: "09:00",
    slotDurationMin: 60,
    priority: "Routine",
    bookingSource: "Online",
    paymentStatus: "Paid",
    appointmentStatus: "Cancelled",
    radiologistAssigned: "Dr. Anand Pillai",
    changedFields: "Appointment Status",
    beforeValue: '{ "status": "Scheduled", "date": "2025-02-25", "time": "09:00" }',
    afterValue: '{ "status": "Cancelled", "cancellationReason": "Patient opted for surgery — scan no longer required" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 13:00:00",
    ipAddress: "192.168.1.21",
    changeReason: "Patient opted for surgical intervention — pre-op scan no longer needed",
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "APT-30050",
    eventType: "Appointment Created",
    appointmentId: "APPT-5520",
    patientId: "UHID-1770",
    patientName: "Girish Patil",
    visitId: "VIS-8831",
    modality: "CT",
    testName: "CT Coronary Calcium Score",
    appointmentDate: "2025-03-03",
    appointmentTime: "08:00",
    slotDurationMin: 20,
    priority: "Routine",
    bookingSource: "Referral",
    paymentStatus: "Pending",
    appointmentStatus: "Scheduled",
    radiologistAssigned: "Dr. Ramesh Iyer",
    changedFields: "All fields (new appointment)",
    beforeValue: null,
    afterValue: '{ "date": "2025-03-03", "time": "08:00", "modality": "CT" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 15:30:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    systemTriggered: false,
    status: "Success",
    failureReason: null,
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Main Component ───────────────────────────────────────────────────────────

export function AppointmentAuditLogs() {
  const logs = mockApptAuditLogs;

  // --- Filter state ---
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [modalityFilter, setModalityFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [systemTriggeredFilter, setSystemTriggeredFilter] = React.useState("all");
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
  const [selectedLog, setSelectedLog] = React.useState<ApptAuditLog | null>(null);
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
    const created = logs.filter((l) => l.eventType === "Appointment Created").length;
    const rescheduled = logs.filter((l) => l.eventType === "Appointment Rescheduled").length;
    const cancelled = logs.filter((l) => l.eventType === "Appointment Cancelled").length;
    const failed = logs.filter((l) => l.status === "Failed").length;
    return { total, created, rescheduled, cancelled, failed };
  }, [logs]);

  // --- Filtered logs ---
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const sq = searchFilter.toLowerCase();
      const matchesSearch =
        !sq ||
        log.auditId.toLowerCase().includes(sq) ||
        log.patientId.toLowerCase().includes(sq) ||
        log.patientName.toLowerCase().includes(sq) ||
        log.changedByUserId.toLowerCase().includes(sq);

      const matchesEventType = eventTypeFilter === "all" || log.eventType === eventTypeFilter;
      const matchesModality = modalityFilter === "all" || log.modality === modalityFilter;
      const matchesPriority = priorityFilter === "all" || log.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || log.status === statusFilter;
      const matchesFacility = facilityFilter === "all" || log.facilityId === facilityFilter;
      const matchesSystemTriggered =
        systemTriggeredFilter === "all" ||
        (systemTriggeredFilter === "yes" && log.systemTriggered) ||
        (systemTriggeredFilter === "no" && !log.systemTriggered);

      const logDate = new Date(log.changeTimestamp);
      const matchesDate =
        logDate >= startOfDay(dateRange.from) && logDate <= endOfDay(dateRange.to);

      return (
        matchesSearch &&
        matchesEventType &&
        matchesModality &&
        matchesPriority &&
        matchesStatus &&
        matchesFacility &&
        matchesSystemTriggered &&
        matchesDate
      );
    });
  }, [
    logs, searchFilter, eventTypeFilter, modalityFilter, priorityFilter,
    statusFilter, facilityFilter, systemTriggeredFilter, dateRange,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => { setCurrentPage(1); }, [
    searchFilter, eventTypeFilter, modalityFilter, priorityFilter,
    statusFilter, facilityFilter, systemTriggeredFilter, dateRange,
  ]);

  const hasActiveFilters =
    eventTypeFilter !== "all" || modalityFilter !== "all" || priorityFilter !== "all" ||
    statusFilter !== "all" || facilityFilter !== "all" ||
    systemTriggeredFilter !== "all";

  const clearAllFilters = () => {
    setEventTypeFilter("all"); setModalityFilter("all"); setPriorityFilter("all");
    setStatusFilter("all"); setFacilityFilter("all");
    setSystemTriggeredFilter("all"); setSearchFilter("");
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
  const getEventTypeBadge = (et: ApptEventType) => {
    switch (et) {
      case "Appointment Created":
        return (
          <Badge variant="default">
            <CalendarPlus className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Created
          </Badge>
        );
      case "Appointment Updated":
        return (
          <Badge variant="secondary">
            <CalendarCheck className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Updated
          </Badge>
        );
      case "Appointment Rescheduled":
        return (
          <Badge variant="outline">
            <CalendarClock className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Rescheduled
          </Badge>
        );
      case "Appointment Cancelled":
        return (
          <Badge variant="destructive">
            <CalendarX className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Cancelled
          </Badge>
        );
    }
  };

  const getPriorityBadge = (p: Priority) => {
    if (p === "VIP") return <Badge variant="default">VIP</Badge>;
    if (p === "Urgent") return <Badge variant="destructive">Urgent</Badge>;
    return <Badge variant="outline">Routine</Badge>;
  };

  const getPaymentStatusBadge = (ps: "Paid" | "Pending") => {
    if (ps === "Paid") return <Badge variant="default">Paid</Badge>;
    return <Badge variant="outline">Pending</Badge>;
  };

  const getApptStatusBadge = (s: AppointmentStatus) => {
    switch (s) {
      case "Scheduled": return <Badge variant="secondary">Scheduled</Badge>;
      case "Completed": return <Badge variant="default">Completed</Badge>;
      case "Cancelled": return <Badge variant="destructive">Cancelled</Badge>;
      case "No-Show":   return <Badge variant="outline">No-Show</Badge>;
    }
  };

  const getStatusCell = (status: ApptStatus) => {
    if (status === "Success") {
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
        title="Appointment Audit Logs"
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
              description="All appointment events"
              icon={ClipboardList}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Appointments Created"
              value={stats.created}
              description="New bookings"
              icon={CalendarPlus}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Rescheduled"
              value={stats.rescheduled}
              description="Date / time changes"
              icon={CalendarClock}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Cancelled"
              value={stats.cancelled}
              description="All cancellations"
              icon={CalendarX}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-destructive"
            />
            <StatCard
              title="Failed Operations"
              value={stats.failed}
              description="Rejected / slot conflicts"
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
                        placeholder="Search by UHID, patient name, changed by, audit ID"
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
                    <SelectTrigger className="h-8 w-48 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Appointment Created">Created</SelectItem>
                      <SelectItem value="Appointment Updated">Updated</SelectItem>
                      <SelectItem value="Appointment Rescheduled">Rescheduled</SelectItem>
                      <SelectItem value="Appointment Cancelled">Cancelled</SelectItem>
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

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="Routine">Routine</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={systemTriggeredFilter} onValueChange={setSystemTriggeredFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="System Triggered" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Triggers</SelectItem>
                      <SelectItem value="yes">System Triggered</SelectItem>
                      <SelectItem value="no">User Triggered</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
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
                      <SelectItem value="FAC-004">FAC-004</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Patient UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Visit ID</TableHead>
                    <TableHead className="whitespace-nowrap">Modality</TableHead>
                    <TableHead className="whitespace-nowrap">Test Name</TableHead>
                    <TableHead className="whitespace-nowrap">Appt Date</TableHead>
                    <TableHead className="whitespace-nowrap">Appt Time</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Slot (min)</TableHead>
                    <TableHead className="whitespace-nowrap">Priority</TableHead>
                    <TableHead className="whitespace-nowrap">Payment Status</TableHead>
                    <TableHead className="whitespace-nowrap">Appt Status</TableHead>
                    <TableHead className="whitespace-nowrap">Changed Fields</TableHead>
                    <TableHead className="whitespace-nowrap">Before Value</TableHead>
                    <TableHead className="whitespace-nowrap">After Value</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By (UHID)</TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="whitespace-nowrap">Change Reason</TableHead>
                    <TableHead className="whitespace-nowrap">System Triggered</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => (
                      <TableRow
                        key={log.auditId}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.auditId}</TableCell>
                        <TableCell className="whitespace-nowrap">{getEventTypeBadge(log.eventType)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.patientId}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.visitId ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="secondary" className="roboto-mono text-xs tabular-nums">{log.modality}</Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-[160px] truncate" title={log.testName}>{log.testName}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.appointmentDate}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.appointmentTime}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap text-right">{log.slotDurationMin}</TableCell>
                        <TableCell className="whitespace-nowrap">{getPriorityBadge(log.priority)}</TableCell>
                        <TableCell className="whitespace-nowrap">{getPaymentStatusBadge(log.paymentStatus)}</TableCell>
                        <TableCell className="whitespace-nowrap">{getApptStatusBadge(log.appointmentStatus)}</TableCell>
                        <TableCell className="text-sm max-w-[140px] truncate" title={log.changedFields}>{log.changedFields}</TableCell>
                        <TableCell className="max-w-[120px]">
                          {log.beforeValue ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="roboto-mono text-xs tabular-nums text-muted-foreground truncate block cursor-default max-w-[120px]">
                                  {log.beforeValue}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                sideOffset={6}
                                className="max-w-[360px] p-0 overflow-hidden"
                              >
                                <pre className="roboto-mono text-xs tabular-nums p-3 whitespace-pre-wrap break-all leading-relaxed">
                                  {(() => { try { return JSON.stringify(JSON.parse(log.beforeValue), null, 2); } catch { return log.beforeValue; } })()}
                                </pre>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[120px]">
                          {log.afterValue ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="roboto-mono text-xs tabular-nums text-muted-foreground truncate block cursor-default max-w-[120px]">
                                  {log.afterValue}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                sideOffset={6}
                                className="max-w-[360px] p-0 overflow-hidden"
                              >
                                <pre className="roboto-mono text-xs tabular-nums p-3 whitespace-pre-wrap break-all leading-relaxed">
                                  {(() => { try { return JSON.stringify(JSON.parse(log.afterValue), null, 2); } catch { return log.afterValue; } })()}
                                </pre>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.changedByUserId}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.changedByRole}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.changeTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.ipAddress}</TableCell>
                        <TableCell className="text-sm max-w-[160px] truncate" title={log.changeReason ?? ""}>
                          {log.changeReason ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {log.systemTriggered ? (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Cpu className="size-3.5" strokeWidth={ICON_STROKE_WIDTH} />
                              <span className="text-xs">Auto</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">User</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getStatusCell(log.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={22}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <CalendarX className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">No appointment audit logs found matching your criteria</p>
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

            {/* Compliance notice */}
            
          </Card>
        </div>
      </div>

      {/* Detail Dialog — all 13 system-captured + core appointment fields */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Appointment Audit Record Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">
                  {selectedLog.auditId}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>Complete appointment audit record — read-only, immutable</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow label="Event Type" value={getEventTypeBadge(selectedLog.eventType)} />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Patient Name" value={selectedLog.patientName} />
              <DetailRow label="Visit ID" value={selectedLog.visitId} mono />
              <DetailRow label="Modality" value={<Badge variant="secondary" className="roboto-mono text-xs tabular-nums">{selectedLog.modality}</Badge>} />
              <DetailRow label="Test Name" value={selectedLog.testName} />
              <DetailRow label="Appointment Date" value={selectedLog.appointmentDate} mono />
              <DetailRow label="Appointment Time" value={selectedLog.appointmentTime} mono />
              <DetailRow label="Slot Duration" value={`${selectedLog.slotDurationMin} min`} mono />
              <DetailRow label="Priority" value={getPriorityBadge(selectedLog.priority)} />
              <DetailRow label="Booking Source" value={selectedLog.bookingSource} />
              <DetailRow label="Payment Status" value={selectedLog.paymentStatus} />
              <DetailRow label="Appointment Status" value={selectedLog.appointmentStatus} />
              <DetailRow label="Radiologist Assigned" value={selectedLog.radiologistAssigned} />
              <DetailRow label="Changed Fields" value={selectedLog.changedFields} />
              <DetailRow label="Before Value" value={
                selectedLog.beforeValue
                  ? <span className="roboto-mono text-xs tabular-nums text-muted-foreground break-all">{selectedLog.beforeValue}</span>
                  : null
              } />
              <DetailRow label="After Value" value={
                selectedLog.afterValue
                  ? <span className="roboto-mono text-xs tabular-nums break-all">{selectedLog.afterValue}</span>
                  : null
              } />
              <DetailRow label="Changed By (UHID)" value={selectedLog.changedByUserId} mono />
              <DetailRow label="Changed By Role" value={selectedLog.changedByRole} />
              <DetailRow label="Facility ID" value={selectedLog.facilityId} mono />
              <DetailRow label="Change Timestamp" value={formatTimestamp(selectedLog.changeTimestamp)} mono />
              <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
              <DetailRow label="Change Reason" value={selectedLog.changeReason} />
              <DetailRow label="System Triggered" value={
                selectedLog.systemTriggered
                  ? <div className="flex items-center gap-1.5 text-muted-foreground"><Cpu className="size-4" strokeWidth={ICON_STROKE_WIDTH} /><span>Yes — Auto</span></div>
                  : "No — User action"
              } />
              <DetailRow label="Status" value={getStatusCell(selectedLog.status)} />
              <DetailRow label="Failure Reason" value={
                selectedLog.failureReason
                  ? <span className="text-destructive">{selectedLog.failureReason}</span>
                  : null
              } />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Logs Sheet */}
      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Export Logs</SheetTitle>
            <SheetDescription>Generate and download compliance reports from immutable appointment audit log data.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default AppointmentAuditLogs;
