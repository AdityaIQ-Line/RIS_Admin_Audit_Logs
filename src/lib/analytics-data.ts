/**
 * Analytics Mock Data Generator
 * Generates realistic sample data for analytics module
 */

import { AnalyticsCategory } from './analytics-config'

export interface AnalyticsDataPoint {
  [key: string]: any
  date?: string
  period?: string
}

/**
 * Generate mock data for radiologist performance
 */
export function generateRadiologistPerformanceData(): AnalyticsDataPoint[] {
  const radiologists = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Williams',
    'Dr. James Anderson',
    'Dr. Maria Garcia'
  ]
  
  const modalities = ['CT', 'MRI', 'X-Ray', 'Ultrasound', 'PET-CT']
  
  return radiologists.map((name, index) => ({
    radiologistId: `RAD-${index + 1}`,
    radiologistName: name,
    totalReports: Math.floor(Math.random() * 200) + 150,
    avgTAT: (Math.random() * 24 + 12).toFixed(1),
    reportsPerDay: (Math.random() * 15 + 10).toFixed(1),
    modality: modalities[index % modalities.length],
    qualityScore: (Math.random() * 15 + 85).toFixed(1),
    revisionRate: (Math.random() * 8 + 2).toFixed(1)
  }))
}

/**
 * Generate mock data for modality case analytics
 */
export function generateModalityCaseData(): AnalyticsDataPoint[] {
  const modalities = ['CT', 'MRI', 'X-Ray', 'Ultrasound']
  
  return modalities.map((modality, index) => {
    const totalCases = Math.floor(Math.random() * 500) + 300
    const avgTAT = (Math.random() * 20 + 8).toFixed(1) // 8-28 hours
    const medianTAT = (parseFloat(avgTAT) * (0.8 + Math.random() * 0.3)).toFixed(1)
    
    return {
      modalityId: `MOD-${index + 1}`,
      modality,
      totalCases,
      avgTAT: parseFloat(avgTAT),
      medianTAT: parseFloat(medianTAT)
    }
  })
}

/**
 * Generate mock data for modality report analytics
 */
export function generateModalityReportData(): AnalyticsDataPoint[] {
  const modalities = ['CT', 'MRI', 'X-Ray', 'Ultrasound', 'Mammography', 'PET-CT']
  
  return modalities.map((modality, index) => {
    const totalReports = Math.floor(Math.random() * 400) + 200
    const finalizedReports = Math.floor(totalReports * (0.75 + Math.random() * 0.2))
    
    return {
      modalityId: `MOD-${index + 1}`,
      modality,
      totalReports,
      finalizedReports,
      draftReports: totalReports - finalizedReports,
      avgReportTAT: (Math.random() * 36 + 24).toFixed(1),
      criticalFindingsRate: (Math.random() * 15 + 5).toFixed(1)
    }
  })
}

/**
 * Generate mock data for referrer analytics
 */
export function generateReferrerData(): AnalyticsDataPoint[] {
  const referrers = [
    'Dr. Robert Miller',
    'Dr. Patricia Davis',
    'Dr. David Wilson',
    'Dr. Linda Martinez',
    'Dr. Christopher Taylor'
  ]
  
  return referrers.map((name, index) => ({
    referrerId: `REF-${index + 1}`,
    referrerName: name,
    totalReferrals: Math.floor(Math.random() * 150) + 50,
    avgReferralTAT: (Math.random() * 24 + 18).toFixed(1),
    criticalFindingsCount: Math.floor(Math.random() * 20) + 5,
    followUpRate: (Math.random() * 30 + 20).toFixed(1)
  }))
}

/**
 * Generate mock data for AI acceptance rate
 */
export function generateAIAcceptanceData(): AnalyticsDataPoint[] {
  const modalities = ['CT', 'MRI', 'X-Ray', 'Ultrasound']
  
  return modalities.map((modality, index) => {
    const aiReportsGenerated = Math.floor(Math.random() * 200) + 100
    const aiAccepted = Math.floor(aiReportsGenerated * (0.6 + Math.random() * 0.3))
    
    return {
      modalityId: `MOD-${index + 1}`,
      modality,
      aiReportsGenerated,
      aiAccepted,
      aiModified: aiReportsGenerated - aiAccepted,
      aiAcceptanceRate: ((aiAccepted / aiReportsGenerated) * 100).toFixed(1),
      aiTimeSaved: (Math.random() * 50 + 30).toFixed(1)
    }
  })
}

