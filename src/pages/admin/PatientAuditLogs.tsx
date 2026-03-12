// @refresh reset
import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  UserPlus,
  UserCheck,
  FilePen,
  Fingerprint,
  Calendar,
  Users,
  AlertTriangle,
  ClipboardList,
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
 * PATIENT CREATION & EDITS AUDIT LOG — Story 4
 *
 * SCOPE:
 * ✔ New patient registration
 * ✔ Edits to patient demographic details
 * ✔ Edits to identifiers (UHID, ABHA, MRN)
 *
 * EXCLUDED: Appointment edits (separate audit)
 *
 * DATA INTEGRITY:
 * - Audit logs are immutable
 * - Before & After snapshot mandatory for updates
 * - Server-side timestamp only
 * - Sensitive identifiers masked in audit view
 *
 * COMPLIANCE:
 * - Supports NABH record traceability
 * - Aligns with ABDM data governance
 * - Meets healthcare audit requirements
 * - Enables medico-legal investigation
 *
 * NON-FUNCTIONAL:
 * - Audit retrieval ≤ 3 seconds
 * - Retention: 7–10 years
 * - Export: CSV / PDF
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/patient - List logs with pagination
 * - Query params: patientId, changedBy, eventType, status, facilityId, dateFrom, dateTo
 * - GET /api/admin/audit-logs/patient/export - Export logs as CSV/PDF
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type EventType =
  | "Patient Created"
  | "Patient Details Updated"
  | "Patient Identifier Updated";

type ChangeStatus = "Success" | "Failed";

type ChangedByRole =
  | "Front Desk"
  | "Radiology Coordinator"
  | "Facility Admin"
  | "Super Admin";

interface PatientAuditLog {
  auditId: string;
  eventType: EventType;
  patientId: string;
  patientName: string;
  changedFields: string;
  beforeValue: string | null;
  afterValue: string | null;
  changedByUserId: string;
  changedByRole: ChangedByRole;
  facilityId: string;
  changeTimestamp: string;
  ipAddress: string;
  changeReason: string | null;
  status: ChangeStatus;
  failureReason: string | null;
}

// ─── Mock Data (50 records) ───────────────────────────────────────────────────

