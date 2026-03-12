/**
 * Analytics Configuration System
 * Config-driven analytics metadata for scalable, extensible analytics module
 */

export type EntityType = 'radiologist' | 'modality' | 'referrer' | 'ai' | 'turnaround' | 'quality' | 'operational' | 'custom'

export type MetricType = 'count' | 'percentage' | 'duration' | 'rate' | 'score' | 'trend'

export type VisualizationType = 'line' | 'bar' | 'pie' | 'area' | 'table' | 'kpi'

export type FilterType = 'dateRange' | 'radiologist' | 'modality' | 'referrer' | 'priority' | 'status' | 'facility' | 'aiModel'

export interface MetricDefinition {
  id: string
  name: string
  type: MetricType
  unit?: string
  description: string
  format?: 'number' | 'percentage' | 'duration' | 'decimal'
  threshold?: {
    warning: number
    critical: number
    direction: 'above' | 'below' // whether higher or lower is worse
  }
}

export interface FilterDefinition {
  id: FilterType
  name: string
  type: 'select' | 'dateRange' | 'multiSelect' | 'text'
  required?: boolean
  defaultValue?: any
}

export interface VisualizationDefinition {
  id: string
  type: VisualizationType
  title: string
  metrics: string[] // metric IDs
  chartType?: 'line' | 'bar' | 'pie' | 'area'
}

export interface AnalyticsCategory {
  id: string
  name: string
  description: string
  icon: string // lucide icon name
  entityType: EntityType
  
  // Metrics tracked in this category
  metrics: MetricDefinition[]
  
  // Available filters
  filters: FilterDefinition[]
  
  // Default visualizations
  visualizations: VisualizationDefinition[]
  
  // CSV export configuration
  csvExport: {
    filename: string
    columns: {
      id: string
      header: string
      dataKey: string
      format?: 'number' | 'percentage' | 'duration' | 'date'
    }[]
  }
  
  // Drill-down configuration
  drillDown?: {
    enabled: boolean
    entityIdField: string
    detailRoute?: string
  }
}

/**
 * Analytics Categories Configuration
 * Add new categories here to extend the analytics module
 */