/**
 * Generate mock data for turnaround time metrics
 */
export function generateTurnaroundTimeData(): AnalyticsDataPoint[] {
  const periods = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  
  return periods.map((period, index) => ({
    period,
    avgTotalTAT: (Math.random() * 24 + 24).toFixed(1),
    avgReportingTime: (Math.random() * 12 + 6).toFixed(1),
    avgQATime: (Math.random() * 6 + 2).toFixed(1),
    tatComplianceRate: (Math.random() * 10 + 88).toFixed(1),
    statTAT: (Math.random() * 2 + 1).toFixed(1)
  }))
}

/**
 * Generate mock data for report quality
 */
export function generateReportQualityData(): AnalyticsDataPoint[] {
  const radiologists = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Williams',
    'Dr. James Anderson',
    'Dr. Maria Garcia'
  ]
  
  return radiologists.map((name, index) => ({
    radiologistId: `RAD-${index + 1}`,
    radiologist: name,
    totalReportsReviewed: Math.floor(Math.random() * 150) + 100,
    errorRate: (Math.random() * 6 + 1).toFixed(1),
    incompleteReports: Math.floor(Math.random() * 15) + 2,
    addendumRate: (Math.random() * 8 + 2).toFixed(1),
    completenessScore: (Math.random() * 10 + 88).toFixed(1)
  }))
}

/**
 * Generate mock data for study volume trends
 */
export function generateStudyVolumeData(): AnalyticsDataPoint[] {
  const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  
  return periods.map((period, index) => {
    const totalStudies = Math.floor(Math.random() * 500) + 1000
    
    return {
      period,
      totalStudies,
      dailyAverage: Math.floor(totalStudies / 30),
      peakVolume: Math.floor(totalStudies / 20),
      growthRate: ((Math.random() * 10 - 2)).toFixed(1),
      capacityUtilization: (Math.random() * 15 + 75).toFixed(1)
    }
  })
}

/**
 * Generate mock data for peer review
 */
export function generatePeerReviewData(): AnalyticsDataPoint[] {
  const radiologists = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Williams',
    'Dr. James Anderson',
    'Dr. Maria Garcia'
  ]
  
  return radiologists.map((name, index) => ({
    radiologistId: `RAD-${index + 1}`,
    radiologist: name,
    reportsPeerReviewed: Math.floor(Math.random() * 80) + 40,
    peerReviewRate: (Math.random() * 20 + 70).toFixed(1),
    agreementRate: (Math.random() * 10 + 88).toFixed(1),
    majorDiscrepancies: Math.floor(Math.random() * 8) + 1,
    avgReviewTime: (Math.random() * 20 + 10).toFixed(1)
  }))
}

/**
 * Generate mock data for AI vs final comparison
 */
export function generateAIComparisonData(): AnalyticsDataPoint[] {
  const modalities = ['CT', 'MRI', 'X-Ray', 'Ultrasound']
  
  return modalities.map((modality, index) => ({
    modalityId: `MOD-${index + 1}`,
    modality,
    reportsCompared: Math.floor(Math.random() * 150) + 100,
    aiAccuracy: (Math.random() * 15 + 80).toFixed(1),
    falsePositives: Math.floor(Math.random() * 20) + 5,
    falseNegatives: Math.floor(Math.random() * 15) + 3,
    sensitivity: (Math.random() * 10 + 85).toFixed(1),
    specificity: (Math.random() * 8 + 88).toFixed(1)
  }))
}

/**
 * Generate mock data for operational bottlenecks
 */
export function generateOperationalBottleneckData(): AnalyticsDataPoint[] {
  const stages = ['Assignment', 'Reporting', 'QA Review', 'Finalization']
  
  return stages.map((stage, index) => ({
    stage,
    avgWaitTime: (Math.random() * 12 + 6).toFixed(1),
    backlogCount: Math.floor(Math.random() * 80) + 20,
    reassignmentRate: (Math.random() * 15 + 5).toFixed(1),
    rejectionRate: (Math.random() * 10 + 3).toFixed(1)
  }))
}

/**
 * Generate time series data for trend charts
 */
