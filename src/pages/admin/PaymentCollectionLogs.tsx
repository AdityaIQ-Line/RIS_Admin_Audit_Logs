/**
 * PAYMENT COLLECTION AUDIT LOG — Story 18
 *
 * Audits all payment collection activities for financial transparency,
 * revenue leakage prevention, and billing compliance traceability.
 *
 * SCOPE: Payment collection, advance, mode selection, adjustment, discount, refund, void.
 * EXCLUDED: External accounting system audit, Insurance claim settlement.
 *
 * BACKEND: GET /api/admin/audit-logs/payment-collection — list with pagination
 *          GET /api/admin/audit-logs/payment-collection/export — CSV / PDF
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
  IndianRupee,
  CreditCard,
  Receipt,
  AlertTriangle,
  RotateCcw,
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

type PaymentEventType =
  | "Payment Collected"
  | "Discount Applied"
  | "Payment Adjusted"
  | "Payment Refunded"
  | "Refund Approved"
  | "Payment Voided"
  | "Payment Collection Failed";

type PaymentStatus = "Paid" | "Partial" | "Pending" | "Refunded";
type PaymentMode = "Cash" | "Card" | "UPI" | "Bank Transfer" | "Online";
type EventStatus = "Success" | "Failed";

interface PaymentCollectionLog {
  auditId: string;
  eventType: PaymentEventType;
  visitId: string;
  patientId: string;
  invoiceNumber: string;
  totalAmount: number;
  amountCollected: number;
  balanceAmount: number;
  discountAmount: number;
  taxAmount: number;
  paymentMode: PaymentMode;
  transactionRef: string | null;
  paymentStatus: PaymentStatus;
  refundAmount: number | null;
  refundReason: string | null;
  collectedBy: string;
  userRole: string;
  facilityId: string;
  timestamp: string;
  ipAddress: string;
  changeReason: string | null;
  status: EventStatus;
}

const ITEMS_PER_PAGE = 10;

const mockLogs: PaymentCollectionLog[] = [
  {
    auditId: "PAY-A-10001",
    eventType: "Payment Collected",
    visitId: "VIS-001",
    patientId: "UHID-4501",
    invoiceNumber: "INV-2025-001",
    totalAmount: 2500,
    amountCollected: 2500,
    balanceAmount: 0,
    discountAmount: 0,
    taxAmount: 450,
    paymentMode: "UPI",
    transactionRef: "UPI123456789",
    paymentStatus: "Paid",
    refundAmount: null,
    refundReason: null,
    collectedBy: "USR-FD-001",
    userRole: "Front Desk",
    facilityId: "FAC-001",
    timestamp: "2025-02-01 08:45:22",
    ipAddress: "192.168.1.20",
    changeReason: null,
    status: "Success",
  },
  {
    auditId: "PAY-A-10002",
    eventType: "Discount Applied",
    visitId: "VIS-002",
    patientId: "UHID-4502",
    invoiceNumber: "INV-2025-002",
    totalAmount: 3500,
    amountCollected: 3150,
    balanceAmount: 0,
    discountAmount: 350,
    taxAmount: 630,
    paymentMode: "Card",
    transactionRef: "TXN-CARD-002",
    paymentStatus: "Paid",
    refundAmount: null,
    refundReason: null,
    collectedBy: "USR-FD-001",
    userRole: "Front Desk",
    facilityId: "FAC-001",
    timestamp: "2025-02-01 09:15:44",
    ipAddress: "192.168.1.20",
    changeReason: "Senior citizen discount (10%)",
    status: "Success",
  },
  {
    auditId: "PAY-A-10003",
    eventType: "Payment Refunded",
    visitId: "VIS-003",
    patientId: "UHID-3892",
    invoiceNumber: "INV-2025-003",
    totalAmount: 1800,
    amountCollected: 0,
    balanceAmount: 1800,
    discountAmount: 0,
    taxAmount: 324,
    paymentMode: "Cash",
    transactionRef: null,
    paymentStatus: "Refunded",
    refundAmount: 1800,
    refundReason: "Study cancelled by patient — full refund per policy",
    collectedBy: "USR-FD-002",
    userRole: "Front Desk",
    facilityId: "FAC-001",
    timestamp: "2025-02-01 10:30:05",
    ipAddress: "192.168.1.21",
    changeReason: "Study cancelled by patient",
    status: "Success",
  },
  {
    auditId: "PAY-A-10004",
    eventType: "Payment Adjusted",
    visitId: "VIS-004",
    patientId: "UHID-2201",
    invoiceNumber: "INV-2025-004",
    totalAmount: 4200,
    amountCollected: 4200,
    balanceAmount: 0,
    discountAmount: 200,
    taxAmount: 720,
    paymentMode: "Bank Transfer",
    transactionRef: "NEFT-20250201-001",
    paymentStatus: "Paid",
    refundAmount: null,
    refundReason: null,
    collectedBy: "USR-RC-001",
    userRole: "Radiology Coordinator",
    facilityId: "FAC-001",
    timestamp: "2025-02-02 11:00:00",
    ipAddress: "192.168.1.22",
    changeReason: "Correction: duplicate charge reversed",
    status: "Success",
  },
  {
    auditId: "PAY-A-10005",
    eventType: "Payment Voided",
    visitId: "VIS-005",
    patientId: "UHID-5501",
    invoiceNumber: "INV-2025-005",
    totalAmount: 1500,
    amountCollected: 0,
    balanceAmount: 1500,
    discountAmount: 0,
    taxAmount: 270,
    paymentMode: "Cash",
    transactionRef: null,
    paymentStatus: "Pending",
    refundAmount: null,
    refundReason: null,
    collectedBy: "USR-FD-001",
    userRole: "Front Desk",
    facilityId: "FAC-001",
    timestamp: "2025-02-02 14:20:00",
    ipAddress: "192.168.1.20",
    changeReason: "Voided before report finalization — wrong patient selected",
    status: "Success",
  },
  {
    auditId: "PAY-A-10006",
    eventType: "Payment Collection Failed",
    visitId: "VIS-006",
    patientId: "UHID-5502",
    invoiceNumber: "INV-2025-006",
    totalAmount: 2800,
    amountCollected: 0,
    balanceAmount: 2800,
    discountAmount: 0,
    taxAmount: 504,
    paymentMode: "Card",
    transactionRef: null,
    paymentStatus: "Pending",
    refundAmount: null,
    refundReason: null,
    collectedBy: "USR-FD-002",
    userRole: "Front Desk",
    facilityId: "FAC-001",
    timestamp: "2025-02-03 09:45:00",
    ipAddress: "192.168.1.21",
    changeReason: null,
    status: "Failed",
  },
  {
    auditId: "PAY-A-10007",
    eventType: "Refund Approved",
    visitId: "VIS-007",
    patientId: "UHID-4503",
    invoiceNumber: "INV-2025-007",
    totalAmount: 5000,
    amountCollected: 0,
    balanceAmount: 5000,
    discountAmount: 0,
    taxAmount: 900,
    paymentMode: "UPI",
    transactionRef: "UPI987654321",
    paymentStatus: "Refunded",
    refundAmount: 5000,
    refundReason: "Approved by Facility Admin — duplicate payment",
    collectedBy: "USR-ADM-001",
    userRole: "Facility Admin",
    facilityId: "FAC-001",
    timestamp: "2025-02-03 15:00:00",
    ipAddress: "192.168.1.10",
    changeReason: "Duplicate payment refund approved",
    status: "Success",
  },
  {
    auditId: "PAY-A-10008",
    eventType: "Payment Collected",
    visitId: "VIS-008",
    patientId: "UHID-5503",
    invoiceNumber: "INV-2025-008",
    totalAmount: 1200,
    amountCollected: 1200,
    balanceAmount: 0,
    discountAmount: 0,
    taxAmount: 216,
    paymentMode: "Cash",
    transactionRef: null,
    paymentStatus: "Paid",
    refundAmount: null,
    refundReason: null,
    collectedBy: "USR-FD-001",
    userRole: "Front Desk",
    facilityId: "FAC-002",
    timestamp: "2025-02-04 10:15:00",
    ipAddress: "192.168.2.20",
    changeReason: null,
    status: "Success",
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

export function PaymentCollectionLogs() {
  const [searchFilter, setSearchFilter] = React.useState("");
  const [eventTypeFilter, setEventTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({ from: subDays(new Date(), 450), to: new Date() });
  const [tempDateRange, setTempDateRange] = React.useState<{ from?: Date; to?: Date }>({});
  const [isDateRangeActive, setIsDateRangeActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedLog, setSelectedLog] = React.useState<PaymentCollectionLog | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [reportSheetOpen, setReportSheetOpen] = React.useState(false);

  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const q = searchFilter.toLowerCase();
      if (q && ![log.auditId, log.invoiceNumber, log.patientId, log.collectedBy, log.visitId].some((v) => String(v).toLowerCase().includes(q))) return false;
      if (eventTypeFilter !== "all" && log.eventType !== eventTypeFilter) return false;
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      if (isDateRangeActive) {
        const ts = new Date(log.timestamp.replace(" ", "T"));
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
    collected: mockLogs.filter((l) => l.eventType === "Payment Collected" && l.status === "Success").length,
    refunded: mockLogs.filter((l) => l.eventType === "Payment Refunded" || l.eventType === "Refund Approved").length,
    failed: mockLogs.filter((l) => l.status === "Failed").length,
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

  function openDetail(log: PaymentCollectionLog) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  return (
    <PageShell>
      <PageHeader
        title="Payment Collection Audit Logs"
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
            <StatCard title="Total Events" value={stats.total} description="All payment events" icon={Receipt} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Payments Collected" value={stats.collected} description="Successful collections" icon={IndianRupee} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-primary" />
            <StatCard title="Refunds" value={stats.refunded} description="Refunded / approved" icon={RotateCcw} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-muted-foreground" />
            <StatCard title="Failed" value={stats.failed} description="Collection failures" icon={AlertTriangle} iconStrokeWidth={ICON_STROKE_WIDTH} iconColor="text-destructive" />
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
                      <input placeholder="Search by audit ID, invoice, UHID, visit, collected by…" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
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
                    <SelectTrigger className="h-8 w-48 bg-card border-border text-foreground gap-1.5 px-3 rounded-[4px] font-medium hover:bg-accent data-[state=open]:bg-accent">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Event Types</SelectItem>
                      <SelectItem value="Payment Collected">Payment Collected</SelectItem>
                      <SelectItem value="Discount Applied">Discount Applied</SelectItem>
                      <SelectItem value="Payment Adjusted">Payment Adjusted</SelectItem>
                      <SelectItem value="Payment Refunded">Payment Refunded</SelectItem>
                      <SelectItem value="Refund Approved">Refund Approved</SelectItem>
                      <SelectItem value="Payment Voided">Payment Voided</SelectItem>
                      <SelectItem value="Payment Collection Failed">Payment Collection Failed</SelectItem>
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
                    <TableHead className="whitespace-nowrap">Invoice</TableHead>
                    <TableHead className="whitespace-nowrap">Patient UHID</TableHead>
                    <TableHead className="whitespace-nowrap">Total (₹)</TableHead>
                    <TableHead className="whitespace-nowrap">Collected (₹)</TableHead>
                    <TableHead className="whitespace-nowrap">Mode</TableHead>
                    <TableHead className="whitespace-nowrap">Collected By</TableHead>
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
                          <TableCell className="whitespace-nowrap"><Badge variant="outline" className="whitespace-nowrap">{log.eventType}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono text-sm">{log.invoiceNumber}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.patientId}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.totalAmount.toLocaleString("en-IN")}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="font-mono tabular-nums text-sm">{log.amountCollected.toLocaleString("en-IN")}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.paymentMode}</span></TableCell>
                          <TableCell className="whitespace-nowrap"><span className="text-sm">{log.collectedBy}</span></TableCell>
                          <TableCell className="whitespace-nowrap">
                            {log.status === "Success" && <Badge variant="default" className="gap-1"><CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Success</Badge>}
                            {log.status === "Failed" && <Badge variant="destructive" className="gap-1"><XCircle strokeWidth={ICON_STROKE_WIDTH} className="size-3" />Failed</Badge>}
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
            <DialogTitle>Payment Collection Event Details</DialogTitle>
            <DialogDescription>Audit ID: <span className="font-mono tabular-nums">{selectedLog?.auditId}</span></DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Event Summary</p>
                <div className="grid grid-cols-1 gap-y-0">
                  <DetailRow label="Event Type" value={<Badge variant="outline">{selectedLog.eventType}</Badge>} />
                  <DetailRow label="Timestamp" value={formatTs(selectedLog.timestamp)} mono />
                  <DetailRow label="Visit ID" value={selectedLog.visitId} mono />
                  <DetailRow label="Invoice Number" value={selectedLog.invoiceNumber} mono />
                  <DetailRow label="Patient UHID" value={selectedLog.patientId} mono />
                  <DetailRow label="Total Amount (₹)" value={selectedLog.totalAmount.toLocaleString("en-IN")} mono />
                  <DetailRow label="Amount Collected (₹)" value={selectedLog.amountCollected.toLocaleString("en-IN")} mono />
                  <DetailRow label="Balance (₹)" value={selectedLog.balanceAmount.toLocaleString("en-IN")} mono />
                  <DetailRow label="Discount (₹)" value={selectedLog.discountAmount.toLocaleString("en-IN")} mono />
                  <DetailRow label="Payment Mode" value={selectedLog.paymentMode} />
                  <DetailRow label="Transaction Ref" value={selectedLog.transactionRef ?? "—"} mono />
                  <DetailRow label="Payment Status" value={selectedLog.paymentStatus} />
                  <DetailRow label="Collected By" value={selectedLog.collectedBy} mono />
                  <DetailRow label="User Role" value={selectedLog.userRole} />
                  <DetailRow label="Facility" value={selectedLog.facilityId} mono />
                  <DetailRow label="IP Address" value={selectedLog.ipAddress} mono />
                  <DetailRow label="Change Reason" value={selectedLog.changeReason ?? "—"} />
                  {selectedLog.refundAmount != null && <DetailRow label="Refund Amount (₹)" value={selectedLog.refundAmount.toLocaleString("en-IN")} mono />}
                  {selectedLog.refundReason && <DetailRow label="Refund Reason" value={selectedLog.refundReason} />}
                  <DetailRow label="Status" value={selectedLog.status} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={reportSheetOpen} onOpenChange={setReportSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Export Payment Collection Logs</SheetTitle>
            <SheetDescription>Export audit records for Payment Collection (Story 18) in CSV or PDF format.</SheetDescription>
          </SheetHeader>
          <div className="py-6 text-sm text-muted-foreground">Select format and date range to export. (Integration with export API can be wired here.)</div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default PaymentCollectionLogs;
