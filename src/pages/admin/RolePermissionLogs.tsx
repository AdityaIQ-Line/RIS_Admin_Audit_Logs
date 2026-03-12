// @refresh reset
import * as React from "react";
import {
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Key,
  Calendar,
  Layers,
  Search,
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
 * ROLE & PERMISSION CHANGE LOGS — Story 3
 *
 * SCOPE:
 * ✔ Role assignment
 * ✔ Role change
 * ✔ Permission add / remove
 * ✔ Permission override
 * ✔ Role activation / deactivation
 * ✔ Bulk role updates
 *
 * COMPLIANCE:
 * - NABH access governance requirements
 * - ISO 27001 control A.9 (Access Control)
 * - Forensic investigation and compliance audits
 *
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/audit-logs/role-permission — list with pagination
 * - Query params: targetUser, changedBy, roleName, permissionName,
 *                 changeType, module, status, facilityId, dateFrom, dateTo
 * - GET /api/admin/audit-logs/role-permission/export — CSV / PDF
 * - Facility Admin sees only their facility; Super Admin sees cross-facility
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type ChangeType = "Add" | "Remove" | "Modify";
type ChangeStatus = "Success" | "Failed";
type ActionPerformed = "Assign" | "Update" | "Remove" | "Activate" | "Deactivate";
type RisModule = "Reporting" | "PACS" | "Admin" | "Worklist" | "Billing";

interface RolePermissionLog {
  auditId: string;
  targetUserId: string;
  targetUsername: string;
  targetRoleBefore: string | null;
  targetRoleAfter: string | null;
  permissionBefore: string | null;
  permissionAfter: string | null;
  changeType: ChangeType;
  actionPerformed: ActionPerformed;
  module: RisModule;
  changedByUserId: string;
  changedByRole: string;
  changeTimestamp: string;
  ipAddress: string;
  changeReason: string | null;
  changeStatus: ChangeStatus;
  failureReason: string | null;
  facilityId: string;
}

// ─── Mock Data (50 records) ───────────────────────────────────────────────────
// ChangeType values: "Add" | "Remove" | "Modify"
// Add     = Role Assignment, Permission Added
// Remove  = Role Removed, Permission Removed
// Modify  = Role Change, Role Status Changed, Bulk Update

const mockRolePermissionLogs: RolePermissionLog[] = [
  // ── Feb 01 ──────────────────────────────────────────
  {
    auditId: "RPC-10001",
    targetUserId: "USR-011",
    targetUsername: "sarah.johnson",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Radiologist",
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Update",
    module: "Reporting",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-01 09:12:44",
    ipAddress: "192.168.1.10",
    changeReason: "Promotion after qualification",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10002",
    targetUserId: "USR-022",
    targetUsername: "michael.chen",
    targetRoleBefore: null,
    targetRoleAfter: "Radiologist",
    permissionBefore: null,
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "Reporting",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-01 09:45:00",
    ipAddress: "192.168.1.10",
    changeReason: "New hire onboarding",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10003",
    targetUserId: "USR-033",
    targetUsername: "emily.wong",
    targetRoleBefore: "Front Desk",
    targetRoleAfter: null,
    permissionBefore: "view_worklist, register_patient",
    permissionAfter: null,
    changeType: "Remove",
    actionPerformed: "Remove",
    module: "Worklist",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-01 11:30:22",
    ipAddress: "192.168.1.15",
    changeReason: "Staff resignation",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10004",
    targetUserId: "USR-044",
    targetUsername: "david.kumar",
    targetRoleBefore: "Technician",
    targetRoleAfter: null,
    permissionBefore: "upload_images, view_worklist",
    permissionAfter: "upload_images, view_worklist, edit_study",
    changeType: "Add",
    actionPerformed: "Update",
    module: "PACS",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-01 14:05:33",
    ipAddress: "192.168.1.10",
    changeReason: "Expanded duties",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10005",
    targetUserId: "USR-055",
    targetUsername: "james.park",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: null,
    permissionBefore: "view_reports, sign_reports, upload_images, admin_access",
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Remove",
    actionPerformed: "Update",
    module: "Admin",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-01 15:20:10",
    ipAddress: "192.168.1.10",
    changeReason: "Privilege de-escalation per audit",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  // ── Feb 03 ──────────────────────────────────────────
  {
    auditId: "RPC-10006",
    targetUserId: "USR-066",
    targetUsername: "robert.anderson",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Deactivate",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-03 08:00:00",
    ipAddress: "10.0.0.5",
    changeReason: "Account under review",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10007",
    targetUserId: "USR-077",
    targetUsername: "lisa.martinez",
    targetRoleBefore: null,
    targetRoleAfter: "Front Desk",
    permissionBefore: null,
    permissionAfter: "view_worklist, register_patient, schedule_appointment",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "Worklist",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-03 10:15:44",
    ipAddress: "192.168.1.10",
    changeReason: "New hire onboarding",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10008",
    targetUserId: "USR-088",
    targetUsername: "kevin.nguyen",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: "Facility Admin",
    permissionBefore: "view_reports, sign_reports",
    permissionAfter: "view_reports, sign_reports, manage_users, view_audit",
    changeType: "Modify",
    actionPerformed: "Update",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-03 11:00:05",
    ipAddress: "10.0.0.5",
    changeReason: "Appointed Facility Admin",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10009",
    targetUserId: "USR-099",
    targetUsername: "priya.patel",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: "upload_images, view_worklist, edit_study, delete_study",
    permissionAfter: "upload_images, view_worklist, edit_study",
    changeType: "Remove",
    actionPerformed: "Update",
    module: "PACS",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-03 13:45:20",
    ipAddress: "192.168.1.10",
    changeReason: "Role scope correction",
    changeStatus: "Failed",
    failureReason: "Permission is mandatory for role",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10010",
    targetUserId: "USR-100",
    targetUsername: "ahmed.hassan",
    targetRoleBefore: null,
    targetRoleAfter: "Technician",
    permissionBefore: null,
    permissionAfter: "upload_images, view_worklist",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "PACS",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-03 16:30:00",
    ipAddress: "192.168.1.15",
    changeReason: null,
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-003",
  },
  // ── Feb 05 ──────────────────────────────────────────
  {
    auditId: "RPC-10011",
    targetUserId: "USR-111",
    targetUsername: "sofia.garcia",
    targetRoleBefore: "Front Desk",
    targetRoleAfter: "Front Desk",
    permissionBefore: "view_worklist",
    permissionAfter: "view_worklist, register_patient",
    changeType: "Add",
    actionPerformed: "Update",
    module: "Worklist",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-05 09:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Expanded role duties",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10012",
    targetUserId: "USR-122",
    targetUsername: "tom.baker",
    targetRoleBefore: "Facility Admin",
    targetRoleAfter: "Radiologist",
    permissionBefore: "manage_users, view_audit, view_reports",
    permissionAfter: "view_reports, sign_reports",
    changeType: "Modify",
    actionPerformed: "Update",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-05 10:30:00",
    ipAddress: "10.0.0.5",
    changeReason: "Role reassignment per org change",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10013",
    targetUserId: "USR-133",
    targetUsername: "nina.sharma",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: null,
    permissionBefore: "view_reports, sign_reports",
    permissionAfter: null,
    changeType: "Remove",
    actionPerformed: "Remove",
    module: "Reporting",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-05 12:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Transfer to another facility",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10014",
    targetUserId: "USR-144",
    targetUsername: "oliver.brown",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Activate",
    module: "Admin",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-05 14:15:00",
    ipAddress: "192.168.1.10",
    changeReason: "Account review cleared",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10015",
    targetUserId: "USR-155",
    targetUsername: "rachel.kim",
    targetRoleBefore: null,
    targetRoleAfter: "Radiologist",
    permissionBefore: null,
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "Reporting",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-05 16:00:00",
    ipAddress: "192.168.1.15",
    changeReason: "New hire onboarding",
    changeStatus: "Failed",
    failureReason: "User already has an active role",
    facilityId: "FAC-003",
  },
  // ── Feb 08 ──────────────────────────────────────────
  {
    auditId: "RPC-10016",
    targetUserId: "USR-166",
    targetUsername: "jason.white",
    targetRoleBefore: null,
    targetRoleAfter: "Technician",
    permissionBefore: null,
    permissionAfter: "upload_images, view_worklist",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "PACS",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-08 08:30:00",
    ipAddress: "192.168.1.10",
    changeReason: "New hire onboarding",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10017",
    targetUserId: "USR-177",
    targetUsername: "grace.lee",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: "upload_images, view_worklist, edit_study",
    permissionAfter: "upload_images, view_worklist, edit_study, view_billing",
    changeType: "Add",
    actionPerformed: "Update",
    module: "Billing",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-08 10:00:00",
    ipAddress: "10.0.0.5",
    changeReason: "Billing module access granted",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10018",
    targetUserId: "USR-188",
    targetUsername: "henry.clark",
    targetRoleBefore: "Front Desk",
    targetRoleAfter: "Front Desk",
    permissionBefore: "view_worklist, register_patient, schedule_appointment, view_billing",
    permissionAfter: "view_worklist, register_patient, schedule_appointment",
    changeType: "Remove",
    actionPerformed: "Update",
    module: "Billing",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-08 11:20:00",
    ipAddress: "192.168.1.10",
    changeReason: "Scope reduction per HR directive",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10019",
    targetUserId: "USR-199",
    targetUsername: "anna.wilson",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: "Radiologist",
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Deactivate",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-08 13:00:00",
    ipAddress: "10.0.0.5",
    changeReason: "Temporary suspension — investigation",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-003",
  },
  {
    auditId: "RPC-10020",
    targetUserId: "USR-200",
    targetUsername: "carlos.mendez",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Radiologist",
    permissionBefore: "upload_images, view_worklist",
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Modify",
    actionPerformed: "Update",
    module: "Reporting",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-08 15:45:00",
    ipAddress: "192.168.1.10",
    changeReason: "Qualification upgrade",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  // ── Feb 10 ──────────────────────────────────────────
  {
    auditId: "RPC-10021",
    targetUserId: "USR-211",
    targetUsername: "diana.foster",
    targetRoleBefore: null,
    targetRoleAfter: "Facility Admin",
    permissionBefore: null,
    permissionAfter: "manage_users, view_audit, view_reports, system_settings",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-10 09:00:00",
    ipAddress: "10.0.0.5",
    changeReason: "New Facility Admin appointment",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-004",
  },
  {
    auditId: "RPC-10022",
    targetUserId: "USR-222",
    targetUsername: "felix.turner",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: null,
    permissionBefore: "view_reports, sign_reports",
    permissionAfter: null,
    changeType: "Remove",
    actionPerformed: "Remove",
    module: "Reporting",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-10 10:30:00",
    ipAddress: "192.168.1.15",
    changeReason: "Retired",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10023",
    targetUserId: "USR-233",
    targetUsername: "isabel.scott",
    targetRoleBefore: "Front Desk",
    targetRoleAfter: "Front Desk",
    permissionBefore: "view_worklist",
    permissionAfter: "view_worklist, register_patient",
    changeType: "Add",
    actionPerformed: "Update",
    module: "Worklist",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-10 11:45:00",
    ipAddress: "192.168.1.10",
    changeReason: null,
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10024",
    targetUserId: "USR-244",
    targetUsername: "leo.harris",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: "upload_images, view_worklist, edit_study",
    permissionAfter: "upload_images, view_worklist",
    changeType: "Remove",
    actionPerformed: "Update",
    module: "PACS",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-10 14:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Disciplinary action",
    changeStatus: "Failed",
    failureReason: "Cannot remove mandatory role permission",
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10025",
    targetUserId: "USR-255",
    targetUsername: "maya.robinson",
    targetRoleBefore: null,
    targetRoleAfter: "Technician",
    permissionBefore: null,
    permissionAfter: "upload_images, view_worklist",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "PACS",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-10 16:30:00",
    ipAddress: "192.168.1.15",
    changeReason: "New hire onboarding",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-003",
  },
  // ── Feb 12 ──────────────────────────────────────────
  {
    auditId: "RPC-10026",
    targetUserId: "USR-266",
    targetUsername: "noah.evans",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: "Radiologist",
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Activate",
    module: "Admin",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-12 08:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Investigation cleared",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10027",
    targetUserId: "USR-277",
    targetUsername: "olivia.james",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Radiologist",
    permissionBefore: "upload_images, view_worklist",
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Modify",
    actionPerformed: "Update",
    module: "Reporting",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-12 10:00:00",
    ipAddress: "10.0.0.5",
    changeReason: "Certified radiologist — upgrade",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10028",
    targetUserId: "USR-288",
    targetUsername: "patrick.martin",
    targetRoleBefore: "Facility Admin",
    targetRoleAfter: null,
    permissionBefore: "manage_users, view_audit, view_reports",
    permissionAfter: null,
    changeType: "Remove",
    actionPerformed: "Remove",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-12 11:30:00",
    ipAddress: "10.0.0.5",
    changeReason: "Admin role revoked",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10029",
    targetUserId: "USR-299",
    targetUsername: "quinn.taylor",
    targetRoleBefore: "Front Desk",
    targetRoleAfter: "Front Desk",
    permissionBefore: "view_worklist, register_patient",
    permissionAfter: "view_worklist, register_patient, view_billing",
    changeType: "Add",
    actionPerformed: "Update",
    module: "Billing",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-12 13:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Billing access requested",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10030",
    targetUserId: "USR-300",
    targetUsername: "ryan.cooper",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: "Radiologist",
    permissionBefore: "view_reports, sign_reports, upload_images, admin_access",
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Remove",
    actionPerformed: "Update",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-12 15:45:00",
    ipAddress: "10.0.0.5",
    changeReason: "Periodic access review",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-003",
  },
  // ── Feb 15 ──────────────────────────────────────────
  {
    auditId: "RPC-10031",
    targetUserId: "USR-311",
    targetUsername: "stephanie.nguyen",
    targetRoleBefore: null,
    targetRoleAfter: "Front Desk",
    permissionBefore: null,
    permissionAfter: "view_worklist, register_patient",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "Worklist",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-15 09:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "New hire onboarding",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10032",
    targetUserId: "USR-322",
    targetUsername: "thomas.reed",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Deactivate",
    module: "Admin",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-15 10:30:00",
    ipAddress: "192.168.1.15",
    changeReason: "Extended leave",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10033",
    targetUserId: "USR-333",
    targetUsername: "uma.patel",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: "Radiologist",
    permissionBefore: "view_reports",
    permissionAfter: "view_reports, sign_reports",
    changeType: "Add",
    actionPerformed: "Update",
    module: "Reporting",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-15 12:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "License verification complete",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10034",
    targetUserId: "USR-344",
    targetUsername: "victor.chen",
    targetRoleBefore: "Front Desk",
    targetRoleAfter: "Technician",
    permissionBefore: "view_worklist, register_patient",
    permissionAfter: "upload_images, view_worklist",
    changeType: "Modify",
    actionPerformed: "Update",
    module: "PACS",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-15 14:15:00",
    ipAddress: "192.168.1.10",
    changeReason: "Internal transfer",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10035",
    targetUserId: "USR-355",
    targetUsername: "wendy.hall",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: null,
    permissionBefore: "view_reports, sign_reports",
    permissionAfter: null,
    changeType: "Remove",
    actionPerformed: "Remove",
    module: "Reporting",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-15 16:00:00",
    ipAddress: "10.0.0.5",
    changeReason: "Contract ended",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-004",
  },
  // ── Feb 18 ──────────────────────────────────────────
  {
    auditId: "RPC-10036",
    targetUserId: "USR-366",
    targetUsername: "xavier.morris",
    targetRoleBefore: null,
    targetRoleAfter: "Radiologist",
    permissionBefore: null,
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "Reporting",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-18 08:30:00",
    ipAddress: "192.168.1.15",
    changeReason: "Locum radiologist start",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10037",
    targetUserId: "USR-377",
    targetUsername: "yasmine.patel",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: "upload_images, view_worklist",
    permissionAfter: "upload_images, view_worklist, edit_study",
    changeType: "Add",
    actionPerformed: "Update",
    module: "PACS",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-18 10:00:00",
    ipAddress: "192.168.1.10",
    changeReason: null,
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10038",
    targetUserId: "USR-388",
    targetUsername: "zachary.price",
    targetRoleBefore: "Facility Admin",
    targetRoleAfter: "Facility Admin",
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Deactivate",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-18 11:45:00",
    ipAddress: "10.0.0.5",
    changeReason: "Compliance investigation",
    changeStatus: "Failed",
    failureReason: "Cannot deactivate last active admin for facility",
    facilityId: "FAC-003",
  },
  {
    auditId: "RPC-10039",
    targetUserId: "USR-399",
    targetUsername: "alice.brooks",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Radiologist",
    permissionBefore: "upload_images, view_worklist",
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Modify",
    actionPerformed: "Update",
    module: "Reporting",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-18 13:30:00",
    ipAddress: "192.168.1.10",
    changeReason: "Fellowship completed",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10040",
    targetUserId: "USR-400",
    targetUsername: "ben.campbell",
    targetRoleBefore: null,
    targetRoleAfter: "Front Desk",
    permissionBefore: null,
    permissionAfter: "view_worklist, register_patient, schedule_appointment",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "Worklist",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-18 15:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "New hire onboarding",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  // ── Feb 20 ──────────────────────────────────────────
  {
    auditId: "RPC-10041",
    targetUserId: "USR-411",
    targetUsername: "carla.dixon",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: "Radiologist",
    permissionBefore: "view_reports, sign_reports, upload_images, view_billing",
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Remove",
    actionPerformed: "Update",
    module: "Billing",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-20 09:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Quarterly access review",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10042",
    targetUserId: "USR-422",
    targetUsername: "derek.foster",
    targetRoleBefore: "Front Desk",
    targetRoleAfter: null,
    permissionBefore: "view_worklist, register_patient",
    permissionAfter: null,
    changeType: "Remove",
    actionPerformed: "Remove",
    module: "Worklist",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-20 10:30:00",
    ipAddress: "192.168.1.15",
    changeReason: "Resignation",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10043",
    targetUserId: "USR-433",
    targetUsername: "elena.ross",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Activate",
    module: "Admin",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-20 12:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Return from leave",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10044",
    targetUserId: "USR-444",
    targetUsername: "frank.ward",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: "Radiologist",
    permissionBefore: "view_reports",
    permissionAfter: "view_reports, sign_reports",
    changeType: "Add",
    actionPerformed: "Update",
    module: "Reporting",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-20 14:00:00",
    ipAddress: "10.0.0.5",
    changeReason: "License renewal approved",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-003",
  },
  {
    auditId: "RPC-10045",
    targetUserId: "USR-455",
    targetUsername: "gina.young",
    targetRoleBefore: "Front Desk",
    targetRoleAfter: "Technician",
    permissionBefore: "view_worklist, register_patient",
    permissionAfter: "upload_images, view_worklist",
    changeType: "Modify",
    actionPerformed: "Update",
    module: "PACS",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-20 16:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Cross-trained and moved dept",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  // ── Feb 22 ──────────────────────────────────────────
  {
    auditId: "RPC-10046",
    targetUserId: "USR-466",
    targetUsername: "harry.griffin",
    targetRoleBefore: null,
    targetRoleAfter: "Technician",
    permissionBefore: null,
    permissionAfter: "upload_images, view_worklist",
    changeType: "Add",
    actionPerformed: "Assign",
    module: "PACS",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-22 09:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "New hire onboarding",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10047",
    targetUserId: "USR-477",
    targetUsername: "iris.campbell",
    targetRoleBefore: "Radiologist",
    targetRoleAfter: null,
    permissionBefore: "view_reports, sign_reports",
    permissionAfter: null,
    changeType: "Remove",
    actionPerformed: "Remove",
    module: "Reporting",
    changedByUserId: "ADM-002",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-22 10:45:00",
    ipAddress: "192.168.1.15",
    changeReason: "Contract ended",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-002",
  },
  {
    auditId: "RPC-10048",
    targetUserId: "USR-488",
    targetUsername: "jack.morgan",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Technician",
    permissionBefore: "upload_images, view_worklist, edit_study",
    permissionAfter: "upload_images, view_worklist",
    changeType: "Remove",
    actionPerformed: "Update",
    module: "PACS",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-22 12:30:00",
    ipAddress: "10.0.0.5",
    changeReason: "Annual access review",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-004",
  },
  {
    auditId: "RPC-10049",
    targetUserId: "USR-499",
    targetUsername: "kate.simmons",
    targetRoleBefore: null,
    targetRoleAfter: null,
    permissionBefore: null,
    permissionAfter: null,
    changeType: "Modify",
    actionPerformed: "Update",
    module: "Admin",
    changedByUserId: "ADM-003",
    changedByRole: "Super Admin",
    changeTimestamp: "2025-02-22 14:00:00",
    ipAddress: "10.0.0.5",
    changeReason: "Q1 annual access review — 12 users updated",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "RPC-10050",
    targetUserId: "USR-500",
    targetUsername: "liam.turner",
    targetRoleBefore: "Technician",
    targetRoleAfter: "Radiologist",
    permissionBefore: "upload_images, view_worklist",
    permissionAfter: "view_reports, sign_reports, upload_images",
    changeType: "Modify",
    actionPerformed: "Update",
    module: "Reporting",
    changedByUserId: "ADM-001",
    changedByRole: "Facility Admin",
    changeTimestamp: "2025-02-22 16:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Promotion — DNB Radiology certified",
    changeStatus: "Success",
    failureReason: null,
    facilityId: "FAC-001",
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Main Component ───────────────────────────────────────────────────────────

export function RolePermissionLogs() {
  const logs = mockRolePermissionLogs;

  // ── Filter state — Date & Time Range, search (Target User + Changed By),
  //   Facility, Role Name, Permission Name, Change Type, Module, Status ──
  const [facilityFilter, setFacilityFilter] = React.useState("all");
  const [searchFilter, setSearchFilter] = React.useState("");
  const [roleNameFilter, setRoleNameFilter] = React.useState("all");
  const [permissionNameFilter, setPermissionNameFilter] = React.useState("all");
  const [changeTypeFilter, setChangeTypeFilter] = React.useState("all");
  const [moduleFilter, setModuleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = ITEMS_PER_PAGE;

  // Date & Time Range
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 450),
    to: new Date(),
  });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});

  // Detail dialog + export sheet
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<RolePermissionLog | null>(null);
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
    const add = logs.filter((l) => l.changeType === "Add").length;
    const remove = logs.filter((l) => l.changeType === "Remove").length;
    const modify = logs.filter((l) => l.changeType === "Modify").length;
    const failed = logs.filter((l) => l.changeStatus === "Failed").length;
    return { total, add, remove, modify, failed };
  }, [logs]);

  // --- Filtered logs ---
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchesFacility = facilityFilter === "all" || log.facilityId === facilityFilter;

      const sq = searchFilter.toLowerCase();
      const matchesSearch =
        !sq ||
        log.targetUserId.toLowerCase().includes(sq) ||
        log.targetUsername.toLowerCase().includes(sq) ||
        log.changedByUserId.toLowerCase().includes(sq) ||
        log.auditId.toLowerCase().includes(sq);

      const matchesRoleName =
        roleNameFilter === "all" ||
        log.targetRoleBefore === roleNameFilter ||
        log.targetRoleAfter === roleNameFilter;

      const matchesPermissionName =
        permissionNameFilter === "all" ||
        (log.permissionBefore ?? "").includes(permissionNameFilter) ||
        (log.permissionAfter ?? "").includes(permissionNameFilter);

      const matchesChangeType =
        changeTypeFilter === "all" || log.changeType === changeTypeFilter;

      const matchesModule = moduleFilter === "all" || log.module === moduleFilter;

      const matchesStatus = statusFilter === "all" || log.changeStatus === statusFilter;

      const logDate = new Date(log.changeTimestamp);
      const matchesDate =
        logDate >= startOfDay(dateRange.from) && logDate <= endOfDay(dateRange.to);

      return (
        matchesFacility &&
        matchesSearch &&
        matchesRoleName &&
        matchesPermissionName &&
        matchesChangeType &&
        matchesModule &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    logs,
    facilityFilter,
    searchFilter,
    roleNameFilter,
    permissionNameFilter,
    changeTypeFilter,
    moduleFilter,
    statusFilter,
    dateRange,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    facilityFilter, searchFilter, roleNameFilter,
    permissionNameFilter, changeTypeFilter, moduleFilter, statusFilter, dateRange,
  ]);

  const hasActiveFilters =
    facilityFilter !== "all" ||
    roleNameFilter !== "all" ||
    permissionNameFilter !== "all" ||
    changeTypeFilter !== "all" ||
    moduleFilter !== "all" ||
    statusFilter !== "all";

  const clearAllFilters = () => {
    setFacilityFilter("all");
    setSearchFilter("");
    setRoleNameFilter("all");
    setPermissionNameFilter("all");
    setChangeTypeFilter("all");
    setModuleFilter("all");
    setStatusFilter("all");
  };

  // --- Helpers ---
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

  const getChangeTypeBadge = (ct: ChangeType) => {
    switch (ct) {
      case "Add":
        return (
          <Badge variant="default">
            <Key className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Add
          </Badge>
        );
      case "Remove":
        return (
          <Badge variant="destructive">
            <XCircle className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Remove
          </Badge>
        );
      case "Modify":
        return (
          <Badge variant="secondary">
            <Shield className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
            Modify
          </Badge>
        );
    }
  };

  const getStatusCell = (status: ChangeStatus) => {
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

  const getModuleBadge = (mod: RisModule) => (
    <Badge variant="ghost">{mod}</Badge>
  );

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
        title="Role & Permission Change Logs"
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
              title="Total Changes"
              value={stats.total}
              description="All audit events"
              icon={ShieldCheck}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Add"
              value={stats.add}
              description="Roles & permissions added"
              icon={UserCog}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-primary"
            />
            <StatCard
              title="Remove"
              value={stats.remove}
              description="Roles & permissions removed"
              icon={XCircle}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-destructive"
            />
            <StatCard
              title="Modify"
              value={stats.modify}
              description="Role changes & status updates"
              icon={Layers}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-muted-foreground"
            />
            <StatCard
              title="Failed Changes"
              value={stats.failed}
              description="Blocked by system"
              icon={ShieldAlert}
              iconStrokeWidth={ICON_STROKE_WIDTH}
              iconColor="text-destructive"
            />
          </div>

          {/* Logs Table */}
          <Card className="p-[16px]">
            <div className="flex flex-col gap-3 p-[0px]">

              {/* Row 1: Date & Time Range + Search | Filter icon */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                {/* Date & Time Range */}
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

                  {/* Search — Target User & Changed By */}
                  <div className="bg-background relative rounded-[8px] w-96">
                    <div className="flex items-center gap-2 px-3 py-[7.5px]">
                      <Search
                        strokeWidth={ICON_STROKE_WIDTH}
                        className="size-5 text-muted-foreground shrink-0"
                      />
                      <input
                        placeholder="Search by target user, changed by, audit ID"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      />
                      {searchFilter && (
                        <button
                          onClick={() => setSearchFilter("")}
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          aria-label="Clear search"
                        >
                          <X className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
                        </button>
                      )}
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute border border-border inset-[-1px] pointer-events-none rounded-[4px]"
                    />
                  </div>
                </div>

                {/* Filter icon */}
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

              {/* Filter panel — Facility, Role Name, Permission Name,
                  Change Type, Module, Status */}
              {showFilters && (
                <div className="flex items-center gap-2 flex-wrap">

                  {/* Facility */}
                  <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
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

                  {/* Role Name */}
                  <Select value={roleNameFilter} onValueChange={setRoleNameFilter}>
                    <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Role Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Radiologist">Radiologist</SelectItem>
                      <SelectItem value="Technician">Technician</SelectItem>
                      <SelectItem value="Front Desk">Front Desk</SelectItem>
                      <SelectItem value="Facility Admin">Facility Admin</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Permission Name */}
                  <Select value={permissionNameFilter} onValueChange={setPermissionNameFilter}>
                    <SelectTrigger className="h-8 w-56 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Permission Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Permissions</SelectItem>
                      <SelectItem value="view_reports">view_reports</SelectItem>
                      <SelectItem value="sign_reports">sign_reports</SelectItem>
                      <SelectItem value="upload_images">upload_images</SelectItem>
                      <SelectItem value="view_worklist">view_worklist</SelectItem>
                      <SelectItem value="register_patient">register_patient</SelectItem>
                      <SelectItem value="schedule_appointment">schedule_appointment</SelectItem>
                      <SelectItem value="edit_study">edit_study</SelectItem>
                      <SelectItem value="delete_study">delete_study</SelectItem>
                      <SelectItem value="admin_access">admin_access</SelectItem>
                      <SelectItem value="manage_users">manage_users</SelectItem>
                      <SelectItem value="view_audit">view_audit</SelectItem>
                      <SelectItem value="system_settings">system_settings</SelectItem>
                      <SelectItem value="view_billing">view_billing</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Change Type: Add / Remove / Modify */}
                  <Select value={changeTypeFilter} onValueChange={setChangeTypeFilter}>
                    <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Change Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Change Types</SelectItem>
                      <SelectItem value="Add">Add</SelectItem>
                      <SelectItem value="Remove">Remove</SelectItem>
                      <SelectItem value="Modify">Modify</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Module */}
                  <Select value={moduleFilter} onValueChange={setModuleFilter}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      <SelectItem value="Reporting">Reporting</SelectItem>
                      <SelectItem value="PACS">PACS</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Worklist">Worklist</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Status */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Target UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Target Username</TableHead>
                    <TableHead className="whitespace-nowrap">Target Role (Before)</TableHead>
                    <TableHead className="whitespace-nowrap">Target Role (After)</TableHead>
                    <TableHead className="whitespace-nowrap">Permission Before</TableHead>
                    <TableHead className="whitespace-nowrap">Permission After</TableHead>
                    <TableHead className="whitespace-nowrap">Change Type</TableHead>
                    <TableHead className="whitespace-nowrap">Action Performed</TableHead>
                    <TableHead className="whitespace-nowrap">Module</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Changed By Role</TableHead>
                    <TableHead className="whitespace-nowrap">Change Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="whitespace-nowrap">Change Reason</TableHead>
                    <TableHead className="whitespace-nowrap">Change Status</TableHead>
                    <TableHead className="whitespace-nowrap">Failure Reason</TableHead>
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
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.targetUserId}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.targetUsername}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                          {log.targetRoleBefore ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.targetRoleAfter ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums max-w-[140px] truncate" title={log.permissionBefore ?? ""}>
                          {log.permissionBefore ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums max-w-[140px] truncate" title={log.permissionAfter ?? ""}>
                          {log.permissionAfter ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {getChangeTypeBadge(log.changeType)}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.actionPerformed}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {getModuleBadge(log.module)}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.changedByUserId}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {log.changedByRole}
                        </TableCell>
                        <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap">
                          {formatTimestamp(log.changeTimestamp)}
                        </TableCell>
                        <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                          {log.ipAddress}
                        </TableCell>
                        <TableCell className="text-sm max-w-[160px] truncate" title={log.changeReason ?? ""}>
                          {log.changeReason ?? <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {getStatusCell(log.changeStatus)}
                        </TableCell>
                        <TableCell className="text-sm max-w-[160px] truncate" title={log.failureReason ?? ""}>
                          {log.failureReason
                            ? <span className="text-destructive">{log.failureReason}</span>
                            : <span className="text-muted-foreground">—</span>
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={17}>
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                          <Shield className="size-8 text-muted-foreground" strokeWidth={ICON_STROKE_WIDTH} />
                          <p className="text-sm text-muted-foreground">
                            No role or permission change logs found matching your criteria
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

      {/* Detail Dialog — all 17 spec fields */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Role &amp; Permission Change Detail
              {selectedLog && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">
                  {selectedLog.auditId}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Complete access-control audit record — read-only, immutable
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
              <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
              <DetailRow label="Target User ID" value={selectedLog.targetUserId} mono />
              <DetailRow label="Target Username" value={selectedLog.targetUsername} />
              <DetailRow label="Target Role (Before)" value={selectedLog.targetRoleBefore} />
              <DetailRow label="Target Role (After)" value={selectedLog.targetRoleAfter} />
              <DetailRow
                label="Permission Before"
                value={
                  selectedLog.permissionBefore
                    ? <span className="roboto-mono text-xs tabular-nums text-muted-foreground break-all">{selectedLog.permissionBefore}</span>
                    : null
                }
              />
              <DetailRow
                label="Permission After"
                value={
                  selectedLog.permissionAfter
                    ? <span className="roboto-mono text-xs tabular-nums break-all">{selectedLog.permissionAfter}</span>
                    : null
                }
              />
              <DetailRow label="Change Type" value={getChangeTypeBadge(selectedLog.changeType)} />
              <DetailRow label="Action Performed" value={selectedLog.actionPerformed} />
              <DetailRow label="Module" value={getModuleBadge(selectedLog.module)} />
              <DetailRow label="Changed By User ID" value={selectedLog.changedByUserId} mono />
              <DetailRow label="Changed By Role" value={selectedLog.changedByRole} />
              <DetailRow
                label="Change Timestamp"
                value={formatTimestamp(selectedLog.changeTimestamp)}
                mono
              />
              <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
              <DetailRow label="Change Reason" value={selectedLog.changeReason} />
              <DetailRow label="Change Status" value={getStatusCell(selectedLog.changeStatus)} />
              <DetailRow
                label="Failure Reason"
                value={
                  selectedLog.failureReason
                    ? <span className="text-destructive">{selectedLog.failureReason}</span>
                    : null
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