export function generateTimeSeriesData(days: number = 30): AnalyticsDataPoint[] {
  const data: AnalyticsDataPoint[] = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 50,
      secondary: Math.floor(Math.random() * 50) + 25
    })
  }
  
  return data
}

/**
 * Main data generator function - routes to appropriate generator based on category ID
 */
export function generateAnalyticsData(categoryId: string): AnalyticsDataPoint[] {
  switch (categoryId) {
    case 'radiologist-performance':
      return generateRadiologistPerformanceData()
    case 'modality-case-analytics':
      return generateModalityCaseData()
    case 'modality-report-analytics':
      return generateModalityReportData()
    case 'referrer-analytics':
      return generateReferrerData()
    case 'ai-acceptance-rate':
      return generateAIAcceptanceData()
    case 'turnaround-time':
      return generateTurnaroundTimeData()
    case 'report-quality':
      return generateReportQualityData()
    case 'study-volume-trend':
      return generateStudyVolumeData()
    case 'peer-review-qa':
      return generatePeerReviewData()
    case 'ai-vs-final':
      return generateAIComparisonData()
    case 'operational-bottleneck':
      return generateOperationalBottleneckData()
    case 'report-revision-analytics':
      return generateRevisionRadiologistData()
    default:
      return []
  }
}

// ─── Revision Analytics Data Types ────────────────────────────────────────────

export interface RevisionRadiologistRow extends AnalyticsDataPoint {
  radiologistId: string
  radiologistName: string
  totalReports: number
  revisedReports: number
  revisionRate: number
  postFinalPct: number
  avgRevisionsPerReport: number
}

export interface RevisionHistoryEntry {
  id: string
  patientId: string
  patientName: string
  visitId: string
  modality: string
  revisionNumber: number
  revisionType: 'Minor' | 'Major' | 'Post-Final'
  reason: string
  revisedBy: string
  timeToRevision: number // minutes
  criticalFlagChanged: boolean
  date: string
}

export interface RevisionTrendPoint {
  date: string
  revisionRate: number
  postFinalRate: number
}

// ─── Revision Mock Data Generators ────────────────────────────────────────────

const REVISION_REASONS = [
  'Measurement Error',
  'Clinical Correlation Needed',
  'Critical Finding Missed',
  'Technique Description Update',
  'Comparison Study Added',
  'Typographical Correction',
  'Impression Clarification',
  'Referring Physician Request',
  'Incidental Finding Added',
  'Protocol Deviation Noted',
]

const MODALITIES = ['CT', 'MRI', 'X-Ray', 'Ultrasound']

const RADIOLOGIST_NAMES = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Williams',
  'Dr. James Anderson',
  'Dr. Maria Garcia',
  'Dr. Robert Thompson',
  'Dr. Linda Martinez',
  'Dr. David Kim',
]

const PATIENT_NAMES_DUR = [
  'Aarav Sharma', 'Priya Patel', 'Mohammed Al-Hassan', 'Emily Johnson', 'Ravi Kumar',
  'Sunita Verma', 'James O\'Brien', 'Fatima Al-Rashid', 'Chen Wei', 'Anjali Nair',
  'Samuel Okonkwo', 'Laura Müller', 'Arjun Mehta', 'Sofia Fernandez', 'David Kim',
  'Neha Gupta', 'Carlos Rivera', 'Aisha Malik', 'Liam Nguyen', 'Kavya Reddy',
]

/**
 * Generate radiologist-level revision summary data (Screen 1 table)
 */
export function generateRevisionRadiologistData(): RevisionRadiologistRow[] {
  return RADIOLOGIST_NAMES.map((name, index) => {
    const totalReports = Math.floor(Math.random() * 180) + 120
    const revisedReports = Math.floor(totalReports * (0.06 + Math.random() * 0.12))
    const revisionRate = parseFloat(((revisedReports / totalReports) * 100).toFixed(1))
    const postFinalPct = parseFloat((Math.random() * 9 + 1).toFixed(1))
    const avgRevisionsPerReport = parseFloat((1 + Math.random() * 0.6).toFixed(2))

    return {
      radiologistId: `RAD-${index + 1}`,
      radiologistName: name,
      totalReports,
      revisedReports,
      revisionRate,
      postFinalPct,
      avgRevisionsPerReport,
    }
  })
}

