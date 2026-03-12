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
  FileUp,
  FileText,
  Eye,
  RefreshCw,
  FilePenLine,
  AlertTriangle,
  ClipboardList,
  Lock,
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
 * PATIENT DOCUMENT UPLOAD AUDIT LOG — Story 5
 *
 * SCOPE:
 * ✔ Document upload (new)
 * ✔ Document re-upload (replacement)
 * ✔ Document metadata edit
 * ✔ Document view
 *
 * EXCLUDED: Report uploads, PACS/DICOM image storage
 *
 * DOCUMENT TYPES: Consent Form, Previous Reports, Insurance Document,
 *                 Prescription, Other Attachments
 *
 * FILE VALIDATIONS:
 * - Allowed formats: PDF, JPG, JPEG, PNG
 * - Max file size: 10 MB (configurable)
 * - Virus/malware scan mandatory
 * - File hash generated automatically
 * - Aadhaar/sensitive docs: masked preview, full access logged
 *
 * DATA INTEGRITY:
 * - Audit logs are immutable (no edit/delete)
 * - File hash stored and retrievable
 * - Storage encrypted at rest
 * - Retention: 7–10 years (configurable)
 *
 * COMPLIANCE:
 * - NABH document traceability
 * - ABDM document governance compliance
 * - ISO 27001 change management
 * - Medico-legal integrity protection
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/documents — list with pagination
 * - Query params: patientId, uploadedBy, eventType, docType, fileFormat,
 *                 status, facilityId, dateFrom, dateTo
 * - GET /api/admin/audit-logs/documents/export — CSV / PDF
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type DocEventType = "Upload" | "Re-upload" | "View" | "Metadata Edit";
type DocStatus = "Success" | "Failed";
type DocType =
  | "Consent Form"
  | "Previous Report"
  | "Insurance Document"
  | "Prescription"
  | "Other Attachment";
type FileFormat = "PDF" | "JPG" | "PNG" | "JPEG";
type DocRole =
  | "Front Desk"
  | "Radiology Coordinator"
  | "Radiologist"
  | "Technician"
  | "Facility Admin";

interface DocAuditLog {
  auditId: string;
  eventType: DocEventType;
  patientId: string;
  patientName: string;
  visitId: string | null;
  documentType: DocType;
  fileName: string;
  fileSizeMB: number;
  fileFormat: FileFormat;
  fileHash: string;
  uploadedByUserId: string;
  uploadedByRole: DocRole;
  facilityId: string;
  changeTimestamp: string;
  ipAddress: string;
  status: DocStatus;
  failureReason: string | null;
  overrideReason: string | null;
}

// ─── Mock Data (50 records) ───────────────────────────────────────────────────