export const ANALYTICS_CATEGORIES: AnalyticsCategory[] = [
  {
    id: 'radiologist-performance',
    name: 'Radiologist Performance Analytics',
    description: 'Track individual radiologist productivity, quality, and turnaround times',
    icon: 'UserCheck',
    entityType: 'radiologist',
    
    metrics: [
      {
        id: 'total_reports',
        name: 'Total Reports',
        type: 'count',
        description: 'Total number of reports generated',
        format: 'number'
      },
      {
        id: 'avg_tat',
        name: 'Average TAT',
        type: 'duration',
        unit: 'hours',
        description: 'Average turnaround time',
        format: 'duration',
        threshold: {
          warning: 24,
          critical: 48,
          direction: 'above'
        }
      },
      {
        id: 'reports_per_day',
        name: 'Reports per Day',
        type: 'rate',
        description: 'Average reports per working day',
        format: 'decimal'
      },
      {
        id: 'quality_score',
        name: 'Quality Score',
        type: 'percentage',
        unit: '%',
        description: 'Quality assurance score based on peer reviews',
        format: 'percentage',
        threshold: {
          warning: 85,
          critical: 75,
          direction: 'below'
        }
      },
      {
        id: 'revision_rate',
        name: 'Revision Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of reports requiring revision',
        format: 'percentage',
        threshold: {
          warning: 10,
          critical: 15,
          direction: 'above'
        }
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'radiologist', name: 'Radiologist', type: 'multiSelect' },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'facility', name: 'Facility', type: 'select' }
    ],
    
    visualizations: [
      {
        id: 'reports_trend',
        type: 'line',
        title: 'Reports Trend Over Time',
        metrics: ['total_reports'],
        chartType: 'line'
      },
      {
        id: 'tat_comparison',
        type: 'bar',
        title: 'Average TAT by Radiologist',
        metrics: ['avg_tat'],
        chartType: 'bar'
      },
      {
        id: 'quality_overview',
        type: 'table',
        title: 'Radiologist Performance Summary',
        metrics: ['total_reports', 'avg_tat', 'quality_score', 'revision_rate']
      }
    ],
    
    csvExport: {
      filename: 'radiologist_performance',
      columns: [
        { id: 'radiologist_name', header: 'Radiologist Name', dataKey: 'radiologistName' },
        { id: 'total_reports', header: 'Total Reports', dataKey: 'totalReports', format: 'number' },
        { id: 'avg_tat', header: 'Avg TAT (hours)', dataKey: 'avgTAT', format: 'duration' },
        { id: 'reports_per_day', header: 'Reports/Day', dataKey: 'reportsPerDay', format: 'number' },
        { id: 'quality_score', header: 'Quality Score (%)', dataKey: 'qualityScore', format: 'percentage' },
        { id: 'revision_rate', header: 'Revision Rate (%)', dataKey: 'revisionRate', format: 'percentage' }
      ]
    },
    
    drillDown: {
      enabled: true,
      entityIdField: 'radiologistId',
      detailRoute: '/admin/analytics/radiologist'
    }
  },
  
  {
    id: 'modality-case-analytics',
    name: 'Modality-wise Case Analytics',
    description: 'Analyze TAT performance and case distribution across imaging modalities',
    icon: 'Activity',
    entityType: 'modality',
    
    metrics: [
      {
        id: 'total_cases',
        name: 'Total Cases',
        type: 'count',
        description: 'Total number of cases',
        format: 'number'
      },
      {
        id: 'avg_tat',
        name: 'Average TAT',
        type: 'duration',
        unit: 'hours',
        description: 'Average turnaround time',
        format: 'duration',
        threshold: {
          warning: 24,
          critical: 48,
          direction: 'above'
        }
      },
      {
        id: 'median_tat',
        name: 'Median TAT',
        type: 'duration',
        unit: 'hours',
        description: 'Median turnaround time',
        format: 'duration'
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'facility', name: 'Facility', type: 'select' },
      { id: 'priority', name: 'Priority', type: 'multiSelect' },
      { id: 'radiologist', name: 'Radiologist', type: 'multiSelect' }
    ],
    
    visualizations: [
      {
        id: 'tat_trend',
        type: 'line',
        title: 'Average TAT Trend',
        metrics: ['avg_tat'],
        chartType: 'line'
      },
      {
        id: 'modality_summary',
        type: 'table',
        title: 'Modality Performance Summary',
        metrics: ['total_cases', 'avg_tat', 'median_tat']
      }
    ],
    
    csvExport: {
      filename: 'modality_case_analytics',
      columns: [
        { id: 'modality', header: 'Modality', dataKey: 'modality' },
        { id: 'total_cases', header: 'Total Cases', dataKey: 'totalCases', format: 'number' },
        { id: 'avg_tat', header: 'Avg TAT (hrs)', dataKey: 'avgTAT', format: 'duration' },
        { id: 'median_tat', header: 'Median TAT (hrs)', dataKey: 'medianTAT', format: 'duration' }
      ]
    },
    
    drillDown: {
      enabled: true,
      entityIdField: 'modalityId',
      detailRoute: '/admin/analytics/modality'
    }
  },
  
  {
    id: 'modality-report-analytics',
    name: 'Modality-wise Report Analytics',
    description: 'Track report quality and completion metrics by modality',
    icon: 'FileText',
    entityType: 'modality',
    
    metrics: [
      {
        id: 'total_reports',
        name: 'Total Reports',
        type: 'count',
        description: 'Total reports generated',
        format: 'number'
      },
      {
        id: 'finalized_reports',
        name: 'Finalized Reports',
        type: 'count',
        description: 'Reports marked as finalized',
        format: 'number'
      },
      {
        id: 'draft_reports',
        name: 'Draft Reports',
        type: 'count',
        description: 'Reports in draft state',
        format: 'number'
      },
      {
        id: 'avg_report_tat',
        name: 'Avg Report TAT',
        type: 'duration',
        unit: 'hours',
        description: 'Average time from study to finalized report',
        format: 'duration',
        threshold: {
          warning: 48,
          critical: 72,
          direction: 'above'
        }
      },
      {
        id: 'critical_findings_rate',
        name: 'Critical Findings Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of reports with critical findings',
        format: 'percentage'
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'radiologist', name: 'Radiologist', type: 'multiSelect' },
      { id: 'priority', name: 'Priority', type: 'multiSelect' }
    ],
    
    visualizations: [
      {
        id: 'report_status',
        type: 'bar',
        title: 'Report Status by Modality',
        metrics: ['finalized_reports', 'draft_reports'],
        chartType: 'bar'
      },
      {
        id: 'tat_by_modality',
        type: 'bar',
        title: 'Average TAT by Modality',
        metrics: ['avg_report_tat'],
        chartType: 'bar'
      },
      {
        id: 'report_summary',
        type: 'table',
        title: 'Report Analytics Summary',
        metrics: ['total_reports', 'finalized_reports', 'avg_report_tat', 'critical_findings_rate']
      }
    ],
    
    csvExport: {
      filename: 'modality_report_analytics',
      columns: [
        { id: 'modality', header: 'Modality', dataKey: 'modality' },
        { id: 'total_reports', header: 'Total Reports', dataKey: 'totalReports', format: 'number' },
        { id: 'finalized', header: 'Finalized', dataKey: 'finalizedReports', format: 'number' },
        { id: 'draft', header: 'Draft', dataKey: 'draftReports', format: 'number' },
        { id: 'avg_tat', header: 'Avg TAT (hours)', dataKey: 'avgReportTAT', format: 'duration' },
        { id: 'critical_rate', header: 'Critical Findings (%)', dataKey: 'criticalFindingsRate', format: 'percentage' }
      ]
    },
    
    drillDown: {
      enabled: true,
      entityIdField: 'modalityId'
    }
  },
  
  {
    id: 'referrer-analytics',
    name: 'Referrer Physician Analytics',
    description: 'Analyze referral patterns and collaboration metrics',
    icon: 'Users',
    entityType: 'referrer',
    
    metrics: [
      {
        id: 'total_referrals',
        name: 'Total Referrals',
        type: 'count',
        description: 'Total cases referred',
        format: 'number'
      },
      {
        id: 'referrals_by_modality',
        name: 'Referrals by Modality',
        type: 'count',
        description: 'Breakdown by imaging modality',
        format: 'number'
      },
      {
        id: 'avg_referral_tat',
        name: 'Avg Referral TAT',
        type: 'duration',
        unit: 'hours',
        description: 'Average time from referral to report',
        format: 'duration'
      },
      {
        id: 'critical_findings_count',
        name: 'Critical Findings',
        type: 'count',
        description: 'Cases with critical findings',
        format: 'number'
      },
      {
        id: 'follow_up_rate',
        name: 'Follow-up Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of cases with follow-up studies',
        format: 'percentage'
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'referrer', name: 'Referring Physician', type: 'multiSelect' },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'facility', name: 'Facility', type: 'select' }
    ],
    
    visualizations: [
      {
        id: 'referral_volume',
        type: 'bar',
        title: 'Referral Volume by Physician',
        metrics: ['total_referrals'],
        chartType: 'bar'
      },
      {
        id: 'referral_trend',
        type: 'line',
        title: 'Referral Trend Over Time',
        metrics: ['total_referrals'],
        chartType: 'line'
      },
      {
        id: 'referrer_summary',
        type: 'table',
        title: 'Referrer Analytics Summary',
        metrics: ['total_referrals', 'avg_referral_tat', 'critical_findings_count', 'follow_up_rate']
      }
    ],
    
    csvExport: {
      filename: 'referrer_analytics',
      columns: [
        { id: 'referrer_name', header: 'Referring Physician', dataKey: 'referrerName' },
        { id: 'total_referrals', header: 'Total Referrals', dataKey: 'totalReferrals', format: 'number' },
        { id: 'avg_tat', header: 'Avg TAT (hours)', dataKey: 'avgReferralTAT', format: 'duration' },
        { id: 'critical_findings', header: 'Critical Findings', dataKey: 'criticalFindingsCount', format: 'number' },
        { id: 'follow_up_rate', header: 'Follow-up Rate (%)', dataKey: 'followUpRate', format: 'percentage' }
      ]
    },
    
    drillDown: {
      enabled: true,
      entityIdField: 'referrerId'
    }
  },
  
  {
    id: 'ai-acceptance-rate',
    name: 'AI Report Acceptance Rate',
    description: 'Track AI-assisted reporting adoption and accuracy',
    icon: 'Cpu',
    entityType: 'ai',
    
    metrics: [
      {
        id: 'ai_reports_generated',
        name: 'AI Reports Generated',
        type: 'count',
        description: 'Total AI-assisted reports',
        format: 'number'
      },
      {
        id: 'ai_accepted',
        name: 'AI Accepted',
        type: 'count',
        description: 'AI reports accepted without modification',
        format: 'number'
      },
      {
        id: 'ai_modified',
        name: 'AI Modified',
        type: 'count',
        description: 'AI reports modified before finalization',
        format: 'number'
      },
      {
        id: 'ai_acceptance_rate',
        name: 'AI Acceptance Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of AI reports accepted as-is',
        format: 'percentage'
      },
      {
        id: 'ai_time_saved',
        name: 'Time Saved',
        type: 'duration',
        unit: 'hours',
        description: 'Estimated time saved using AI',
        format: 'duration'
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'radiologist', name: 'Radiologist', type: 'multiSelect' },
      { id: 'aiModel', name: 'AI Model', type: 'select' }
    ],
    
    visualizations: [
      {
        id: 'ai_acceptance_pie',
        type: 'pie',
        title: 'AI Report Disposition',
        metrics: ['ai_accepted', 'ai_modified'],
        chartType: 'pie'
      },
      {
        id: 'ai_trend',
        type: 'line',
        title: 'AI Acceptance Trend',
        metrics: ['ai_acceptance_rate'],
        chartType: 'line'
      },
      {
        id: 'ai_summary',
        type: 'table',
        title: 'AI Analytics Summary',
        metrics: ['ai_reports_generated', 'ai_accepted', 'ai_modified', 'ai_acceptance_rate', 'ai_time_saved']
      }
    ],
    
    csvExport: {
      filename: 'ai_acceptance_analytics',
      columns: [
        { id: 'modality', header: 'Modality', dataKey: 'modality' },
        { id: 'ai_generated', header: 'AI Reports Generated', dataKey: 'aiReportsGenerated', format: 'number' },
        { id: 'ai_accepted', header: 'Accepted', dataKey: 'aiAccepted', format: 'number' },
        { id: 'ai_modified', header: 'Modified', dataKey: 'aiModified', format: 'number' },
        { id: 'acceptance_rate', header: 'Acceptance Rate (%)', dataKey: 'aiAcceptanceRate', format: 'percentage' },
        { id: 'time_saved', header: 'Time Saved (hours)', dataKey: 'aiTimeSaved', format: 'duration' }
      ]
    },
    
    drillDown: {
      enabled: true,
      entityIdField: 'modalityId'
    }
  },
  
  {
    id: 'turnaround-time',
    name: 'Turnaround Time Metrics',
    description: 'Comprehensive TAT analysis across all dimensions',
    icon: 'Clock',
    entityType: 'turnaround',
    
    metrics: [
      {
        id: 'avg_total_tat',
        name: 'Avg Total TAT',
        type: 'duration',
        unit: 'hours',
        description: 'Average time from study to finalized report',
        format: 'duration',
        threshold: {
          warning: 48,
          critical: 72,
          direction: 'above'
        }
      },
      {
        id: 'avg_reporting_time',
        name: 'Avg Reporting Time',
        type: 'duration',
        unit: 'hours',
        description: 'Average time radiologist spends on report',
        format: 'duration'
      },
      {
        id: 'avg_qa_time',
        name: 'Avg QA Time',
        type: 'duration',
        unit: 'hours',
        description: 'Average time in quality control',
        format: 'duration'
      },
      {
        id: 'tat_compliance_rate',
        name: 'TAT Compliance Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage meeting TAT SLA',
        format: 'percentage',
        threshold: {
          warning: 90,
          critical: 80,
          direction: 'below'
        }
      },
      {
        id: 'stat_tat',
        name: 'STAT TAT',
        type: 'duration',
        unit: 'hours',
        description: 'Average TAT for urgent cases',
        format: 'duration',
        threshold: {
          warning: 2,
          critical: 4,
          direction: 'above'
        }
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'radiologist', name: 'Radiologist', type: 'multiSelect' },
      { id: 'priority', name: 'Priority', type: 'multiSelect' },
      { id: 'facility', name: 'Facility', type: 'select' }
    ],
    
    visualizations: [
      {
        id: 'tat_trend',
        type: 'line',
        title: 'TAT Trend Over Time',
        metrics: ['avg_total_tat'],
        chartType: 'line'
      },
      {
        id: 'tat_breakdown',
        type: 'bar',
        title: 'TAT Breakdown by Stage',
        metrics: ['avg_reporting_time', 'avg_qa_time'],
        chartType: 'bar'
      },
      {
        id: 'tat_summary',
        type: 'table',
        title: 'TAT Metrics Summary',
        metrics: ['avg_total_tat', 'avg_reporting_time', 'tat_compliance_rate', 'stat_tat']
      }
    ],
    
    csvExport: {
      filename: 'turnaround_time_analytics',
      columns: [
        { id: 'period', header: 'Period', dataKey: 'period' },
        { id: 'avg_total_tat', header: 'Avg Total TAT (hours)', dataKey: 'avgTotalTAT', format: 'duration' },
        { id: 'avg_reporting', header: 'Avg Reporting Time (hours)', dataKey: 'avgReportingTime', format: 'duration' },
        { id: 'avg_qa', header: 'Avg QA Time (hours)', dataKey: 'avgQATime', format: 'duration' },
        { id: 'compliance_rate', header: 'TAT Compliance (%)', dataKey: 'tatComplianceRate', format: 'percentage' },
        { id: 'stat_tat', header: 'STAT TAT (hours)', dataKey: 'statTAT', format: 'duration' }
      ]
    },
    
    drillDown: {
      enabled: false
    }
  },
  
  {
    id: 'report-quality',
    name: 'Report Completeness & Error Metrics',
    description: 'Track report quality, errors, and completeness',
    icon: 'CheckCircle',
    entityType: 'quality',
    
    metrics: [
      {
        id: 'total_reports_reviewed',
        name: 'Total Reports Reviewed',
        type: 'count',
        description: 'Reports that underwent quality review',
        format: 'number'
      },
      {
        id: 'error_rate',
        name: 'Error Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of reports with errors',
        format: 'percentage',
        threshold: {
          warning: 5,
          critical: 10,
          direction: 'above'
        }
      },
      {
        id: 'incomplete_reports',
        name: 'Incomplete Reports',
        type: 'count',
        description: 'Reports missing required fields',
        format: 'number'
      },
      {
        id: 'addendum_rate',
        name: 'Addendum Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of reports requiring addendums',
        format: 'percentage',
        threshold: {
          warning: 8,
          critical: 12,
          direction: 'above'
        }
      },
      {
        id: 'completeness_score',
        name: 'Completeness Score',
        type: 'percentage',
        unit: '%',
        description: 'Average report completeness score',
        format: 'percentage',
        threshold: {
          warning: 90,
          critical: 85,
          direction: 'below'
        }
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'radiologist', name: 'Radiologist', type: 'multiSelect' },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'facility', name: 'Facility', type: 'select' }
    ],
    
    visualizations: [
      {
        id: 'quality_trend',
        type: 'line',
        title: 'Quality Metrics Trend',
        metrics: ['error_rate', 'completeness_score'],
        chartType: 'line'
      },
      {
        id: 'error_breakdown',
        type: 'bar',
        title: 'Error Distribution',
        metrics: ['error_rate', 'addendum_rate'],
        chartType: 'bar'
      },
      {
        id: 'quality_summary',
        type: 'table',
        title: 'Quality Metrics Summary',
        metrics: ['total_reports_reviewed', 'error_rate', 'incomplete_reports', 'addendum_rate', 'completeness_score']
      }
    ],
    
    csvExport: {
      filename: 'report_quality_analytics',
      columns: [
        { id: 'radiologist', header: 'Radiologist', dataKey: 'radiologist' },
        { id: 'total_reviewed', header: 'Reports Reviewed', dataKey: 'totalReportsReviewed', format: 'number' },
        { id: 'error_rate', header: 'Error Rate (%)', dataKey: 'errorRate', format: 'percentage' },
        { id: 'incomplete', header: 'Incomplete Reports', dataKey: 'incompleteReports', format: 'number' },
        { id: 'addendum_rate', header: 'Addendum Rate (%)', dataKey: 'addendumRate', format: 'percentage' },
        { id: 'completeness', header: 'Completeness Score (%)', dataKey: 'completenessScore', format: 'percentage' }
      ]
    },
    
    drillDown: {
      enabled: true,
      entityIdField: 'radiologistId'
    }
  },
  
  {
    id: 'study-volume-trend',
    name: 'Study Volume & Trend Analysis',
    description: 'Analyze study volumes, trends, and capacity utilization',
    icon: 'TrendingUp',
    entityType: 'operational',
    
    metrics: [
      {
        id: 'total_studies',
        name: 'Total Studies',
        type: 'count',
        description: 'Total imaging studies performed',
        format: 'number'
      },
      {
        id: 'daily_average',
        name: 'Daily Average',
        type: 'rate',
        description: 'Average studies per day',
        format: 'number'
      },
      {
        id: 'peak_volume',
        name: 'Peak Volume',
        type: 'count',
        description: 'Highest single-day volume',
        format: 'number'
      },
      {
        id: 'growth_rate',
        name: 'Growth Rate',
        type: 'percentage',
        unit: '%',
        description: 'Period-over-period growth',
        format: 'percentage'
      },
      {
        id: 'capacity_utilization',
        name: 'Capacity Utilization',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of total capacity used',
        format: 'percentage',
        threshold: {
          warning: 90,
          critical: 95,
          direction: 'above'
        }
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'facility', name: 'Facility', type: 'select' }
    ],
    
    visualizations: [
      {
        id: 'volume_trend',
        type: 'area',
        title: 'Study Volume Trend',
        metrics: ['total_studies'],
        chartType: 'area'
      },
      {
        id: 'modality_volume',
        type: 'bar',
        title: 'Volume by Modality',
        metrics: ['total_studies'],
        chartType: 'bar'
      },
      {
        id: 'volume_summary',
        type: 'table',
        title: 'Volume Analytics Summary',
        metrics: ['total_studies', 'daily_average', 'peak_volume', 'growth_rate', 'capacity_utilization']
      }
    ],
    
    csvExport: {
      filename: 'study_volume_analytics',
      columns: [
        { id: 'period', header: 'Period', dataKey: 'period' },
        { id: 'total_studies', header: 'Total Studies', dataKey: 'totalStudies', format: 'number' },
        { id: 'daily_avg', header: 'Daily Average', dataKey: 'dailyAverage', format: 'number' },
        { id: 'peak_volume', header: 'Peak Volume', dataKey: 'peakVolume', format: 'number' },
        { id: 'growth_rate', header: 'Growth Rate (%)', dataKey: 'growthRate', format: 'percentage' },
        { id: 'capacity_util', header: 'Capacity Utilization (%)', dataKey: 'capacityUtilization', format: 'percentage' }
      ]
    },
    
    drillDown: {
      enabled: false
    }
  },
  
  {
    id: 'peer-review-qa',
    name: 'Peer Review / QA Metrics',
    description: 'Track peer review activities and quality assurance',
    icon: 'Shield',
    entityType: 'quality',
    
    metrics: [
      {
        id: 'reports_peer_reviewed',
        name: 'Reports Peer Reviewed',
        type: 'count',
        description: 'Total reports that underwent peer review',
        format: 'number'
      },
      {
        id: 'peer_review_rate',
        name: 'Peer Review Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of reports peer reviewed',
        format: 'percentage'
      },
      {
        id: 'agreement_rate',
        name: 'Agreement Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage where peer agrees with findings',
        format: 'percentage',
        threshold: {
          warning: 90,
          critical: 85,
          direction: 'below'
        }
      },
      {
        id: 'major_discrepancies',
        name: 'Major Discrepancies',
        type: 'count',
        description: 'Reports with significant diagnostic differences',
        format: 'number',
        threshold: {
          warning: 10,
          critical: 20,
          direction: 'above'
        }
      },
      {
        id: 'avg_review_time',
        name: 'Avg Review Time',
        type: 'duration',
        unit: 'minutes',
        description: 'Average time spent on peer review',
        format: 'duration'
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'radiologist', name: 'Radiologist', type: 'multiSelect' },
      { id: 'modality', name: 'Modality', type: 'multiSelect' }
    ],
    
    visualizations: [
      {
        id: 'agreement_trend',
        type: 'line',
        title: 'Agreement Rate Trend',
        metrics: ['agreement_rate'],
        chartType: 'line'
      },
      {
        id: 'discrepancy_breakdown',
        type: 'bar',
        title: 'Discrepancies by Radiologist',
        metrics: ['major_discrepancies'],
        chartType: 'bar'
      },
      {
        id: 'peer_review_summary',
        type: 'table',
        title: 'Peer Review Summary',
        metrics: ['reports_peer_reviewed', 'peer_review_rate', 'agreement_rate', 'major_discrepancies']
      }
    ],
    
    csvExport: {
      filename: 'peer_review_analytics',
      columns: [
        { id: 'radiologist', header: 'Radiologist', dataKey: 'radiologist' },
        { id: 'reviewed', header: 'Reports Peer Reviewed', dataKey: 'reportsPeerReviewed', format: 'number' },
        { id: 'review_rate', header: 'Peer Review Rate (%)', dataKey: 'peerReviewRate', format: 'percentage' },
        { id: 'agreement', header: 'Agreement Rate (%)', dataKey: 'agreementRate', format: 'percentage' },
        { id: 'discrepancies', header: 'Major Discrepancies', dataKey: 'majorDiscrepancies', format: 'number' },
        { id: 'review_time', header: 'Avg Review Time (min)', dataKey: 'avgReviewTime', format: 'duration' }
      ]
    },
    
    drillDown: {
      enabled: true,
      entityIdField: 'radiologistId'
    }
  },
  
  {
    id: 'ai-vs-final',
    name: 'AI vs Final Report Comparison',
    description: 'Compare AI-generated reports with final radiologist reports',
    icon: 'GitCompare',
    entityType: 'ai',
    
    metrics: [
      {
        id: 'reports_compared',
        name: 'Reports Compared',
        type: 'count',
        description: 'Total reports with AI comparison',
        format: 'number'
      },
      {
        id: 'ai_accuracy',
        name: 'AI Accuracy',
        type: 'percentage',
        unit: '%',
        description: 'Percentage where AI matches final diagnosis',
        format: 'percentage'
      },
      {
        id: 'false_positives',
        name: 'False Positives',
        type: 'count',
        description: 'AI findings not confirmed by radiologist',
        format: 'number'
      },
      {
        id: 'false_negatives',
        name: 'False Negatives',
        type: 'count',
        description: 'Findings missed by AI',
        format: 'number'
      },
      {
        id: 'sensitivity',
        name: 'Sensitivity',
        type: 'percentage',
        unit: '%',
        description: 'AI true positive rate',
        format: 'percentage'
      },
      {
        id: 'specificity',
        name: 'Specificity',
        type: 'percentage',
        unit: '%',
        description: 'AI true negative rate',
        format: 'percentage'
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'aiModel', name: 'AI Model', type: 'select' }
    ],
    
    visualizations: [
      {
        id: 'accuracy_trend',
        type: 'line',
        title: 'AI Accuracy Trend',
        metrics: ['ai_accuracy'],
        chartType: 'line'
      },
      {
        id: 'error_distribution',
        type: 'bar',
        title: 'AI Error Distribution',
        metrics: ['false_positives', 'false_negatives'],
        chartType: 'bar'
      },
      {
        id: 'ai_comparison_summary',
        type: 'table',
        title: 'AI Comparison Summary',
        metrics: ['reports_compared', 'ai_accuracy', 'sensitivity', 'specificity']
      }
    ],
    
    csvExport: {
      filename: 'ai_vs_final_comparison',
      columns: [
        { id: 'modality', header: 'Modality', dataKey: 'modality' },
        { id: 'compared', header: 'Reports Compared', dataKey: 'reportsCompared', format: 'number' },
        { id: 'accuracy', header: 'AI Accuracy (%)', dataKey: 'aiAccuracy', format: 'percentage' },
        { id: 'false_pos', header: 'False Positives', dataKey: 'falsePositives', format: 'number' },
        { id: 'false_neg', header: 'False Negatives', dataKey: 'falseNegatives', format: 'number' },
        { id: 'sensitivity', header: 'Sensitivity (%)', dataKey: 'sensitivity', format: 'percentage' },
        { id: 'specificity', header: 'Specificity (%)', dataKey: 'specificity', format: 'percentage' }
      ]
    },
    
    drillDown: {
      enabled: true,
      entityIdField: 'modalityId'
    }
  },
  
  {
    id: 'operational-bottleneck',
    name: 'Operational Bottleneck Analytics',
    description: 'Identify workflow bottlenecks and optimization opportunities',
    icon: 'AlertTriangle',
    entityType: 'operational',
    
    metrics: [
      {
        id: 'avg_wait_time',
        name: 'Avg Wait Time',
        type: 'duration',
        unit: 'hours',
        description: 'Average time studies wait for assignment',
        format: 'duration',
        threshold: {
          warning: 12,
          critical: 24,
          direction: 'above'
        }
      },
      {
        id: 'backlog_count',
        name: 'Current Backlog',
        type: 'count',
        description: 'Unassigned or pending studies',
        format: 'number',
        threshold: {
          warning: 50,
          critical: 100,
          direction: 'above'
        }
      },
      {
        id: 'reassignment_rate',
        name: 'Reassignment Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of studies reassigned',
        format: 'percentage',
        threshold: {
          warning: 15,
          critical: 25,
          direction: 'above'
        }
      },
      {
        id: 'rejection_rate',
        name: 'QC Rejection Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage rejected by quality control',
        format: 'percentage',
        threshold: {
          warning: 10,
          critical: 15,
          direction: 'above'
        }
      },
      {
        id: 'bottleneck_stage',
        name: 'Primary Bottleneck',
        type: 'count',
        description: 'Stage with longest delays',
        format: 'number'
      }
    ],
    
    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'facility', name: 'Facility', type: 'select' }
    ],
    
    visualizations: [
      {
        id: 'wait_time_trend',
        type: 'line',
        title: 'Wait Time Trend',
        metrics: ['avg_wait_time'],
        chartType: 'line'
      },
      {
        id: 'bottleneck_distribution',
        type: 'bar',
        title: 'Bottleneck Distribution',
        metrics: ['backlog_count', 'reassignment_rate'],
        chartType: 'bar'
      },
      {
        id: 'operational_summary',
        type: 'table',
        title: 'Operational Metrics Summary',
        metrics: ['avg_wait_time', 'backlog_count', 'reassignment_rate', 'rejection_rate']
      }
    ],
    
    csvExport: {
      filename: 'operational_bottleneck_analytics',
      columns: [
        { id: 'stage', header: 'Workflow Stage', dataKey: 'stage' },
        { id: 'wait_time', header: 'Avg Wait Time (hours)', dataKey: 'avgWaitTime', format: 'duration' },
        { id: 'backlog', header: 'Current Backlog', dataKey: 'backlogCount', format: 'number' },
        { id: 'reassignment', header: 'Reassignment Rate (%)', dataKey: 'reassignmentRate', format: 'percentage' },
        { id: 'rejection', header: 'QC Rejection Rate (%)', dataKey: 'rejectionRate', format: 'percentage' }
      ]
    },
    
    drillDown: {
      enabled: false
    }
  },

  {
    id: 'report-revision-analytics',
    name: 'Report Revision Analytics',
    description: 'Track report revision rates, post-final corrections, and revision patterns by radiologist',
    icon: 'GitCompare',
    entityType: 'quality',

    metrics: [
      {
        id: 'total_reports',
        name: 'Total Reports',
        type: 'count',
        description: 'Total reports in the selected period',
        format: 'number'
      },
      {
        id: 'revision_rate',
        name: 'Revision Rate',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of reports that required revision',
        format: 'percentage',
        threshold: { warning: 10, critical: 15, direction: 'above' }
      },
      {
        id: 'post_final_pct',
        name: 'Post-Final Revision %',
        type: 'percentage',
        unit: '%',
        description: 'Percentage of revisions made after report finalization',
        format: 'percentage',
        threshold: { warning: 5, critical: 8, direction: 'above' }
      },
      {
        id: 'avg_time_to_revision',
        name: 'Avg Time to Revision',
        type: 'duration',
        unit: 'mins',
        description: 'Average minutes from finalization to revision request',
        format: 'duration'
      }
    ],

    filters: [
      { id: 'dateRange', name: 'Date Range', type: 'dateRange', required: true },
      { id: 'facility', name: 'Facility', type: 'select' },
      { id: 'modality', name: 'Modality', type: 'multiSelect' },
      { id: 'radiologist', name: 'Radiologist', type: 'multiSelect' }
    ],

    visualizations: [
      {
        id: 'revision_trend',
        type: 'line',
        title: 'Revision Rate Trend',
        metrics: ['revision_rate', 'post_final_pct'],
        chartType: 'line'
      },
      {
        id: 'revision_summary',
        type: 'table',
        title: 'Radiologist Revision Summary',
        metrics: ['total_reports', 'revision_rate', 'post_final_pct', 'avg_time_to_revision']
      }
    ],

    csvExport: {
      filename: 'report_revision_analytics',
      columns: [
        { id: 'radiologist_name', header: 'Radiologist', dataKey: 'radiologistName' },
        { id: 'total_reports', header: 'Total Reports', dataKey: 'totalReports', format: 'number' },
        { id: 'revised_reports', header: 'Revised Reports', dataKey: 'revisedReports', format: 'number' },
        { id: 'revision_rate', header: 'Revision Rate (%)', dataKey: 'revisionRate', format: 'percentage' },
        { id: 'post_final_pct', header: 'Post-Final %', dataKey: 'postFinalPct', format: 'percentage' },
        { id: 'avg_revisions', header: 'Avg Revisions/Report', dataKey: 'avgRevisionsPerReport', format: 'decimal' }
      ]
    },

    drillDown: {
      enabled: true,
      entityIdField: 'radiologistId',
      detailRoute: '/admin/analytics/report-revision-analytics'
    }
  }
]

/**
 * Helper function to get analytics category by ID
 */
export function getAnalyticsCategoryById(id: string): AnalyticsCategory | undefined {
  return ANALYTICS_CATEGORIES.find(cat => cat.id === id)
}

/**
 * Helper function to get all analytics categories grouped by entity type
 */
export function getAnalyticsCategoriesByEntityType(): Record<EntityType, AnalyticsCategory[]> {
  return ANALYTICS_CATEGORIES.reduce((acc, category) => {
    if (!acc[category.entityType]) {
      acc[category.entityType] = []
    }
    acc[category.entityType].push(category)
    return acc
  }, {} as Record<EntityType, AnalyticsCategory[]>)
}