/**
 * Generate revision history entries for a specific radiologist (Screen 2 table)
 */
export function generateRevisionHistoryData(radiologistId: string): RevisionHistoryEntry[] {
  const count = Math.floor(Math.random() * 12) + 12
  const entries: RevisionHistoryEntry[] = []
  const today = new Date('2026-02-19')

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const entryDate = new Date(today)
    entryDate.setDate(entryDate.getDate() - daysAgo)

    const revNum = Math.random() < 0.7 ? 1 : Math.random() < 0.7 ? 2 : 3
    const typeRoll = Math.random()
    const revisionType: RevisionHistoryEntry['revisionType'] =
      typeRoll < 0.55 ? 'Minor' : typeRoll < 0.82 ? 'Major' : 'Post-Final'

    const criticalFlagChanged = revisionType === 'Post-Final' ? Math.random() < 0.45 : Math.random() < 0.12

    entries.push({
      id: `REV-${radiologistId}-${i + 1}`,
      patientId: `MOH${String(entryDate.getFullYear()).slice(2)}${String(entryDate.getMonth() + 1).padStart(2, '0')}${String(entryDate.getDate()).padStart(2, '0')}${String(Math.floor(1 + Math.random() * 99999)).padStart(5, '0')}`,
      patientName: PATIENT_NAMES_DUR[Math.floor(Math.random() * PATIENT_NAMES_DUR.length)],
      visitId: `VIS-${Math.floor(100000 + Math.random() * 900000)}`,
      modality: MODALITIES[Math.floor(Math.random() * MODALITIES.length)],
      revisionNumber: revNum,
      revisionType,
      reason: REVISION_REASONS[Math.floor(Math.random() * REVISION_REASONS.length)],
      revisedBy: RADIOLOGIST_NAMES[Math.floor(Math.random() * RADIOLOGIST_NAMES.length)],
      timeToRevision: Math.floor(Math.random() * 480) + 15,
      criticalFlagChanged,
      date: entryDate.toISOString().split('T')[0],
    })
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Generate trend data for revision rate over time (Screen 2 chart)
 */
export function generateRevisionTrendData(days = 30): RevisionTrendPoint[] {
  const points: RevisionTrendPoint[] = []
  const today = new Date('2026-02-19')

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const label = `${d.getMonth() + 1}/${d.getDate()}`

    points.push({
      date: label,
      revisionRate: parseFloat((6 + Math.random() * 8).toFixed(1)),
      postFinalRate: parseFloat((1.5 + Math.random() * 5).toFixed(1)),
    })
  }
  return points
}

// ─── Modality Reporting Duration Data Types ───────────────────────────────────

export interface ModalityDurationRow extends AnalyticsDataPoint {
  modalityId: string
  modality: string
  totalReports: number
  avgReportingTAT: number
  medianTAT: number
  slaBreachPct: number
  delayedReports: number
}

export interface ModalityDurationCaseEntry {
  id: string
  uhid: string
  patientName: string
  bodyPart: string
  radiologist: string
  reportCreatedTime: string
  reportReleasedTime: string
  expectedTAT: number
  actualTAT: number
  status: 'On Time' | 'Delayed'
  priority: 'Routine' | 'Urgent' | 'VIP'
}

export interface ModalityDurationTrendPoint {
  date: string
  avgReportingTAT: number
}

// ─── Modality Reporting Duration Mock Data Generators ─────────────────────────

const MODALITIES_DURATION = ['CT', 'MRI', 'X-Ray', 'Ultrasound']

const BODY_PARTS_BY_MODALITY: Record<string, string[]> = {
  CT: ['Brain', 'Thorax/Chest', 'Abdomen', 'Pelvis', 'Spine', 'Neck', 'Angiography (CTA)'],
  MRI: ['Brain', 'Lumbar Spine', 'Knee', 'Shoulder', 'Liver', 'MRCP', 'Whole Spine'],
  'X-Ray': ['Chest', 'Hand', 'Foot', 'Skull', 'KUB', 'Ribs', 'Clavicle'],
  Ultrasound: ['Abdomen', 'Pelvis', 'Thyroid', 'Breast', 'Prostate', 'Liver', 'Kidney'],
}

