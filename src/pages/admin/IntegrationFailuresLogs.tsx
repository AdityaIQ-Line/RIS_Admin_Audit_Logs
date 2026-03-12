/**
 * INTEGRATION FAILURES AUDIT LOG — Story 19
 *
 * Logs and tracks integration failures between RIS, PACS, and LIMS so that
 * failed data exchanges can be identified, investigated, and resolved quickly.
 *
 * SCOPE: All failed integration events (DICOM, HL7, API) between RIS–PACS–LIMS.
 * Admin users view from Audit Logs → Integration Failures. Search by system,
 * modality, study ID, patient ID, date range, error type. Export CSV/PDF.
 *
 * BACKEND: GET /api/admin/audit-logs/integration-failures — list with pagination
 *          GET /api/admin/audit-logs/integration-failures/export — CSV / PDF
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Calendar,
  Unplug,
  RefreshCw,
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

type SourceSystem = "RIS" | "PACS" | "LIMS";
type TargetSystem = "RIS" | "PACS" | "LIMS";
type TransactionType = "HL7" | "DICOM" | "API";
type FailureStatus = "Failed" | "Retried" | "Resolved";

interface IntegrationFailureLog {
  auditId: string;
  eventType: string;
  sourceSystem: SourceSystem;
  targetSystem: TargetSystem;
  transactionType: TransactionType;
  messageType: string;
  patientId: string | null;
  accessionNumber: string | null;
  studyUid: string | null;
  modality: string | null;
  failureReason: string;
  errorCode: string | null;
  retryAttempt: boolean;
  retryCount: number;
  status: FailureStatus;
  timestamp: string;
  loggedBy: string;
  resolutionNotes: string | null;
}

const ITEMS_PER_PAGE = 10;

const mockLogs: IntegrationFailureLog[] = [
  {
    auditId: "INTF-A-10001",
    eventType: "Integration Failure",
    sourceSystem: "RIS",
    targetSystem: "PACS",
    transactionType: "DICOM",
    messageType: "DICOM Store",
    patientId: "UHID-8001",
    accessionNumber: "ACC-60001",
    studyUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    modality: "CT",
    failureReason: "Network timeout during C-STORE — PACS did not respond within 30s",
    errorCode: "NET-001",
    retryAttempt: true,
    retryCount: 2,
    status: "Resolved",
    timestamp: "2025-02-01 08:20:00",
    loggedBy: "Integration Service",
    resolutionNotes: "Retry succeeded on attempt 3.",
  },
  {
    auditId: "INTF-A-10002",
    eventType: "Integration Failure",
    sourceSystem: "LIMS",
    targetSystem: "RIS",
    transactionType: "HL7",
    messageType: "ORM",
    patientId: "UHID-4501",
    accessionNumber: "ACC-2025-001",
    studyUid: null,
    modality: null,
    failureReason: "HL7 message rejected by RIS — invalid patient ID format",
    errorCode: "HL7-002",
    retryAttempt: false,
    retryCount: 0,
    status: "Failed",
    timestamp: "2025-02-01 09:15:00",
    loggedBy: "Integration Service",
    resolutionNotes: null,
  },
  {
    auditId: "INTF-A-10003",
    eventType: "Integration Failure",
    sourceSystem: "RIS",
    targetSystem: "PACS",
    transactionType: "DICOM",
    messageType: "DICOM Store",
    patientId: "UHID-8002",
    accessionNumber: "ACC-60002",
    studyUid: "1.2.840.10008.5.1.4.1.1.4.60002",
    modality: "MRI",
    failureReason: "Duplicate Study UID received — integration conflict",
    errorCode: "DICOM-003",
    retryAttempt: false,
    retryCount: 0,
    status: "Failed",
    timestamp: "2025-02-01 10:35:00",
    loggedBy: "System",
    resolutionNotes: null,
  },
  {
    auditId: "INTF-A-10004",
    eventType: "Integration Failure",
    sourceSystem: "PACS",
    targetSystem: "RIS",
    transactionType: "HL7",
    messageType: "ORU",
    patientId: "UHID-7001",
    accessionNumber: "ACC-50001",
    studyUid: null,
    modality: null,
    failureReason: "Partial message transfer — incomplete ORU segment",
    errorCode: "HL7-004",
    retryAttempt: true,
    retryCount: 1,
    status: "Resolved",
    timestamp: "2025-02-02 11:00:00",
    loggedBy: "Integration Service",
    resolutionNotes: "Full message resent successfully.",
  },
  {
    auditId: "INTF-A-10005",
    eventType: "Integration Failure",
    sourceSystem: "RIS",
    targetSystem: "LIMS",
    transactionType: "API",
    messageType: "REST",
    patientId: null,
    accessionNumber: null,
    studyUid: null,
    modality: null,
    failureReason: "Source system unavailable — LIMS returned 503",
    errorCode: "API-503",
    retryAttempt: true,
    retryCount: 3,
    status: "Failed",
    timestamp: "2025-02-02 14:20:00",
    loggedBy: "Integration Service",
    resolutionNotes: "Escalated to infra team.",
  },
  {
    auditId: "INTF-A-10006",
    eventType: "Integration Failure",
    sourceSystem: "RIS",
    targetSystem: "PACS",
    transactionType: "DICOM",
    messageType: "MWL",
    patientId: "UHID-5501",
    accessionNumber: "ACC-2025-010",
    studyUid: null,
    modality: "CT",
    failureReason: "PACS connection error — connection refused",
    errorCode: "NET-002",
    retryAttempt: true,
    retryCount: 2,
    status: "Retried",
    timestamp: "2025-02-03 08:00:00",
    loggedBy: "System",
    resolutionNotes: null,
  },
  {
    auditId: "INTF-A-10007",
    eventType: "Integration Failure",
    sourceSystem: "LIMS",
    targetSystem: "RIS",
    transactionType: "HL7",
    messageType: "ORM",
    patientId: "UHID-4502",
    accessionNumber: "ACC-2025-002",
    studyUid: null,
    modality: null,
    failureReason: "Rejection reason: Invalid ordering physician ID",
    errorCode: "HL7-005",
    retryAttempt: false,
    retryCount: 0,
    status: "Failed",
    timestamp: "2025-02-03 09:45:00",
    loggedBy: "Integration Service",
    resolutionNotes: null,
  },
  {
    auditId: "INTF-A-10008",
    eventType: "Integration Failure",
    sourceSystem: "RIS",
    targetSystem: "PACS",
    transactionType: "DICOM",
    messageType: "DICOM Store",
    patientId: "UHID-8003",
    accessionNumber: "ACC-60003",
    studyUid: "1.2.840.10008.5.1.4.1.1.2.60003",
    modality: "CT",
    failureReason: "Network failure during DICOM push",
    errorCode: "NET-003",
    retryAttempt: true,
    retryCount: 1,
    status: "Resolved",
    timestamp: "2025-02-04 10:15:00",
    loggedBy: "Integration Service",
    resolutionNotes: "Retry succeeded.",
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

export function IntegrationFailuresLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [targetFilter, setTargetFilter] = React.useState("all");
  const [transactionFilter, setTransactionFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ from: subDays(new Date(), 450), to: new Date() });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<IntegrationFailureLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.patientId ?? "", log.accessionNumber ?? "", log.studyUid ?? "", log.failureReason, log.errorCode ?? ""].some((v) => String(v).toLowerCase().includes(q))) return false;
      if (sourceFilter !== "all" && log.sourceSystem !== sourceFilter) return false;
      if (targetFilter !== "all" && log.targetSystem !== targetFilter) return false;
      if (transactionFilter !== "all" && log.transactionType !== transactionFilter) return false;
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.timestamp.replace(" ", "T"));
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, sourceFilter, targetFilter, transactionFilter, statusFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, sourceFilter, targetFilter, transactionFilter, statusFilter, isDateRangeActive, dateRange]);

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    failed: mockLogs.filter((l) => l.status === "Failed").length,
    resolved: mockLogs.filter((l) => l.status === "Resolved").length,
    retried: mockLogs.filter((l) => l.retryAttempt).length,
  }), []);

  const hasActiveFilters = sourceFilter !== "all" || targetFilter !== "all" || transactionFilter !== "all" || statusFilter !== "all";

  function clearAllFilters() {
    setSourceFilter("all");
    setTargetFilter("all");
    setTransactionFilter("all");
    setStatusFilter("all");
    setSearchFilter("");
    setDateRange({ from: subDays(new Date(), 450), to: new Date() });
    setTempDateRange({});
    setIsDateRangeActive(false);
    setCurrentPage(1);
  }

  function openDetail(log: IntegrationFailureLog) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  return (
    <PageShell>
      <PageHeader
        title="Integration Failures (RIS–PACS–LIMS)"
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

          <div className="grid gap-4 md:grid-cols-4">
            <StatCard title="Total Failures" value={stats.total} description="All integration failure events" icon={Unplug} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
            <StatCard title="Failed" value={stats.failed} description="Unresolved failures" icon={XCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
            <StatCard title="Resolved" value={stats.resolved} description="Retry or manual resolution" icon={CheckCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="With Retry" value={stats.retried} description="Automatic retry attempted" icon={RefreshCw} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-muted-foreground" />
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
                          <span className="flex items-center" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); clearAllFilters(); setDateRange({ from: subDays(new Date(), 450), to: new Date() }); setTempDateRange({}); setIsDateRangeActive(false); setCurrentPage(1); }}>
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
                      <input placeholder="Search by audit ID, study ID, patient, accession, error…" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
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
                  <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="RIS">RIS</SelectItem>
                      <SelectItem value="PACS">PACS</SelectItem>
                      <SelectItem value="LIMS">LIMS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={targetFilter} onValueChange={(v) => { setTargetFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Targets</SelectItem>
                      <SelectItem value="RIS">RIS</SelectItem>
                      <SelectItem value="PACS">PACS</SelectItem>
                      <SelectItem value="LIMS">LIMS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={transactionFilter} onValueChange={(v) => { setTransactionFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Transaction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="HL7">HL7</SelectItem>
                      <SelectItem value="DICOM">DICOM</SelectItem>
                      <SelectItem value="API">API</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Retried">Retried</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Source</TableHead>
                    <TableHead className="whitespace-nowrap">Target</TableHead>
                    <TableHead className="whitespace-nowrap">Transaction</TableHead>
                    <TableHead className="whitespace-nowrap">Message Type</TableHead>
                    <TableHead className="whitespace-nowrap">Patient / Accession</TableHead>
                    <TableHead className="whitespace-nowrap">Failure Reason</TableHead>
                    <TableHead className="whitespace-nowrap">Retry</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">No records found matching the current filters.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((log, idx) => {
                      const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <TableRow key={log.auditId} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(log)}>
                          <TableCell className="text-right whitespace-nowrap"><span className="font-mono tabular-nums text-muted-foreground text-sm">{srNo}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.auditId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{formatTs(log.timestamp)}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline">{log.sourceSystem}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline">{log.targetSystem}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.transactionType}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.messageType}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.patientId ?? "—"} / {log.accessionNumber ?? "—"}</span></TableCell>
                          <TableCell className="max-w-[200px]"><span className="text-sm text-muted-foreground line-clamp-2">{log.failureReason}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-sm">{log.retryCount}</span></TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.status === "Failed" && <Badge variant="destructive" className="gap-1"><XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Failed</Badge>}
                            {log.status === "Resolved" && <Badge variant="default" className="gap-1"><CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Resolved</Badge>}
                            {log.status === "Retried" && <Badge variant="secondary" className="gap-1"><RefreshCw strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Retried</Badge>}
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
            <DialogTitle>Integration Failure Details</DialogTitle>
            <DialogDescription>Audit ID: <span className="font-mono tabular-nums">{selectedLog?.auditId}</span></DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Event Summary</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Source System" value={selectedLog.sourceSystem} />
                  <DetailRow label="Target System" value={selectedLog.targetSystem} />
                  <DetailRow label="Transaction Type" value={selectedLog.transactionType} />
                  <DetailRow label="Message Type" value={selectedLog.messageType} />
                  <DetailRow label="Timestamp" value={formatTs(selectedLog.timestamp)} mono />
                  <DetailRow label="Patient ID" value={selectedLog.patientId ?? "—"} mono />
                  <DetailRow label="Accession Number" value={selectedLog.accessionNumber ?? "—"} mono />
                  <DetailRow label="Study UID" value={selectedLog.studyUid ?? "—"} mono />
                  <DetailRow label="Modality" value={selectedLog.modality ?? "—"} />
                  <DetailRow label="Failure Reason" value={selectedLog.failureReason} />
                  <DetailRow label="Error Code" value={selectedLog.errorCode ?? "—"} mono />
                  <DetailRow label="Retry Attempt" value={selectedLog.retryAttempt ? "Yes" : "No"} />
                  <DetailRow label="Retry Count" value={selectedLog.retryCount} mono />
                  <DetailRow label="Status" value={selectedLog.status} />
                  <DetailRow label="Logged By" value={selectedLog.loggedBy} />
                  <DetailRow label="Resolution Notes" value={selectedLog.resolutionNotes ?? "—"} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Export Integration Failure Logs</SheetTitle>
            <SheetDescription>Export audit records for Integration Failures RIS–PACS–LIMS (Story 19) in CSV or PDF format.</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-sm text-muted-foreground">Select format and date range to export. (Integration with export API can be wired here.)</div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default IntegrationFailuresLogs;
