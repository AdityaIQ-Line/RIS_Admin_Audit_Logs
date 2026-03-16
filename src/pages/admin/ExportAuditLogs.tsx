/**
 * EXPORT AUDIT LOGS — Story 22
 *
 * Tracks export of filtered audit logs (CSV / Excel / PDF). Export action is
 * role-controlled, logged as an audit event, and respects facility scope.
 *
 * SCOPE: Manual export by authorized user; export reflects applied filters.
 * Secure download, optional watermark "Confidential – Audit Use Only".
 * This page lists export history events (who exported what, when, format).
 *
 * BACKEND: GET /api/admin/audit-logs/export-history — list export events
 *          POST /api/admin/audit-logs/export — trigger export (role-controlled)
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  Calendar,
  FileDown,
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

type ExportFormat = "CSV" | "Excel" | "PDF";
type ExportStatus = "Success" | "Failed";

interface ExportAuditLogEntry {
  // Core Audit Fields (Story 22)
  auditId: string;
  eventType: string;
  moduleName: string;
  patientId: string | null; // UHID – masked if required
  username: string;
  userRole: string;
  facilityId: string;
  timestamp: string; // Server Time
  ipAddress: string | null;
  deviceType: string | null;
  sessionId: string | null;
  status: ExportStatus; // Success / Failed
  errorCode: string | null;
  triggeredBy: "User" | "System"; // User/System per Story 22
  changeReason: string | null;
  // Extended Fields (Optional) – Story 22
  beforeSnapshot: string | null; // JSON
  afterSnapshot: string | null; // JSON
  severity: string | null; // if applicable
  criticalFlagStatus: string | null;
  // Export-specific
  exportFormat: ExportFormat;
  rowCount: number;
  dateRangeFrom: string;
  dateRangeTo: string;
}

const ITEMS_PER_PAGE = 10;

const mockLogs: ExportAuditLogEntry[] = [
  {
    auditId: "EXP-A-10001",
    eventType: "Audit Logs Exported",
    moduleName: "Audit Logs",
    patientId: null,
    username: "admin@facility.com",
    userRole: "Facility Admin",
    facilityId: "FAC-001",
    timestamp: "2025-02-01 10:00:00",
    ipAddress: "192.168.20.102",
    deviceType: "Web",
    sessionId: "SESS-002",
    status: "Success",
    errorCode: null,
    triggeredBy: "User",
    changeReason: null,
    beforeSnapshot: null,
    afterSnapshot: null,
    severity: "Low",
    criticalFlagStatus: "No",
    exportFormat: "CSV",
    rowCount: 2500,
    dateRangeFrom: "2025-01-01",
    dateRangeTo: "2025-01-31",
  },
  {
    auditId: "EXP-A-10002",
    eventType: "Audit Logs Exported",
    moduleName: "Audit Logs",
    patientId: null,
    username: "compliance@facility.com",
    userRole: "Compliance Officer",
    facilityId: "FAC-001",
    timestamp: "2025-02-01 14:30:00",
    ipAddress: "192.168.20.105",
    deviceType: "Web",
    sessionId: "SESS-005",
    status: "Success",
    errorCode: null,
    triggeredBy: "User",
    changeReason: null,
    beforeSnapshot: null,
    afterSnapshot: null,
    severity: "Low",
    criticalFlagStatus: "No",
    exportFormat: "PDF",
    rowCount: 1200,
    dateRangeFrom: "2025-01-15",
    dateRangeTo: "2025-01-31",
  },
  {
    auditId: "EXP-A-10003",
    eventType: "Audit Logs Exported",
    moduleName: "Audit Logs",
    patientId: null,
    username: "itadmin@facility.com",
    userRole: "IT Admin",
    facilityId: "FAC-001",
    timestamp: "2025-02-02 09:15:00",
    ipAddress: "192.168.20.108",
    deviceType: "Web",
    sessionId: "SESS-008",
    status: "Failed",
    errorCode: "EXPORT-LIMIT",
    triggeredBy: "User",
    changeReason: "No records in range",
    beforeSnapshot: null,
    afterSnapshot: null,
    severity: "Medium",
    criticalFlagStatus: "No",
    exportFormat: "Excel",
    rowCount: 0,
    dateRangeFrom: "2025-02-01",
    dateRangeTo: "2025-02-02",
  },
  {
    auditId: "EXP-A-10004",
    eventType: "Audit Logs Exported",
    moduleName: "Audit Logs",
    patientId: null,
    username: "system",
    userRole: "System",
    facilityId: "FAC-001",
    timestamp: "2025-02-02 23:00:00",
    ipAddress: null,
    deviceType: null,
    sessionId: null,
    status: "Success",
    errorCode: null,
    triggeredBy: "System",
    changeReason: "Scheduled monthly export",
    beforeSnapshot: null,
    afterSnapshot: null,
    severity: null,
    criticalFlagStatus: null,
    exportFormat: "CSV",
    rowCount: 50000,
    dateRangeFrom: "2025-01-01",
    dateRangeTo: "2025-01-31",
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

export function ExportAuditLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [formatFilter, setFormatFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ from: subDays(new Date(), 90), to: new Date() });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<ExportAuditLogEntry | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.eventType, log.moduleName, log.username, log.userRole, log.facilityId, log.exportFormat, log.sessionId, log.severity, log.criticalFlagStatus, log.changeReason].some((v) => String(v ?? "").toLowerCase().includes(q))) return false;
      if (formatFilter !== "all" && log.exportFormat !== formatFilter) return false;
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.timestamp.replace(" ", "T"));
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, formatFilter, statusFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, formatFilter, statusFilter, isDateRangeActive, dateRange]);

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    success: mockLogs.filter((l) => l.status === "Success").length,
    failed: mockLogs.filter((l) => l.status === "Failed").length,
  }), []);

  const hasActiveFilters = formatFilter !== "all" || statusFilter !== "all";

  function clearAllFilters() {
    setFormatFilter("all");
    setStatusFilter("all");
    setSearchFilter("");
    setDateRange({ from: subDays(new Date(), 90), to: new Date() });
    setTempDateRange({});
    setIsDateRangeActive(false);
    setCurrentPage(1);
  }

  function openDetail(log: ExportAuditLogEntry) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  return (
    <PageShell>
      <PageHeader
        title="Export Audit Logs"
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
            <StatCard title="Total Exports" value={stats.total} description="Export events" icon={FileDown} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Success" value={stats.success} description="Completed exports" icon={CheckCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Failed" value={stats.failed} description="Failed exports" icon={XCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
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
                      <input placeholder="Search by Audit ID, User, Role, Facility, Format…" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
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
                  <Select value={formatFilter} onValueChange={(v) => { setFormatFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Formats</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Audit ID</TableHead>
                    <TableHead className="whitespace-nowrap">Event Type</TableHead>
                    <TableHead className="whitespace-nowrap">Module</TableHead>
                    <TableHead className="whitespace-nowrap">Patient ID</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">User</TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead className="whitespace-nowrap">Facility</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="whitespace-nowrap">Device</TableHead>
                    <TableHead className="whitespace-nowrap">Session ID</TableHead>
                    <TableHead className="whitespace-nowrap">Format</TableHead>
                    <TableHead className="whitespace-nowrap">Row Count</TableHead>
                    <TableHead className="whitespace-nowrap">Date Range</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Error Code</TableHead>
                    <TableHead className="whitespace-nowrap">Triggered By</TableHead>
                    <TableHead className="whitespace-nowrap max-w-[120px]">Change Reason</TableHead>
                    <TableHead className="whitespace-nowrap">Severity</TableHead>
                    <TableHead className="whitespace-nowrap">Critical Flag Status</TableHead>
                    <TableHead className="whitespace-nowrap w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={21} className="text-center py-12 text-muted-foreground">No records found matching the current filters.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((log, idx) => {
                      const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <TableRow key={log.auditId}>
                          <TableCell className="text-right whitespace-nowrap"><span className="font-mono tabular-nums text-muted-foreground text-sm">{srNo}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.auditId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.eventType}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.moduleName}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs text-muted-foreground">{log.patientId ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{formatTs(log.timestamp)}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.username}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.userRole}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.facilityId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.ipAddress ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-xs">{log.deviceType ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.sessionId ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline">{log.exportFormat}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-sm">{log.rowCount.toLocaleString()}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.dateRangeFrom} – {log.dateRangeTo}</span></TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.status === "Success" && <Badge variant="default" className="gap-1"><CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Success</Badge>}
                            {log.status === "Failed" && <Badge variant="destructive" className="gap-1"><XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Failed</Badge>}
                          </TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.errorCode ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.triggeredBy}</span></TableCell>
                          <TableCell className="max-w-[120px] truncate" title={log.changeReason ?? undefined}><span className="text-xs text-muted-foreground">{log.changeReason ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-xs">{log.severity ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-xs">{log.criticalFlagStatus ?? "—"}</span></TableCell>
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
            <DialogTitle>Export Audit Log Details</DialogTitle>
            <DialogDescription>Audit ID: <span className="font-mono tabular-nums">{selectedLog?.auditId}</span></DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Core Audit Fields (Story 22)</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Audit ID" value={selectedLog.auditId} mono />
                  <DetailRow label="Event Type" value={selectedLog.eventType} />
                  <DetailRow label="Module Name" value={selectedLog.moduleName} />
                  <DetailRow label="Patient ID (UHID – masked if required)" value={selectedLog.patientId ?? "—"} mono />
                  <DetailRow label="Username" value={selectedLog.username} />
                  <DetailRow label="User Role" value={selectedLog.userRole} />
                  <DetailRow label="Facility ID" value={selectedLog.facilityId} mono />
                  <DetailRow label="Timestamp (Server Time)" value={formatTs(selectedLog.timestamp)} mono />
                  <DetailRow label="IP Address" value={selectedLog.ipAddress ?? "—"} mono />
                  <DetailRow label="Device Type" value={selectedLog.deviceType ?? "—"} />
                  <DetailRow label="Session ID" value={selectedLog.sessionId ?? "—"} mono />
                  <DetailRow label="Status (Success / Failed)" value={selectedLog.status} />
                  <DetailRow label="Error Code (if applicable)" value={selectedLog.errorCode ?? "—"} mono />
                  <DetailRow label="Triggered By (User/System)" value={selectedLog.triggeredBy} />
                  <DetailRow label="Change Reason" value={selectedLog.changeReason ?? "—"} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Extended Fields (Optional)</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Before Snapshot (JSON)" value={selectedLog.beforeSnapshot ? <pre className="text-xs font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto bg-muted/50 p-2 rounded">{selectedLog.beforeSnapshot}</pre> : "—"} />
                  <DetailRow label="After Snapshot (JSON)" value={selectedLog.afterSnapshot ? <pre className="text-xs font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto bg-muted/50 p-2 rounded">{selectedLog.afterSnapshot}</pre> : "—"} />
                  <DetailRow label="Severity (if applicable)" value={selectedLog.severity ?? "—"} />
                  <DetailRow label="Critical Flag Status" value={selectedLog.criticalFlagStatus ?? "—"} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Export Summary</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Export Format" value={selectedLog.exportFormat} />
                  <DetailRow label="Row Count" value={selectedLog.rowCount.toLocaleString()} mono />
                  <DetailRow label="Date Range" value={`${selectedLog.dateRangeFrom} – ${selectedLog.dateRangeTo}`} mono />
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
            <SheetDescription>Trigger a new export (Story 22). Select format (CSV / Excel / PDF) and date range. Export is role-controlled and logged. File watermark: &quot;Confidential – Audit Use Only&quot;.</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-sm text-muted-foreground">Select format and date range. Max export range and row limit configurable. Export action is itself logged.</div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default ExportAuditLogs;