const RADIOLOGIST_NAMES_DUR = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Williams',
  'Dr. James Anderson',
  'Dr. Maria Garcia',
  'Dr. Robert Thompson',
]

const SLA_THRESHOLDS_BY_PRIORITY: Record<string, number> = {
  Routine: 24,
  Urgent: 4,
  VIP: 2,
}

/**
 * Generate modality-level summary rows (Screen 1 table)
 */
export function generateModalityDurationData(): ModalityDurationRow[] {
  return MODALITIES_DURATION.map((modality, index) => {
    const totalReports = Math.floor(Math.random() * 400) + 300
    const avgReportingTAT = parseFloat((Math.random() * 28 + 8).toFixed(1))
    const medianTAT = parseFloat((avgReportingTAT * (0.8 + Math.random() * 0.3)).toFixed(1))
    const slaBreachPct = parseFloat((Math.random() * 22 + 4).toFixed(1))
    const delayedReports = Math.round((slaBreachPct / 100) * totalReports)

    return {
      modalityId: `MOD-DUR-${index + 1}`,
      modality,
      totalReports,
      avgReportingTAT,
      medianTAT,
      slaBreachPct,
      delayedReports,
    }
  })
}

/**
 * Generate individual case rows for a modality detail view (Screen 2 table)
 */
export function generateModalityDurationCaseData(modalityId: string): ModalityDurationCaseEntry[] {
  const modalityIndex = parseInt(modalityId.replace('MOD-DUR-', '')) - 1
  const modality = MODALITIES_DURATION[modalityIndex] ?? 'CT'
  const bodyParts = BODY_PARTS_BY_MODALITY[modality] ?? BODY_PARTS_BY_MODALITY['CT']

  const count = Math.floor(Math.random() * 15) + 20
  const entries: ModalityDurationCaseEntry[] = []
  const today = new Date('2026-02-19')
  const priorities: Array<'Routine' | 'Urgent' | 'VIP'> = ['Routine', 'Urgent', 'VIP']

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const createdDate = new Date(today)
    createdDate.setDate(createdDate.getDate() - daysAgo)
    createdDate.setHours(Math.floor(Math.random() * 12) + 6, Math.floor(Math.random() * 60), 0)

    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const expectedTAT = SLA_THRESHOLDS_BY_PRIORITY[priority]
    const actualTAT = parseFloat(
      (expectedTAT * (0.4 + Math.random() * 1.8)).toFixed(1)
    )
    const status: 'On Time' | 'Delayed' = actualTAT > expectedTAT ? 'Delayed' : 'On Time'

    const releasedDate = new Date(createdDate)
    releasedDate.setTime(releasedDate.getTime() + actualTAT * 60 * 60 * 1000)

    entries.push({
      id: `CASE-${modalityId}-${i + 1}`,
      uhid: `UH${Math.floor(100000 + Math.random() * 900000)}`,
      patientName: PATIENT_NAMES_DUR[Math.floor(Math.random() * PATIENT_NAMES_DUR.length)],
      bodyPart: bodyParts[Math.floor(Math.random() * bodyParts.length)],
      radiologist: RADIOLOGIST_NAMES_DUR[Math.floor(Math.random() * RADIOLOGIST_NAMES_DUR.length)],
      reportCreatedTime: createdDate.toISOString(),
      reportReleasedTime: releasedDate.toISOString(),
      expectedTAT,
      actualTAT,
      status,
      priority,
    })
  }

  return entries.sort(
    (a, b) => new Date(b.reportCreatedTime).getTime() - new Date(a.reportCreatedTime).getTime()
  )
}

/**
 * Generate TAT trend data for the detail screen line chart
 */
export function generateModalityDurationTrendData(days = 30): ModalityDurationTrendPoint[] {
  const points: ModalityDurationTrendPoint[] = []
  const today = new Date('2026-02-19')

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const label = `${d.getMonth() + 1}/${d.getDate()}`

    points.push({
      date: label,
      avgReportingTAT: parseFloat((10 + Math.random() * 20).toFixed(1)),
    })
  }
  return points
}

// ─── Modality Case Detail Data Types ─────────────────────────────────────────

const MODALITY_IDS_CASE = ['CT', 'MRI', 'X-Ray', 'Ultrasound']