const mockPatientAuditLogs: PatientAuditLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "PAT-20001",
    eventType: "Patient Created",
    patientId: "UHID-4501",
    patientName: "Arjun Mehta",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Arjun Mehta", "gender": "Male", "dob": "1985-03-12", "mobile": "9876543210" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 08:45:22",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20002",
    eventType: "Patient Created",
    patientId: "UHID-4502",
    patientName: "Priya Sharma",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Email",
    beforeValue: null,
    afterValue: '{ "name": "Priya Sharma", "gender": "Female", "dob": "1992-07-25", "mobile": "9988112233", "email": "priya.sharma@email.com" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 09:15:44",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20003",
    eventType: "Patient Details Updated",
    patientId: "UHID-3892",
    patientName: "Ramesh Nair",
    changedFields: "Mobile Number",
    beforeValue: '{ "mobile": "9876500001" }',
    afterValue: '{ "mobile": "9123456789" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 10:30:05",
    ipAddress: "192.168.1.21",
    changeReason: "Patient reported number change",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20004",
    eventType: "Patient Details Updated",
    patientId: "UHID-2201",
    patientName: "Sunita Verma",
    changedFields: "Address, City, Pincode",
    beforeValue: '{ "address": "12 MG Road, Delhi", "city": "Delhi", "pincode": "110001" }',
    afterValue: '{ "address": "45 Lajpat Nagar, Delhi", "city": "Delhi", "pincode": "110024" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 11:00:00",
    ipAddress: "192.168.1.22",
    changeReason: "Patient updated address at reception",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20005",
    eventType: "Patient Identifier Updated",
    patientId: "UHID-3310",
    patientName: "Mohammed Ansari",
    changedFields: "ABHA ID",
    beforeValue: '{ "abhaId": null }',
    afterValue: '{ "abhaId": "91-2345-6789-0123" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-01 12:45:30",
    ipAddress: "192.168.2.10",
    changeReason: "ABHA ID linked by patient request",
    status: "Success",
    failureReason: null,
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "PAT-20006",
    eventType: "Patient Created",
    patientId: "UHID-4503",
    patientName: "Kavitha Rajan",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Address",
    beforeValue: null,
    afterValue: '{ "name": "Kavitha Rajan", "gender": "Female", "dob": "1978-11-04", "mobile": "9900112233" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 08:30:10",
    ipAddress: "192.168.1.21",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20007",
    eventType: "Patient Created",
    patientId: "UHID-4504",
    patientName: "Deepak Joshi",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Deepak Joshi", "gender": "Male", "dob": "2003-01-15", "mobile": "9812345678", "guardianName": "Suresh Joshi" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 09:10:22",
    ipAddress: "192.168.1.20",
    changeReason: "Minor patient — guardian recorded",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20008",
    eventType: "Patient Details Updated",
    patientId: "UHID-1105",
    patientName: "Anita Krishnan",
    changedFields: "Email",
    beforeValue: '{ "email": null }',
    afterValue: '{ "email": "anita.k@gmail.com" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 10:00:00",
    ipAddress: "192.168.1.22",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20009",
    eventType: "Patient Details Updated",
    patientId: "UHID-3012",
    patientName: "Sanjay Pillai",
    changedFields: "Gender",
    beforeValue: '{ "gender": "Male" }',
    afterValue: '{ "gender": "Other" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-03 11:30:00",
    ipAddress: "192.168.2.10",
    changeReason: "Patient requested gender correction",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20010",
    eventType: "Patient Created",
    patientId: "UHID-4505",
    patientName: "Rekha Singh",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Rekha Singh", "gender": "Female", "dob": "1965-06-30", "mobile": "9711223344" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-03 14:00:00",
    ipAddress: "192.168.3.5",
    changeReason: null,
    status: "Failed",
    failureReason: "Duplicate detected: same Mobile + DOB as UHID-2890",
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "PAT-20011",
    eventType: "Patient Created",
    patientId: "UHID-4506",
    patientName: "Vikram Chandra",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, ABHA ID",
    beforeValue: null,
    afterValue: '{ "name": "Vikram Chandra", "gender": "Male", "dob": "1990-09-09", "mobile": "9823456789", "abhaId": "14-5678-9012-3456" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 08:55:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20012",
    eventType: "Patient Details Updated",
    patientId: "UHID-2456",
    patientName: "Geeta Menon",
    changedFields: "Date of Birth",
    beforeValue: '{ "dob": "1980-04-20" }',
    afterValue: '{ "dob": "1980-04-22" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 10:15:00",
    ipAddress: "192.168.1.10",
    changeReason: "DOB corrected as per original ID document",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20013",
    eventType: "Patient Identifier Updated",
    patientId: "UHID-1890",
    patientName: "Harish Iyer",
    changedFields: "Aadhaar (Masked)",
    beforeValue: '{ "aadhaar": "XXXX-XXXX-1234" }',
    afterValue: '{ "aadhaar": "XXXX-XXXX-5678" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 11:45:00",
    ipAddress: "192.168.1.10",
    changeReason: "Aadhaar correction — original entry error",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20014",
    eventType: "Patient Details Updated",
    patientId: "UHID-3345",
    patientName: "Fatima Shaikh",
    changedFields: "Guardian Name",
    beforeValue: '{ "guardianName": "Ahmed Shaikh" }',
    afterValue: '{ "guardianName": "Zainab Shaikh" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-05 13:00:00",
    ipAddress: "192.168.2.11",
    changeReason: "Guardian changed — mother to accompany patient",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20015",
    eventType: "Patient Created",
    patientId: "UHID-4507",
    patientName: "Suresh Babu",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Address, City, State",
    beforeValue: null,
    afterValue: '{ "name": "Suresh Babu", "gender": "Male", "dob": "1972-12-01", "mobile": "9844332211", "city": "Chennai", "state": "Tamil Nadu" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-05 15:30:00",
    ipAddress: "192.168.3.5",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 07 ──────────────────────────────────────────
  {
    auditId: "PAT-20016",
    eventType: "Patient Details Updated",
    patientId: "UHID-2789",
    patientName: "Nisha Kapoor",
    changedFields: "Mobile Number, Email",
    beforeValue: '{ "mobile": "9876001122", "email": null }',
    afterValue: '{ "mobile": "9999887766", "email": "nisha.k@email.com" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 09:00:00",
    ipAddress: "192.168.1.20",
    changeReason: "Patient updated contact details",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20017",
    eventType: "Patient Created",
    patientId: "UHID-4508",
    patientName: "Arun Prakash",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Arun Prakash", "gender": "Male", "dob": "1998-05-17", "mobile": "9655443322" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-07 10:20:00",
    ipAddress: "192.168.2.12",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20018",
    eventType: "Patient Details Updated",
    patientId: "UHID-1234",
    patientName: "Meena Pillai",
    changedFields: "Patient Status",
    beforeValue: '{ "status": "Active" }',
    afterValue: '{ "status": "Inactive" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 11:30:00",
    ipAddress: "192.168.1.10",
    changeReason: "Patient deceased — record deactivated",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20019",
    eventType: "Patient Identifier Updated",
    patientId: "UHID-3789",
    patientName: "Ravi Kumar",
    changedFields: "ABHA ID",
    beforeValue: '{ "abhaId": "22-3456-7890-1234" }',
    afterValue: '{ "abhaId": null }',
    changedByUserId: "USR-ADM-002",
    changedByRole: "Facility Admin",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-07 13:00:00",
    ipAddress: "192.168.2.10",
    changeReason: "ABHA unlinked by patient request",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20020",
    eventType: "Patient Details Updated",
    patientId: "UHID-2010",
    patientName: "Lalitha Devi",
    changedFields: "First Name",
    beforeValue: '{ "firstName": "Lalita" }',
    afterValue: '{ "firstName": "Lalitha" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 15:00:00",
    ipAddress: "192.168.1.21",
    changeReason: "Name spelling correction as per ID proof",
    status: "Success",
    failureReason: null,
  },
  // ── Feb 10 ──────────────────────────────────────────
  {
    auditId: "PAT-20021",
    eventType: "Patient Created",
    patientId: "UHID-4509",
    patientName: "Pooja Desai",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Email, Address",
    beforeValue: null,
    afterValue: '{ "name": "Pooja Desai", "gender": "Female", "dob": "1995-08-20", "mobile": "9811223344" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 08:40:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20022",
    eventType: "Patient Details Updated",
    patientId: "UHID-3100",
    patientName: "Kiran Shah",
    changedFields: "Address, Pincode, City",
    beforeValue: '{ "address": "8 Ring Road, Ahmedabad", "pincode": "380001", "city": "Ahmedabad" }',
    afterValue: '{ "address": "22 Navrangpura, Ahmedabad", "pincode": "380009", "city": "Ahmedabad" }',
    changedByUserId: "USR-RC-002",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-10 09:50:00",
    ipAddress: "192.168.3.6",
    changeReason: "Patient shifted residence",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20023",
    eventType: "Patient Created",
    patientId: "UHID-4510",
    patientName: "Tarun Bose",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Tarun Bose", "gender": "Male", "dob": "1988-02-14", "mobile": "9733221100" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-10 10:30:00",
    ipAddress: "192.168.2.12",
    changeReason: null,
    status: "Failed",
    failureReason: "Mandatory field missing: Gender",
  },
  {
    auditId: "PAT-20024",
    eventType: "Patient Identifier Updated",
    patientId: "UHID-2345",
    patientName: "Sudha Rao",
    changedFields: "ABHA ID",
    beforeValue: '{ "abhaId": null }',
    afterValue: '{ "abhaId": "56-7890-1234-5678" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 12:00:00",
    ipAddress: "192.168.1.21",
    changeReason: "ABHA enrolment completed",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20025",
    eventType: "Patient Details Updated",
    patientId: "UHID-1678",
    patientName: "Naresh Gupta",
    changedFields: "Mobile Number",
    beforeValue: '{ "mobile": "9845671234" }',
    afterValue: '{ "mobile": "9900012345" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 14:15:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 12 ──────────────────────────────────────────
  {
    auditId: "PAT-20026",
    eventType: "Patient Created",
    patientId: "UHID-4511",
    patientName: "Amrita Sood",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, ABHA ID",
    beforeValue: null,
    afterValue: '{ "name": "Amrita Sood", "gender": "Female", "dob": "1982-10-05", "mobile": "9855443322", "abhaId": "78-9012-3456-7890" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-12 08:30:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20027",
    eventType: "Patient Details Updated",
    patientId: "UHID-2900",
    patientName: "Balaji Reddy",
    changedFields: "Patient Status",
    beforeValue: '{ "status": "Inactive" }',
    afterValue: '{ "status": "Active" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-12 09:45:00",
    ipAddress: "192.168.1.10",
    changeReason: "Patient reactivated after long-term absence",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20028",
    eventType: "Patient Created",
    patientId: "UHID-4512",
    patientName: "Sheela Nambiar",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Guardian Name",
    beforeValue: null,
    afterValue: '{ "name": "Sheela Nambiar", "gender": "Female", "dob": "2010-03-22", "mobile": "9766554433", "guardianName": "Prakash Nambiar" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-12 11:00:00",
    ipAddress: "192.168.2.11",
    changeReason: "Minor patient — guardian recorded",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20029",
    eventType: "Patient Identifier Updated",
    patientId: "UHID-3456",
    patientName: "Chetan Bhatt",
    changedFields: "Aadhaar (Masked)",
    beforeValue: '{ "aadhaar": "XXXX-XXXX-9999" }',
    afterValue: '{ "aadhaar": "XXXX-XXXX-0011" }',
    changedByUserId: "USR-ADM-002",
    changedByRole: "Facility Admin",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-12 13:30:00",
    ipAddress: "192.168.2.10",
    changeReason: "Aadhaar updated — previous entry was incorrect",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20030",
    eventType: "Patient Details Updated",
    patientId: "UHID-1980",
    patientName: "Divya Krishnamurthy",
    changedFields: "Last Name",
    beforeValue: '{ "lastName": "Krishnamurthy" }',
    afterValue: '{ "lastName": "Venkatesh" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-12 15:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Surname change after marriage",
    status: "Success",
    failureReason: null,
  },
  // ── Feb 14 ──────────────────────────────────────────
  {
    auditId: "PAT-20031",
    eventType: "Patient Created",
    patientId: "UHID-4513",
    patientName: "Mahesh Trivedi",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Mahesh Trivedi", "gender": "Male", "dob": "1975-01-28", "mobile": "9844221100" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-14 08:20:00",
    ipAddress: "192.168.3.5",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20032",
    eventType: "Patient Details Updated",
    patientId: "UHID-2200",
    patientName: "Anjali Bhat",
    changedFields: "Email, Mobile Number",
    beforeValue: '{ "email": "anjali.old@email.com", "mobile": "9877665544" }',
    afterValue: '{ "email": "anjali.bhat@gmail.com", "mobile": "9912345678" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 10:00:00",
    ipAddress: "192.168.1.20",
    changeReason: "Patient updated contact details",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20033",
    eventType: "Patient Identifier Updated",
    patientId: "UHID-1560",
    patientName: "Ramakrishnan Pillai",
    changedFields: "ABHA ID",
    beforeValue: '{ "abhaId": null }',
    afterValue: '{ "abhaId": "33-4567-8901-2345" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 11:30:00",
    ipAddress: "192.168.1.21",
    changeReason: "ABHA linkage — patient enrolled at facility",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20034",
    eventType: "Patient Details Updated",
    patientId: "UHID-4099",
    patientName: "Savita Kumari",
    changedFields: "Date of Birth",
    beforeValue: '{ "dob": "1970-06-15" }',
    afterValue: '{ "dob": "1970-06-18" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 13:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "DOB corrected as per Aadhaar document",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20035",
    eventType: "Patient Created",
    patientId: "UHID-4514",
    patientName: "Prakash Iyer",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Address, ABHA ID",
    beforeValue: null,
    afterValue: '{ "name": "Prakash Iyer", "gender": "Male", "dob": "1993-04-04", "mobile": "9700998877", "abhaId": "44-5678-9012-3456" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-14 15:30:00",
    ipAddress: "192.168.2.12",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  // ── Feb 17 ──────────────────────────────────────────
  {
    auditId: "PAT-20036",
    eventType: "Patient Details Updated",
    patientId: "UHID-2780",
    patientName: "Usha Prabhu",
    changedFields: "Address, City, State, Pincode",
    beforeValue: '{ "address": "7 Shivaji Nagar, Pune", "city": "Pune", "state": "Maharashtra", "pincode": "411005" }',
    afterValue: '{ "address": "14 Kothrud, Pune", "city": "Pune", "state": "Maharashtra", "pincode": "411038" }',
    changedByUserId: "USR-RC-001",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 09:00:00",
    ipAddress: "192.168.1.22",
    changeReason: "Patient relocation",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20037",
    eventType: "Patient Created",
    patientId: "UHID-4515",
    patientName: "Venkat Subramanian",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Venkat Subramanian", "gender": "Male", "dob": "1960-12-12", "mobile": "9866554433" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-17 10:15:00",
    ipAddress: "192.168.3.5",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20038",
    eventType: "Patient Details Updated",
    patientId: "UHID-3321",
    patientName: "Leela Murthy",
    changedFields: "First Name, Last Name",
    beforeValue: '{ "firstName": "Leela", "lastName": "Murthy" }',
    afterValue: '{ "firstName": "Leela", "lastName": "Rao" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 11:45:00",
    ipAddress: "192.168.1.10",
    changeReason: "Name change post marriage — ID document verified",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20039",
    eventType: "Patient Created",
    patientId: "UHID-4516",
    patientName: "Karthik Srinivasan",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Email",
    beforeValue: null,
    afterValue: '{ "name": "Karthik Srinivasan", "gender": "Male", "dob": "2000-07-07", "mobile": "9755443322", "email": "karthik.s@email.com" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 14:00:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20040",
    eventType: "Patient Details Updated",
    patientId: "UHID-2555",
    patientName: "Padma Nair",
    changedFields: "Mobile Number",
    beforeValue: '{ "mobile": "9800112233" }',
    afterValue: '{ "mobile": "9900223344" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-17 15:30:00",
    ipAddress: "192.168.2.12",
    changeReason: null,
    status: "Failed",
    failureReason: "ABHA linked — demographic edit restricted",
  },
  // ── Feb 19 ──────────────────────────────────────────
  {
    auditId: "PAT-20041",
    eventType: "Patient Created",
    patientId: "UHID-4517",
    patientName: "Bhavna Chouhan",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Bhavna Chouhan", "gender": "Female", "dob": "1986-09-14", "mobile": "9822334455" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 08:30:00",
    ipAddress: "192.168.1.21",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20042",
    eventType: "Patient Identifier Updated",
    patientId: "UHID-1432",
    patientName: "Dinesh Mohan",
    changedFields: "ABHA ID",
    beforeValue: '{ "abhaId": "12-3456-7890-0001" }',
    afterValue: '{ "abhaId": null }',
    changedByUserId: "USR-ADM-002",
    changedByRole: "Facility Admin",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-19 10:00:00",
    ipAddress: "192.168.3.6",
    changeReason: "Patient requested ABHA unlink — record error",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20043",
    eventType: "Patient Details Updated",
    patientId: "UHID-3890",
    patientName: "Hema Malini",
    changedFields: "Email",
    beforeValue: '{ "email": "hema.old@email.com" }',
    afterValue: '{ "email": "hema.malini@gmail.com" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 11:30:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20044",
    eventType: "Patient Created",
    patientId: "UHID-4518",
    patientName: "Jyoti Patel",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Address, City",
    beforeValue: null,
    afterValue: '{ "name": "Jyoti Patel", "gender": "Female", "dob": "1991-11-11", "mobile": "9700887766", "city": "Surat" }',
    changedByUserId: "USR-FD-003",
    changedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-19 13:00:00",
    ipAddress: "192.168.3.5",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20045",
    eventType: "Patient Details Updated",
    patientId: "UHID-2100",
    patientName: "Santosh Hegde",
    changedFields: "Date of Birth",
    beforeValue: '{ "dob": "1955-03-01" }',
    afterValue: '{ "dob": "1955-03-10" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 15:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "DOB correction — supporting doc verified",
    status: "Success",
    failureReason: null,
  },
  // ── Feb 22 ──────────────────────────────────────────
  {
    auditId: "PAT-20046",
    eventType: "Patient Created",
    patientId: "UHID-4519",
    patientName: "Rohan Saxena",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile",
    beforeValue: null,
    afterValue: '{ "name": "Rohan Saxena", "gender": "Male", "dob": "2005-06-06", "mobile": "9811009988", "guardianName": "Rakesh Saxena" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 08:45:00",
    ipAddress: "192.168.1.20",
    changeReason: "Minor patient — guardian recorded",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20047",
    eventType: "Patient Details Updated",
    patientId: "UHID-3600",
    patientName: "Indira Thomas",
    changedFields: "Address, Pincode",
    beforeValue: '{ "address": "3 Church Lane, Kochi", "pincode": "682001" }',
    afterValue: '{ "address": "18 Marine Drive, Kochi", "pincode": "682031" }',
    changedByUserId: "USR-RC-002",
    changedByRole: "Radiology Coordinator",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-22 10:00:00",
    ipAddress: "192.168.2.11",
    changeReason: "Address update at follow-up visit",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20048",
    eventType: "Patient Identifier Updated",
    patientId: "UHID-2877",
    patientName: "Sunil Deshpande",
    changedFields: "ABHA ID",
    beforeValue: '{ "abhaId": null }',
    afterValue: '{ "abhaId": "67-8901-2345-6789" }',
    changedByUserId: "USR-FD-002",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 11:30:00",
    ipAddress: "192.168.1.21",
    changeReason: "ABHA enrolled during OPD visit",
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20049",
    eventType: "Patient Created",
    patientId: "UHID-4520",
    patientName: "Varsha Gaikwad",
    changedFields: "First Name, Last Name, Gender, DOB, Mobile, Email, ABHA ID",
    beforeValue: null,
    afterValue: '{ "name": "Varsha Gaikwad", "gender": "Female", "dob": "1987-04-19", "mobile": "9833221100", "abhaId": "89-0123-4567-8901" }',
    changedByUserId: "USR-FD-001",
    changedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 13:00:00",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
    failureReason: null,
  },
  {
    auditId: "PAT-20050",
    eventType: "Patient Details Updated",
    patientId: "UHID-1770",
    patientName: "Girish Patil",
    changedFields: "Patient Status",
    beforeValue: '{ "status": "Active" }',
    afterValue: '{ "status": "Inactive" }',
    changedByUserId: "USR-ADM-001",
    changedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 15:30:00",
    ipAddress: "192.168.1.10",
    changeReason: "Transferred to another facility",
    status: "Success",
    failureReason: null,
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Main component ─────────────────────────────────────────────────────────

export function PatientAuditLogs() {
  const logs = mockPatientAuditLogs;

  // --- Filter state ---
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [facilityFilter, setFacilityFilter] = React.useState("all");
  const [roleFilter, setRoleFilter] = React.useState("all");
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
  const [tempDateRange, setTempDateRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Detail dialog
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<PatientAuditLog | null>(null);

  // Export sheet
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  // Quick ranges
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

  // --- Stats ---
  const stats = React.useMemo(() => {
    const total = logs.length;
    const created = logs.filter((l) => l.eventType === "Patient Created").length;
    const updated = logs.filter((l) => l.eventType === "Patient Details Updated").length;
    const identifierUpdated = logs.filter((l) => l.eventType === "Patient Identifier Updated").length;
    const failed = logs.filter((l) => l.status === "Failed").length;
    return { total, created, updated, identifierUpdated, failed };
  }, [logs]);

  // --- Filtered logs ---
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const sq = searchFilter.toLowerCase();
      const matchesSearch =
        !sq ||
        log.patientId.toLowerCase().includes(sq) ||
        log.patientName.toLowerCase().includes(sq) ||
        log.changedByUserId.toLowerCase().includes(sq) ||
        log.auditId.toLowerCase().includes(sq);

      const matchesEventType =
        eventTypeFilter === "all" || log.eventType === eventTypeFilter;

      const matchesStatus =
        statusFilter === "all" || log.status === statusFilter;

      const matchesFacility =
        facilityFilter === "all" || log.facilityId === facilityFilter;

      const matchesRole =
        roleFilter === "all" || log.changedByRole === roleFilter;

      const logDate = new Date(log.changeTimestamp);
      const matchesDate =
        logDate >= startOfDay(dateRange.from) &&
        logDate <= endOfDay(dateRange.to);

      return (
        matchesSearch &&
        matchesEventType &&
        matchesStatus &&
        matchesFacility &&
        matchesRole &&
        matchesDate
      );
    });
  }, [logs, searchFilter, eventTypeFilter, statusFilter, facilityFilter, roleFilter, dateRange]);

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, eventTypeFilter, statusFilter, facilityFilter, roleFilter, dateRange]);

  // --- Filter helpers ---
  const hasActiveFilters =
    eventTypeFilter !== "all" ||
    statusFilter !== "all" ||
    facilityFilter !== "all" ||
    roleFilter !== "all";

  const clearAllFilters = () => {
    setEventTypeFilter("all");
    setStatusFilter("all");
    setFacilityFilter("all");
    setRoleFilter("all");
    setSearchFilter("");
  };

  // --- Format timestamp ---
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
    } catch {
      return ts;
    }
  };

  // --- Badge / icon helpers ---

  const getEventTypeBadge = (et: EventType) => {
    switch (et) {
      case "Patient Created":
        return (
          <Badge variant="default">
            <UserPlus className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Created
          </Badge>
        );
      case "Patient Details Updated":
        return (
          <Badge variant="secondary">
            <FilePen className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Details Updated
          </Badge>
        );
      case "Patient Identifier Updated":
        return (
          <Badge variant="outline">
            <Fingerprint className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Identifier Updated
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: ChangeStatus) => {
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

  // --- Detail row component ---
  const DetailRow = ({
    label,
    value,
    mono,
  }: {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
  }) => (
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
        title="Patient Creation & Edit Logs"
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
              description="All audit events"
              icon={ClipboardList}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Patients Created"
              value={stats.created}
              description="New registrations"
              icon={UserPlus}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Details Updated"
              value={stats.updated}
              description="Demographic changes"
              icon={FilePen}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Identifier Updates"
              value={stats.identifierUpdated}
              description="ABHA / Aadhaar changes"
              icon={Fingerprint}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Failed Changes"
              value={stats.failed}
              description="Blocked by system"
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
                        <span
                          className={[
                            "text-sm",
                            isDateRangeActive ? "text-primary" : "text-muted-foreground",
                          ].join(" ")}
                        >
                          {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd")}
                        </span>
                        {isDateRangeActive ? (
                          <span
                            className="flex items-center"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchFilter("");
                              setEventTypeFilter("all");
                              setStatusFilter("all");
                              setFacilityFilter("all");
                              setRoleFilter("all");
                              setDateRange({ from: subDays(new Date(), 450), to: new Date() });
                              setTempDateRange({});
                              setIsDateRangeActive(false);
                              setCurrentPage(1);
                            }}
                          >
                            <X
                              className="size-4 text-primary shrink-0"
                              strokeWidth={ICON_STROKE_WIDTH}
                            />
                          </span>
                        ) : (
                          <Calendar
                            className="size-4 text-muted-foreground shrink-0"
                            strokeWidth={ICON_STROKE_WIDTH}
                          />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border-0 shadow-none bg-transparent"
                      align="start"
                      sideOffset={4}
                    >
                      <DateRangePicker
                        value={tempDateRange}
                        quickRanges={quickRanges}
                        onApply={(range) => {
                          setDateRange(range);
                          setTempDateRange(range);
                          setIsDateRangeActive(true);
                          setDatePickerOpen(false);
                        }}
                        onCancel={handleCancelDateRange}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Unified Search */}
                  <div className="bg-background relative rounded-[8px] w-80">
                    <div className="flex items-center gap-2 px-3 py-[7.5px]">
                      <Search
                        strokeWidth={ICON_STROKE_WIDTH}
                        className="size-5 text-muted-foreground shrink-0"
                      />
                      <input
                        placeholder="Search by patient UHID, name, changed by, audit ID"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute border border-border inset-[-1px] pointer-events-none rounded-[4px]"
                    />
                  </div>
                </div>

                {/* Right: Filter icon */}
                <div className="flex items-center gap-2">
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
              </div>

              {/* Row 2: Filter chips */}
              {showFilters && (
                <div className="flex items-center gap-2 flex-wrap">

                  {/* Event Type */}
                  <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                    <SelectTrigger className="h-8 w-48 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Patient Created">Patient Created</SelectItem>
                      <SelectItem value="Patient Details Updated">Details Updated</SelectItem>
                      <SelectItem value="Patient Identifier Updated">Identifier Updated</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Status */}
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

                  {/* Changed By Role */}
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Changed By Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Front Desk">Front Desk</SelectItem>
                      <SelectItem value="Radiology Coordinator">Radiology Coordinator</SelectItem>
                      <SelectItem value="Facility Admin">Facility Admin</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Facility */}
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
                    <TableHead className="whitespace-nowrap">Patient Name</TableHead>
                    <TableHead className="whitespace-nowrap">Changed Fields</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By (ID)</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By Role</TableHead>
                    <TableHead className="whitespace-nowrap">Facility</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="whitespace-nowrap">Change Reason</TableHead>
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
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.auditId}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {getEventTypeBadge(log.eventType)}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.patientId}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.patientName}
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate" title={log.changedFields}>
                          {log.changedFields}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.changedByUserId}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.changedByRole}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.facilityId}
                        </TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">
                          {formatTimestamp(log.changeTimestamp)}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.ipAddress}
                        </TableCell>
                        <TableCell className="text-sm max-w-[160px] truncate text-muted-foreground" title={log.changeReason ?? undefined}>
                          {log.changeReason ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {getStatusBadge(log.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <Users
                            className="size-8 text-muted-foreground"
                            strokeWidth={ICON_STROKE_WIDTH}
                          />
                          <p className="text-sm text-muted-foreground">
                            No patient audit logs found matching your criteria
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Try adjusting your filters or date range.
                          </p>
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

      {/* Row Detail Dialog — shows all 13 system-captured audit log fields */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Patient Audit Record Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">
                  {selectedLog.auditId}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Complete patient data audit record — read-only, immutable
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow
                label="Event Type"
                value={getEventTypeBadge(selectedLog.eventType)}
              />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Patient Name" value={selectedLog.patientName} />
              <DetailRow label="Changed Fields" value={selectedLog.changedFields} />
              <DetailRow
                label="Before Value"
                value={
                  selectedLog.beforeValue ? (
                    <span className="roboto-mono text-xs tabular-nums text-muted-foreground break-all">
                      {selectedLog.beforeValue}
                    </span>
                  ) : null
                }
              />
              <DetailRow
                label="After Value"
                value={
                  selectedLog.afterValue ? (
                    <span className="roboto-mono text-xs tabular-nums break-all">
                      {selectedLog.afterValue}
                    </span>
                  ) : null
                }
              />
              <DetailRow label="Changed By (ID)" value={selectedLog.changedByUserId} mono />
              <DetailRow label="Changed By Role" value={selectedLog.changedByRole} />
              <DetailRow label="Facility ID" value={selectedLog.facilityId} mono />
              <DetailRow
                label="Change Timestamp"
                value={formatTimestamp(selectedLog.changeTimestamp)}
                mono
              />
              <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
              <DetailRow label="Change Reason" value={selectedLog.changeReason} />
              <DetailRow
                label="Status"
                value={getStatusBadge(selectedLog.status)}
              />
              <DetailRow
                label="Failure Reason"
                value={
                  selectedLog.failureReason ? (
                    <span className="text-destructive">{selectedLog.failureReason}</span>
                  ) : null
                }
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Logs Sheet */}
      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Export Logs</SheetTitle>
            <SheetDescription>
              Generate and download compliance reports from immutable audit log data.
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default PatientAuditLogs;
