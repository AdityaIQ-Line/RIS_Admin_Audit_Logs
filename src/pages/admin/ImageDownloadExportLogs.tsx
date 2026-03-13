/**
 * IMAGE DOWNLOAD & EXPORT AUDIT LOG — Story 15
 *
 * Audits all image download and export activities in RIS for patient data protection,
 * unauthorized data sharing prevention, and medico-legal traceability.
 *
 * SCOPE: Study download, series/image export, DICOM/JPEG/PNG export, CD/DVD, secure link.
 * EXCLUDED: Image viewing (separate), PACS internal routing.
 *
 * BACKEND: GET /api/admin/audit-logs/image-download-export — list with pagination
 *          GET /api/admin/audit-logs/image-download-export/export — CSV / PDF
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
  FileDown,
  Image as ImageIcon,
  FolderDown,
  Link2,
  AlertTriangle,
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfMonth } from "date-fns";
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

type ExportEventType =
  | "Study Downloaded"
  | "Series Exported"
  | "Image Exported"
  | "DICOM Export Generated"
  | "Non-DICOM Export (JPEG/PDF)"
  | "CD/DVD Created"
  | "Secure Link Generated"
  | "Download/Export Denied";

type ExportStatus = "Success" | "Failed" | "Denied";

interface ImageDownloadExportLog {
  auditId: string;
  eventType: ExportEventType;
  studyInstanceUid: string;
  accessionNumber: string;
  patientId: string;
  modality: string;
  studyDate: string;
  exportType: string;
  exportFormat: string;
  filesExported: number;
  fileSizeMB: number;
  watermarkApplied: boolean;
  anonymizationApplied: boolean;
  secureLinkExpiry: string | null;
  userRole: string;
  sessionId: string;
  ipAddress: string;
  deviceBrowser: string;
  exportTimestamp: string;
  exportStatus: ExportStatus;
  denialReason: string | null;
  facilityId: string;
}

const ITEMS_PER_PAGE = 10;

const mockLogs: ImageDownloadExportLog[] = [
  {
    auditId: "IDEX-A-10001",
    eventType: "Study Downloaded",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60001",
    accessionNumber: "ACC-60001",
    patientId: "UHID-8001",
    modality: "CT",
    studyDate: "2025-01-28",
    exportType: "DICOM",
    exportFormat: "DICOM",
    filesExported: 120,
    fileSizeMB: 245,
    watermarkApplied: false,
    anonymizationApplied: false,
    secureLinkExpiry: null,
    userRole: "Radiologist",
    sessionId: "SESS-A-001",
    ipAddress: "192.168.20.101",
    deviceBrowser: "Chrome 121.0 / Windows 11",
    exportTimestamp: "2025-02-01 08:15:00",
    exportStatus: "Success",
    denialReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "IDEX-A-10002",
    eventType: "DICOM Export Generated",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60002",
    accessionNumber: "ACC-60002",
    patientId: "UHID-8002",
    modality: "MRI",
    studyDate: "2025-01-30",
    exportType: "DICOM",
    exportFormat: "ZIP",
    filesExported: 80,
    fileSizeMB: 180,
    watermarkApplied: false,
    anonymizationApplied: false,
    secureLinkExpiry: null,
    userRole: "Senior Radiologist",
    sessionId: "SESS-A-002",
    ipAddress: "192.168.20.102",
    deviceBrowser: "DICOM Workstation",
    exportTimestamp: "2025-02-01 10:35:00",
    exportStatus: "Success",
    denialReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "IDEX-A-10003",
    eventType: "Non-DICOM Export (JPEG/PDF)",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60004",
    accessionNumber: "ACC-60004",
    patientId: "UHID-8004",
    modality: "CR",
    studyDate: "2025-02-01",
    exportType: "JPEG",
    exportFormat: "JPEG",
    filesExported: 2,
    fileSizeMB: 4,
    watermarkApplied: true,
    anonymizationApplied: true,
    secureLinkExpiry: null,
    userRole: "Radiologist",
    sessionId: "SESS-A-004",
    ipAddress: "192.168.20.103",
    deviceBrowser: "Firefox 122.0 / macOS 14.3",
    exportTimestamp: "2025-02-02 09:30:00",
    exportStatus: "Success",
    denialReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "IDEX-A-10004",
    eventType: "Secure Link Generated",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.6.1.60005",
    accessionNumber: "ACC-60005",
    patientId: "UHID-8005",
    modality: "US",
    studyDate: "2025-02-02",
    exportType: "Secure Link",
    exportFormat: "N/A",
    filesExported: 0,
    fileSizeMB: 0,
    watermarkApplied: true,
    anonymizationApplied: false,
    secureLinkExpiry: "2025-02-04 14:00:00",
    userRole: "Radiologist",
    sessionId: "SESS-A-005",
    ipAddress: "192.168.20.103",
    deviceBrowser: "Chrome 121.0",
    exportTimestamp: "2025-02-02 14:00:00",
    exportStatus: "Success",
    denialReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "IDEX-A-10005",
    eventType: "Download/Export Denied",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60006",
    accessionNumber: "ACC-60006",
    patientId: "UHID-8006",
    modality: "MRI",
    studyDate: "2025-02-02",
    exportType: "DICOM",
    exportFormat: "DICOM",
    filesExported: 0,
    fileSizeMB: 0,
    watermarkApplied: false,
    anonymizationApplied: false,
    secureLinkExpiry: null,
    userRole: "Technician",
    sessionId: "SESS-A-006",
    ipAddress: "192.168.20.110",
    deviceBrowser: "Chrome 121.0 / Windows 10",
    exportTimestamp: "2025-02-03 10:15:00",
    exportStatus: "Denied",
    denialReason: "Role restriction — Technician role does not have download/export privileges.",
    facilityId: "FAC-001",
  },
  {
    auditId: "IDEX-A-10006",
    eventType: "CD/DVD Created",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.2.60009",
    accessionNumber: "ACC-60009",
    patientId: "UHID-8009",
    modality: "CT",
    studyDate: "2025-02-04",
    exportType: "CD/DVD",
    exportFormat: "DICOM",
    filesExported: 120,
    fileSizeMB: 248,
    watermarkApplied: false,
    anonymizationApplied: false,
    secureLinkExpiry: null,
    userRole: "Radiologist",
    sessionId: "SESS-A-007",
    ipAddress: "192.168.20.105",
    deviceBrowser: "Chrome 121.0 / Windows 11",
    exportTimestamp: "2025-02-04 11:00:00",
    exportStatus: "Success",
    denialReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "IDEX-A-10007",
    eventType: "Image Exported",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.4.60010",
    accessionNumber: "ACC-60010",
    patientId: "UHID-8010",
    modality: "MRI",
    studyDate: "2025-02-05",
    exportType: "JPEG",
    exportFormat: "JPEG",
    filesExported: 1,
    fileSizeMB: 2,
    watermarkApplied: true,
    anonymizationApplied: true,
    secureLinkExpiry: null,
    userRole: "Referring Physician",
    sessionId: "SESS-EXT-003",
    ipAddress: "122.87.34.56",
    deviceBrowser: "Safari 17.3 / iOS 17",
    exportTimestamp: "2025-02-05 15:00:00",
    exportStatus: "Success",
    denialReason: null,
    facilityId: "FAC-001",
  },
  {
    auditId: "IDEX-A-10008",
    eventType: "Series Exported",
    studyInstanceUid: "1.2.840.10008.5.1.4.1.1.1.60011",
    accessionNumber: "ACC-60011",
    patientId: "UHID-8011",
    modality: "CR",
    studyDate: "2025-02-05",
    exportType: "DICOM",
    exportFormat: "DICOM",
    filesExported: 2,
    fileSizeMB: 12,
    watermarkApplied: false,
    anonymizationApplied: false,
    secureLinkExpiry: null,
    userRole: "Radiologist",
    sessionId: "SESS-A-008",
    ipAddress: "192.168.20.101",
    deviceBrowser: "Chrome 121.0 / Windows 11",
    exportTimestamp: "2025-02-06 08:35:00",
    exportStatus: "Success",
    denialReason: null,
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

export function ImageDownloadExportLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ from: subDays(new Date(), 450), to: new Date() });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<ImageDownloadExportLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.accessionNumber, log.patientId, log.userRole].some((v) => v.toLowerCase().includes(q))) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (statusFilter !== "all" && log.exportStatus !== statusFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.exportTimestamp.replace(" ", "T"));
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
    success: mockLogs.filter((l) => l.exportStatus === "Success").length,
    denied: mockLogs.filter((l) => l.exportStatus === "Denied").length,
    dicomExports: mockLogs.filter((l) => l.exportType === "DICOM" || l.eventType === "DICOM Export Generated").length,
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

  function openDetail(log: ImageDownloadExportLog) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  return (
    <PageShell>
      <PageHeader
        title="Image Download & Export Audit Logs"
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
            <StatCard title="Total Events" value={stats.total} description="All download/export events" icon={FileDown} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Successful Exports" value={stats.success} description="Completed exports" icon={CheckCircle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Denied Attempts" value={stats.denied} description="Unauthorized or blocked" icon={AlertTriangle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
            <StatCard title="DICOM Exports" value={stats.dicomExports} description="DICOM/study exports" icon={ImageIcon} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
          </div>

          <Card className="p-[16px]">
            <div className="flex flex-col gap-3 p-[0px]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={["w-48 justify-between gap-2 font-normal", isDateRangeActive ? "bg-primary/10 border-primary text-primary hover:bg-primary/15" : "bg-background border-border"].join(" ")}
                      >
                        <span className={["text-sm", isDateRangeActive ? "text-primary" : "text-muted-foreground"].join(" ")}>
                          {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd")}
                        </span>
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
                      <DateRangePicker
                        value={tempDateRange}
                        quickRanges={quickRanges}
                        onApply={(range) => { setDateRange(range); setTempDateRange(range); setIsDateRangeActive(true); setDatePickerOpen(false); setCurrentPage(1); }}
                        onCancel={() => { setTempDateRange({}); setDatePickerOpen(false); }}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="bg-background relative rounded-[8px] w-80">
                    <div className="flex items-center gap-2 px-3 py-[7.5px]">
                      <Search strokeWidth={ICON_STROKE_WIDTH} className="size-5 text-muted-foreground shrink-0" />
                      <input placeholder="Search by audit ID, accession, UHID, role…" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
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
                      <SelectItem value="Study Downloaded">Study Downloaded</SelectItem>
                      <SelectItem value="Series Exported">Series Exported</SelectItem>
                      <SelectItem value="Image Exported">Image Exported</SelectItem>
                      <SelectItem value="DICOM Export Generated">DICOM Export Generated</SelectItem>
                      <SelectItem value="Non-DICOM Export (JPEG/PDF)">Non-DICOM Export (JPEG/PDF)</SelectItem>
                      <SelectItem value="CD/DVD Created">CD/DVD Created</SelectItem>
                      <SelectItem value="Secure Link Generated">Secure Link Generated</SelectItem>
                      <SelectItem value="Download/Export Denied">Download/Export Denied</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-36 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Denied">Denied</SelectItem>
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
                    <TableHead className="whitespace-nowrap">UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Modality</TableHead>
                    <TableHead className="whitespace-nowrap">Export Type</TableHead>
                    <TableHead className="whitespace-nowrap">Files</TableHead>
                    <TableHead className="whitespace-nowrap">File Size (MB)</TableHead>
                    <TableHead className="whitespace-nowrap">User Role</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">No records found matching the current filters.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((log, idx) => {
                      const srNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <TableRow key={log.auditId} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(log)}>
                          <TableCell className="text-right whitespace-nowrap"><span className="font-mono tabular-nums text-muted-foreground text-sm">{srNo}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.auditId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{formatTs(log.exportTimestamp)}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><Badge variant="outline" className="whitespace-nowrap">{log.eventType}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.accessionNumber}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.patientId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.modality}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.exportType}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.filesExported}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.fileSizeMB}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.userRole}</span></TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.exportStatus === "Success" && <Badge variant="default" className="gap-1"><CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Success</Badge>}
                            {log.exportStatus === "Denied" && <Badge variant="destructive" className="gap-1"><XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Denied</Badge>}
                            {log.exportStatus === "Failed" && <Badge variant="destructive" className="gap-1"><XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Failed</Badge>}
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
            <DialogTitle>Image Download & Export Event Details</DialogTitle>
            <DialogDescription>Audit ID: <span className="font-mono tabular-nums">{selectedLog?.auditId}</span></DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Event Summary</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <DetailRow label="Event Type" value={<Badge variant="outline">{selectedLog.eventType}</Badge>} />
                  <DetailRow label="Export Status" value={selectedLog.exportStatus} />
                  <DetailRow label="Export Timestamp" value={formatTs(selectedLog.exportTimestamp)} mono />
                  <DetailRow label="Accession No." value={selectedLog.accessionNumber} mono />
                  <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
                  <DetailRow label="Modality" value={selectedLog.modality} />
                  <DetailRow label="Export Type" value={selectedLog.exportType} />
                  <DetailRow label="Export Format" value={selectedLog.exportFormat} />
                  <DetailRow label="Files Exported" value={selectedLog.filesExported} mono />
                  <DetailRow label="File Size (MB)" value={selectedLog.fileSizeMB} mono />
                  <DetailRow label="Watermark Applied" value={selectedLog.watermarkApplied ? "Yes" : "No"} />
                  <DetailRow label="Anonymization Applied" value={selectedLog.anonymizationApplied ? "Yes" : "No"} />
                  <DetailRow label="User Role" value={selectedLog.userRole} />
                  <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
                  <DetailRow label="Facility" value={selectedLog.facilityId} mono />
                  {selectedLog.denialReason && <DetailRow label="Denial Reason" value={selectedLog.denialReason} />}
                  {selectedLog.secureLinkExpiry && <DetailRow label="Secure Link Expiry" value={formatTs(selectedLog.secureLinkExpiry)} mono />}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Export Image Download & Export Logs</SheetTitle>
            <SheetDescription>Export audit records for Image Download & Export (Story 15) in CSV or PDF format.</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-sm text-muted-foreground">Select format and date range to export. (Integration with export API can be wired here.)</div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default ImageDownloadExportLogs;
