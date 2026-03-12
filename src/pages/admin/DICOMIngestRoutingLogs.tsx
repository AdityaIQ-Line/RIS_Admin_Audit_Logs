/**
 * DICOM INGEST & ROUTING AUDIT LOG — Story 16
 *
 * Audits all DICOM ingest (C-STORE) and routing events for data integrity,
 * routing failure detection, patient-study mismatch prevention, and medico-legal traceability.
 *
 * SCOPE: Study/Series/Image ingest, validation, rejection, merge/split, routing to PACS/Archive/AI.
 * EXCLUDED: Image viewing audit, Report editing audit.
 *
 * BACKEND: GET /api/admin/audit-logs/dicom-ingest-routing — list with pagination
 *          GET /api/admin/audit-logs/dicom-ingest-routing/export — CSV / PDF
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
  Database,
  Route,
  AlertTriangle,
  RefreshCw,
  Merge,
  Split,
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

type DICOMEventType =
  | "DICOM Study Received"
  | "DICOM Validation Passed"
  | "DICOM Validation Failed"
  | "Study Rejected"
  | "Study Routed"
  | "Routing Failed"
  | "Routing Retried"
  | "Study Merged"
  | "Study Split";

type RoutingStatus = "Success" | "Failed";

interface DICOMIngestRoutingLog {
  auditId: string;
  eventType: DICOMEventType;
  studyInstanceUid: string;
  accessionNumber: string;
  patientId: string;
  patientName: string;
  modality: string;
  studyDateTime: string;
  callingAETitle: string;
  calledAETitle: string;
  sourceIP: string;
  destinationAETitle: string | null;
  destinationSystem: string | null;
  routingRuleId: string | null;
  routingTimestamp: string | null;
  routingStatus: RoutingStatus | null;
  retryCount: number;
  errorCode: string | null;
  errorMessage: string | null;
  serverTimestamp: string;
  processingTimeMs: number;
  triggeredBy: string;
  facilityId: string;
}

const ITEMS_PER_PAGE = 10;

const mockLogs: DICOMIngestRoutingLog[] = [
  {
    auditId: "DICM-A-10001",
    eventType: "DICOM Study Received",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    accessionNumber: "ACC-60001",
    patientId: "UHID-8001",
    patientName: "Patient One",
    modality: "CT",
    studyDateTime: "2025-01-28 08:00:00",
    callingAETitle: "MODALITY_CT1",
    calledAETitle: "RIS_SCP",
    sourceIP: "192.168.10.50",
    destinationAETitle: null,
    destinationSystem: null,
    routingRuleId: null,
    routingTimestamp: null,
    routingStatus: null,
    retryCount: 0,
    errorCode: null,
    errorMessage: null,
    serverTimestamp: "2025-02-01 08:15:00",
    processingTimeMs: 120,
    triggeredBy: "System",
    facilityId: "FAC-001",
  },
  {
    auditId: "DICM-A-10002",
    eventType: "DICOM Validation Passed",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    accessionNumber: "ACC-60001",
    patientId: "UHID-8001",
    patientName: "Patient One",
    modality: "CT",
    studyDateTime: "2025-01-28 08:00:00",
    callingAETitle: "MODALITY_CT1",
    calledAETitle: "RIS_SCP",
    sourceIP: "192.168.10.50",
    destinationAETitle: null,
    destinationSystem: null,
    routingRuleId: null,
    routingTimestamp: null,
    routingStatus: null,
    retryCount: 0,
    errorCode: null,
    errorMessage: null,
    serverTimestamp: "2025-02-01 08:15:01",
    processingTimeMs: 45,
    triggeredBy: "System",
    facilityId: "FAC-001",
  },
  {
    auditId: "DICM-A-10003",
    eventType: "Study Routed",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    accessionNumber: "ACC-60001",
    patientId: "UHID-8001",
    patientName: "Patient One",
    modality: "CT",
    studyDateTime: "2025-01-28 08:00:00",
    callingAETitle: "MODALITY_CT1",
    calledAETitle: "RIS_SCP",
    sourceIP: "192.168.10.50",
    destinationAETitle: "PACS_ARCHIVE",
    destinationSystem: "PACS",
    routingRuleId: "RULE-001",
    routingTimestamp: "2025-02-01 08:15:05",
    routingStatus: "Success",
    retryCount: 0,
    errorCode: null,
    errorMessage: null,
    serverTimestamp: "2025-02-01 08:15:06",
    processingTimeMs: 890,
    triggeredBy: "System",
    facilityId: "FAC-001",
  },
  {
    auditId: "DICM-A-10004",
    eventType: "DICOM Study Received",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60002",
    accessionNumber: "ACC-60002",
    patientId: "UHID-8002",
    patientName: "Patient Two",
    modality: "MRI",
    studyDateTime: "2025-01-30 10:00:00",
    callingAETitle: "MODALITY_MRI1",
    calledAETitle: "RIS_SCP",
    sourceIP: "192.168.10.51",
    destinationAETitle: null,
    destinationSystem: null,
    routingRuleId: null,
    routingTimestamp: null,
    routingStatus: null,
    retryCount: 0,
    errorCode: null,
    errorMessage: null,
    serverTimestamp: "2025-02-01 10:00:00",
    processingTimeMs: 95,
    triggeredBy: "System",
    facilityId: "FAC-001",
  },
  {
    auditId: "DICM-A-10005",
    eventType: "DICOM Validation Failed",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60003",
    accessionNumber: "ACC-60003",
    patientId: "UHID-8003",
    patientName: "Patient Three",
    modality: "CT",
    studyDateTime: "2025-01-31 11:00:00",
    callingAETitle: "MODALITY_CT2",
    calledAETitle: "RIS_SCP",
    sourceIP: "192.168.10.52",
    destinationAETitle: null,
    destinationSystem: null,
    routingRuleId: null,
    routingTimestamp: null,
    routingStatus: null,
    retryCount: 0,
    errorCode: "VAL-001",
    errorMessage: "Patient ID mismatch with MWL",
    serverTimestamp: "2025-02-01 11:45:00",
    processingTimeMs: 12,
    triggeredBy: "System",
    facilityId: "FAC-001",
  },
  {
    auditId: "DICM-A-10006",
    eventType: "Routing Failed",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60004",
    accessionNumber: "ACC-60004",
    patientId: "UHID-8004",
    patientName: "Patient Four",
    modality: "CR",
    studyDateTime: "2025-02-01 09:00:00",
    callingAETitle: "RIS_SCP",
    calledAETitle: "PACS_ARCHIVE",
    sourceIP: "192.168.20.1",
    destinationAETitle: "PACS_ARCHIVE",
    destinationSystem: "PACS",
    routingRuleId: "RULE-002",
    routingTimestamp: "2025-02-02 09:30:00",
    routingStatus: "Failed",
    retryCount: 2,
    errorCode: "NET-001",
    errorMessage: "Network timeout during C-STORE",
    serverTimestamp: "2025-02-02 09:30:05",
    processingTimeMs: 5000,
    triggeredBy: "System",
    facilityId: "FAC-001",
  },
  {
    auditId: "DICM-A-10007",
    eventType: "Study Merged",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60005",
    accessionNumber: "ACC-60005",
    patientId: "UHID-8005",
    patientName: "Patient Five",
    modality: "US",
    studyDateTime: "2025-02-02 14:00:00",
    callingAETitle: "RIS",
    calledAETitle: "RIS",
    sourceIP: "192.168.20.1",
    destinationAETitle: null,
    destinationSystem: null,
    routingRuleId: null,
    routingTimestamp: null,
    routingStatus: null,
    retryCount: 0,
    errorCode: null,
    errorMessage: null,
    serverTimestamp: "2025-02-02 14:15:00",
    processingTimeMs: 230,
    triggeredBy: "User",
    facilityId: "FAC-001",
  },
  {
    auditId: "DICM-A-10008",
    eventType: "Routing Retried",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60004",
    accessionNumber: "ACC-60004",
    patientId: "UHID-8004",
    patientName: "Patient Four",
    modality: "CR",
    studyDateTime: "2025-02-01 09:00:00",
    callingAETitle: "RIS_SCP",
    calledAETitle: "PACS_ARCHIVE",
    sourceIP: "192.168.20.1",
    destinationAETitle: "PACS_ARCHIVE",
    destinationSystem: "PACS",
    routingRuleId: "RULE-002",
    routingTimestamp: "2025-02-02 10:00:00",
    routingStatus: "Success",
    retryCount: 3,
    errorCode: null,
    errorMessage: null,
    serverTimestamp: "2025-02-02 10:00:08",
    processingTimeMs: 1200,
    triggeredBy: "System",
    facilityId: "FAC-001",
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

export function DICOMIngestRoutingLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ from: subDays(new Date(), 450), to: new Date() });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<DICOMIngestRoutingLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.accessionNumber, log.patientId, log.patientName, log.errorMessage ?? ""].some((v) => String(v).toLowerCase().includes(q))) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (statusFilter === "Success" && log.routingStatus !== "Success") return false;
      if (statusFilter === "Failed" && log.routingStatus !== "Failed") return false;
      if (statusFilter === "all") { /* no status filter */ }
      else if (statusFilter !== "N/A" && log.routingStatus !== statusFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.serverTimestamp.replace(" ", "T"));
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, eventTypeFilter, statusFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, eventTypeFilter, statusFilter, isDateRangeActive, dateRange]);

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    received: mockLogs.filter((l) => l.eventType === "DICOM Study Received").length,
    routed: mockLogs.filter((l) => l.eventType === "Study Routed" && l.routingStatus === "Success").length,
    failed: mockLogs.filter((l) => l.routingStatus === "Failed" || l.eventType === "DICOM Validation Failed" || l.eventType === "Study Rejected").length,
  }), []);

  const hasActiveFilters = eventTypeFilter !== "all" || statusFilter !== "all";

  function clearAllFilters() {
    setEventTypeFilter("all");
    setStatusFilter("all");
    setSearchFilter("");
    setDateRange({ from: subDays(new Date(), 450), to: new Date() });
    setTempDateRange({});
    setIsDateRangeActive(false);
    setCurrentPage(1);
  }

  function openDetail(log: DICOMIngestRoutingLog) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  return (
    <PageShell>
      <PageHeader
        title="DICOM Ingest & Routing Audit Logs"
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
            <StatCard title="Total Events" value={stats.total} description="All ingest & routing events" icon={Database} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Studies Received" value={stats.received} description="C-STORE received" icon={Database} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Routed Successfully" value={stats.routed} description="Routing success" icon={Route} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Failed / Rejected" value={stats.failed} description="Validation or routing failures" icon={AlertTriangle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
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
                      <input placeholder="Search by audit ID, accession, UHID, patient, error…" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
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
                  <Select value={eventTypeFilter} onValueChange={(v) => { setEventTypeFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-52 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="DICOM Study Received">DICOM Study Received</SelectItem>
                      <SelectItem value="DICOM Validation Passed">DICOM Validation Passed</SelectItem>
                      <SelectItem value="DICOM Validation Failed">DICOM Validation Failed</SelectItem>
                      <SelectItem value="Study Rejected">Study Rejected</SelectItem>
                      <SelectItem value="Study Routed">Study Routed</SelectItem>
                      <SelectItem value="Routing Failed">Routing Failed</SelectItem>
                      <SelectItem value="Routing Retried">Routing Retried</SelectItem>
                      <SelectItem value="Study Merged">Study Merged</SelectItem>
                      <SelectItem value="Study Split">Study Split</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-40 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Routing Status" />
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
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">Event Type</TableHead>
                    <TableHead className="whitespace-nowrap">Accession No.</TableHead>
                    <TableHead className="whitespace-nowrap">Patient UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Modality</TableHead>
                    <TableHead className="whitespace-nowrap">Calling AE</TableHead>
                    <TableHead className="whitespace-nowrap">Destination</TableHead>
                    <TableHead className="whitespace-nowrap">Routing Status</TableHead>
                    <TableHead className="whitespace-nowrap">Retry</TableHead>
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
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{formatTs(log.serverTimestamp)}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline" className="whitespace-nowrap">{log.eventType}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.accessionNumber}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.patientId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.modality}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.callingAETitle}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.destinationSystem ?? "—"}</span></TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.routingStatus === "Success" && <Badge variant="default" className="gap-1"><CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Success</Badge>}
                            {log.routingStatus === "Failed" && <Badge variant="destructive" className="gap-1"><XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Failed</Badge>}
                            {!log.routingStatus && <span className="text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.retryCount}</span></TableCell>
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
            <DialogTitle>DICOM Ingest & Routing Event Details</DialogTitle>
            <DialogDescription>Audit ID: <span className="font-mono tabular-nums">{selectedLog?.auditId}</span></DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Event Summary</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Event Type" value={<Badge variant="outline">{selectedLog.eventType}</Badge>} />
                  <DetailRow label="Server Timestamp" value={formatTs(selectedLog.serverTimestamp)} mono />
                  <DetailRow label="Processing Time (ms)" value={selectedLog.processingTimeMs} mono />
                  <DetailRow label="Triggered By" value={selectedLog.triggeredBy} />
                  <DetailRow label="Study Instance UID" value={selectedLog.studyInstanceUid} mono />
                  <DetailRow label="Accession Number" value={selectedLog.accessionNumber} mono />
                  <DetailRow label="Patient ID" value={selectedLog.patientId} mono />
                  <DetailRow label="Patient Name" value={selectedLog.patientName} />
                  <DetailRow label="Modality" value={selectedLog.modality} />
                  <DetailRow label="Calling AE Title" value={selectedLog.callingAETitle} mono />
                  <DetailRow label="Called AE Title" value={selectedLog.calledAETitle} mono />
                  <DetailRow label="Source IP" value={selectedLog.sourceIP} mono />
                  <DetailRow label="Destination AE Title" value={selectedLog.destinationAETitle ?? "—"} mono />
                  <DetailRow label="Destination System" value={selectedLog.destinationSystem ?? "—"} />
                  <DetailRow label="Routing Rule ID" value={selectedLog.routingRuleId ?? "—"} mono />
                  <DetailRow label="Routing Timestamp" value={selectedLog.routingTimestamp ? formatTs(selectedLog.routingTimestamp) : "—"} mono />
                  <DetailRow label="Routing Status" value={selectedLog.routingStatus ?? "—"} />
                  <DetailRow label="Retry Count" value={selectedLog.retryCount} mono />
                  <DetailRow label="Error Code" value={selectedLog.errorCode ?? "—"} mono />
                  <DetailRow label="Error Message" value={selectedLog.errorMessage ?? "—"} />
                  <DetailRow label="Facility" value={selectedLog.facilityId} mono />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Export DICOM Ingest & Routing Logs</SheetTitle>
            <SheetDescription>Export audit records for DICOM Ingest & Routing (Story 16) in CSV or PDF format.</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-sm text-muted-foreground">Select format and date range to export. (Integration with export API can be wired here.)</div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default DICOMIngestRoutingLogs;
