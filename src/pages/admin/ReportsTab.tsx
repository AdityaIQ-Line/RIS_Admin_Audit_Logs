import * as React from "react";
import {
  Download,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { ICON_STROKE_WIDTH } from "../../lib/constants";
import { Button } from "../../app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../app/components/ui/card";
import { Badge } from "../../app/components/ui/badge";
import { Separator } from "../../app/components/ui/separator";

interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  frequency: string;
  lastGenerated: string;
  format: string[];
  complianceFrameworks: string[];
}

const reportDefinitions: ReportDefinition[] = [
  {
    id: "RPT-001",
    name: "Login Activity Summary",
    description:
      "Aggregated summary of all login and logout events grouped by user, role, and facility. Includes success rates and session duration averages.",
    frequency: "Daily",
    lastGenerated: "2025-01-14",
    format: ["CSV", "PDF"],
    complianceFrameworks: ["HIPAA", "ISO 27001"],
  },
  {
    id: "RPT-002",
    name: "Failed Authentication Report",
    description:
      "Detailed report of all failed login attempts including brute-force alerts, account lockouts, and after-hours anomalies.",
    frequency: "Daily",
    lastGenerated: "2025-01-14",
    format: ["CSV", "PDF"],
    complianceFrameworks: ["HIPAA", "NABH", "ISO 27001"],
  },
  {
    id: "RPT-003",
    name: "Session Anomaly Report",
    description:
      "Highlights suspicious session activity including concurrent session blocks, unusually long sessions, and off-hours access.",
    frequency: "Weekly",
    lastGenerated: "2025-01-12",
    format: ["PDF"],
    complianceFrameworks: ["ISO 27001"],
  },
  {
    id: "RPT-004",
    name: "User Access Audit (NABH)",
    description:
      "Full audit trail for NABH accreditation inspections. Covers all user access events for the selected date range.",
    frequency: "Monthly",
    lastGenerated: "2025-01-01",
    format: ["PDF"],
    complianceFrameworks: ["NABH"],
  },
  {
    id: "RPT-005",
    name: "ISO 27001 Access Control Log",
    description:
      "Structured access control log meeting ISO 27001 Annex A.9 requirements. Includes role verification and privilege summary.",
    frequency: "Monthly",
    lastGenerated: "2025-01-01",
    format: ["CSV", "PDF"],
    complianceFrameworks: ["ISO 27001"],
  },
];

const complianceBadgeVariant = (
  framework: string,
): "default" | "secondary" | "outline" => {
  if (framework === "HIPAA") return "default";
  if (framework === "NABH") return "secondary";
  return "outline";
};

export function ReportsTab() {
  const handleExport = (reportId: string, format: string) => {
    alert(
      `Generating ${format} for report ${reportId}. In production, this will download the report file.`,
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-6 py-6 space-y-6">
      {/* Header info */}
      <div className="flex items-start gap-3 rounded-md border border-border bg-muted/40 px-4 py-3">
        <Shield
          className="size-4 text-muted-foreground mt-0.5 shrink-0"
          strokeWidth={ICON_STROKE_WIDTH}
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">
            Compliance Reporting:
          </span>{" "}
          All reports are generated from immutable audit log data. Reports are
          available in CSV and PDF formats. Logs are retained for 5–7 years per
          NABH, ISO 27001, and HIPAA-aligned retention policy.
        </p>
      </div>

      {/* Retention Policy Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xs font-normal text-muted-foreground">
                Retention Period
              </h3>
              <Clock
                strokeWidth={ICON_STROKE_WIDTH}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div className="text-2xl font-bold text-foreground">5–7 Years</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Per NABH &amp; ISO 27001 policy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xs font-normal text-muted-foreground">
                Compliance Frameworks
              </h3>
              <CheckCircle
                strokeWidth={ICON_STROKE_WIDTH}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              HIPAA · NABH · ISO 27001
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xs font-normal text-muted-foreground">
                Available Reports
              </h3>
              <FileText
                strokeWidth={ICON_STROKE_WIDTH}
                className="h-5 w-5 text-muted-foreground"
              />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {reportDefinitions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ready to generate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Select a report to generate and download. All reports use the current
            audit log dataset.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {reportDefinitions.map((report, index) => (
              <div
                key={report.id}
                className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    <FileText
                      className="size-4 text-muted-foreground"
                      strokeWidth={ICON_STROKE_WIDTH}
                    />
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">
                        {report.name}
                      </span>
                      <span className="roboto-mono text-xs text-muted-foreground tabular-nums">
                        {report.id}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      {report.complianceFrameworks.map((fw) => (
                        <Badge
                          key={fw}
                          variant={complianceBadgeVariant(fw)}
                          className="text-xs"
                        >
                          {fw}
                        </Badge>
                      ))}
                      <Separator orientation="vertical" className="h-3" />
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar
                          className="size-3"
                          strokeWidth={ICON_STROKE_WIDTH}
                        />
                        <span>
                          {report.frequency} · Last:{" "}
                          <span className="roboto-mono tabular-nums">
                            {report.lastGenerated}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {report.format.map((fmt) => (
                    <Button
                      key={fmt}
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => handleExport(report.id, fmt)}
                    >
                      <Download
                        className="size-3.5"
                        strokeWidth={ICON_STROKE_WIDTH}
                      />
                      {fmt}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-4 py-3">
        <AlertTriangle
          className="size-4 text-muted-foreground mt-0.5 shrink-0"
          strokeWidth={ICON_STROKE_WIDTH}
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Important:</span>{" "}
          Report data is sourced from immutable audit logs. No report generation
          modifies the underlying log data. For inspection purposes, reports must
          be requested through the appropriate compliance officer. All export
          activity is itself logged in the system audit trail.
        </p>
      </div>
    </div>
  );
}

export default ReportsTab;