const mockDocAuditLogs: DocAuditLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "DOC-10001",
    eventType: "Upload",
    patientId: "UHID-4501",
    patientName: "Arjun Mehta",
    visitId: "VIS-8801",
    documentType: "Consent Form",
    fileName: "consent_arjun_mehta_2025.pdf",
    fileSizeMB: 0.4,
    fileFormat: "PDF",
    fileHash: "sha256:a3f2b1c9d4e5...0012",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 08:52:10",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10002",
    eventType: "Upload",
    patientId: "UHID-4502",
    patientName: "Priya Sharma",
    visitId: "VIS-8802",
    documentType: "Insurance Document",
    fileName: "insurance_priya_sharma_feb25.pdf",
    fileSizeMB: 1.2,
    fileFormat: "PDF",
    fileHash: "sha256:b4e5f6a7c8d9...0034",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 09:18:30",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10003",
    eventType: "View",
    patientId: "UHID-3892",
    patientName: "Ramesh Nair",
    visitId: "VIS-7721",
    documentType: "Previous Report",
    fileName: "mri_brain_ramesh_jan25.pdf",
    fileSizeMB: 3.8,
    fileFormat: "PDF",
    fileHash: "sha256:c5d6e7f8a9b0...0056",
    uploadedByUserId: "USR-RAD-001",
    uploadedByRole: "Radiologist",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 10:30:00",
    ipAddress: "192.168.1.30",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10004",
    eventType: "Upload",
    patientId: "UHID-2201",
    patientName: "Sunita Verma",
    visitId: null,
    documentType: "Prescription",
    fileName: "rx_sunita_verma_01feb.jpg",
    fileSizeMB: 0.7,
    fileFormat: "JPG",
    fileHash: "sha256:d6e7f8a9b0c1...0078",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-01 11:05:44",
    ipAddress: "192.168.1.21",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10005",
    eventType: "Upload",
    patientId: "UHID-3310",
    patientName: "Mohammed Ansari",
    visitId: "VIS-8803",
    documentType: "Other Attachment",
    fileName: "aadhaar_masked_ansari.png",
    fileSizeMB: 11.5,
    fileFormat: "PNG",
    fileHash: "sha256:e7f8a9b0c1d2...0090",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-01 13:00:00",
    ipAddress: "192.168.2.10",
    status: "Failed",
    failureReason: "File size exceeds maximum allowed limit (10 MB)",
    overrideReason: null,
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "DOC-10006",
    eventType: "Upload",
    patientId: "UHID-4503",
    patientName: "Kavitha Rajan",
    visitId: "VIS-8804",
    documentType: "Consent Form",
    fileName: "consent_kavitha_rajan_feb25.pdf",
    fileSizeMB: 0.3,
    fileFormat: "PDF",
    fileHash: "sha256:f8a9b0c1d2e3...0112",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 08:35:00",
    ipAddress: "192.168.1.21",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10007",
    eventType: "View",
    patientId: "UHID-4504",
    patientName: "Deepak Joshi",
    visitId: "VIS-8805",
    documentType: "Insurance Document",
    fileName: "insurance_deepak_joshi.pdf",
    fileSizeMB: 2.1,
    fileFormat: "PDF",
    fileHash: "sha256:a9b0c1d2e3f4...0134",
    uploadedByUserId: "USR-RC-001",
    uploadedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 09:20:00",
    ipAddress: "192.168.1.22",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10008",
    eventType: "Re-upload",
    patientId: "UHID-1105",
    patientName: "Anita Krishnan",
    visitId: "VIS-7200",
    documentType: "Previous Report",
    fileName: "ct_chest_anita_krishnan_v2.pdf",
    fileSizeMB: 5.6,
    fileFormat: "PDF",
    fileHash: "sha256:b0c1d2e3f4a5...0156",
    uploadedByUserId: "USR-TECH-001",
    uploadedByRole: "Technician",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-03 10:10:00",
    ipAddress: "192.168.1.35",
    status: "Success",
    failureReason: null,
    overrideReason: "Replacing incomplete scan from previous visit",
  },
  {
    auditId: "DOC-10009",
    eventType: "Metadata Edit",
    patientId: "UHID-3012",
    patientName: "Sanjay Pillai",
    visitId: "VIS-6100",
    documentType: "Consent Form",
    fileName: "consent_sanjay_pillai_v1.pdf",
    fileSizeMB: 0.5,
    fileFormat: "PDF",
    fileHash: "sha256:c1d2e3f4a5b6...0178",
    uploadedByUserId: "USR-ADM-001",
    uploadedByRole: "Facility Admin",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-03 11:45:00",
    ipAddress: "192.168.2.10",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10010",
    eventType: "Upload",
    patientId: "UHID-4505",
    patientName: "Rekha Singh",
    visitId: "VIS-8806",
    documentType: "Prescription",
    fileName: "rx_rekha_singh_03feb.pdf",
    fileSizeMB: 0.6,
    fileFormat: "PDF",
    fileHash: "sha256:d2e3f4a5b6c7...0190",
    uploadedByUserId: "USR-FD-003",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-03 14:20:00",
    ipAddress: "192.168.3.5",
    status: "Failed",
    failureReason: "Virus/malware scan failed — file quarantined",
    overrideReason: null,
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "DOC-10011",
    eventType: "Upload",
    patientId: "UHID-4506",
    patientName: "Vikram Chandra",
    visitId: "VIS-8807",
    documentType: "Insurance Document",
    fileName: "insurance_vikram_chandra_feb25.pdf",
    fileSizeMB: 1.9,
    fileFormat: "PDF",
    fileHash: "sha256:e3f4a5b6c7d8...0212",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 09:05:00",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10012",
    eventType: "View",
    patientId: "UHID-2456",
    patientName: "Geeta Menon",
    visitId: "VIS-5500",
    documentType: "Consent Form",
    fileName: "consent_geeta_menon_2024.pdf",
    fileSizeMB: 0.4,
    fileFormat: "PDF",
    fileHash: "sha256:f4a5b6c7d8e9...0234",
    uploadedByUserId: "USR-RAD-001",
    uploadedByRole: "Radiologist",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 10:30:00",
    ipAddress: "192.168.1.30",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10013",
    eventType: "Upload",
    patientId: "UHID-1890",
    patientName: "Harish Iyer",
    visitId: "VIS-8808",
    documentType: "Previous Report",
    fileName: "xray_chest_harish_iyer_jan25.jpg",
    fileSizeMB: 4.2,
    fileFormat: "JPG",
    fileHash: "sha256:a5b6c7d8e9f0...0256",
    uploadedByUserId: "USR-TECH-001",
    uploadedByRole: "Technician",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-05 11:50:00",
    ipAddress: "192.168.1.35",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10014",
    eventType: "Re-upload",
    patientId: "UHID-3345",
    patientName: "Fatima Shaikh",
    visitId: "VIS-7450",
    documentType: "Insurance Document",
    fileName: "insurance_fatima_shaikh_updated.pdf",
    fileSizeMB: 2.3,
    fileFormat: "PDF",
    fileHash: "sha256:b6c7d8e9f0a1...0278",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-05 13:15:00",
    ipAddress: "192.168.2.11",
    status: "Success",
    failureReason: null,
    overrideReason: "Policy renewed — replacing expired insurance document",
  },
  {
    auditId: "DOC-10015",
    eventType: "Upload",
    patientId: "UHID-4507",
    patientName: "Suresh Babu",
    visitId: "VIS-8809",
    documentType: "Consent Form",
    fileName: "consent_suresh_babu_feb25.pdf",
    fileSizeMB: 0.5,
    fileFormat: "PDF",
    fileHash: "sha256:c7d8e9f0a1b2...0300",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-05 15:40:00",
    ipAddress: "192.168.3.5",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  // ── Feb 07 ──────────────────────────────────────────
  {
    auditId: "DOC-10016",
    eventType: "View",
    patientId: "UHID-2789",
    patientName: "Nisha Kapoor",
    visitId: "VIS-6630",
    documentType: "Prescription",
    fileName: "rx_nisha_kapoor_jan25.pdf",
    fileSizeMB: 0.8,
    fileFormat: "PDF",
    fileHash: "sha256:d8e9f0a1b2c3...0322",
    uploadedByUserId: "USR-RC-001",
    uploadedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 09:10:00",
    ipAddress: "192.168.1.22",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10017",
    eventType: "Upload",
    patientId: "UHID-4508",
    patientName: "Arun Prakash",
    visitId: "VIS-8810",
    documentType: "Other Attachment",
    fileName: "ref_letter_arun_prakash_feb25.png",
    fileSizeMB: 1.1,
    fileFormat: "PNG",
    fileHash: "sha256:e9f0a1b2c3d4...0344",
    uploadedByUserId: "USR-FD-003",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-07 10:25:00",
    ipAddress: "192.168.2.12",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10018",
    eventType: "Upload",
    patientId: "UHID-1234",
    patientName: "Meena Pillai",
    visitId: "VIS-8811",
    documentType: "Previous Report",
    fileName: "mri_knee_meena_pillai.pdf",
    fileSizeMB: 7.4,
    fileFormat: "PDF",
    fileHash: "sha256:f0a1b2c3d4e5...0366",
    uploadedByUserId: "USR-TECH-001",
    uploadedByRole: "Technician",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 11:40:00",
    ipAddress: "192.168.1.35",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10019",
    eventType: "Metadata Edit",
    patientId: "UHID-3789",
    patientName: "Ravi Kumar",
    visitId: "VIS-7890",
    documentType: "Insurance Document",
    fileName: "insurance_ravi_kumar_2024.pdf",
    fileSizeMB: 1.5,
    fileFormat: "PDF",
    fileHash: "sha256:a1b2c3d4e5f6...0388",
    uploadedByUserId: "USR-ADM-001",
    uploadedByRole: "Facility Admin",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-07 13:05:00",
    ipAddress: "192.168.2.10",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10020",
    eventType: "Upload",
    patientId: "UHID-2010",
    patientName: "Lalitha Devi",
    visitId: null,
    documentType: "Consent Form",
    fileName: "consent_lalitha_devi_07feb.pdf",
    fileSizeMB: 0.3,
    fileFormat: "PDF",
    fileHash: "sha256:b2c3d4e5f6a7...0400",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-07 15:10:00",
    ipAddress: "192.168.1.21",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  // ── Feb 10 ──────────────────────────────────────────
  {
    auditId: "DOC-10021",
    eventType: "Upload",
    patientId: "UHID-4509",
    patientName: "Pooja Desai",
    visitId: "VIS-8812",
    documentType: "Prescription",
    fileName: "rx_pooja_desai_10feb.pdf",
    fileSizeMB: 0.9,
    fileFormat: "PDF",
    fileHash: "sha256:c3d4e5f6a7b8...0422",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 08:45:00",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10022",
    eventType: "View",
    patientId: "UHID-3100",
    patientName: "Kiran Shah",
    visitId: "VIS-7100",
    documentType: "Previous Report",
    fileName: "ultrasound_kiran_shah_oct24.pdf",
    fileSizeMB: 4.7,
    fileFormat: "PDF",
    fileHash: "sha256:d4e5f6a7b8c9...0444",
    uploadedByUserId: "USR-RAD-001",
    uploadedByRole: "Radiologist",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-10 09:55:00",
    ipAddress: "192.168.3.30",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10023",
    eventType: "Upload",
    patientId: "UHID-4510",
    patientName: "Tarun Bose",
    visitId: "VIS-8813",
    documentType: "Insurance Document",
    fileName: "insurance_tarun_bose.docx",
    fileSizeMB: 0.8,
    fileFormat: "PDF",
    fileHash: "sha256:e5f6a7b8c9d0...0466",
    uploadedByUserId: "USR-FD-003",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-10 10:35:00",
    ipAddress: "192.168.2.12",
    status: "Failed",
    failureReason: "Unsupported file format — only PDF, JPG, JPEG, PNG allowed",
    overrideReason: null,
  },
  {
    auditId: "DOC-10024",
    eventType: "Re-upload",
    patientId: "UHID-2345",
    patientName: "Sudha Rao",
    visitId: "VIS-6800",
    documentType: "Consent Form",
    fileName: "consent_sudha_rao_v3.pdf",
    fileSizeMB: 0.5,
    fileFormat: "PDF",
    fileHash: "sha256:f6a7b8c9d0e1...0488",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 12:10:00",
    ipAddress: "192.168.1.21",
    status: "Success",
    failureReason: null,
    overrideReason: "Patient signed revised consent form after procedure update",
  },
  {
    auditId: "DOC-10025",
    eventType: "View",
    patientId: "UHID-1678",
    patientName: "Naresh Gupta",
    visitId: "VIS-5200",
    documentType: "Insurance Document",
    fileName: "insurance_naresh_gupta_2024.pdf",
    fileSizeMB: 1.3,
    fileFormat: "PDF",
    fileHash: "sha256:a7b8c9d0e1f2...0510",
    uploadedByUserId: "USR-RC-001",
    uploadedByRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-10 14:20:00",
    ipAddress: "192.168.1.22",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  // ── Feb 12 ──────────────────────────────────────────
  {
    auditId: "DOC-10026",
    eventType: "Upload",
    patientId: "UHID-4511",
    patientName: "Amrita Sood",
    visitId: "VIS-8814",
    documentType: "Consent Form",
    fileName: "consent_amrita_sood_feb25.pdf",
    fileSizeMB: 0.4,
    fileFormat: "PDF",
    fileHash: "sha256:b8c9d0e1f2a3...0532",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-12 08:35:00",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10027",
    eventType: "Upload",
    patientId: "UHID-2900",
    patientName: "Balaji Reddy",
    visitId: "VIS-8815",
    documentType: "Previous Report",
    fileName: "ct_abdomen_balaji_reddy.pdf",
    fileSizeMB: 9.1,
    fileFormat: "PDF",
    fileHash: "sha256:c9d0e1f2a3b4...0554",
    uploadedByUserId: "USR-TECH-001",
    uploadedByRole: "Technician",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-12 09:50:00",
    ipAddress: "192.168.1.35",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10028",
    eventType: "View",
    patientId: "UHID-4512",
    patientName: "Sheela Nambiar",
    visitId: "VIS-8816",
    documentType: "Consent Form",
    fileName: "consent_sheela_nambiar.pdf",
    fileSizeMB: 0.3,
    fileFormat: "PDF",
    fileHash: "sha256:d0e1f2a3b4c5...0576",
    uploadedByUserId: "USR-RAD-001",
    uploadedByRole: "Radiologist",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-12 11:10:00",
    ipAddress: "192.168.2.30",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10029",
    eventType: "Upload",
    patientId: "UHID-3456",
    patientName: "Chetan Bhatt",
    visitId: "VIS-8817",
    documentType: "Other Attachment",
    fileName: "referral_chetan_bhatt.jpg",
    fileSizeMB: 2.2,
    fileFormat: "JPG",
    fileHash: "sha256:e1f2a3b4c5d6...0598",
    uploadedByUserId: "USR-FD-003",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-12 13:35:00",
    ipAddress: "192.168.2.12",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10030",
    eventType: "Metadata Edit",
    patientId: "UHID-1980",
    patientName: "Divya Krishnamurthy",
    visitId: "VIS-5800",
    documentType: "Insurance Document",
    fileName: "insurance_divya_krishnamurthy.pdf",
    fileSizeMB: 1.7,
    fileFormat: "PDF",
    fileHash: "sha256:f2a3b4c5d6e7...0610",
    uploadedByUserId: "USR-ADM-001",
    uploadedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-12 15:05:00",
    ipAddress: "192.168.1.10",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  // ── Feb 14 ──────────────────────────────────────────
  {
    auditId: "DOC-10031",
    eventType: "Upload",
    patientId: "UHID-4513",
    patientName: "Mahesh Trivedi",
    visitId: "VIS-8818",
    documentType: "Consent Form",
    fileName: "consent_mahesh_trivedi_feb25.pdf",
    fileSizeMB: 0.4,
    fileFormat: "PDF",
    fileHash: "sha256:a3b4c5d6e7f8...0632",
    uploadedByUserId: "USR-FD-003",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-14 08:25:00",
    ipAddress: "192.168.3.5",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10032",
    eventType: "View",
    patientId: "UHID-2200",
    patientName: "Anjali Bhat",
    visitId: "VIS-6200",
    documentType: "Previous Report",
    fileName: "mri_spine_anjali_bhat_dec24.pdf",
    fileSizeMB: 6.3,
    fileFormat: "PDF",
    fileHash: "sha256:b4c5d6e7f8a9...0654",
    uploadedByUserId: "USR-RAD-001",
    uploadedByRole: "Radiologist",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 10:10:00",
    ipAddress: "192.168.1.30",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10033",
    eventType: "Re-upload",
    patientId: "UHID-1560",
    patientName: "Ramakrishnan Pillai",
    visitId: "VIS-7600",
    documentType: "Prescription",
    fileName: "rx_ramakrishnan_pillai_v2.jpg",
    fileSizeMB: 1.0,
    fileFormat: "JPG",
    fileHash: "sha256:c5d6e7f8a9b0...0676",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 11:35:00",
    ipAddress: "192.168.1.21",
    status: "Success",
    failureReason: null,
    overrideReason: "Prescription reissued — original was unclear",
  },
  {
    auditId: "DOC-10034",
    eventType: "Upload",
    patientId: "UHID-4099",
    patientName: "Savita Kumari",
    visitId: "VIS-8819",
    documentType: "Insurance Document",
    fileName: "insurance_savita_kumari_2025.pdf",
    fileSizeMB: 2.8,
    fileFormat: "PDF",
    fileHash: "sha256:d6e7f8a9b0c1...0698",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-14 13:05:00",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10035",
    eventType: "Upload",
    patientId: "UHID-4514",
    patientName: "Prakash Iyer",
    visitId: "VIS-8820",
    documentType: "Previous Report",
    fileName: "xray_shoulder_prakash_iyer.png",
    fileSizeMB: 3.5,
    fileFormat: "PNG",
    fileHash: "sha256:e7f8a9b0c1d2...0720",
    uploadedByUserId: "USR-TECH-001",
    uploadedByRole: "Technician",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-14 15:35:00",
    ipAddress: "192.168.2.35",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  // ── Feb 17 ──────────────────────────────────────────
  {
    auditId: "DOC-10036",
    eventType: "View",
    patientId: "UHID-2780",
    patientName: "Usha Prabhu",
    visitId: "VIS-5950",
    documentType: "Consent Form",
    fileName: "consent_usha_prabhu_2024.pdf",
    fileSizeMB: 0.4,
    fileFormat: "PDF",
    fileHash: "sha256:f8a9b0c1d2e3...0742",
    uploadedByUserId: "USR-RAD-001",
    uploadedByRole: "Radiologist",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 09:05:00",
    ipAddress: "192.168.1.30",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10037",
    eventType: "Upload",
    patientId: "UHID-4515",
    patientName: "Venkat Subramanian",
    visitId: "VIS-8821",
    documentType: "Consent Form",
    fileName: "consent_venkat_subramanian_feb25.pdf",
    fileSizeMB: 0.5,
    fileFormat: "PDF",
    fileHash: "sha256:a9b0c1d2e3f4...0764",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-17 10:20:00",
    ipAddress: "192.168.3.5",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10038",
    eventType: "Upload",
    patientId: "UHID-3321",
    patientName: "Leela Rao",
    visitId: "VIS-8822",
    documentType: "Other Attachment",
    fileName: "id_proof_leela_rao.jpg",
    fileSizeMB: 1.8,
    fileFormat: "JPG",
    fileHash: "sha256:b0c1d2e3f4a5...0786",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 11:50:00",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10039",
    eventType: "Re-upload",
    patientId: "UHID-4516",
    patientName: "Karthik Srinivasan",
    visitId: "VIS-8823",
    documentType: "Insurance Document",
    fileName: "insurance_karthik_srinivasan_v2.pdf",
    fileSizeMB: 2.0,
    fileFormat: "PDF",
    fileHash: "sha256:c1d2e3f4a5b6...0808",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-17 14:10:00",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: "Policy updated — duplicate hash detected, override approved",
  },
  {
    auditId: "DOC-10040",
    eventType: "Upload",
    patientId: "UHID-2555",
    patientName: "Padma Nair",
    visitId: "VIS-8824",
    documentType: "Prescription",
    fileName: "rx_padma_nair_17feb.pdf",
    fileSizeMB: 0.6,
    fileFormat: "PDF",
    fileHash: "sha256:d2e3f4a5b6c7...0820",
    uploadedByUserId: "USR-FD-003",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-17 15:40:00",
    ipAddress: "192.168.2.12",
    status: "Failed",
    failureReason: "Network drop during upload — partial file discarded",
    overrideReason: null,
  },
  // ── Feb 19 ──────────────────────────────────────────
  {
    auditId: "DOC-10041",
    eventType: "Upload",
    patientId: "UHID-4517",
    patientName: "Bhavna Chouhan",
    visitId: "VIS-8825",
    documentType: "Consent Form",
    fileName: "consent_bhavna_chouhan_feb25.pdf",
    fileSizeMB: 0.4,
    fileFormat: "PDF",
    fileHash: "sha256:e3f4a5b6c7d8...0842",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 08:35:00",
    ipAddress: "192.168.1.21",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10042",
    eventType: "View",
    patientId: "UHID-1432",
    patientName: "Dinesh Mohan",
    visitId: "VIS-6400",
    documentType: "Previous Report",
    fileName: "echo_heart_dinesh_mohan_sep24.pdf",
    fileSizeMB: 5.9,
    fileFormat: "PDF",
    fileHash: "sha256:f4a5b6c7d8e9...0864",
    uploadedByUserId: "USR-RAD-001",
    uploadedByRole: "Radiologist",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-19 10:05:00",
    ipAddress: "192.168.3.30",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10043",
    eventType: "Metadata Edit",
    patientId: "UHID-3890",
    patientName: "Hema Malini",
    visitId: "VIS-7920",
    documentType: "Consent Form",
    fileName: "consent_hema_malini_2024.pdf",
    fileSizeMB: 0.4,
    fileFormat: "PDF",
    fileHash: "sha256:a5b6c7d8e9f0...0886",
    uploadedByUserId: "USR-ADM-002",
    uploadedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 11:35:00",
    ipAddress: "192.168.1.10",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10044",
    eventType: "Upload",
    patientId: "UHID-4518",
    patientName: "Jyoti Patel",
    visitId: "VIS-8826",
    documentType: "Insurance Document",
    fileName: "insurance_jyoti_patel_feb25.pdf",
    fileSizeMB: 1.6,
    fileFormat: "PDF",
    fileHash: "sha256:b6c7d8e9f0a1...0908",
    uploadedByUserId: "USR-FD-003",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-003",
    changeTimestamp: "2025-02-19 13:10:00",
    ipAddress: "192.168.3.5",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10045",
    eventType: "Re-upload",
    patientId: "UHID-2100",
    patientName: "Santosh Hegde",
    visitId: "VIS-6100",
    documentType: "Previous Report",
    fileName: "ct_head_santosh_hegde_v2.pdf",
    fileSizeMB: 8.2,
    fileFormat: "PDF",
    fileHash: "sha256:c7d8e9f0a1b2...0920",
    uploadedByUserId: "USR-TECH-001",
    uploadedByRole: "Technician",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-19 15:05:00",
    ipAddress: "192.168.1.35",
    status: "Success",
    failureReason: null,
    overrideReason: "Updated scan with higher resolution — replacing original",
  },
  // ── Feb 22 ──────────────────────────────────────────
  {
    auditId: "DOC-10046",
    eventType: "Upload",
    patientId: "UHID-4519",
    patientName: "Rohan Saxena",
    visitId: "VIS-8827",
    documentType: "Consent Form",
    fileName: "consent_rohan_saxena_guardian.pdf",
    fileSizeMB: 0.5,
    fileFormat: "PDF",
    fileHash: "sha256:d8e9f0a1b2c3...0942",
    uploadedByUserId: "USR-FD-001",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 08:50:00",
    ipAddress: "192.168.1.20",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10047",
    eventType: "View",
    patientId: "UHID-3600",
    patientName: "Indira Thomas",
    visitId: "VIS-7300",
    documentType: "Insurance Document",
    fileName: "insurance_indira_thomas_2025.pdf",
    fileSizeMB: 2.4,
    fileFormat: "PDF",
    fileHash: "sha256:e9f0a1b2c3d4...0964",
    uploadedByUserId: "USR-RC-002",
    uploadedByRole: "Radiology Coordinator",
    facilityId: "FAC-002",
    changeTimestamp: "2025-02-22 10:05:00",
    ipAddress: "192.168.2.22",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10048",
    eventType: "Upload",
    patientId: "UHID-2877",
    patientName: "Sunil Deshpande",
    visitId: "VIS-8828",
    documentType: "Prescription",
    fileName: "rx_sunil_deshpande_22feb.pdf",
    fileSizeMB: 0.7,
    fileFormat: "PDF",
    fileHash: "sha256:f0a1b2c3d4e5...0986",
    uploadedByUserId: "USR-FD-002",
    uploadedByRole: "Front Desk",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 11:35:00",
    ipAddress: "192.168.1.21",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10049",
    eventType: "Upload",
    patientId: "UHID-4520",
    patientName: "Varsha Gaikwad",
    visitId: "VIS-8829",
    documentType: "Other Attachment",
    fileName: "blood_report_varsha_gaikwad.jpg",
    fileSizeMB: 3.1,
    fileFormat: "JPG",
    fileHash: "sha256:a1b2c3d4e5f6...1008",
    uploadedByUserId: "USR-TECH-001",
    uploadedByRole: "Technician",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 13:05:00",
    ipAddress: "192.168.1.35",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
  {
    auditId: "DOC-10050",
    eventType: "Metadata Edit",
    patientId: "UHID-1770",
    patientName: "Girish Patil",
    visitId: "VIS-6700",
    documentType: "Consent Form",
    fileName: "consent_girish_patil_2024.pdf",
    fileSizeMB: 0.4,
    fileFormat: "PDF",
    fileHash: "sha256:b2c3d4e5f6a7...1020",
    uploadedByUserId: "USR-ADM-001",
    uploadedByRole: "Facility Admin",
    facilityId: "FAC-001",
    changeTimestamp: "2025-02-22 15:35:00",
    ipAddress: "192.168.1.10",
    status: "Success",
    failureReason: null,
    overrideReason: null,
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Main Component ───────────────────────────────────────────────────────────

export function PatientDocumentUploadLogs() {
  const logs = mockDocAuditLogs;

  // --- Filter state ---
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [fileFormatFilter, setFileFormatFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
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
  const [tempDateRange, setTempDateRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Detail dialog
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<DocAuditLog | null>(null);

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
    const uploads = logs.filter((l) => l.eventType === "Upload").length;
    const reUploads = logs.filter((l) => l.eventType === "Re-upload").length;
    const views = logs.filter((l) => l.eventType === "View").length;
    const failed = logs.filter((l) => l.status === "Failed").length;
    return { total, uploads, reUploads, views, failed };
  }, [logs]);

  // --- Filtered logs ---
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const sq = searchFilter.toLowerCase();
      const matchesSearch =
        !sq ||
        log.patientId.toLowerCase().includes(sq) ||
        log.patientName.toLowerCase().includes(sq) ||
        log.auditId.toLowerCase().includes(sq) ||
        log.fileName.toLowerCase().includes(sq) ||
        log.uploadedByUserId.toLowerCase().includes(sq);

      const matchesEventType =
        eventTypeFilter === "all" || log.eventType === eventTypeFilter;

      const matchesFileFormat =
        fileFormatFilter === "all" || log.fileFormat === fileFormatFilter;

      const matchesStatus =
        statusFilter === "all" || log.status === statusFilter;

      const matchesFacility =
        facilityFilter === "all" || log.facilityId === facilityFilter;

      const logDate = new Date(log.changeTimestamp);
      const matchesDate =
        logDate >= startOfDay(dateRange.from) &&
        logDate <= endOfDay(dateRange.to);

      return (
        matchesSearch &&
        matchesEventType &&
        matchesFileFormat &&
        matchesStatus &&
        matchesFacility &&
        matchesDate
      );
    });
  }, [
    logs,
    searchFilter,
    eventTypeFilter,
    fileFormatFilter,
    statusFilter,
    facilityFilter,
    dateRange,
  ]);

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchFilter,
    eventTypeFilter,
    fileFormatFilter,
    statusFilter,
    facilityFilter,
    dateRange,
  ]);

  // --- Filter helpers ---
  const hasActiveFilters =
    eventTypeFilter !== "all" ||
    fileFormatFilter !== "all" ||
    statusFilter !== "all" ||
    facilityFilter !== "all";

  const clearAllFilters = () => {
    setEventTypeFilter("all");
    setFileFormatFilter("all");
    setStatusFilter("all");
    setFacilityFilter("all");
    setSearchFilter("");
  };

  // --- Timestamp formatter ---
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

  // --- Badge helpers ---
  const getEventTypeBadge = (et: DocEventType) => {
    switch (et) {
      case "Upload":
        return (
          <Badge variant="default">
            <FileUp className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Upload
          </Badge>
        );
      case "Re-upload":
        return (
          <Badge variant="secondary">
            <RefreshCw className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Re-upload
          </Badge>
        );
      case "View":
        return (
          <Badge variant="outline">
            <Eye className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            View
          </Badge>
        );
      case "Metadata Edit":
        return (
          <Badge variant="outline">
            <FilePenLine className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Metadata Edit
          </Badge>
        );
    }
  };

  const getStatusCell = (status: DocStatus) => {
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

  // --- Detail row ---
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
      <span
        className={`text-sm flex-1 ${mono ? "roboto-mono text-xs tabular-nums" : ""}`}
      >
        {value ?? <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );

  return (
    <PageShell>
      <PageHeader
        title="Patient Document Upload Logs"
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
              description="All document events"
              icon={ClipboardList}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Uploads"
              value={stats.uploads}
              description="New document uploads"
              icon={FileUp}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Re-uploads"
              value={stats.reUploads}
              description="Document replacements"
              icon={RefreshCw}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Document Views"
              value={stats.views}
              description="Access events"
              icon={Eye}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Failed Operations"
              value={stats.failed}
              description="Upload failures"
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
                            isDateRangeActive
                              ? "text-primary"
                              : "text-muted-foreground",
                          ].join(" ")}
                        >
                          {format(dateRange.from, "MMM dd")} –{" "}
                          {format(dateRange.to, "MMM dd")}
                        </span>
                        {isDateRangeActive ? (
                          <span
                            className="flex items-center"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              clearAllFilters();
                              setDateRange({
                                from: subDays(new Date(), 450),
                                to: new Date(),
                              });
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

                  {/* Search */}
                  <div className="bg-background relative rounded-[8px] w-80">
                    <div className="flex items-center gap-2 px-3 py-[7.5px]">
                      <Search
                        strokeWidth={ICON_STROKE_WIDTH}
                        className="size-5 text-muted-foreground shrink-0"
                      />
                      <input
                        placeholder="Search by UHID, name, file name, audit ID, uploaded by"
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

                {/* Filter icon */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Filter options"
                    aria-pressed={showFilters}
                    onClick={() => setShowFilters((v) => !v)}
                    className={
                      showFilters
                        ? "bg-accent text-accent-foreground border-border"
                        : ""
                    }
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
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Upload">Upload</SelectItem>
                      <SelectItem value="Re-upload">Re-upload</SelectItem>
                      <SelectItem value="View">View</SelectItem>
                      <SelectItem value="Metadata Edit">Metadata Edit</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* File Format */}
                  <Select value={fileFormatFilter} onValueChange={setFileFormatFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="File Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Formats</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="JPG">JPG</SelectItem>
                      <SelectItem value="JPEG">JPEG</SelectItem>
                      <SelectItem value="PNG">PNG</SelectItem>
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
                      <X
                        className="size-3.5 text-muted-foreground"
                        strokeWidth={ICON_STROKE_WIDTH}
                      />
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
                    <TableHead className="whitespace-nowrap">File Name</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Size (MB)</TableHead>
                    <TableHead className="whitespace-nowrap">Format</TableHead>
                    <TableHead className="whitespace-nowrap">Uploaded By</TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead className="whitespace-nowrap">Facility</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
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
                        <TableCell
                          className="text-sm max-w-[180px] truncate"
                          title={log.fileName}
                        >
                          {log.fileName}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums text-right whitespace-nowrap">
                          {log.fileSizeMB.toFixed(1)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">
                            {log.fileFormat}
                          </Badge>
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.uploadedByUserId}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.uploadedByRole}
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
                        <TableCell className="whitespace-nowrap">
                          {getStatusCell(log.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <FileText
                            className="size-8 text-muted-foreground"
                            strokeWidth={ICON_STROKE_WIDTH}
                          />
                          <p className="text-sm text-muted-foreground">
                            No document audit logs found matching your criteria
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

      {/* Row Detail Dialog — all system-captured audit + document fields */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Document Audit Record Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">
                  {selectedLog.auditId}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Complete document audit record — read-only, immutable
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              {/* System-captured audit fields */}
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow
                label="Event Type"
                value={getEventTypeBadge(selectedLog.eventType)}
              />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Patient Name" value={selectedLog.patientName} />
              <DetailRow
                label="Visit ID"
                value={selectedLog.visitId}
                mono
              />
              <DetailRow
                label="Changed By (ID)"
                value={selectedLog.uploadedByUserId}
                mono
              />
              <DetailRow label="Changed By Role" value={selectedLog.uploadedByRole} />
              <DetailRow label="Facility ID" value={selectedLog.facilityId} mono />
              <DetailRow
                label="Change Timestamp"
                value={formatTimestamp(selectedLog.changeTimestamp)}
                mono
              />
              <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
              <DetailRow
                label="Status"
                value={getStatusCell(selectedLog.status)}
              />
              <DetailRow
                label="Failure Reason"
                value={
                  selectedLog.failureReason ? (
                    <span className="text-destructive">
                      {selectedLog.failureReason}
                    </span>
                  ) : null
                }
              />

              {/* Document fields */}
              <DetailRow
                label="File Name"
                value={
                  <span className="roboto-mono text-xs tabular-nums break-all">
                    {selectedLog.fileName}
                  </span>
                }
              />
              <DetailRow
                label="File Size"
                value={`${selectedLog.fileSizeMB.toFixed(2)} MB`}
                mono
              />
              <DetailRow
                label="File Format"
                value={
                  <Badge variant="outline" className="roboto-mono text-xs tabular-nums">
                    {selectedLog.fileFormat}
                  </Badge>
                }
              />
              <DetailRow
                label="File Hash"
                value={
                  <span className="roboto-mono text-xs tabular-nums break-all text-muted-foreground">
                    {selectedLog.fileHash}
                  </span>
                }
              />
              <DetailRow
                label="Override Reason"
                value={selectedLog.overrideReason}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Logs Sheet */}
      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto p-0"
        >
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Export Logs</SheetTitle>
            <SheetDescription>
              Generate and download compliance reports from immutable document audit log data.
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

export default PatientDocumentUploadLogs;
