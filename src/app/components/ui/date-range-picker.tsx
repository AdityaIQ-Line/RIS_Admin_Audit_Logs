import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { Button } from "./button";
import { ICON_STROKE_WIDTH } from "../../../lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface QuickRange {
  label: string;
  getValue: () => { from: Date; to: Date };
}

interface DateRangePickerProps {
  /** Current committed range (shown in the trigger label) */
  value: DateRange;
  /** Called when user clicks Apply */
  onApply: (range: { from: Date; to: Date }) => void;
  /** Called when user clicks Cancel */
  onCancel: () => void;
  /** Quick-select presets shown in the left sidebar */
  quickRanges?: QuickRange[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Calendar helpers
// ─────────────────────────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function buildWeeks(year: number, month: number): Date[][] {
  const first = startOfMonth(new Date(year, month));
  const last = endOfMonth(new Date(year, month));
  const start = startOfWeek(first, { weekStartsOn: 0 });
  const end = endOfWeek(last, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

// ─────────────────────────────────────────────────────────────────────────────
// Single-month calendar sub-component
// ─────────────────────────────────────────────────────────────────────────────

interface MonthCalendarProps {
  year: number;
  month: number;
  selection: DateRange;
  hoverDate: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function MonthCalendar({
  year,
  month,
  selection,
  hoverDate,
  onDayClick,
  onDayHover,
  onPrev,
  onNext,
}: MonthCalendarProps) {
  const weeks = buildWeeks(year, month);
  const monthDate = new Date(year, month);

  const effectiveTo =
    selection.from && !selection.to && hoverDate && isAfter(hoverDate, selection.from)
      ? hoverDate
      : selection.to;

  const isSelected = (d: Date) =>
    !!(
      (selection.from && isSameDay(d, selection.from)) ||
      (effectiveTo && isSameDay(d, effectiveTo))
    );

  const isInRange = (d: Date) => {
    if (!selection.from || !effectiveTo) return false;
    if (isSameDay(selection.from, effectiveTo)) return false;
    return (
      isWithinInterval(d, { start: selection.from, end: effectiveTo }) &&
      !isSameDay(d, selection.from) &&
      !isSameDay(d, effectiveTo)
    );
  };

  const isRangeStart = (d: Date) =>
    !!(selection.from && isSameDay(d, selection.from) && effectiveTo && !isSameDay(selection.from, effectiveTo));

  const isRangeEnd = (d: Date) =>
    !!(effectiveTo && isSameDay(d, effectiveTo) && selection.from && !isSameDay(selection.from, effectiveTo));

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Month header */}
      <div className="flex items-center justify-between">
        {onPrev ? (
          <button
            onClick={onPrev}
            aria-label="Previous month"
            className="flex items-center justify-center size-8 rounded-md border border-border bg-background shadow-sm hover:bg-accent transition-colors"
          >
            <ChevronLeft strokeWidth={ICON_STROKE_WIDTH} className="size-[15px] text-foreground" />
          </button>
        ) : (
          <div className="size-8" />
        )}

        <span className="text-sm font-medium text-foreground">
          {format(monthDate, "MMMM yyyy")}
        </span>

        {onNext ? (
          <button
            onClick={onNext}
            aria-label="Next month"
            className="flex items-center justify-center size-8 rounded-md border border-border bg-background shadow-sm hover:bg-accent transition-colors"
          >
            <ChevronRight strokeWidth={ICON_STROKE_WIDTH} className="size-[15px] text-foreground" />
          </button>
        ) : (
          <div className="size-8" />
        )}
      </div>

      {/* Weekday row */}
      <div className="flex">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex flex-1 items-center justify-center size-12 text-xs text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day rows */}
      <div className="flex flex-col gap-px">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex">
            {week.map((day, di) => {
              const outsideMonth = !isSameMonth(day, monthDate);
              const selected = isSelected(day);
              const inRange = isInRange(day);
              const rangeStart = isRangeStart(day);
              const rangeEnd = isRangeEnd(day);

              return (
                <div
                  key={di}
                  className={[
                    "flex flex-1 items-center justify-center size-12 relative",
                    inRange ? "bg-primary/10" : "",
                    rangeStart ? "rounded-l-sm bg-primary/10" : "",
                    rangeEnd ? "rounded-r-sm bg-primary/10" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <button
                    onClick={() => onDayClick(day)}
                    onMouseEnter={() => onDayHover(day)}
                    onMouseLeave={() => onDayHover(null)}
                    className={[
                      "flex items-center justify-center size-8 rounded-sm text-sm transition-colors",
                      outsideMonth ? "opacity-40" : "",
                      selected
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-accent text-foreground",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {format(day, "d")}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main DateRangePicker panel (rendered inside a Popover)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_QUICK_RANGES: QuickRange[] = [
  {
    label: "Today",
    getValue: () => ({ from: startOfDay(new Date()), to: new Date() }),
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 7);
      return { from, to };
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from, to };
    },
  },
  {
    label: "Last 90 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 90);
      return { from, to };
    },
  },
  {
    label: "Month to date",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: new Date(),
    }),
  },
];

export function DateRangePicker({
  value,
  onApply,
  onCancel,
  quickRanges = DEFAULT_QUICK_RANGES,
}: DateRangePickerProps) {
  // Internal draft state — only committed on Apply
  const [draft, setDraft] = React.useState<DateRange>({
    from: value.from,
    to: value.to,
  });
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const [activePreset, setActivePreset] = React.useState<string | null>(null);

  // Left calendar shows `viewMonth`, right shows `viewMonth + 1`
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(
    value.from ? value.from.getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = React.useState(
    value.from ? value.from.getMonth() : today.getMonth(),
  );

  const rightMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  const handlePrev = () => {
    const prev = subMonths(new Date(viewYear, viewMonth), 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  };

  const handleNext = () => {
    const next = addMonths(new Date(viewYear, viewMonth), 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  // Day click: first click sets from, second sets to (in order)
  const handleDayClick = (day: Date) => {
    setActivePreset(null);
    if (!draft.from || (draft.from && draft.to)) {
      // Start fresh selection
      setDraft({ from: day, to: undefined });
    } else {
      // We have from, no to yet
      if (isBefore(day, draft.from) || isSameDay(day, draft.from)) {
        setDraft({ from: day, to: undefined });
      } else {
        setDraft({ from: draft.from, to: day });
      }
    }
  };

  const handleQuickRange = (qr: QuickRange) => {
    const range = qr.getValue();
    setDraft({ from: range.from, to: range.to });
    setActivePreset(qr.label);
    // Navigate left calendar to the from month
    setViewYear(range.from.getFullYear());
    setViewMonth(range.from.getMonth());
  };

  const handleApply = () => {
    if (draft.from && draft.to) {
      onApply({ from: draft.from, to: draft.to });
    }
  };

  const formatRangeLabel = (d: Date) =>
    format(d, "dd-MMM-yy").toUpperCase();

  const canApply = !!(draft.from && draft.to);

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border shadow-md flex flex-col">
      <div className="flex">
        {/* ── Quick select sidebar ─────────────────────────────────── */}
        <div className="flex flex-col gap-3 p-2 border-r border-border w-36 shrink-0">
          {quickRanges.map((qr) => {
            const isActive = activePreset === qr.label;
            return (
              <button
                key={qr.label}
                onClick={() => handleQuickRange(qr)}
                className={[
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                  isActive
                    ? "border border-border bg-background shadow-sm text-foreground font-medium"
                    : "text-foreground hover:bg-accent",
                ].join(" ")}
              >
                {qr.label}
              </button>
            );
          })}
        </div>

        {/* ── Dual calendar area ───────────────────────────────────── */}
        <div className="flex gap-4 p-3">
          <MonthCalendar
            year={viewYear}
            month={viewMonth}
            selection={draft}
            hoverDate={hoverDate}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
            onPrev={handlePrev}
          />

          {/* Vertical divider */}
          <div className="w-px bg-border self-stretch" />

          <MonthCalendar
            year={rightYear}
            month={rightMonth}
            selection={draft}
            hoverDate={hoverDate}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
            onNext={handleNext}
          />
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
        {/* Range label */}
        <span className="text-sm text-muted-foreground tabular-nums roboto-mono">
          {draft.from && draft.to ? (
            <>
              <span className="text-foreground font-medium mr-1">Range:</span>
              {formatRangeLabel(draft.from)} – {formatRangeLabel(draft.to)}
            </>
          ) : draft.from ? (
            <>
              <span className="text-foreground font-medium mr-1">From:</span>
              {formatRangeLabel(draft.from)}
              <span className="ml-1 text-muted-foreground">— select end date</span>
            </>
          ) : (
            <span className="italic text-muted-foreground">No range selected</span>
          )}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply} disabled={!canApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}