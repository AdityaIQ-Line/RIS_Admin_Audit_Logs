import * as React from "react";
import {
  Search,
  XCircle,
  MonitorSmartphone,
  Lock,
  AlertTriangle,
  Globe,
  Clock,
  Filter,
  Calendar,
  X,
  Download,
  UserCheck,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
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
import { StatCard } from "../../app/components/cards/stat-card";
import { Pagination } from "../../app/components/ui/pagination";
import { DateRangePicker } from "../../app/components/ui/date-range-picker";

// --- Types ---

type UserRole =
  | "Radiologist"
  | "Technician"
  | "Front Desk"
  | "Facility Admin";
type DeviceType = "Web" | "Mobile" | "Workstation";
type AuthMethod = "Password" | "SSO" | "OTP";
type FailureCategory =
  | "Invalid Credentials"
  | "Brute Force"
  | "Account Locked"
  | "Session Blocked"
  | "Account Disabled"
  | "Token Error"
  | "IP Blocked";

interface FailedAttemptLog {
  auditId: string;
  userId: string;
  username: string;
  role: UserRole;
  facilityId: string;
  eventType: "Failed Login" | "Concurrent Session Blocked";
  attemptTimestamp: string;
  ipAddress: string;
  browserOs: string;
  authMethod: AuthMethod;
  failureCategory: FailureCategory;
  failureReason: string;
  attemptCount: number;
  deviceType: DeviceType;
  performedBy: string;
  // Derived compliance fields
  accountLockTriggered: boolean;
  lockTimestamp: string | null;
  accountStatus: "Active" | "Locked";
}

type FailedAttemptLogRaw = Omit<
  FailedAttemptLog,
  "accountLockTriggered" | "lockTimestamp" | "accountStatus"
>;

// --- Mock Data (50 records) ---

const mockFailedAttempts: FailedAttemptLogRaw[] = [
  // INVALID CREDENTIALS (FAD-001 to FAD-015)
  {
    auditId: "FAD-001",
    userId: "UNKNOWN",
    username: "sarah.johnson",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-15 07:57:34",
    ipAddress: "192.168.1.100",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (1st attempt)",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-002",
    userId: "UNKNOWN",
    username: "sarah.johnson",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-15 07:57:52",
    ipAddress: "192.168.1.100",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (2nd attempt)",
    attemptCount: 2,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-003",
    userId: "UNKNOWN",
    username: "michael.chen",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-15 07:45:01",
    ipAddress: "192.168.1.102",
    browserOs: "Firefox 122 / macOS 14",
    authMethod: "SSO",
    failureCategory: "Token Error",
    failureReason: "SSO token expired — re-authentication required",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-004",
    userId: "UNKNOWN",
    username: "emily.wong",
    role: "Radiologist",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-14 13:20:11",
    ipAddress: "192.168.2.50",
    browserOs: "Safari 17 / macOS 14",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (1st attempt)",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-005",
    userId: "UNKNOWN",
    username: "david.kumar",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-14 08:15:30",
    ipAddress: "192.168.1.103",
    browserOs: "Edge 120 / Windows 10",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (2nd attempt)",
    attemptCount: 2,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-006",
    userId: "UNKNOWN",
    username: "robert.anderson",
    role: "Front Desk",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-14 07:50:22",
    ipAddress: "192.168.1.104",
    browserOs: "Chrome 121 / Windows 10",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (1st attempt)",
    attemptCount: 1,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-007",
    userId: "UNKNOWN",
    username: "lisa.martinez",
    role: "Technician",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-13 08:29:55",
    ipAddress: "192.168.2.60",
    browserOs: "Safari 17 / iOS 17",
    authMethod: "OTP",
    failureCategory: "Token Error",
    failureReason: "OTP expired — new OTP sent",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-008",
    userId: "UNKNOWN",
    username: "priya.sharma",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-13 10:02:44",
    ipAddress: "192.168.1.108",
    browserOs: "Chrome 121 / Windows 10",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (1st attempt)",
    attemptCount: 1,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-009",
    userId: "UNKNOWN",
    username: "james.park",
    role: "Facility Admin",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-12 07:58:15",
    ipAddress: "192.168.1.105",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (1st attempt)",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-010",
    userId: "UNKNOWN",
    username: "mark.taylor",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-12 06:54:22",
    ipAddress: "192.168.1.115",
    browserOs: "Safari 17 / macOS 14",
    authMethod: "SSO",
    failureCategory: "Token Error",
    failureReason: "SSO session expired — must re-authenticate",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-011",
    userId: "UNKNOWN",
    username: "nina.patel",
    role: "Technician",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-11 08:14:33",
    ipAddress: "192.168.2.80",
    browserOs: "Chrome 121 / Windows 10",
    authMethod: "OTP",
    failureCategory: "Token Error",
    failureReason: "Invalid OTP entered",
    attemptCount: 1,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-012",
    userId: "UNKNOWN",
    username: "carlos.reyes",
    role: "Front Desk",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-11 07:29:45",
    ipAddress: "10.10.3.25",
    browserOs: "Firefox 122 / Ubuntu 22.04",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (3rd attempt)",
    attemptCount: 3,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-013",
    userId: "UNKNOWN",
    username: "anita.desai",
    role: "Radiologist",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-10 06:47:10",
    ipAddress: "10.10.3.20",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (2nd attempt)",
    attemptCount: 2,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-014",
    userId: "UNKNOWN",
    username: "daniel.garcia",
    role: "Facility Admin",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-10 06:48:44",
    ipAddress: "10.10.3.10",
    browserOs: "Chrome 121 / macOS 14",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (1st attempt)",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-015",
    userId: "UNKNOWN",
    username: "john.smith",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-09 08:59:44",
    ipAddress: "192.168.1.112",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Password expired — account requires reset",
    attemptCount: 1,
    deviceType: "Workstation",
    performedBy: "System",
  },
  // BRUTE FORCE / EXTERNAL THREATS (FAD-016 to FAD-025)
  {
    auditId: "FAD-016",
    userId: "UNKNOWN",
    username: "admin",
    role: "Facility Admin",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-15 01:22:04",
    ipAddress: "45.33.32.156",
    browserOs: "Python-urllib/3.11 / Linux",
    authMethod: "Password",
    failureCategory: "Brute Force",
    failureReason: "Brute-force detected — IP temporarily blocked",
    attemptCount: 47,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-017",
    userId: "UNKNOWN",
    username: "root",
    role: "Facility Admin",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-15 01:23:55",
    ipAddress: "45.33.32.156",
    browserOs: "Python-urllib/3.11 / Linux",
    authMethod: "Password",
    failureCategory: "IP Blocked",
    failureReason: "IP blocked — rate limit exceeded (100+ attempts)",
    attemptCount: 100,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-018",
    userId: "UNKNOWN",
    username: "administrator",
    role: "Facility Admin",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-14 02:45:33",
    ipAddress: "185.220.101.42",
    browserOs: "Scrapy/2.11 / Linux",
    authMethod: "Password",
    failureCategory: "Brute Force",
    failureReason: "Brute-force detected — IP temporarily blocked",
    attemptCount: 35,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-019",
    userId: "UNKNOWN",
    username: "hacker_bot",
    role: "Facility Admin",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-14 02:47:19",
    ipAddress: "185.220.101.42",
    browserOs: "Scrapy/2.11 / Linux",
    authMethod: "Password",
    failureCategory: "IP Blocked",
    failureReason: "IP blocked — rate limit exceeded",
    attemptCount: 78,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-020",
    userId: "UNKNOWN",
    username: "admin_test",
    role: "Facility Admin",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-13 03:15:22",
    ipAddress: "203.0.113.45",
    browserOs: "Chrome 120 / Linux",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid credentials (3rd attempt)",
    attemptCount: 3,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-021",
    userId: "UNKNOWN",
    username: "superuser",
    role: "Facility Admin",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-13 23:44:10",
    ipAddress: "198.51.100.78",
    browserOs: "curl/7.88 / Linux",
    authMethod: "Password",
    failureCategory: "Brute Force",
    failureReason: "Brute-force attempt — automated scanner detected",
    attemptCount: 22,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-022",
    userId: "UNKNOWN",
    username: "test_user",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-12 04:33:18",
    ipAddress: "172.16.0.99",
    browserOs: "Postman/10.0 / Windows 11",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "User does not exist",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-023",
    userId: "UNKNOWN",
    username: "admin",
    role: "Facility Admin",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-11 23:45:10",
    ipAddress: "185.220.101.42",
    browserOs: "Scrapy/2.11 / Linux",
    authMethod: "Password",
    failureCategory: "Brute Force",
    failureReason: "Brute-force detected — IP temporarily blocked",
    attemptCount: 42,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-024",
    userId: "UNKNOWN",
    username: "crawler_bot",
    role: "Facility Admin",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-10 02:10:45",
    ipAddress: "192.0.2.100",
    browserOs: "Python-requests/2.31 / Linux",
    authMethod: "Password",
    failureCategory: "IP Blocked",
    failureReason: "IP blocked — multiple failed attempts from same IP",
    attemptCount: 55,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-025",
    userId: "UNKNOWN",
    username: "root_access",
    role: "Facility Admin",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-09 01:05:33",
    ipAddress: "45.33.32.200",
    browserOs: "Python-urllib/3.11 / Linux",
    authMethod: "Password",
    failureCategory: "Brute Force",
    failureReason: "Automated attack detected — CAPTCHA triggered",
    attemptCount: 31,
    deviceType: "Web",
    performedBy: "System",
  },
  // ACCOUNT LOCKED (FAD-026 to FAD-032)
  {
    auditId: "FAD-026",
    userId: "UNKNOWN",
    username: "jsmith",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-15 06:12:55",
    ipAddress: "192.168.1.110",
    browserOs: "Chrome 121 / Android 14",
    authMethod: "OTP",
    failureCategory: "Account Locked",
    failureReason: "Account locked after 5 failed attempts",
    attemptCount: 5,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-027",
    userId: "UNKNOWN",
    username: "priya.sharma",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-14 10:04:05",
    ipAddress: "192.168.1.108",
    browserOs: "Chrome 121 / Windows 10",
    authMethod: "Password",
    failureCategory: "Account Locked",
    failureReason: "Account locked after 5 failed attempts",
    attemptCount: 5,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-028",
    userId: "UNKNOWN",
    username: "carlos.reyes",
    role: "Front Desk",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-13 07:30:01",
    ipAddress: "10.10.3.25",
    browserOs: "Firefox 122 / Ubuntu 22.04",
    authMethod: "Password",
    failureCategory: "Account Locked",
    failureReason: "Account locked — too many failed attempts",
    attemptCount: 5,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-029",
    userId: "UNKNOWN",
    username: "rachel.green",
    role: "Technician",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-12 08:49:30",
    ipAddress: "10.10.3.30",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "OTP",
    failureCategory: "Account Locked",
    failureReason: "Account locked after repeated OTP failures",
    attemptCount: 5,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-030",
    userId: "UNKNOWN",
    username: "john.smith",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-11 08:28:10",
    ipAddress: "192.168.1.112",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "Password",
    failureCategory: "Account Locked",
    failureReason: "Account locked — password policy violation",
    attemptCount: 5,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-031",
    userId: "UNKNOWN",
    username: "olivia.brown",
    role: "Front Desk",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-10 13:44:05",
    ipAddress: "192.168.2.85",
    browserOs: "Edge 120 / Windows 11",
    authMethod: "Password",
    failureCategory: "Account Locked",
    failureReason: "Account locked after 5 failed attempts",
    attemptCount: 5,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-032",
    userId: "UNKNOWN",
    username: "emily.wong",
    role: "Radiologist",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-09 06:29:50",
    ipAddress: "192.168.2.50",
    browserOs: "Safari 17 / macOS 14",
    authMethod: "SSO",
    failureCategory: "Account Locked",
    failureReason: "Account suspended — pending security review",
    attemptCount: 3,
    deviceType: "Web",
    performedBy: "System",
  },
  // CONCURRENT SESSION BLOCKED (FAD-033 to FAD-042)
  {
    auditId: "FAD-033",
    userId: "USR-009",
    username: "tom.wilson",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-15 09:15:30",
    ipAddress: "10.0.0.55",
    browserOs: "Firefox 122 / Windows 11",
    authMethod: "SSO",
    failureCategory: "Session Blocked",
    failureReason: "Active session exists on another device",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-034",
    userId: "USR-012",
    username: "anita.desai",
    role: "Radiologist",
    facilityId: "FAC-003",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-12 10:30:45",
    ipAddress: "10.10.3.20",
    browserOs: "Safari 17 / iOS 17",
    authMethod: "SSO",
    failureCategory: "Session Blocked",
    failureReason: "Active session exists on another device",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-035",
    userId: "USR-011",
    username: "kevin.lee",
    role: "Technician",
    facilityId: "FAC-002",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-11 12:10:15",
    ipAddress: "192.168.2.75",
    browserOs: "Chrome 121 / Android 14",
    authMethod: "OTP",
    failureCategory: "Session Blocked",
    failureReason: "Active session exists on another device",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-036",
    userId: "USR-001",
    username: "sarah.johnson",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-14 08:05:44",
    ipAddress: "10.20.1.50",
    browserOs: "Chrome 121 / iOS 17",
    authMethod: "SSO",
    failureCategory: "Session Blocked",
    failureReason: "Concurrent session policy — only one active session allowed",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-037",
    userId: "USR-002",
    username: "michael.chen",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-13 09:30:22",
    ipAddress: "10.20.1.55",
    browserOs: "Chrome 121 / Android 14",
    authMethod: "SSO",
    failureCategory: "Session Blocked",
    failureReason: "Active session exists on workstation",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-038",
    userId: "USR-019",
    username: "sophia.nguyen",
    role: "Radiologist",
    facilityId: "FAC-002",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-10 11:45:10",
    ipAddress: "192.168.2.95",
    browserOs: "Safari 17 / iOS 17",
    authMethod: "SSO",
    failureCategory: "Session Blocked",
    failureReason: "Active session exists on another device",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-039",
    userId: "USR-022",
    username: "alex.thompson",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-09 14:22:18",
    ipAddress: "10.0.0.60",
    browserOs: "Safari 17 / macOS 14",
    authMethod: "SSO",
    failureCategory: "Session Blocked",
    failureReason: "Concurrent session policy violated",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-040",
    userId: "USR-015",
    username: "mark.taylor",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-08 07:05:33",
    ipAddress: "192.168.1.118",
    browserOs: "Chrome 121 / Android 14",
    authMethod: "SSO",
    failureCategory: "Session Blocked",
    failureReason: "Active session exists on another device",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-041",
    userId: "USR-018",
    username: "daniel.garcia",
    role: "Facility Admin",
    facilityId: "FAC-003",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-07 09:12:44",
    ipAddress: "10.10.3.15",
    browserOs: "Chrome 121 / iOS 17",
    authMethod: "Password",
    failureCategory: "Session Blocked",
    failureReason: "Active admin session on primary workstation",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  {
    auditId: "FAD-042",
    userId: "USR-006",
    username: "robert.anderson",
    role: "Front Desk",
    facilityId: "FAC-001",
    eventType: "Concurrent Session Blocked",
    attemptTimestamp: "2025-01-06 13:05:22",
    ipAddress: "192.168.1.107",
    browserOs: "Chrome 121 / Android 14",
    authMethod: "Password",
    failureCategory: "Session Blocked",
    failureReason: "Concurrent session blocked — policy enforcement",
    attemptCount: 1,
    deviceType: "Mobile",
    performedBy: "System",
  },
  // ACCOUNT DISABLED (FAD-043 to FAD-046)
  {
    auditId: "FAD-043",
    userId: "UNKNOWN",
    username: "test.user",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-15 04:33:18",
    ipAddress: "172.16.0.99",
    browserOs: "Postman/10.0 / Windows 11",
    authMethod: "Password",
    failureCategory: "Account Disabled",
    failureReason: "Account disabled by administrator",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-044",
    userId: "UNKNOWN",
    username: "former.employee",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-13 18:45:11",
    ipAddress: "203.0.113.200",
    browserOs: "Chrome 121 / Windows 10",
    authMethod: "Password",
    failureCategory: "Account Disabled",
    failureReason: "Account deactivated — employee offboarded",
    attemptCount: 3,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-045",
    userId: "UNKNOWN",
    username: "suspended.user",
    role: "Technician",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-11 11:22:40",
    ipAddress: "192.168.2.88",
    browserOs: "Edge 120 / Windows 11",
    authMethod: "Password",
    failureCategory: "Account Disabled",
    failureReason: "Account suspended — pending investigation",
    attemptCount: 2,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-046",
    userId: "UNKNOWN",
    username: "temp.contractor",
    role: "Front Desk",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-09 09:05:55",
    ipAddress: "10.10.3.50",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "Password",
    failureCategory: "Account Disabled",
    failureReason: "Contractor access expired — contract ended",
    attemptCount: 1,
    deviceType: "Workstation",
    performedBy: "System",
  },
  // TOKEN / AUTH ERRORS (FAD-047 to FAD-050)
  {
    auditId: "FAD-047",
    userId: "UNKNOWN",
    username: "hannah.kim",
    role: "Technician",
    facilityId: "FAC-003",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-08 08:59:22",
    ipAddress: "10.10.3.35",
    browserOs: "Chrome 121 / ChromeOS 120",
    authMethod: "OTP",
    failureCategory: "Token Error",
    failureReason: "OTP not received — resend requested",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
  {
    auditId: "FAD-048",
    userId: "UNKNOWN",
    username: "ryan.murphy",
    role: "Technician",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-07 14:58:30",
    ipAddress: "192.168.1.120",
    browserOs: "Edge 120 / Windows 10",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Password expired — must reset before login",
    attemptCount: 1,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-049",
    userId: "UNKNOWN",
    username: "kevin.lee",
    role: "Technician",
    facilityId: "FAC-002",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-06 11:20:15",
    ipAddress: "192.168.2.75",
    browserOs: "Edge 120 / Windows 11",
    authMethod: "Password",
    failureCategory: "Invalid Credentials",
    failureReason: "Invalid password (1st attempt)",
    attemptCount: 1,
    deviceType: "Workstation",
    performedBy: "System",
  },
  {
    auditId: "FAD-050",
    userId: "UNKNOWN",
    username: "alex.thompson",
    role: "Radiologist",
    facilityId: "FAC-001",
    eventType: "Failed Login",
    attemptTimestamp: "2025-01-05 07:19:44",
    ipAddress: "192.168.1.130",
    browserOs: "Chrome 121 / Windows 11",
    authMethod: "SSO",
    failureCategory: "Token Error",
    failureReason: "SSO certificate validation failed",
    attemptCount: 1,
    deviceType: "Web",
    performedBy: "System",
  },
];

// --- Badge helpers ---

function getEventTypeBadge(
  eventType: "Failed Login" | "Concurrent Session Blocked",
) {
  if (eventType === "Concurrent Session Blocked") {
    return (
      <Badge variant="destructive">
        <MonitorSmartphone
          className="size-3 mr-1"
          strokeWidth={ICON_STROKE_WIDTH}
        />
        Blocked
      </Badge>
    );
  }
  return (
    <Badge variant="destructive">
      <XCircle className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
      Failed Login
    </Badge>
  );
}

function getFailureCategoryBadge(category: FailureCategory) {
  switch (category) {
    case "Brute Force":
    case "IP Blocked":
      return (
        <Badge variant="destructive" className="whitespace-nowrap">
          {category}
        </Badge>
      );
    case "Account Locked":
    case "Account Disabled":
      return (
        <Badge variant="outline" className="whitespace-nowrap">
          {category}
        </Badge>
      );
    case "Session Blocked":
      return (
        <Badge variant="secondary" className="whitespace-nowrap">
          {category}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="whitespace-nowrap">
          {category}
        </Badge>
      );
  }
}

// --- Detail Row sub-component ---

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start py-2.5 border-b border-border last:border-0">
      <span className="w-40 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-sm flex-1 ${mono ? "roboto-mono text-xs tabular-nums" : ""}`}
      >
        {value ?? <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );
}

// --- Main Component ---

export function FailedAttemptsTab() {
  const [records] = React.useState<FailedAttemptLog[]>(mockFailedAttempts.map((r) => ({
    ...r,
    accountLockTriggered:
      r.failureCategory === "Account Locked" ||
      r.failureCategory === "Brute Force" ||
      r.failureCategory === "IP Blocked",
    lockTimestamp:
      r.failureCategory === "Account Locked" ||
      r.failureCategory === "Brute Force" ||
      r.failureCategory === "IP Blocked"
        ? r.attemptTimestamp
        : null,
    accountStatus:
      r.failureCategory === "Account Locked" ||
      r.failureCategory === "Account Disabled"
        ? "Locked"
        : "Active",
  })));

  // Filters
  const [usernameFilter, setUsernameFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [deviceFilter, setDeviceFilter] = React.useState("all");
  const [facilityFilter, setFacilityFilter] = React.useState("all");
  const [authMethodFilter, setAuthMethodFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(true);
  // Attempt count sort — 'none' preserves original order
  const [attemptCountSort, setAttemptCountSort] = React.useState<
    "none" | "asc" | "desc"
  >("none");
  // --- NEW spec-required filters ---
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [accountStatusFilter, setAccountStatusFilter] = React.useState("all");
  const [attemptCountFilter, setAttemptCountFilter] = React.useState("all");
  const [failureReasonCodeFilter, setFailureReasonCodeFilter] = React.useState("all");

  // Date range
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 450),
    to: new Date(),
  });
  const [tempDateRange, setTempDateRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Detail dialog
  const [selectedRecord, setSelectedRecord] =
    React.useState<FailedAttemptLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const quickRanges = [
    {
      label: "Today",
      getValue: () => ({
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      }),
    },
    {
      label: "Last 7 days",
      getValue: () => ({
        from: subDays(new Date(), 7),
        to: new Date(),
      }),
    },
    {
      label: "Last 30 days",
      getValue: () => ({
        from: subDays(new Date(), 30),
        to: new Date(),
      }),
    },
    {
      label: "Last 90 days",
      getValue: () => ({
        from: subDays(new Date(), 90),
        to: new Date(),
      }),
    },
    {
      label: "Month to date",
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: new Date(),
      }),
    },
  ];

  // Stats
  const stats = React.useMemo(() => {
    const total = records.length;
    const accountLockouts = records.filter(
      (r) => r.failureCategory === "Account Locked",
    ).length;
    const bruteForce = records.filter(
      (r) =>
        r.failureCategory === "Brute Force" ||
        r.failureCategory === "IP Blocked",
    ).length;
    const sessionBlocked = records.filter(
      (r) => r.eventType === "Concurrent Session Blocked",
    ).length;
    // After-hours: before 06:00 or after 22:00
    const afterHours = records.filter((r) => {
      const hour = parseInt(r.attemptTimestamp.split(" ")[1].split(":")[0]);
      return hour < 6 || hour >= 22;
    }).length;
    return { total, accountLockouts, bruteForce, sessionBlocked, afterHours };
  }, [records]);

  // Filtered records
  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      const uq = usernameFilter.toLowerCase();
      const matchesUsername =
        !uq ||
        r.username.toLowerCase().includes(uq) ||
        r.userId.toLowerCase().includes(uq) ||
        r.ipAddress.toLowerCase().includes(uq);

      const matchesEventType =
        eventTypeFilter === "all" || r.eventType === eventTypeFilter;

      const matchesCategory =
        categoryFilter === "all" || r.failureCategory === categoryFilter;

      const matchesDevice =
        deviceFilter === "all" || r.deviceType === deviceFilter;

      const matchesFacility =
        facilityFilter === "all" || r.facilityId === facilityFilter;

      const matchesAuth =
        authMethodFilter === "all" || r.authMethod === authMethodFilter;

      const matchesRole = roleFilter === "all" || r.role === roleFilter;

      const matchesAccountStatus =
        accountStatusFilter === "all" || r.accountStatus === accountStatusFilter;

      const matchesAttemptCount =
        attemptCountFilter === "all" || r.attemptCount === parseInt(attemptCountFilter);

      const matchesFailureReasonCode =
        failureReasonCodeFilter === "all" || r.failureCategory === failureReasonCodeFilter;

      const logDate = new Date(r.attemptTimestamp);
      const matchesDate =
        logDate >= startOfDay(dateRange.from) &&
        logDate <= endOfDay(dateRange.to);

      return (
        matchesUsername &&
        matchesEventType &&
        matchesCategory &&
        matchesDevice &&
        matchesFacility &&
        matchesAuth &&
        matchesRole &&
        matchesAccountStatus &&
        matchesAttemptCount &&
        matchesFailureReasonCode &&
        matchesDate
      );
    });
  }, [
    records,
    usernameFilter,
    eventTypeFilter,
    categoryFilter,
    deviceFilter,
    facilityFilter,
    authMethodFilter,
    dateRange,
    roleFilter,
    accountStatusFilter,
    attemptCountFilter,
    failureReasonCodeFilter,
  ]);

  // Apply attempt-count sort on top of the filtered list
  const sortedRecords = React.useMemo(() => {
    if (attemptCountSort === "none") return filteredRecords;
    return [...filteredRecords].sort((a, b) =>
      attemptCountSort === "asc"
        ? a.attemptCount - b.attemptCount
        : b.attemptCount - a.attemptCount,
    );
  }, [filteredRecords, attemptCountSort]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedRecords.length / itemsPerPage),
  );
  const paginatedRecords = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRecords.slice(start, start + itemsPerPage);
  }, [sortedRecords, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    usernameFilter,
    eventTypeFilter,
    categoryFilter,
    deviceFilter,
    facilityFilter,
    authMethodFilter,
    dateRange,
    roleFilter,
    accountStatusFilter,
    attemptCountFilter,
    failureReasonCodeFilter,
    attemptCountSort,
  ]);

  const hasActiveFilters =
    eventTypeFilter !== "all" ||
    categoryFilter !== "all" ||
    deviceFilter !== "all" ||
    facilityFilter !== "all" ||
    authMethodFilter !== "all" ||
    usernameFilter !== "" ||
    roleFilter !== "all" ||
    accountStatusFilter !== "all" ||
    attemptCountFilter !== "all" ||
    failureReasonCodeFilter !== "all";

  const clearAllFilters = () => {
    setEventTypeFilter("all");
    setCategoryFilter("all");
    setDeviceFilter("all");
    setFacilityFilter("all");
    setAuthMethodFilter("all");
    setUsernameFilter("");
    setRoleFilter("all");
    setAccountStatusFilter("all");
    setAttemptCountFilter("all");
    setFailureReasonCodeFilter("all");
  };

  const handleExport = () => {
    alert(
      "Export functionality will download CSV/PDF of all failed attempt audit records",
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard
          title="Total Failed Attempts"
          value={stats.total}
          description="All failure events"
          icon={XCircle}
          iconStrokeWidth={ICON_STROKE_WIDTH}
          iconColor="text-destructive"
        />
        <StatCard
          title="Account Lockouts"
          value={stats.accountLockouts}
          description="Locked after repeated failures"
          icon={Lock}
          iconStrokeWidth={ICON_STROKE_WIDTH}
          iconColor="text-destructive"
        />
        <StatCard
          title="Brute Force / IP Blocked"
          value={stats.bruteForce}
          description="Automated attack attempts"
          icon={Globe}
          iconStrokeWidth={ICON_STROKE_WIDTH}
          iconColor="text-destructive"
        />
        <StatCard
          title="Concurrent Blocks"
          value={stats.sessionBlocked}
          description="Session policy violations"
          icon={MonitorSmartphone}
          iconStrokeWidth={ICON_STROKE_WIDTH}
          iconColor="text-muted-foreground"
        />
        <StatCard
          title="After-Hours Attempts"
          value={stats.afterHours}
          description="Before 06:00 or after 22:00"
          icon={Clock}
          iconStrokeWidth={ICON_STROKE_WIDTH}
          iconColor="text-muted-foreground"
        />
      </div>

      {/* Table Card */}
      <Card className="px-4 py-0 p-4">
        <div className="flex flex-col gap-3 p-0">
          {/* Toolbar Row */}
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
                      <X
                        className="size-4 text-primary shrink-0"
                        strokeWidth={ICON_STROKE_WIDTH}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateRange({
                            from: subDays(new Date(), 450),
                            to: new Date(),
                          });
                          setTempDateRange({});
                          setIsDateRangeActive(false);
                          setCurrentPage(1);
                        }}
                      />
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
                    onCancel={() => {
                      setTempDateRange({});
                      setDatePickerOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>

              {/* Search */}
              <div className="bg-background relative rounded-[8px] w-72">
                <div className="flex items-center gap-2 px-3 py-[7.5px]">
                  <Search
                    strokeWidth={ICON_STROKE_WIDTH}
                    className="size-5 text-muted-foreground shrink-0"
                  />
                  <input
                    placeholder="Search by username, UHID or IP address"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute border border-border inset-[-1px] pointer-events-none rounded-[4px]"
                />
              </div>
            </div>

            {/* Right: Export + Filter toggle */}
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

          {/* Filter Chips Row */}
          {showFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Event Type */}
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                
                <SelectContent>
                  <SelectItem value="all">All Event Types</SelectItem>
                  <SelectItem value="Failed Login">Failed Login</SelectItem>
                  <SelectItem value="Concurrent Session Blocked">
                    Session Blocked
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Failure Category */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                  <SelectValue placeholder="Failure Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Failure Reason Code</SelectItem>
                  <SelectItem value="Invalid Credentials">
                    Invalid Credentials
                  </SelectItem>
                  <SelectItem value="Brute Force">Brute Force</SelectItem>
                  <SelectItem value="IP Blocked">IP Blocked</SelectItem>
                  <SelectItem value="Account Locked">Account Locked</SelectItem>
                  <SelectItem value="Account Disabled">
                    Account Disabled
                  </SelectItem>
                  <SelectItem value="Session Blocked">Session Blocked</SelectItem>
                  <SelectItem value="Token Error">Token Error</SelectItem>
                </SelectContent>
              </Select>

              {/* Device */}
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Workstation">Workstation</SelectItem>
                </SelectContent>
              </Select>

              {/* Facility */}
              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                  <SelectValue placeholder="Facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  <SelectItem value="FAC-001">FAC-001</SelectItem>
                  <SelectItem value="FAC-002">FAC-002</SelectItem>
                  <SelectItem value="FAC-003">FAC-003</SelectItem>
                </SelectContent>
              </Select>

              {/* Auth Method */}
              <Select
                value={authMethodFilter}
                onValueChange={setAuthMethodFilter}
              >
                <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                  <SelectValue placeholder="Auth Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Auth Methods</SelectItem>
                  <SelectItem value="Password">Password</SelectItem>
                  <SelectItem value="SSO">SSO</SelectItem>
                  <SelectItem value="OTP">OTP</SelectItem>
                </SelectContent>
              </Select>

              {/* Role */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Radiologist">Radiologist</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Front Desk">Front Desk</SelectItem>
                  <SelectItem value="Facility Admin">Facility Admin</SelectItem>
                </SelectContent>
              </Select>

              {/* Account Status */}
              <Select
                value={accountStatusFilter}
                onValueChange={setAccountStatusFilter}
              >
                <SelectTrigger className="h-8 w-44 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                  <SelectValue placeholder="Account Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Locked">Locked</SelectItem>
                </SelectContent>
              </Select>

              {/* Failure Reason Code */}
              <Select
                value={failureReasonCodeFilter}
                onValueChange={setFailureReasonCodeFilter}
              >
                
                <SelectContent>
                  <SelectItem value="all">All Reason Codes</SelectItem>
                  <SelectItem value="Invalid Credentials">Invalid Credentials</SelectItem>
                  <SelectItem value="Brute Force">Brute Force</SelectItem>
                  <SelectItem value="IP Blocked">IP Blocked</SelectItem>
                  <SelectItem value="Account Locked">Account Locked</SelectItem>
                  <SelectItem value="Account Disabled">Account Disabled</SelectItem>
                  <SelectItem value="Session Blocked">Session Blocked</SelectItem>
                  <SelectItem value="Token Error">Token Error</SelectItem>
                </SelectContent>
              </Select>

              {/* Attempt Count */}
              <Select
                value={attemptCountFilter}
                onValueChange={setAttemptCountFilter}
              >
                
                <SelectContent>
                  <SelectItem value="all">All Counts</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear all — visible only when any filter is active */}
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
                <TableHead className="whitespace-nowrap">UHID</TableHead>
                <TableHead className="whitespace-nowrap">Entered Username</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="whitespace-nowrap">Facility ID</TableHead>
                <TableHead className="whitespace-nowrap">Event Type</TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  <button
                    onClick={() =>
                      setAttemptCountSort((prev) =>
                        prev === "none"
                          ? "desc"
                          : prev === "desc"
                            ? "asc"
                            : "none",
                      )
                    }
                    className="inline-flex items-center gap-1 justify-end w-full text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    aria-label={`Sort by attempt count ${attemptCountSort === "asc" ? "(ascending)" : attemptCountSort === "desc" ? "(descending)" : "(unsorted)"}`}
                  >
                    <span>Attempt Seq. No.</span>
                    {attemptCountSort === "asc" ? (
                      <ArrowUp strokeWidth={ICON_STROKE_WIDTH} className="size-3.5 text-primary shrink-0" />
                    ) : attemptCountSort === "desc" ? (
                      <ArrowDown strokeWidth={ICON_STROKE_WIDTH} className="size-3.5 text-primary shrink-0" />
                    ) : (
                      <ArrowUpDown strokeWidth={ICON_STROKE_WIDTH} className="size-3.5 shrink-0" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  Attempt Timestamp
                </TableHead>
                <TableHead className="whitespace-nowrap">IP Address</TableHead>
                <TableHead className="whitespace-nowrap">Browser / OS</TableHead>
                <TableHead className="whitespace-nowrap">Device</TableHead>
                <TableHead className="whitespace-nowrap">Auth Method</TableHead>
                <TableHead className="whitespace-nowrap">
                  Failure Reason Code
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  Failure Description
                </TableHead>
                <TableHead className="whitespace-nowrap text-center">
                  Lock Triggered
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  Lock Timestamp
                </TableHead>
                <TableHead className="whitespace-nowrap">Logged By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record) => (
                  <TableRow
                    key={record.auditId}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                      {record.auditId}
                    </TableCell>
                    <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                      {record.userId}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {record.username}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.role}</Badge>
                    </TableCell>
                    <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                      {record.facilityId}
                    </TableCell>
                    <TableCell>{getEventTypeBadge(record.eventType)}</TableCell>
                    <TableCell className="roboto-mono text-sm tabular-nums text-right">
                      {record.attemptCount}
                    </TableCell>
                    <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                      {record.attemptTimestamp}
                    </TableCell>
                    <TableCell className="roboto-mono text-sm tabular-nums whitespace-nowrap">
                      {record.ipAddress}
                    </TableCell>
                    <TableCell
                      className="text-xs whitespace-nowrap max-w-48 truncate"
                      title={record.browserOs}
                    >
                      {record.browserOs}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.deviceType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.authMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      {getFailureCategoryBadge(record.failureCategory)}
                    </TableCell>
                    <TableCell className="max-w-52">
                      <span
                        className="text-xs text-destructive truncate block"
                        title={record.failureReason}
                      >
                        {record.failureReason}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {record.accountLockTriggered ? (
                        <Badge variant="destructive" className="whitespace-nowrap">
                          <ShieldAlert className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="whitespace-nowrap">
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="roboto-mono text-xs tabular-nums whitespace-nowrap text-muted-foreground">
                      {record.lockTimestamp ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {record.performedBy}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={17} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 py-8">
                      <AlertTriangle
                        className="size-8 text-muted-foreground"
                        strokeWidth={ICON_STROKE_WIDTH}
                      />
                      <p className="text-sm text-muted-foreground">
                        No failed attempt records matching your criteria
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
              totalItems={sortedRecords.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Compliance Notice */}
          
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Failed Attempt Detail
              {selectedRecord && (
                <span className="roboto-mono text-sm tabular-nums text-muted-foreground">
                  {selectedRecord.auditId}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Complete failed authentication audit record — read-only, immutable
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="mt-2">
              <DetailRow
                label="Audit ID"
                value={selectedRecord.auditId}
                mono
              />
              <DetailRow label="UHID" value={selectedRecord.userId} mono />
              <DetailRow label="Entered Username" value={selectedRecord.username} />
              <DetailRow
                label="Role"
                value={
                  <Badge variant="secondary">{selectedRecord.role}</Badge>
                }
              />
              <DetailRow
                label="Facility ID"
                value={selectedRecord.facilityId}
                mono
              />
              <DetailRow
                label="Event Type"
                value={getEventTypeBadge(selectedRecord.eventType)}
              />
              <DetailRow
                label="Attempt Timestamp"
                value={selectedRecord.attemptTimestamp}
                mono
              />
              <DetailRow
                label="IP Address"
                value={selectedRecord.ipAddress}
                mono
              />
              <DetailRow label="Browser / OS" value={selectedRecord.browserOs} />
              <DetailRow label="Device Type" value={selectedRecord.deviceType} />
              <DetailRow
                label="Auth Method"
                value={
                  <Badge variant="outline">{selectedRecord.authMethod}</Badge>
                }
              />
              <DetailRow
                label="Failure Reason Code"
                value={getFailureCategoryBadge(selectedRecord.failureCategory)}
              />
              <DetailRow
                label="Failure Description"
                value={
                  <span className="text-destructive">
                    {selectedRecord.failureReason}
                  </span>
                }
              />
              <DetailRow
                label="Attempt Seq. No."
                value={
                  <span className="roboto-mono tabular-nums">
                    {selectedRecord.attemptCount}
                  </span>
                }
              />
              <DetailRow
                label="Lock Triggered"
                value={
                  selectedRecord.accountLockTriggered ? (
                    <Badge variant="destructive">
                      <ShieldAlert className="size-3 mr-1" strokeWidth={ICON_STROKE_WIDTH} />
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )
                }
              />
              <DetailRow
                label="Lock Timestamp"
                value={selectedRecord.lockTimestamp ?? "—"}
                mono
              />
              <DetailRow label="Logged By" value={selectedRecord.performedBy} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FailedAttemptsTab;