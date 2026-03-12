/**
 * AI DRAFT GENERATION & ACCEPTANCE AUDIT LOG — Story 12
 *
 * Captures all AI-generated draft report events and radiologist response actions.
 *
 * SCOPE:
 * ✔ AI Draft Generated
 * ✔ AI Draft Regenerated
 * ✔ AI Draft Accepted (as-is)
 * ✔ AI Draft Modified (before acceptance)
 * ✔ AI Draft Rejected
 * ✔ AI Content Overridden (after acceptance)
 *
 * COMPLIANCE:
 * - Responsible AI governance
 * - Medico-legal traceability
 * - Clinical accountability
 * - ISO 27001 audit logging compliance
 *
 * RETENTION: ≥ 7–10 years
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/ai-draft-generation — list with pagination
 * - Query params: auditId, accessionNumber, patientId, radiologistId,
 *                 eventType, aiModel, deviceType, dateFrom, dateTo
 * - GET /api/admin/audit-logs/ai-draft-generation/export — CSV / PDF
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Bot,
  Eye,
  Calendar,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
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

type AIDraftEventType =
  | "AI Draft Generated"
  | "AI Draft Regenerated"
  | "AI Draft Accepted"
  | "AI Draft Modified"
  | "AI Draft Rejected"
  | "AI Content Overridden";

type AcceptedAsIs = "Yes" | "No" | "N/A";
type DeviceType = "Web" | "Workstation";
type EventOutcome = "Success" | "Failed";

interface AIDraftLog {
  auditId: string;
  eventType: AIDraftEventType;
  accessionNumber: string;
  studyInstanceUid: string;
  patientId: string;
  radiologistId: string;
  radiologistRole: string;
  aiModelName: string;
  aiModelVersion: string;
  aiConfidenceScore: number | null;
  aiPromptVersion: string | null;
  acceptedAsIs: AcceptedAsIs;
  modifiedSections: string | null;
  reportVersion: string;
  generationTimestamp: string | null;
  actionTimestamp: string | null;
  changeTimestamp: string;
  ipAddress: string;
  deviceType: DeviceType;
  status: EventOutcome;
  facilityId: string;
  beforeSnapshot: string | null;
  afterSnapshot: string | null;
  rejectionReason: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockLogs: AIDraftLog[] = [
  // ── Study ACC-51001 · CT Chest · RadiologyAI v2.1 ───────────────────────
  {
    auditId: "AIDG-A-10001", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51001",
    patientId: "UHID-7001", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: 0.91,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-01 08:30:00", actionTimestamp: null,
    changeTimestamp: "2025-02-01 08:30:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10002", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51001", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51001",
    patientId: "UHID-7001", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-01 08:30:00", actionTimestamp: "2025-02-01 09:15:00",
    changeTimestamp: "2025-02-01 09:15:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Bilateral lower zone consolidation consistent with pneumonia. No pleural effusion. No pneumothorax. Heart size normal. Mediastinum unremarkable. Impression: Bilateral lower lobe pneumonia — clinical correlation and antibiotic therapy recommended.",
    afterSnapshot: "Findings: Bilateral lower zone consolidation consistent with pneumonia. No pleural effusion. No pneumothorax. Heart size normal. Mediastinum unremarkable. Impression: Bilateral lower lobe pneumonia — clinical correlation and antibiotic therapy recommended.",
    rejectionReason: null,
  },
  // ── Study ACC-51002 · MRI Lumbar Spine · RadiologyAI v2.3 ───────────────
  {
    auditId: "AIDG-A-10003", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51002",
    patientId: "UHID-7002", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: 0.82,
    aiPromptVersion: "PROMPT-v1.2", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-01 10:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-01 10:00:00", ipAddress: "192.168.20.102",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10004", eventType: "AI Draft Modified",
    accessionNumber: "ACC-51002", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51002",
    patientId: "UHID-7002", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "No", modifiedSections: "Findings",
    reportVersion: "v2", generationTimestamp: "2025-02-01 10:00:00", actionTimestamp: "2025-02-02 08:45:00",
    changeTimestamp: "2025-02-02 08:45:00", ipAddress: "192.168.20.102",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Herniated nucleus pulposus at L4-L5 with mild thecal sac impingement. Moderate facet arthropathy at L3-S1. No canal stenosis. Impression: L4-L5 disc herniation.",
    afterSnapshot: "Findings: Herniated nucleus pulposus at L4-L5 with moderate thecal sac impingement and bilateral L4-L5 neural foraminal narrowing. Moderate-to-severe facet arthropathy L3-S1. Mild acquired canal stenosis at L4-L5. No free disc fragment identified. Impression: L4-L5 disc herniation with moderate thecal sac impingement and bilateral foraminal narrowing — neurosurgical correlation advised.",
    rejectionReason: null,
  },
  // ── Study ACC-51003 · CT Brain · RadiologyAI v2.1 ───────────────────────
  {
    auditId: "AIDG-A-10005", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51003", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51003",
    patientId: "UHID-7003", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: 0.88,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-02 09:30:00", actionTimestamp: null,
    changeTimestamp: "2025-02-02 09:30:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10006", eventType: "AI Draft Rejected",
    accessionNumber: "ACC-51003", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51003",
    patientId: "UHID-7003", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-02 09:30:00", actionTimestamp: "2025-02-02 10:20:00",
    changeTimestamp: "2025-02-02 10:20:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: "Findings: No acute intracranial haemorrhage. Ventricles normal calibre. No midline shift. Grey-white matter differentiation preserved. Impression: Unremarkable CT brain.",
    afterSnapshot: null,
    rejectionReason: "AI draft failed to identify subtle right MCA territory hypodensity — early ischaemic change confirmed on review. Draft rejected; manual report mandatory for patient safety.",
  },
  // ── Study ACC-51004 · CXR · PneumoDetect v1.4 ───────────────────────────
  {
    auditId: "AIDG-A-10007", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51004",
    patientId: "UHID-7004", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: 0.94,
    aiPromptVersion: "PROMPT-v2.0", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-02 11:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-02 11:00:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10008", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51004", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51004",
    patientId: "UHID-7004", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-02 11:00:00", actionTimestamp: "2025-02-03 09:00:00",
    changeTimestamp: "2025-02-03 09:00:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: No acute consolidation. Costophrenic angles clear. No pleural effusion. Cardiac silhouette within normal limits. Trachea central. Impression: Normal chest X-ray.",
    afterSnapshot: "Findings: No acute consolidation. Costophrenic angles clear. No pleural effusion. Cardiac silhouette within normal limits. Trachea central. Impression: Normal chest X-ray.",
    rejectionReason: null,
  },
  // ── Study ACC-51005 · MRI Shoulder · RadiologyAI v2.3 ───────────────────
  {
    auditId: "AIDG-A-10009", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51005", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51005",
    patientId: "UHID-7005", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: 0.79,
    aiPromptVersion: "PROMPT-v1.2", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-03 09:30:00", actionTimestamp: null,
    changeTimestamp: "2025-02-03 09:30:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10010", eventType: "AI Draft Modified",
    accessionNumber: "ACC-51005", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51005",
    patientId: "UHID-7005", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "No", modifiedSections: "Impression",
    reportVersion: "v2", generationTimestamp: "2025-02-03 09:30:00", actionTimestamp: "2025-02-03 10:15:00",
    changeTimestamp: "2025-02-03 10:15:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
    beforeSnapshot: "Findings: Partial thickness supraspinatus tendon tear at musculotendinous junction. Mild glenohumeral joint effusion. No complete tear. Impression: Partial supraspinatus tear.",
    afterSnapshot: "Findings: Partial thickness supraspinatus tendon tear at musculotendinous junction. Mild glenohumeral joint effusion. No complete tear. Impression: Partial thickness supraspinatus tear with mild glenohumeral effusion — MR arthrography advised for assessment of labral pathology and tear extent. Orthopaedic correlation recommended.",
    rejectionReason: null,
  },
  // ── Study ACC-51006 · CT Chest · RadiologyAI v2.1 ───────────────────────
  {
    auditId: "AIDG-A-10011", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51006",
    patientId: "UHID-7006", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: 0.93,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-03 11:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-03 11:00:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10012", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51006", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51006",
    patientId: "UHID-7006", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-03 11:00:00", actionTimestamp: "2025-02-04 09:30:00",
    changeTimestamp: "2025-02-04 09:30:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: No pulmonary embolism. No pleural effusion. Bilateral lung fields clear. Mediastinal contour normal. Impression: No acute pulmonary pathology.",
    afterSnapshot: "Findings: No pulmonary embolism. No pleural effusion. Bilateral lung fields clear. Mediastinal contour normal. Impression: No acute pulmonary pathology.",
    rejectionReason: null,
  },
  // ── Study ACC-51007 · CXR · PneumoDetect v1.4 ───────────────────────────
  {
    auditId: "AIDG-A-10013", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51007",
    patientId: "UHID-7007", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: 0.78,
    aiPromptVersion: "PROMPT-v2.0", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-04 10:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-04 10:00:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10014", eventType: "AI Draft Rejected",
    accessionNumber: "ACC-51007", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51007",
    patientId: "UHID-7007", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-04 10:00:00", actionTimestamp: "2025-02-04 11:00:00",
    changeTimestamp: "2025-02-04 11:00:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: "Findings: Bilateral perihilar haziness. Impression: Likely pulmonary oedema.",
    afterSnapshot: null,
    rejectionReason: "Model confidence 0.78 below institutional threshold of 0.80. Findings also compatible with bilateral pneumonia — differential not captured. Manual radiologist report required.",
  },
  // ── Study ACC-51008 · MRI Knee · RadiologyAI v2.3 ───────────────────────
  {
    auditId: "AIDG-A-10015", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51008", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51008",
    patientId: "UHID-7008", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: 0.86,
    aiPromptVersion: "PROMPT-v1.2", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-04 13:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-04 13:00:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10016", eventType: "AI Draft Modified",
    accessionNumber: "ACC-51008", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51008",
    patientId: "UHID-7008", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "No", modifiedSections: "Findings & Impression",
    reportVersion: "v2", generationTimestamp: "2025-02-04 13:00:00", actionTimestamp: "2025-02-05 09:00:00",
    changeTimestamp: "2025-02-05 09:00:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Medial meniscal tear — grade II signal change at posterior horn. Intact cruciate ligaments. Mild knee joint effusion. Impression: Medial meniscal tear — grade II.",
    afterSnapshot: "Findings: Grade III medial meniscal tear at posterior horn with meniscal extrusion. Associated medial compartment chondral loss — grade III Outerbridge. Intact cruciate and collateral ligaments. Moderate knee joint effusion. Impression: Grade III medial meniscal tear with extrusion and chondral loss — orthopaedic review and arthroscopy evaluation advised.",
    rejectionReason: null,
  },
  // ── Study ACC-51009 · CT Abdomen · RadiologyAI v2.1 ─────────────────────
  {
    auditId: "AIDG-A-10017", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51009",
    patientId: "UHID-7009", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: 0.89,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-05 09:30:00", actionTimestamp: null,
    changeTimestamp: "2025-02-05 09:30:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10018", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51009", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51009",
    patientId: "UHID-7009", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-05 09:30:00", actionTimestamp: "2025-02-05 10:15:00",
    changeTimestamp: "2025-02-05 10:15:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: No free air. No free fluid. Liver, spleen, pancreas, kidneys within normal limits. No lymphadenopathy. Impression: Normal CT abdomen and pelvis.",
    afterSnapshot: "Findings: No free air. No free fluid. Liver, spleen, pancreas, kidneys within normal limits. No lymphadenopathy. Impression: Normal CT abdomen and pelvis.",
    rejectionReason: null,
  },
  // ── Study ACC-51010 · CXR · PneumoDetect v1.4 ───────────────────────────
  {
    auditId: "AIDG-A-10019", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51010", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51010",
    patientId: "UHID-7010", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: 0.96,
    aiPromptVersion: "PROMPT-v2.0", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-05 11:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-05 11:00:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10020", eventType: "AI Draft Modified",
    accessionNumber: "ACC-51010", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51010",
    patientId: "UHID-7010", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "No", modifiedSections: "Findings",
    reportVersion: "v2", generationTimestamp: "2025-02-05 11:00:00", actionTimestamp: "2025-02-06 09:30:00",
    changeTimestamp: "2025-02-06 09:30:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: "Findings: Bilateral hilar lymphadenopathy — non-specific. Lungs clear. Impression: Bilateral hilar lymphadenopathy.",
    afterSnapshot: "Findings: Bilateral hilar lymphadenopathy with peribronchial cuffing and subtle nodular opacities in mid-zones. Impression: Bilateral hilar lymphadenopathy — differential includes sarcoidosis vs lymphoma; CT chest with contrast and clinical correlation recommended.",
    rejectionReason: null,
  },
  // ── Study ACC-51011 · MRI Liver · RadiologyAI v2.3 ──────────────────────
  {
    auditId: "AIDG-A-10021", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51011",
    patientId: "UHID-7011", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: 0.88,
    aiPromptVersion: "PROMPT-v1.2", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-06 10:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-06 10:00:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10022", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51011", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51011",
    patientId: "UHID-7011", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-06 10:00:00", actionTimestamp: "2025-02-06 11:00:00",
    changeTimestamp: "2025-02-06 11:00:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Liver of normal size and signal intensity. No focal hepatic lesion. No intrahepatic biliary dilation. Portal vein patent. Impression: Normal MRI liver.",
    afterSnapshot: "Findings: Liver of normal size and signal intensity. No focal hepatic lesion. No intrahepatic biliary dilation. Portal vein patent. Impression: Normal MRI liver.",
    rejectionReason: null,
  },
  // ── Study ACC-51012 · MRI Brain · NeuroScan v3.0 (REGEN) ────────────────
  {
    auditId: "AIDG-A-10023", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51012",
    patientId: "UHID-7012", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: 0.91,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-06 13:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-06 13:00:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10024", eventType: "AI Draft Regenerated",
    accessionNumber: "ACC-51012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51012",
    patientId: "UHID-7012", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: 0.94,
    aiPromptVersion: "PROMPT-v2.0", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-06 14:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-06 14:00:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10025", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51012", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51012",
    patientId: "UHID-7012", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-06 14:00:00", actionTimestamp: "2025-02-07 09:30:00",
    changeTimestamp: "2025-02-07 09:30:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: "Findings: No acute intracranial infarct. No haemorrhage. White matter signal normal. Ventricles and sulci appropriate for age. No midline shift. Impression: Normal MRI brain.",
    afterSnapshot: "Findings: No acute intracranial infarct. No haemorrhage. White matter signal normal. Ventricles and sulci appropriate for age. No midline shift. Impression: Normal MRI brain.",
    rejectionReason: null,
  },
  // ── Study ACC-51013 · CT Chest · RadiologyAI v2.1 ───────────────────────
  {
    auditId: "AIDG-A-10026", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51013",
    patientId: "UHID-7013", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: 0.87,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-07 10:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-07 10:00:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10027", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51013", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51013",
    patientId: "UHID-7013", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-07 10:00:00", actionTimestamp: "2025-02-07 11:00:00",
    changeTimestamp: "2025-02-07 11:00:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Right lower lobe solitary pulmonary nodule — 8 mm, well-defined, non-calcified. No other focal lesion. Impression: Right lower lobe pulmonary nodule — Fleischner Society follow-up recommended.",
    afterSnapshot: "Findings: Right lower lobe solitary pulmonary nodule — 8 mm, well-defined, non-calcified. No other focal lesion. Impression: Right lower lobe pulmonary nodule — Fleischner Society follow-up recommended.",
    rejectionReason: null,
  },
  // ── Study ACC-51014 · CXR · PneumoDetect v1.4 ───────────────────────────
  {
    auditId: "AIDG-A-10028", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51014",
    patientId: "UHID-7014", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: 0.87,
    aiPromptVersion: "PROMPT-v2.0", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-08 09:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-08 09:00:00", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10029", eventType: "AI Draft Modified",
    accessionNumber: "ACC-51014", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51014",
    patientId: "UHID-7014", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "No", modifiedSections: "Impression",
    reportVersion: "v2", generationTimestamp: "2025-02-08 09:00:00", actionTimestamp: "2025-02-08 10:30:00",
    changeTimestamp: "2025-02-08 10:30:00", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: "Findings: Perihilar haziness with Kerley B lines. Cardiomegaly. No pleural effusion. Impression: Pulmonary oedema.",
    afterSnapshot: "Findings: Perihilar haziness with Kerley B lines. Cardiomegaly. No pleural effusion. Impression: Pulmonary oedema — cardiac vs non-cardiac aetiology; echocardiography correlation advised. BNP correlation recommended.",
    rejectionReason: null,
  },
  // ── Study ACC-51015 · MRI Spine · RadiologyAI v2.3 ──────────────────────
  {
    auditId: "AIDG-A-10030", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51015", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51015",
    patientId: "UHID-7015", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: 0.91,
    aiPromptVersion: "PROMPT-v1.2", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-08 11:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-08 11:00:00", ipAddress: "192.168.20.105",
    deviceType: "Web", status: "Success", facilityId: "FAC-003",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10031", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51015", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51015",
    patientId: "UHID-7015", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-08 11:00:00", actionTimestamp: "2025-02-09 09:15:00",
    changeTimestamp: "2025-02-09 09:15:00", ipAddress: "192.168.20.105",
    deviceType: "Web", status: "Success", facilityId: "FAC-003",
    beforeSnapshot: "Findings: Cervical spondylosis with disc osteophyte complexes at C5-C6 and C6-C7. Mild neural foraminal narrowing bilaterally at C5-C6. No cord compression. Impression: Cervical spondylosis — clinical correlation with neurological symptoms advised.",
    afterSnapshot: "Findings: Cervical spondylosis with disc osteophyte complexes at C5-C6 and C6-C7. Mild neural foraminal narrowing bilaterally at C5-C6. No cord compression. Impression: Cervical spondylosis — clinical correlation with neurological symptoms advised.",
    rejectionReason: null,
  },
  // ── Study ACC-51016 · CT Brain · NeuroScan v3.0 (OVERRIDE) ─────────────
  {
    auditId: "AIDG-A-10032", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51016", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51016",
    patientId: "UHID-7016", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: 0.85,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-09 10:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-09 10:00:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10033", eventType: "AI Content Overridden",
    accessionNumber: "ACC-51016", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51016",
    patientId: "UHID-7016", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "N/A", modifiedSections: "Findings",
    reportVersion: "v3", generationTimestamp: "2025-02-09 10:00:00", actionTimestamp: "2025-02-09 11:30:00",
    changeTimestamp: "2025-02-09 11:30:00", ipAddress: "192.168.20.101",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Periventricular white matter changes — likely chronic microvascular disease. No acute infarct. No haemorrhage. Impression: Chronic microvascular disease.",
    afterSnapshot: "Findings: Periventricular and subcortical white matter changes with new lacunar infarct in right basal ganglia — acute on chronic cerebrovascular disease. No haemorrhage. Impression: Acute lacunar infarct right basal ganglia on background of chronic microvascular disease — neurology consultation and stroke pathway activation recommended.",
    rejectionReason: null,
  },
  // ── Study ACC-51017 · CT Chest · RadiologyAI v2.1 ───────────────────────
  {
    auditId: "AIDG-A-10034", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51017", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51017",
    patientId: "UHID-7017", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: 0.92,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-10 09:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-10 09:00:00", ipAddress: "192.168.20.102",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10035", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51017", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51017",
    patientId: "UHID-7017", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-10 09:00:00", actionTimestamp: "2025-02-10 10:00:00",
    changeTimestamp: "2025-02-10 10:00:00", ipAddress: "192.168.20.102",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Stable post-surgical changes right lower lobe. No new focal consolidation. No pneumothorax. No pleural effusion. Impression: Post-surgical right lower lobe changes — stable compared to prior.",
    afterSnapshot: "Findings: Stable post-surgical changes right lower lobe. No new focal consolidation. No pneumothorax. No pleural effusion. Impression: Post-surgical right lower lobe changes — stable compared to prior.",
    rejectionReason: null,
  },
  // ── Study ACC-51018 · CXR · PneumoDetect v1.4 (REGEN) ──────────────────
  {
    auditId: "AIDG-A-10036", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51018",
    patientId: "UHID-7018", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: 0.83,
    aiPromptVersion: "PROMPT-v2.0", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-10 11:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-10 11:00:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10037", eventType: "AI Draft Regenerated",
    accessionNumber: "ACC-51018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51018",
    patientId: "UHID-7018", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: 0.90,
    aiPromptVersion: "PROMPT-v2.0", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-11 09:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-11 09:00:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10038", eventType: "AI Draft Modified",
    accessionNumber: "ACC-51018", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51018",
    patientId: "UHID-7018", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "No", modifiedSections: "Findings",
    reportVersion: "v2", generationTimestamp: "2025-02-11 09:00:00", actionTimestamp: "2025-02-11 10:30:00",
    changeTimestamp: "2025-02-11 10:30:00", ipAddress: "192.168.20.103",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: "Findings: Right-sided pleural effusion, moderate. Underlying lung not fully assessed. Impression: Moderate right pleural effusion.",
    afterSnapshot: "Findings: Right-sided moderate pleural effusion with associated compressive atelectasis right lower lobe. Underlying parenchymal lesion cannot be excluded — CT recommended. Impression: Moderate right pleural effusion with compressive atelectasis. Consider diagnostic thoracocentesis; CT chest for underlying aetiology.",
    rejectionReason: null,
  },
  // ── Study ACC-51019 · MRI Abdomen · RadiologyAI v2.3 ────────────────────
  {
    auditId: "AIDG-A-10039", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51019", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51019",
    patientId: "UHID-7019", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: 0.84,
    aiPromptVersion: "PROMPT-v1.2", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-11 11:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-11 11:00:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10040", eventType: "AI Draft Rejected",
    accessionNumber: "ACC-51019", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51019",
    patientId: "UHID-7019", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-11 11:00:00", actionTimestamp: "2025-02-11 12:00:00",
    changeTimestamp: "2025-02-11 12:00:00", ipAddress: "192.168.20.104",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: MRI shoulder — supraspinatus tendinopathy. No full-thickness tear identified. Impression: Supraspinatus tendinopathy.",
    afterSnapshot: null,
    rejectionReason: "AI draft incomplete — rotator cuff assessment degraded by motion artefact. Full-thickness tear not adequately excluded. Manual radiologist report mandatory.",
  },
  // ── Study ACC-51020 · CT Brain · NeuroScan v3.0 ─────────────────────────
  {
    auditId: "AIDG-A-10041", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51020",
    patientId: "UHID-7020", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: 0.93,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-12 09:30:00", actionTimestamp: null,
    changeTimestamp: "2025-02-12 09:30:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10042", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51020", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51020",
    patientId: "UHID-7020", radiologistId: "RAD-005", radiologistRole: "Senior Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-12 09:30:00", actionTimestamp: "2025-02-12 10:30:00",
    changeTimestamp: "2025-02-12 10:30:00", ipAddress: "192.168.20.105",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
    beforeSnapshot: "Findings: Post-craniotomy changes right parietal region — stable. No new intracranial haemorrhage. Ventricular size stable. Impression: Post-operative CT brain — stable appearances.",
    afterSnapshot: "Findings: Post-craniotomy changes right parietal region — stable. No new intracranial haemorrhage. Ventricular size stable. Impression: Post-operative CT brain — stable appearances.",
    rejectionReason: null,
  },
  // ── Study ACC-51021 · CT Chest · RadiologyAI v2.1 (OVERRIDE) ────────────
  {
    auditId: "AIDG-A-10043", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51021",
    patientId: "UHID-7001", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: 0.85,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-13 09:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-13 09:00:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10044", eventType: "AI Content Overridden",
    accessionNumber: "ACC-51021", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51021",
    patientId: "UHID-7001", radiologistId: "RAD-001", radiologistRole: "Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.1", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "N/A", modifiedSections: "Impression",
    reportVersion: "v3", generationTimestamp: "2025-02-13 09:00:00", actionTimestamp: "2025-02-13 10:30:00",
    changeTimestamp: "2025-02-13 10:30:00", ipAddress: "192.168.20.101",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Bilateral lower lobe consolidation. Central nodular lesion — spiculated, right lower lobe, 14 mm. Impression: Infective consolidation with central nodular opacity.",
    afterSnapshot: "Findings: Bilateral lower lobe consolidation. Central spiculated nodular lesion right lower lobe, 14 mm — new, malignancy not excluded. Impression: Consolidation with suspicious right lower lobe spiculated nodule — high suspicion for malignancy. CT-guided biopsy of central lesion recommended. Urgent oncology and thoracic surgery referral.",
    rejectionReason: null,
  },
  // ── Study ACC-51022 · MRI Shoulder · RadiologyAI v2.3 ───────────────────
  {
    auditId: "AIDG-A-10045", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51022", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51022",
    patientId: "UHID-7002", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: 0.90,
    aiPromptVersion: "PROMPT-v1.2", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-14 09:15:00", actionTimestamp: null,
    changeTimestamp: "2025-02-14 09:15:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10046", eventType: "AI Draft Modified",
    accessionNumber: "ACC-51022", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.51022",
    patientId: "UHID-7002", radiologistId: "RAD-002", radiologistRole: "Senior Radiologist",
    aiModelName: "RadiologyAI", aiModelVersion: "v2.3", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "No", modifiedSections: "Findings & Impression",
    reportVersion: "v2", generationTimestamp: "2025-02-14 09:15:00", actionTimestamp: "2025-02-14 11:00:00",
    changeTimestamp: "2025-02-14 11:00:00", ipAddress: "192.168.20.102",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-002",
    beforeSnapshot: "Findings: Supraspinatus tendon degeneration — no discrete tear. Mild AC joint arthropathy. Impression: Supraspinatus tendinopathy.",
    afterSnapshot: "Findings: Full-thickness supraspinatus tear with 12 mm retraction. Partial thickness infraspinatus tendon tear at the footprint. Moderate glenohumeral joint and subacromial bursa effusion. Mild AC joint arthropathy. Impression: Full-thickness supraspinatus tear with infraspinatus partial tear — orthopaedic consult recommended; arthroscopic repair evaluation advised.",
    rejectionReason: null,
  },
  // ── Study ACC-51023 · CXR · PneumoDetect v1.4 ───────────────────────────
  {
    auditId: "AIDG-A-10047", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51023", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51023",
    patientId: "UHID-7003", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: 0.92,
    aiPromptVersion: "PROMPT-v2.0", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-14 13:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-14 13:00:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10048", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51023", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.51023",
    patientId: "UHID-7003", radiologistId: "RAD-003", radiologistRole: "Senior Radiologist",
    aiModelName: "PneumoDetect", aiModelVersion: "v1.4", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-14 13:00:00", actionTimestamp: "2025-02-15 09:30:00",
    changeTimestamp: "2025-02-15 09:30:00", ipAddress: "192.168.20.103",
    deviceType: "Web", status: "Success", facilityId: "FAC-001",
    beforeSnapshot: "Findings: Right-sided rib fractures — 6th and 7th posterior ribs. No pneumothorax. No haemothorax. Impression: Right 6th and 7th rib fractures — no acute complication.",
    afterSnapshot: "Findings: Right-sided rib fractures — 6th and 7th posterior ribs. No pneumothorax. No haemothorax. Impression: Right 6th and 7th rib fractures — no acute complication.",
    rejectionReason: null,
  },
  // ── Study ACC-51024 · CT Brain · NeuroScan v3.0 ─────────────────────────
  {
    auditId: "AIDG-A-10049", eventType: "AI Draft Generated",
    accessionNumber: "ACC-51024", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51024",
    patientId: "UHID-7004", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: 0.88,
    aiPromptVersion: "PROMPT-v1.3", acceptedAsIs: "N/A", modifiedSections: null,
    reportVersion: "v1", generationTimestamp: "2025-02-17 10:00:00", actionTimestamp: null,
    changeTimestamp: "2025-02-17 10:00:00", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
    beforeSnapshot: null, afterSnapshot: null, rejectionReason: null,
  },
  {
    auditId: "AIDG-A-10050", eventType: "AI Draft Accepted",
    accessionNumber: "ACC-51024", studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.51024",
    patientId: "UHID-7004", radiologistId: "RAD-004", radiologistRole: "Radiologist",
    aiModelName: "NeuroScan", aiModelVersion: "v3.0", aiConfidenceScore: null,
    aiPromptVersion: null, acceptedAsIs: "Yes", modifiedSections: null,
    reportVersion: "v2", generationTimestamp: "2025-02-17 10:00:00", actionTimestamp: "2025-02-17 11:15:00",
    changeTimestamp: "2025-02-17 11:15:00", ipAddress: "192.168.20.104",
    deviceType: "Workstation", status: "Success", facilityId: "FAC-003",
    beforeSnapshot: "Findings: Known glioblastoma multiforme right temporal lobe — post-treatment changes. No new haemorrhage. Mild perilesional oedema — stable. Impression: Post-treatment GBM — stable compared to prior MRI.",
    afterSnapshot: "Findings: Known glioblastoma multiforme right temporal lobe — post-treatment changes. No new haemorrhage. Mild perilesional oedema — stable. Impression: Post-treatment GBM — stable compared to prior MRI.",
    rejectionReason: null,
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

function getEventTypeBadge(eventType: AIDraftEventType) {
  const map: Record<AIDraftEventType, { label: string; className: string }> = {
    "AI Draft Generated": {
      label: "Generated",
      className: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10",
    },
    "AI Draft Regenerated": {
      label: "Regenerated",
      className: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10",
    },
    "AI Draft Accepted": {
      label: "Accepted",
      className: "bg-[hsl(var(--chart-2,142_71%_45%)/0.12)] text-[hsl(142,60%,35%)] border border-[hsl(142,60%,35%)/20] hover:bg-[hsl(142,60%,35%)/0.12] dark:text-[hsl(142,60%,65%)]",
    },
    "AI Draft Modified": {
      label: "Modified",
      className: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary",
    },
    "AI Draft Rejected": {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/10",
    },
    "AI Content Overridden": {
      label: "Overridden",
      className: "bg-muted text-muted-foreground border border-border hover:bg-muted",
    },
  };
  const cfg = map[eventType];
  return <Badge className={`whitespace-nowrap ${cfg.className}`}>{cfg.label}</Badge>;
}

function getAcceptedAsIsBadge(v: AcceptedAsIs) {
  if (v === "Yes") return <Badge variant="outline" className="text-xs whitespace-nowrap">Yes</Badge>;
  if (v === "No") return <Badge variant="secondary" className="text-xs whitespace-nowrap">No</Badge>;
  return <span className="text-muted-foreground text-sm">—</span>;
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

export function AIDraftGenerationLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [aiModelFilter, setAiModelFilter] = React.useState("all");
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
  const [selectedLog, setSelectedLog] = React.useState<AIDraftLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.accessionNumber, log.patientId, log.radiologistId, log.aiModelName].some((v) => v.toLowerCase().includes(q))) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (aiModelFilter !== "all" && `${log.aiModelName} ${log.aiModelVersion}` !== aiModelFilter) return false;
      if (deviceFilter !== "all" && log.deviceType !== deviceFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.changeTimestamp);
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, eventTypeFilter, aiModelFilter, deviceFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, eventTypeFilter, aiModelFilter, deviceFilter, isDateRangeActive, dateRange]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    generated: mockLogs.filter((l) => l.eventType === "AI Draft Generated" || l.eventType === "AI Draft Regenerated").length,
    accepted: mockLogs.filter((l) => l.eventType === "AI Draft Accepted").length,
    rejected: mockLogs.filter((l) => l.eventType === "AI Draft Rejected").length,
  }), []);

  const hasActiveFilters = eventTypeFilter !== "all" || aiModelFilter !== "all" || deviceFilter !== "all";

  function clearAllFilters() {
    setEventTypeFilter("all");
    setAiModelFilter("all");
    setDeviceFilter("all");
    setSearchFilter("");
    setCurrentPage(1);
  }

  function openDetail(log: AIDraftLog) {
    setSelectedLog(log);
    setDetailOpen(true);
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

  const SnapshotBlock = ({ label, content }: { label: string; content: string | null }) => {
    if (!content) return null;
    return (
      <div className="flex flex-col gap-1.5 py-2.5 border-b border-border last:border-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="bg-muted rounded-sm p-3">
          <p className="roboto-mono text-xs leading-relaxed text-foreground">{content}</p>
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageShell>
      <PageHeader
        title="AI Draft Generation & Acceptance Audit Logs"
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
              title="Total AI Events"
              value={stats.total}
              description="All AI draft audit events"
              icon={Bot}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Drafts Generated"
              value={stats.generated}
              description="Generated & regenerated"
              icon={Sparkles}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Accepted (As-Is)"
              value={stats.accepted}
              description="Accepted without modification"
              icon={ThumbsUp}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Rejected"
              value={stats.rejected}
              description="Draft rejected — manual report"
              icon={ThumbsDown}
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
                        placeholder="Search by audit ID, accession, UHID, radiologist, AI model"
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
                      <SelectItem value="AI Draft Generated">Generated</SelectItem>
                      <SelectItem value="AI Draft Regenerated">Regenerated</SelectItem>
                      <SelectItem value="AI Draft Accepted">Accepted</SelectItem>
                      <SelectItem value="AI Draft Modified">Modified</SelectItem>
                      <SelectItem value="AI Draft Rejected">Rejected</SelectItem>
                      <SelectItem value="AI Content Overridden">Overridden</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={aiModelFilter} onValueChange={setAiModelFilter}>
                    <SelectTrigger className="h-8 w-48 bg-card border-border text-foreground gap-1.5 px-3 rounded-sm font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="AI Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All AI Models</SelectItem>
                      <SelectItem value="RadiologyAI v2.1">RadiologyAI v2.1</SelectItem>
                      <SelectItem value="RadiologyAI v2.3">RadiologyAI v2.3</SelectItem>
                      <SelectItem value="PneumoDetect v1.4">PneumoDetect v1.4</SelectItem>
                      <SelectItem value="NeuroScan v3.0">NeuroScan v3.0</SelectItem>
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
                    <TableHead className="whitespace-nowrap">AI Model</TableHead>
                    <TableHead className="whitespace-nowrap">Version</TableHead>
                    <TableHead className="whitespace-nowrap">Confidence</TableHead>
                    <TableHead className="whitespace-nowrap">Prompt Ver.</TableHead>
                    <TableHead className="whitespace-nowrap">Accepted As-Is</TableHead>
                    <TableHead className="whitespace-nowrap">Modified Sections</TableHead>
                    <TableHead className="whitespace-nowrap">Report Ver.</TableHead>
                    <TableHead className="whitespace-nowrap">Generation Time</TableHead>
                    <TableHead className="whitespace-nowrap">Action Time</TableHead>
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
                        <TableCell className="text-sm whitespace-nowrap">{log.aiModelName}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.aiModelVersion}</Badge>
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap text-right">
                          {log.aiConfidenceScore !== null ? (
                            <span>{(log.aiConfidenceScore * 100).toFixed(0)}%</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {log.aiPromptVersion ? (
                            <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.aiPromptVersion}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getAcceptedAsIsBadge(log.acceptedAsIs)}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.modifiedSections ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{log.reportVersion}</Badge>
                        </TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.generationTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">{formatTimestamp(log.actionTimestamp)}</TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">{log.ipAddress}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{log.deviceType}</TableCell>
                        <TableCell className="whitespace-nowrap">{getStatusCell(log.status)}</TableCell>
                        
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={20}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <Bot className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">No AI draft audit logs found matching your criteria</p>
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
              AI Draft Audit Record
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">{selectedLog.auditId}</span>
              )}
            </DialogTitle>
            <DialogDescription>Complete AI draft audit record — read-only, immutable</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="max-h-[65vh] overflow-y-auto">
              {/* Core fields */}
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow label="Event Type" value={getEventTypeBadge(selectedLog.eventType)} />
              <DetailRow label="Accession Number" value={selectedLog.accessionNumber} mono />
              <DetailRow label="Study Instance UID" value={selectedLog.studyInstanceUid} mono />
              <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
              <DetailRow label="Radiologist UHID" value={selectedLog.radiologistId} mono />
              <DetailRow label="Radiologist Role" value={selectedLog.radiologistRole} />
              <DetailRow
                label="AI Model"
                value={
                  <div className="flex items-center gap-2">
                    <span>{selectedLog.aiModelName}</span>
                    <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.aiModelVersion}</Badge>
                  </div>
                }
              />
              <DetailRow
                label="AI Confidence Score"
                value={
                  selectedLog.aiConfidenceScore !== null
                    ? <span className="roboto-mono text-xs tabular-nums">{(selectedLog.aiConfidenceScore * 100).toFixed(0)}%</span>
                    : null
                }
              />
              <DetailRow
                label="AI Prompt Version"
                value={
                  selectedLog.aiPromptVersion
                    ? <Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.aiPromptVersion}</Badge>
                    : null
                }
              />
              <DetailRow label="Accepted As-Is" value={getAcceptedAsIsBadge(selectedLog.acceptedAsIs)} />
              <DetailRow label="Modified Sections" value={selectedLog.modifiedSections} />
              <DetailRow label="Report Version" value={<Badge variant="outline" className="roboto-mono text-xs tabular-nums">{selectedLog.reportVersion}</Badge>} />
              <DetailRow label="Generation Timestamp" value={formatTimestamp(selectedLog.generationTimestamp)} mono />
              <DetailRow label="Action Timestamp" value={formatTimestamp(selectedLog.actionTimestamp)} mono />
              <DetailRow label="Change Timestamp" value={formatTimestamp(selectedLog.changeTimestamp)} mono />
              <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
              <DetailRow label="Device Type" value={selectedLog.deviceType} />
              <DetailRow label="Status" value={getStatusCell(selectedLog.status)} />
              <DetailRow label="Facility ID" value={selectedLog.facilityId} mono />

              {/* Snapshots & rejection reason */}
              {(selectedLog.beforeSnapshot || selectedLog.afterSnapshot || selectedLog.rejectionReason) && (
                <>
                  <Separator className="my-3" />
                  <p className="text-xs text-muted-foreground mb-2">Content Snapshots</p>
                  <SnapshotBlock label="Before Snapshot (AI Draft)" content={selectedLog.beforeSnapshot} />
                  <SnapshotBlock label="After Snapshot (Final Content)" content={selectedLog.afterSnapshot} />
                  {selectedLog.rejectionReason && (
                    <div className="flex flex-col gap-1.5 py-2.5 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground">Rejection Reason</span>
                      <div className="bg-destructive/10 rounded-sm p-3">
                        <p className="text-xs text-destructive leading-relaxed">{selectedLog.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Logs Sheet */}
      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Export Logs</SheetTitle>
            <SheetDescription>Generate and download compliance reports from immutable AI draft generation and acceptance audit log data.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <ReportsTab />
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default AIDraftGenerationLogs;
