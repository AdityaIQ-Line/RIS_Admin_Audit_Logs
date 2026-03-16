/**
 * VIEW AUDIT LOGS (SEARCH & FILTER) — Story 21
 *
 * Unified view to search and filter audit logs by date, module, user, event type.
 * Read-only; supports export of filtered results. Facility-level restriction enforced.
 *
 * SCOPE: View audit logs, search by key identifiers, filter by date/module/event/role,
 * export filtered results. No edit/delete. Server-side pagination for large datasets.
 *
 * BACKEND: GET /api/admin/audit-logs/view — list with pagination, search, filters
 *          GET /api/admin/audit-logs/view/export — CSV / PDF (role-controlled)
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  Calendar,
  FileSearch,
  CheckCircle,
  XCircle,
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

type AuditStatus = "Success" | "Failed";

interface ViewAuditLogEntry {
  auditId: string;
  timestamp: string;
  eventType: string;
  moduleName: string;
  username: string;
  userRole: string;
  patientId: string | null;
  studyInstanceUid: string | null;
  accessionNumber: string | null;
  referenceId: string | null;
  status: AuditStatus;
  beforeSnapshot: string | null;
  afterSnapshot: string | null;
  changeReason: string | null;
  deviceBrowser: string | null;
  sessionId: string | null;
  errorCode: string | null;
  triggeredBy: "User" | "System";
  facilityId: string;
  ipAddress: string | null;
}

const ITEMS_PER_PAGE = 10;

const mockLogs: ViewAuditLogEntry[] = [
  {
    auditId: "AUD-V-10001",
    timestamp: "2025-02-01 08:15:00",
    eventType: "Report Finalized",
    moduleName: "Reports",
    username: "dr.rad@facility.com",
    userRole: "Radiologist",
    patientId: "UHID-8001",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    accessionNumber: "ACC-60001",
    referenceId: "RPT-60001",
    status: "Success",
    beforeSnapshot: null,
    afterSnapshot: '{"status":"Final","signedAt":"2025-02-01T08:15:00Z"}',
    changeReason: null,
    deviceBrowser: "Chrome 121 / Windows 11",
    sessionId: "SESS-001",
    errorCode: null,
    triggeredBy: "User",
    facilityId: "FAC-001",
    ipAddress: "192.168.20.101",
  },
  {
    auditId: "AUD-V-10002",
    timestamp: "2025-02-01 09:30:00",
    eventType: "Login",
    moduleName: "Authentication",
    username: "admin@facility.com",
    userRole: "Facility Admin",
    patientId: null,
    studyInstanceUid: null,
    accessionNumber: null,
    referenceId: null,
    status: "Success",
    beforeSnapshot: null,
    afterSnapshot: null,
    changeReason: null,
    deviceBrowser: "Firefox 122 / macOS",
    sessionId: "SESS-002",
    errorCode: null,
    triggeredBy: "User",
    facilityId: "FAC-001",
    ipAddress: "192.168.20.102",
  },
  {
    auditId: "AUD-V-10003",
    timestamp: "2025-02-01 10:45:00",
    eventType: "Report Edit",
    moduleName: "Reports",
    username: "dr.rad@facility.com",
    userRole: "Radiologist",
    patientId: "UHID-8002",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60002",
    accessionNumber: "ACC-60002",
    referenceId: "RPT-60002",
    status: "Failed",
    beforeSnapshot: '{"status":"Draft"}',
    afterSnapshot: null,
    changeReason: "Permission denied",
    deviceBrowser: "Chrome 121",
    sessionId: "SESS-001",
    errorCode: "AUTH-403",
    triggeredBy: "User",
    facilityId: "FAC-001",
    ipAddress: "192.168.20.101",
  },
  {
    auditId: "AUD-V-10004",
    timestamp: "2025-02-02 11:00:00",
    eventType: "Case Assigned",
    moduleName: "Worklist",
    username: "admin@facility.com",
    userRole: "Facility Admin",
    patientId: "UHID-5501",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.5501",
    accessionNumber: "ACC-2025-010",
    referenceId: "ACC-2025-010",
    status: "Success",
    beforeSnapshot: '{"assignedTo":null}',
    afterSnapshot: '{"assignedTo":"dr.rad@facility.com"}',
    changeReason: "Manual assignment",
    deviceBrowser: "Chrome 121",
    sessionId: "SESS-002",
    errorCode: null,
    triggeredBy: "User",
    facilityId: "FAC-001",
    ipAddress: "192.168.20.102",
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
    <span className="w-40 shrink-0 text-xs text-muted-foreground">{label}</span>
    <span className={`text-sm flex-1 break-all ${mono ? "font-mono text-xs tabular-nums" : ""}`}>
      {value ?? <span className="text-muted-foreground">—</span>}
    </span>
  </div>
);

export function ViewAuditLogsSearchFilter() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [moduleFilter, setModuleFilter] = React.useState("all");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ from: subDays(new Date(), 90), to: new Date() });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<ViewAuditLogEntry | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.eventType, log.moduleName, log.username, log.userRole, log.patientId ?? "", log.studyInstanceUid ?? "", log.accessionNumber ?? "", log.referenceId ?? "", log.facilityId].some((v) => String(v).toLowerCase().includes(q))) return false;
      if (moduleFilter !== "all" && log.moduleName !== moduleFilter) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.timestamp.replace(" ", "T"));
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, moduleFilter, eventTypeFilter, statusFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, moduleFilter, eventTypeFilter, statusFilter, isDateRangeActive, dateRange]);

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    success: mockLogs.filter((l) => l.status === "Success").length,
    failed: mockLogs.filter((l) => l.status === "Failed").length,
  }), []);

  const hasActiveFilters = moduleFilter !== "all" || eventTypeFilter !== "all" || statusFilter !== "all";

  function clearAllFilters() {
    setModuleFilter("all");
    setEventTypeFilter("all");
    setStatusFilter("all");
    setSearchFilter("");
    setDateRange({ from: subDays(new Date(), 90), to: new Date() });
    setTempDateRange({});
    setIsDateRangeActive(false);
    setCurrentPage(1);
  }

  function openDetail(log: ViewAuditLogEntry) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  const modules = Array.from(new Set(mockLogs.map((l) => l.moduleName)));
  const eventTypes = Array.from(new Set(mockLogs.map((l) => l.eventType)));

  return (
    <PageShell>
      <PageHeader
        title="View Audit Logs (Search & Filter)"
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
            <StatCard title="Total Events" value={stats.total} description="All audit events in range" icon={FileSearch} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Success" value={stats.success} description="Successful events" icon={CheckCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Failed" value={stats.failed} description="Failed events" icon={XCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
          </div>

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
                      <input placeholder="Search by Audit ID, Event Type, Module, User, Role, Patient ID, Study UID, Accession, Reference ID, Facility…" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
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
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      {modules.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={eventTypeFilter} onValueChange={(v) => { setEventTypeFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      {eventTypes.map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">Event Type</TableHead>
                    <TableHead className="whitespace-nowrap">Module</TableHead>
                    <TableHead className="whitespace-nowrap">User</TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead className="whitespace-nowrap">Patient ID</TableHead>
                    <TableHead className="whitespace-nowrap">Reference ID</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">No records found matching the current filters.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((log, idx) => {
                      const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <TableRow key={log.auditId}>
                          <TableCell className="text-right whitespace-nowrap"><span className="font-mono tabular-nums text-muted-foreground text-sm">{srNo}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{formatTs(log.timestamp)}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline">{log.eventType}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.moduleName}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.username}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.userRole}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.patientId ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.referenceId ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.status === "Success" && <Badge variant="default" className="gap-1"><CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Success</Badge>}
                            {log.status === "Failed" && <Badge variant="destructive" className="gap-1"><XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Failed</Badge>}
                          </TableCell>
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
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Audit ID: <span className="font-mono tabular-nums">{selectedLog?.auditId}</span></DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Event &amp; Detail</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Timestamp" value={formatTs(selectedLog.timestamp)} mono />
                  <DetailRow label="Event Type" value={selectedLog.eventType} />
                  <DetailRow label="Module" value={selectedLog.moduleName} />
                  <DetailRow label="Username" value={selectedLog.username} />
                  <DetailRow label="User Role" value={selectedLog.userRole} />
                  <DetailRow label="Patient ID" value={selectedLog.patientId ?? "—"} mono />
                  <DetailRow label="Study Instance UID" value={selectedLog.studyInstanceUid ?? "—"} mono />
                  <DetailRow label="Accession Number" value={selectedLog.accessionNumber ?? "—"} mono />
                  <DetailRow label="Reference ID" value={selectedLog.referenceId ?? "—"} mono />
                  <DetailRow label="Status" value={selectedLog.status} />
                  <DetailRow label="Before Snapshot" value={selectedLog.beforeSnapshot ?? "—"} mono />
                  <DetailRow label="After Snapshot" value={selectedLog.afterSnapshot ?? "—"} mono />
                  <DetailRow label="Change Reason" value={selectedLog.changeReason ?? "—"} />
                  <DetailRow label="Device / Browser" value={selectedLog.deviceBrowser ?? "—"} />
                  <DetailRow label="Session ID" value={selectedLog.sessionId ?? "—"} mono />
                  <DetailRow label="Error Code" value={selectedLog.errorCode ?? "—"} mono />
                  <DetailRow label="Triggered By" value={selectedLog.triggeredBy} />
                  <DetailRow label="Facility ID" value={selectedLog.facilityId} mono />
                  <DetailRow label="IP Address" value={selectedLog.ipAddress ?? "—"} mono />
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
            <SheetDescription>Export filtered audit log view (Story 21) in CSV or PDF. Export action is role-controlled and logged.</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-sm text-muted-foreground">Select format and date range. Export reflects applied filters.</div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default ViewAuditLogsSearchFilter;