const BODY_PARTS_BY_MOD_CASE: Record<string, string[]> = {
  CT: ['Brain', 'Chest/Thorax', 'Abdomen', 'Pelvis', 'Spine', 'Neck', 'Angiography (CTA)'],
  MRI: ['Brain', 'Lumbar Spine', 'Knee', 'Shoulder', 'Liver', 'MRCP', 'Whole Spine'],
  'X-Ray': ['Chest', 'Hand', 'Foot', 'Skull', 'KUB', 'Ribs', 'Clavicle'],
  Ultrasound: ['Abdomen', 'Pelvis', 'Thyroid', 'Breast', 'Prostate', 'Liver', 'Kidney'],
}

const RADIOLOGIST_NAMES_CASE = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Williams',
  'Dr. James Anderson',
  'Dr. Maria Garcia',
  'Dr. Robert Thompson',
]

export interface ModalityCaseEntry {
  id: string
  uhid: string
  patientName: string
  bodyPart: string
  radiologist: string
  scanCompletedTime: string   // ISO
  reportReleasedTime: string  // ISO
  actualCaseTAT: number       // hours
  priority: 'Routine' | 'Urgent' | 'VIP'
}

export interface ModalityCaseTrendPoint {
  date: string
  avgCaseTAT: number
  caseCount: number
}

/**
 * Generate individual case rows for a modality case detail view
 */
export function generateModalityCaseEntries(modalityId: string): ModalityCaseEntry[] {
  const idx = parseInt(modalityId.replace('MOD-', '')) - 1
  const modality = MODALITY_IDS_CASE[idx] ?? 'CT'
  const bodyParts = BODY_PARTS_BY_MOD_CASE[modality] ?? BODY_PARTS_BY_MOD_CASE['CT']
  const priorities: Array<'Routine' | 'Urgent' | 'VIP'> = ['Routine', 'Urgent', 'VIP']

  const count = Math.floor(Math.random() * 15) + 20
  const entries: ModalityCaseEntry[] = []
  const today = new Date('2026-02-19')

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const scanDate = new Date(today)
    scanDate.setDate(scanDate.getDate() - daysAgo)
    scanDate.setHours(Math.floor(Math.random() * 14) + 6, Math.floor(Math.random() * 60), 0)

    // Weighted priority: 60% Routine, 30% Urgent, 10% VIP
    const roll = Math.random()
    const priority: 'Routine' | 'Urgent' | 'VIP' =
      roll < 0.6 ? 'Routine' : roll < 0.9 ? 'Urgent' : 'VIP'

    // TAT range by priority
    const tatRanges: Record<string, [number, number]> = {
      Routine: [8, 36],
      Urgent: [1, 10],
      VIP: [0.5, 5],
    }
    const [tMin, tMax] = tatRanges[priority]
    const actualCaseTAT = parseFloat((tMin + Math.random() * (tMax - tMin)).toFixed(1))

    const releaseDate = new Date(scanDate)
    releaseDate.setTime(releaseDate.getTime() + actualCaseTAT * 60 * 60 * 1000)

    entries.push({
      id: `MCASE-${modalityId}-${i + 1}`,
      uhid: `UH${Math.floor(100000 + Math.random() * 900000)}`,
      patientName: PATIENT_NAMES_DUR[Math.floor(Math.random() * PATIENT_NAMES_DUR.length)],
      bodyPart: bodyParts[Math.floor(Math.random() * bodyParts.length)],
      radiologist: RADIOLOGIST_NAMES_CASE[Math.floor(Math.random() * RADIOLOGIST_NAMES_CASE.length)],
      scanCompletedTime: scanDate.toISOString(),
      reportReleasedTime: releaseDate.toISOString(),
      actualCaseTAT,
      priority,
    })
  }

  return entries.sort(
    (a, b) => new Date(b.scanCompletedTime).getTime() - new Date(a.scanCompletedTime).getTime()
  )
}

/**
 * Generate TAT + case count trend data for the modality case detail chart
 */
export function generateModalityCaseTrendData(days = 30): ModalityCaseTrendPoint[] {
  const points: ModalityCaseTrendPoint[] = []
  const today = new Date('2026-02-19')

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    points.push({
      date: label,
      avgCaseTAT: parseFloat((8 + Math.random() * 22).toFixed(1)),
      caseCount: Math.floor(8 + Math.random() * 28),
    })
  }
  return points
}