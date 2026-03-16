/**
 * DATA SYNC CONFLICTS AUDIT LOG — Story 20
 *
 * Logs and tracks data synchronization conflicts between RIS, PACS, and LIMS
 * so discrepancies can be detected and resolved.
 *
 * SCOPE: Patient/study/report data conflicts during integration. Admin view
 * from Audit Logs → Data Sync Conflicts. Search by Patient ID, Accession,
 * Study UID, Facility, Date Range. Status: Open / Under Review / Resolved.
 *
 * BACKEND: GET /api/admin/audit-logs/data-sync-conflicts — list with pagination
 *          GET /api/admin/audit-logs/data-sync-conflicts/export — CSV / PDF
 */

import * as React from "react";
import {
  Search,
  Download,
  Filter,
  X,
  Calendar,
  GitMerge,
  AlertCircle,
  CheckCircle,
  Clock,
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
type IntegrationType = "HL7" | "DICOM" | "API";
type ConflictCategory = "Patient Data" | "Study Metadata" | "Report Status";
type ConflictStatus = "Open" | "Under Review" | "Resolved";
type ResolutionAction = "Merge" | "Override" | "Ignore";

interface DataSyncConflictLog {
  conflictId: string;
  eventType: string;
  sourceSystem: SourceSystem;
  targetSystem: TargetSystem;
  integrationType: IntegrationType;
  conflictCategory: ConflictCategory;
  patientId: string;
  patientName: string;
  accessionNumber: string;
  studyUid: string;
  modality: string;
  fieldName: string;
  sourceValue: string;
  targetValue: string;
  conflictReason: string;
  detectedTimestamp: string;
  conflictStatus: ConflictStatus;
  resolutionAction: ResolutionAction | null;
  resolutionNotes: string | null;
  resolvedBy: string | null;
  resolutionTimestamp: string | null;
  facilityId: string;
  loggedBy: string;
}

const ITEMS_PER_PAGE = 10;

const mockLogs: DataSyncConflictLog[] = [
  {
    conflictId: "DSC-A-10001",
    eventType: "Data Sync Conflict",
    sourceSystem: "RIS",
    targetSystem: "PACS",
    integrationType: "DICOM",
    conflictCategory: "Patient Data",
    patientId: "UHID-8001",
    patientName: "Patient One",
    accessionNumber: "ACC-60001",
    studyUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    modality: "CT",
    fieldName: "PatientName",
    sourceValue: "Patient One",
    targetValue: "Patient 1",
    conflictReason: "Patient name spelling mismatch between RIS and PACS",
    detectedTimestamp: "2025-02-01 08:15:00",
    conflictStatus: "Resolved",
    resolutionAction: "Override",
    resolutionNotes: "RIS value accepted; PACS updated.",
    resolvedBy: "admin@facility.com",
    resolutionTimestamp: "2025-02-01 09:00:00",
    facilityId: "FAC-001",
    loggedBy: "Integration Service",
  },
  {
    conflictId: "DSC-A-10002",
    eventType: "Data Sync Conflict",
    sourceSystem: "LIMS",
    targetSystem: "RIS",
    integrationType: "HL7",
    conflictCategory: "Study Metadata",
    patientId: "UHID-4501",
    patientName: "Patient Two",
    accessionNumber: "ACC-2025-001",
    studyUid: "",
    modality: "MRI",
    fieldName: "StudyStatus",
    sourceValue: "Scheduled",
    targetValue: "In Progress",
    conflictReason: "Study status mismatch — RIS shows In Progress, LIMS sent Scheduled",
    detectedTimestamp: "2025-02-01 10:30:00",
    conflictStatus: "Under Review",
    resolutionAction: null,
    resolutionNotes: null,
    resolvedBy: null,
    resolutionTimestamp: null,
    facilityId: "FAC-001",
    loggedBy: "System",
  },
  {
    conflictId: "DSC-A-10003",
    eventType: "Data Sync Conflict",
    sourceSystem: "RIS",
    targetSystem: "PACS",
    integrationType: "DICOM",
    conflictCategory: "Report Status",
    patientId: "UHID-8002",
    patientName: "Patient Three",
    accessionNumber: "ACC-60002",
    studyUid: "1.2.840.10008.5.1.4.1.1.4.60002",
    modality: "CT",
    fieldName: "ReportStatus",
    sourceValue: "Final",
    targetValue: "Draft",
    conflictReason: "Report status inconsistency — RIS Final but PACS shows Draft",
    detectedTimestamp: "2025-02-02 11:00:00",
    conflictStatus: "Open",
    resolutionAction: null,
    resolutionNotes: null,
    resolvedBy: null,
    resolutionTimestamp: null,
    facilityId: "FAC-001",
    loggedBy: "Integration Service",
  },
  {
    conflictId: "DSC-A-10004",
    eventType: "Data Sync Conflict",
    sourceSystem: "PACS",
    targetSystem: "RIS",
    integrationType: "HL7",
    conflictCategory: "Patient Data",
    patientId: "UHID-7001",
    patientName: "Patient Four",
    accessionNumber: "ACC-50001",
    studyUid: "",
    modality: "US",
    fieldName: "PatientID",
    sourceValue: "UHID-7001",
    targetValue: "UHID-7001-OLD",
    conflictReason: "Duplicate Patient ID detected across facilities",
    detectedTimestamp: "2025-02-02 14:20:00",
    conflictStatus: "Open",
    resolutionAction: null,
    resolutionNotes: null,
    resolvedBy: null,
    resolutionTimestamp: null,
    facilityId: "FAC-002",
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

export function DataSyncConflictsLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [targetFilter, setTargetFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [facilityFilter, setFacilityFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ from: subDays(new Date(), 90), to: new Date() });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<DataSyncConflictLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.conflictId, log.patientId, log.accessionNumber, log.studyUid, log.fieldName, log.facilityId].some((v) => String(v).toLowerCase().includes(q))) return false;
      if (sourceFilter !== "all" && log.sourceSystem !== sourceFilter) return false;
      if (targetFilter !== "all" && log.targetSystem !== targetFilter) return false;
      if (categoryFilter !== "all" && log.conflictCategory !== categoryFilter) return false;
      if (statusFilter !== "all" && log.conflictStatus !== statusFilter) return false;
      if (facilityFilter !== "all" && log.facilityId !== facilityFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.detectedTimestamp.replace(" ", "T"));
        if (ts < dateRange.from || ts > dateRange.to) return false;
      }
      return true;
    });
  }, [searchFilter, sourceFilter, targetFilter, categoryFilter, statusFilter, facilityFilter, isDateRangeActive, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  React.useEffect(() => { setCurrentPage(1); }, [searchFilter, sourceFilter, targetFilter, categoryFilter, statusFilter, facilityFilter, isDateRangeActive, dateRange]);

  const stats = React.useMemo(() => ({
    total: mockLogs.length,
    open: mockLogs.filter((l) => l.conflictStatus === "Open").length,
    underReview: mockLogs.filter((l) => l.conflictStatus === "Under Review").length,
    resolved: mockLogs.filter((l) => l.conflictStatus === "Resolved").length,
  }), []);

  const hasActiveFilters = sourceFilter !== "all" || targetFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all" || facilityFilter !== "all";

  function clearAllFilters() {
    setSourceFilter("all");
    setTargetFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setFacilityFilter("all");
    setSearchFilter("");
    setDateRange({ from: subDays(new Date(), 90), to: new Date() });
    setTempDateRange({});
    setIsDateRangeActive(false);
    setCurrentPage(1);
  }

  function openDetail(log: DataSyncConflictLog) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  return (
    <PageShell>
      <PageHeader
        title="Data Sync Conflicts"
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
            <StatCard title="Total Conflicts" value={stats.total} description="All sync conflict events" icon={GitMerge} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
            <StatCard title="Open" value={stats.open} description="Unresolved" icon={AlertCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
            <StatCard title="Under Review" value={stats.underReview} description="In progress" icon={Clock} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-muted-foreground" />
            <StatCard title="Resolved" value={stats.resolved} description="Resolved" icon={CheckCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
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
                      <input placeholder="Search by Conflict ID, Patient ID, Accession, Study UID, Facility…" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
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
                  <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Patient Data">Patient Data</SelectItem>
                      <SelectItem value="Study Metadata">Study Metadata</SelectItem>
                      <SelectItem value="Report Status">Report Status</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={facilityFilter} onValueChange={(v) => { setFacilityFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-32 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      <SelectItem value="FAC-001">FAC-001</SelectItem>
                      <SelectItem value="FAC-002">FAC-002</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Conflict ID</TableHead>
                    <TableHead className="whitespace-nowrap">Detected</TableHead>
                    <TableHead className="whitespace-nowrap">Source → Target</TableHead>
                    <TableHead className="whitespace-nowrap">Integration Type</TableHead>
                    <TableHead className="whitespace-nowrap">Category</TableHead>
                    <TableHead className="whitespace-nowrap">Patient / Accession</TableHead>
                    <TableHead className="whitespace-nowrap">Modality</TableHead>
                    <TableHead className="whitespace-nowrap">Field</TableHead>
                    <TableHead className="whitespace-nowrap">Facility</TableHead>
                    <TableHead className="whitespace-nowrap">Source vs Target</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center py-12 text-muted-foreground">No records found matching the current filters.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((log, idx) => {
                      const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <TableRow key={log.conflictId}>
                          <TableCell className="text-right whitespace-nowrap"><span className="font-mono tabular-nums text-muted-foreground text-sm">{srNo}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.conflictId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{formatTs(log.detectedTimestamp)}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline">{log.sourceSystem}</Badge> → <Badge variant="outline">{log.targetSystem}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.integrationType}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.conflictCategory}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.patientId} / {log.accessionNumber}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.modality}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.fieldName}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-xs">{log.facilityId}</span></TableCell>
                          <TableCell className="max-w-[180px]"><span className="text-xs text-muted-foreground line-clamp-2">&quot;{log.sourceValue}&quot; vs &quot;{log.targetValue}&quot;</span></TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.conflictStatus === "Open" && <Badge variant="destructive">Open</Badge>}
                            {log.conflictStatus === "Under Review" && <Badge variant="secondary">Under Review</Badge>}
                            {log.conflictStatus === "Resolved" && <Badge variant="default" className="gap-1"><CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Resolved</Badge>}
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
            <DialogTitle>Data Sync Conflict Details</DialogTitle>
            <DialogDescription>Conflict ID: <span className="font-mono tabular-nums">{selectedLog?.conflictId}</span></DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Conflict Summary</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Source System" value={selectedLog.sourceSystem} />
                  <DetailRow label="Target System" value={selectedLog.targetSystem} />
                  <DetailRow label="Integration Type" value={selectedLog.integrationType} />
                  <DetailRow label="Conflict Category" value={selectedLog.conflictCategory} />
                  <DetailRow label="Patient ID" value={selectedLog.patientId} mono />
                  <DetailRow label="Patient Name" value={selectedLog.patientName} />
                  <DetailRow label="Accession Number" value={selectedLog.accessionNumber} mono />
                  <DetailRow label="Study UID" value={selectedLog.studyUid || "—"} mono />
                  <DetailRow label="Modality" value={selectedLog.modality} />
                  <DetailRow label="Field Name" value={selectedLog.fieldName} />
                  <DetailRow label="Source Value" value={selectedLog.sourceValue} mono />
                  <DetailRow label="Target Value" value={selectedLog.targetValue} mono />
                  <DetailRow label="Conflict Reason" value={selectedLog.conflictReason} />
                  <DetailRow label="Detected Timestamp" value={formatTs(selectedLog.detectedTimestamp)} mono />
                  <DetailRow label="Conflict Status" value={selectedLog.conflictStatus} />
                  <DetailRow label="Resolution Action" value={selectedLog.resolutionAction ?? "—"} />
                  <DetailRow label="Resolution Notes" value={selectedLog.resolutionNotes ?? "—"} />
                  <DetailRow label="Resolved By" value={selectedLog.resolvedBy ?? "—"} />
                  <DetailRow label="Resolution Timestamp" value={selectedLog.resolutionTimestamp ? formatTs(selectedLog.resolutionTimestamp) : "—"} mono />
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
            <SheetTitle>Export Data Sync Conflict Logs</SheetTitle>
            <SheetDescription>Export conflict records (Story 20) in CSV or PDF format.</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-sm text-muted-foreground">Select format and date range to export.</div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default DataSyncConflictsLogs;
