/**
 * ROLE-BASED AUDIT VISIBILITY — Story 23
 *
 * Audit logs visible based on user roles and permissions. Only authorized roles
 * (e.g. Admin, Super Admin) can access; visibility respects facility and module.
 *
 * SCOPE: RBAC for audit access. Radiologist: own report/case logs; Technician:
 * case assignments; Facility Admin: all within facility; Super Admin: full.
 * This page lists audit entries with Access Level and Visibility Scope.
 *
 * BACKEND: GET /api/admin/audit-logs/role-visibility — list (filtered by current user's role)
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  Calendar,
  Shield,
  User,
  Lock,
} from "lucide-react";
import { format, subDays, startOfMonth } from "date-fns";
import { ICON_STROKE_WIDTH } from "../../lib/constants";
import { Button } from "../../app/components/ui/button";
import { Card, CardContent } from "../../app/components/ui/card";
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
import { PageShell } from "../../app/components/layouts/page-shell";
import { PageHeader } from "../../app/components/blocks/page-header";
import { BackButton } from "../../app/components/blocks/back-button";
import { StatCard } from "../../app/components/cards/stat-card";
import { Pagination } from "../../app/components/ui/pagination";
import { DateRangePicker } from "../../app/components/ui/date-range-picker";

type Module = "RIS" | "PACS" | "LIMS" | "Integration";
type UserRole = "Radiologist" | "Technician" | "Facility Admin" | "Super Admin";
type ActionPerformed = "Create" | "Edit" | "Assign" | "Verify" | "Delete" | "View";
type EntityType = "Patient" | "Study" | "Report" | "User";
type AccessLevel = "Full" | "Limited" | "Restricted";
type VisibilityScope = "Own Facility" | "Assigned Cases" | "All Facilities";

interface RoleVisibilityLogEntry {
  auditId: string;
  eventType: string;
  module: Module;
  uhid: string;
  userName: string;
  userRole: UserRole;
  actionPerformed: ActionPerformed;
  entityType: EntityType;
  entityId: string;
  ipAddress: string;
  deviceInfo: string;
  timestamp: string;
  accessLevel: AccessLevel;
  visibilityScope: VisibilityScope;
  facilityId: string;
  loggedBy: string;
}

const ITEMS_PER_PAGE = 10;

const mockLogs: RoleVisibilityLogEntry[] = [
  {
    auditId: "RBAC-A-10001",
    eventType: "Report Edit",
    module: "RIS",
    uhid: "USR-101",
    userName: "Dr. Rad",
    userRole: "Radiologist",
    actionPerformed: "Edit",
    entityType: "Report",
    entityId: "RPT-60001",
    ipAddress: "192.168.20.101",
    deviceInfo: "Chrome 121 / Windows 11",
    timestamp: "2025-02-01 08:15:00",
    accessLevel: "Limited",
    visibilityScope: "Assigned Cases",
    facilityId: "FAC-001",
    loggedBy: "System",
  },
  {
    auditId: "RBAC-A-10002",
    eventType: "Case Assignment",
    module: "RIS",
    uhid: "USR-102",
    userName: "Tech One",
    userRole: "Technician",
    actionPerformed: "Assign",
    entityType: "Study",
    entityId: "ACC-2025-001",
    ipAddress: "192.168.20.102",
    deviceInfo: "Firefox 122",
    timestamp: "2025-02-01 09:30:00",
    accessLevel: "Limited",
    visibilityScope: "Assigned Cases",
    facilityId: "FAC-001",
    loggedBy: "System",
  },
  {
    auditId: "RBAC-A-10003",
    eventType: "Login",
    module: "RIS",
    uhid: "USR-201",
    userName: "Admin User",
    userRole: "Facility Admin",
    actionPerformed: "View",
    entityType: "User",
    entityId: "USR-201",
    ipAddress: "192.168.20.201",
    deviceInfo: "Chrome 121",
    timestamp: "2025-02-01 10:00:00",
    accessLevel: "Full",
    visibilityScope: "Own Facility",
    facilityId: "FAC-001",
    loggedBy: "System",
  },
  {
    auditId: "RBAC-A-10004",
    eventType: "Integration Event",
    module: "Integration",
    uhid: "USR-001",
    userName: "Super Admin",
    userRole: "Super Admin",
    actionPerformed: "View",
    entityType: "Study",
    entityId: "ACC-60001",
    ipAddress: "192.168.20.1",
    deviceInfo: "Chrome 121",
    timestamp: "2025-02-02 11:00:00",
    accessLevel: "Full",
    visibilityScope: "All Facilities",
    facilityId: "FAC-001",
    loggedBy: "System",
  },
];

const quickRanges = [
  { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: "Month to date", getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
];

function formatTs(ts: string): string {
  try {
    const [datePart, timePart] = ts.split(" ");
    const [y, m, d] = datePart.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d} ${months[parseInt(m, 10) - 1]} ${y.slice(2)}, ${timePart}`;
  } catch { return ts; }
}

const DetailRow = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div className="flex items-start py-2.5 border-b border-border last:border-0">
    <span className="w-44 shrink-0 text-xs text-muted-foreground">{label}</span>
    <span className={`text-sm flex-1 ${mono ? "font-mono text-xs tabular-nums" : ""}`}>
      {value ?? <span className="text-muted-foreground">—</span>}
    </span>
  </div>
);

export function RoleBasedAuditVisibility() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [moduleFilter, setModuleFilter] = React.useState("all");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [scopeFilter, setScopeFilter] = React.useState("all");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [facilityFilter, setFacilityFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ from: subDays(new Date(), 90), to: new Date() });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<RoleVisibilityLogEntry | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.eventType, log.uhid, log.userName, log.userRole, log.entityId].some((v) => String(v).toLowerCase().includes(q))) return false;
      if (moduleFilter !== "all" && log.module !== moduleFilter) return false;
      if (roleFilter !== "all" && log.userRole !== roleFilter) return false;
      if (scopeFilter !== "all" && log.visibilityScope !== scopeFilter) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (facilityFilter !== "all" && log.facilityId !== facilityFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.timestamp.replace(" ", "T"));
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, moduleFilter, roleFilter, scopeFilter, eventTypeFilter, facilityFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, moduleFilter, roleFilter, scopeFilter, eventTypeFilter, facilityFilter, isDateRangeActive, dateRange]);

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    fullAccess: mockLogs.filter((l) => l.accessLevel === "Full").length,
    limitedAccess: mockLogs.filter((l) => l.accessLevel === "Limited").length,
  }), []);

  const hasActiveFilters = moduleFilter !== "all" || roleFilter !== "all" || scopeFilter !== "all" || eventTypeFilter !== "all" || facilityFilter !== "all";

  function clearAllFilters() {
    setModuleFilter("all");
    setRoleFilter("all");
    setScopeFilter("all");
    setEventTypeFilter("all");
    setFacilityFilter("all");
    setSearchFilter("");
    setDateRange({ from: subDays(new Date(), 90), to: new Date() });
    setTempDateRange({});
    setIsDateRangeActive(false);
    setCurrentPage(1);
  }

  function openDetail(log: RoleVisibilityLogEntry) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  return (
    <PageShell>
      <PageHeader
        title="Role-based Audit Visibility"
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
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Total Events" value={stats.total} description="Visible audit events" icon={Shield} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Full Access" value={stats.fullAccess} description="Full visibility scope" icon={Lock} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Limited Access" value={stats.limitedAccess} description="Limited visibility" icon={User} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-muted-foreground" />
          </div>

          {/* Role-Based Visibility Matrix (from Story 23) */}
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Role-Based Visibility Matrix</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">Role</th>
                    <th className="text-left py-2 font-medium">Audit Visibility</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border"><td className="py-2 pr-4">Radiologist</td><td className="py-2">Only own report edits, case access logs</td></tr>
                  <tr className="border-b border-border"><td className="py-2 pr-4">Technician</td><td className="py-2">Case assignments and workflow actions</td></tr>
                  <tr className="border-b border-border"><td className="py-2 pr-4">Facility Admin</td><td className="py-2">All audit logs within the facility</td></tr>
                  <tr className="border-b border-border"><td className="py-2 pr-4">Super Admin</td><td className="py-2">Full visibility across all facilities and modules</td></tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-[16px]">
            <div className="flex flex-col gap-3 p-[0px]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={["w-48 justify-between gap-2 font-normal", isDateRangeActive ? "bg-primary/10 border-primary text-primary hover:bg-primary/15" : "bg-background border-border"].join(" ")}>
                        <span className={["text-sm", isDateRangeActive ? "text-primary" : "text-muted-foreground"].join(" ")}>{format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd")}</span>
                        {isDateRangeActive ? (
                          <span className="flex items-center" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); clearAllFilters(); setDateRange({ from: subDays(new Date(), 90), to: new Date() }); setTempDateRange({}); setIsDateRangeActive(false); setCurrentPage(1); }}>
                            <X className="size-4 text-primary shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
                          </span>
                        ) : (
                          <Calendar className="size-4 text-muted-foreground shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0 shadow-none bg-transparent" align="start" sideOffset={4}>
                      <DateRangePicker value={tempDateRange} quickRanges={quickRanges} onApply={(range) => { setDateRange(range); setTempDateRange(range); setIsDateRangeActive(true); setDatePickerOpen(false); setCurrentPage(1); }} onCancel={() => { setTempDateRange({}); setDatePickerOpen(false); }} />
                    </PopoverContent>
                  </Popover>
                  <div className="bg-background relative rounded-[8px] w-80">
                    <div className="flex items-center gap-2 px-3 py-[7.5px]">
                      <Search strokeWidth={ICON_STROKE_WIDTH} className="size-5 text-muted-foreground shrink-0" />
                      <input placeholder="Search by Audit ID, Event Type, UHID, User, Role, Entity ID…" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
                    </div>
                    <div aria-hidden="true" className="absolute border border-border inset-[-1px] pointer-events-none rounded-[4px]" />
                  </div>
                </div>
                <Button variant="outline" size="icon" aria-label="Filter options" aria-pressed={showFilters} onClick={() => setShowFilters((v) => !v)} className={showFilters ? "bg-accent text-accent-foreground border-border" : ""}>
                  <Filter className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
                </Button>
              </div>

              {showFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Select value={moduleFilter} onValueChange={(v) => { setModuleFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      <SelectItem value="RIS">RIS</SelectItem>
                      <SelectItem value="PACS">PACS</SelectItem>
                      <SelectItem value="LIMS">LIMS</SelectItem>
                      <SelectItem value="Integration">Integration</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="User Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Radiologist">Radiologist</SelectItem>
                      <SelectItem value="Technician">Technician</SelectItem>
                      <SelectItem value="Facility Admin">Facility Admin</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={scopeFilter} onValueChange={(v) => { setScopeFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Visibility Scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scopes</SelectItem>
                      <SelectItem value="Own Facility">Own Facility</SelectItem>
                      <SelectItem value="Assigned Cases">Assigned Cases</SelectItem>
                      <SelectItem value="All Facilities">All Facilities</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={eventTypeFilter} onValueChange={(v) => { setEventTypeFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Report Edit">Report Edit</SelectItem>
                      <SelectItem value="Case Assignment">Case Assignment</SelectItem>
                      <SelectItem value="Login">Login</SelectItem>
                      <SelectItem value="Integration Event">Integration Event</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={facilityFilter} onValueChange={(v) => { setFacilityFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      <SelectItem value="FAC-001">FAC-001</SelectItem>
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 bg-card border-border text-foreground font-medium hover:bg-accent rounded-[4px]" onClick={clearAllFilters} aria-label="Clear all filters">
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
                    <TableHead className="whitespace-nowrap">Module</TableHead>
                    <TableHead className="whitespace-nowrap">UHID</TableHead>
                    <TableHead className="whitespace-nowrap">User Name</TableHead>
                    <TableHead className="whitespace-nowrap">User Role</TableHead>
                    <TableHead className="whitespace-nowrap">Action</TableHead>
                    <TableHead className="whitespace-nowrap">Entity</TableHead>
                    <TableHead className="whitespace-nowrap">Access Level</TableHead>
                    <TableHead className="whitespace-nowrap">Visibility Scope</TableHead>
                    <TableHead className="whitespace-nowrap">Facility</TableHead>
                    <TableHead className="whitespace-nowrap w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-12 text-muted-foreground">No records found matching the current filters.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((log, idx) => {
                      const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <TableRow key={log.auditId}>
                          <TableCell className="text-right whitespace-nowrap"><span className="font-mono tabular-nums text-muted-foreground text-sm">{srNo}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.auditId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{formatTs(log.timestamp)}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline">{log.eventType}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.module}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.uhid}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.userName}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.userRole}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="secondary">{log.actionPerformed}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-xs">{log.entityType} / {log.entityId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline">{log.accessLevel}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-xs">{log.visibilityScope}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.facilityId}</span></TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); openDetail(log); }}>View</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {filteredLogs.length > 0 && (
                <div className="px-4 py-3 border-t border-border">
                  <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredLogs.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details (Role-based Visibility)</DialogTitle>
            <DialogDescription>Audit ID: <span className="font-mono tabular-nums">{selectedLog?.auditId}</span></DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Event &amp; Visibility</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
                  <DetailRow label="Event Type" value={selectedLog.eventType} />
                  <DetailRow label="Module" value={selectedLog.module} />
                  <DetailRow label="UHID" value={selectedLog.uhid} mono />
                  <DetailRow label="User Name" value={selectedLog.userName} />
                  <DetailRow label="User Role" value={selectedLog.userRole} />
                  <DetailRow label="Action Performed" value={selectedLog.actionPerformed} />
                  <DetailRow label="Entity Type" value={selectedLog.entityType} />
                  <DetailRow label="Entity ID" value={selectedLog.entityId} mono />
                  <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
                  <DetailRow label="Device Info" value={selectedLog.deviceInfo} />
                  <DetailRow label="Timestamp" value={formatTs(selectedLog.timestamp)} mono />
                  <DetailRow label="Access Level" value={selectedLog.accessLevel} />
                  <DetailRow label="Visibility Scope" value={selectedLog.visibilityScope} />
                  <DetailRow label="Facility ID" value={selectedLog.facilityId} mono />
                  <DetailRow label="Logged By" value={selectedLog.loggedBy} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Export Audit Logs</SheetTitle>
            <SheetDescription>Export visible audit log entries (Story 23). Export is role-controlled; only permitted modules and facilities are included.</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-sm text-muted-foreground">Select format and date range. Visibility respects your role and facility.</div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default RoleBasedAuditVisibility;
