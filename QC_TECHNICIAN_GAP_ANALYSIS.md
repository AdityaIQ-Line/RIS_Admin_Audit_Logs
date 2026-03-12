# QC Technician - Gap Analysis

## Executive Summary

This document analyzes the differences between the **User Story Requirements** for "Senior Technician" quality review and the **Existing Implementation** of "QC Technician" in RadiologyIQ.

---

## 🎯 Current Implementation Overview

### What Exists:
✅ **Role**: Quality Control Technician (QC Technician)
✅ **Dashboard**: `/dashboard/qc-technician` - QualityControlDashboard.tsx
✅ **Worklist**: `/qc-technician/worklist` - QualityControlWorklist.tsx
✅ **Basic Actions**: Approve and Reject reports
✅ **Navigation**: Integrated into role switcher and sidebar
✅ **Dual Approval Integration**: Can be selected as verification route in radiologist workflow

### Current Workflow:
```
Radiologist finalizes report
    ↓
Report status: "Awaiting Review"
    ↓
QC Technician reviews in worklist
    ↓
Actions: Approve OR Reject
    ↓
Status changes to: "Approved" OR "Rejected"
```

---

## 🔴 Critical Gaps Identified

### **GAP 1: Non-Clinical Enforcement**
| Requirement | Current State | Gap |
|-------------|---------------|-----|
| QC Technicians can ONLY review non-clinical aspects | No restrictions in place | ❌ Missing enforcement |
| Must block editing of Findings/Impression fields | Likely editable | ❌ No field-level restrictions |
| System should prevent clinical interpretation changes | No validation | ❌ No safeguards |

**Impact**: HIGH - Core requirement violation
**Priority**: P0 - CRITICAL

---

### **GAP 2: Quality Review Checklist**
| Requirement | Current State | Gap |
|-------------|---------------|-----|
| Missing Section Flag | Not implemented | ❌ Missing |
| Formatting Issue Flag | Not implemented | ❌ Missing |
| Typo/Grammar Flag | Not implemented | ❌ Missing |
| Demographics Mismatch Flag | Not implemented | ❌ Missing |
| Template Mismatch Flag | Not implemented | ❌ Missing |
| Mandatory checklist completion before approval | Not implemented | ❌ Missing |

**Current Implementation**: Only has free-text "Comments" field

**Impact**: HIGH - Cannot track specific quality issues
**Priority**: P0 - CRITICAL

---

### **GAP 3: "Send Back for Correction" Action**
| Requirement | Current State | Gap |
|-------------|---------------|-----|
| Send back to radiologist with specific feedback | Has "Reject" action | ⚠️ Partial |
| Status: "Needs Correction" | Status becomes "Rejected" | ⚠️ Confusing terminology |
| Radiologist can fix and re-submit | Goes back to radiologist | ✅ Works |
| Tracks correction cycles | Not tracked | ❌ Missing |

**Current Implementation**: 
- Has "Reject" which functionally works like "Send Back"
- But terminology doesn't match non-clinical QC context
- "Rejected" sounds clinical rather than "Needs Correction"

**Impact**: MEDIUM - Terminology issue
**Priority**: P1 - HIGH

---

### **GAP 4: Field-Specific Review & Validation**

#### A. Report Fields to Review
| Field | Purpose | Current Visibility | Gap |
|-------|---------|-------------------|-----|
| Patient Name/ID/Age/Sex | Demographics check | ✅ Visible in worklist | ⚠️ No validation |
| Modality | Correctness | ✅ Visible | ⚠️ No validation |
| Body Part | Examined region | ❓ Unknown | ❌ May not be visible |
| Study Date/Time | Correctness | ✅ Visible | ⚠️ No validation |
| Radiologist Name/Signature | Authorship | ✅ Visible | ⚠️ No validation |
| Findings | Clinical content | ❓ Unknown | ❌ Must be READ-ONLY |
| Impression | Clinical content | ❓ Unknown | ❌ Must be READ-ONLY |

#### B. Missing Validations
| Validation | Requirement | Current State |
|------------|-------------|---------------|
| Mandatory sections present | Block approval if missing | ❌ Not implemented |
| Patient demographics present | Block release if empty | ❌ Not implemented |
| Header/footer present | Block if missing | ❌ Not implemented |
| Radiologist signature present | Block if unsigned | ❌ Not implemented |

**Impact**: HIGH - Cannot enforce quality standards
**Priority**: P0 - CRITICAL

---

### **GAP 5: Status Workflow**
| Required Status | Current Status | Gap |
|----------------|----------------|-----|
| Pending Quality Review | Awaiting Review | ✅ Close enough |
| Ready for Release | Approved | ⚠️ Different terminology |
| Needs Correction | Rejected | ⚠️ Confusing terminology |

**Current Workflow**:
```
Awaiting Review → (approve) → Approved
Awaiting Review → (reject) → Rejected → Back to Radiologist
```

**Required Workflow**:
```
Pending Quality Review → (approve) → Ready for Release
Pending Quality Review → (send back) → Needs Correction → Radiologist fixes → Pending Quality Review
```

**Impact**: MEDIUM - Functional but terminology mismatch
**Priority**: P1 - HIGH

---

### **GAP 6: Dedicated QC Review Interface**
| Requirement | Current State | Gap |
|-------------|---------------|-----|
| QC-specific review screen | Uses TechnicianDICOMViewer | ⚠️ Not QC-optimized |
| Side-by-side checklist | Not available | ❌ Missing |
| Field-level validation UI | Not available | ❌ Missing |
| Read-only enforcement for clinical fields | Unknown | ❌ Likely missing |
| Highlight missing/incorrect fields | Not available | ❌ Missing |

**Current Implementation**: 
- Route: `/qc-technician/dicom-viewer/:studyId`
- Uses: `TechnicianDICOMViewer` component
- This is a generic DICOM viewer, not QC-specific

**Impact**: HIGH - UX doesn't support QC workflow
**Priority**: P0 - CRITICAL

---

### **GAP 7: Edge Cases & System Controls**
| Edge Case | Required Handling | Current State |
|-----------|------------------|---------------|
| Bypass QC for STAT/urgent cases | Configurable bypass | ❌ Not implemented |
| Admin can override QC | Admin override function | ❌ Not implemented |
| QC backlog alerts | Alert when threshold exceeded | ❌ Not implemented |
| Technician tries to change diagnosis | Block + audit log | ❌ Not implemented |
| Report revised after QC approval | Auto-return to QC | ❌ Not implemented |
| QC skipped mistakenly | Audit flag | ❌ Not implemented |

**Impact**: MEDIUM-HIGH - Missing safeguards
**Priority**: P1-P2 - HIGH to MEDIUM

---

### **GAP 8: KPIs & Analytics**
| KPI | Requirement | Current State |
|-----|-------------|---------------|
| % reports needing correction | Track and display | ❌ Not tracked |
| Avg QC turnaround time | Track and display | ❌ Not tracked |
| Top error types | Categorize and report | ❌ Not tracked |
| Radiologist correction cycle time | Track per radiologist | ❌ Not tracked |
| Reports per QC technician | Track workload | ❌ Not tracked |

**Current Dashboard Shows**:
- Pending Review count
- Reviewed Today count
- Approved Today count
- Rejected Today count

**Missing**:
- Error type breakdown
- Turnaround time metrics
- Correction cycle tracking
- Trend analysis

**Impact**: MEDIUM - Missing insights
**Priority**: P2 - MEDIUM

---

### **GAP 9: Reviewer Comments & Feedback**
| Requirement | Current State | Gap |
|-------------|---------------|-----|
| Structured feedback by category | Free-text comments only | ⚠️ Partial |
| Link comments to specific checklist items | Not linked | ❌ Missing |
| Mandatory comments for rejection | Required | ✅ Implemented |
| Optional comments for approval | Allowed | ✅ Implemented |
| Feedback visible to radiologist | Unknown | ❓ Needs verification |

**Impact**: MEDIUM - Functional but not structured
**Priority**: P1 - HIGH

---

### **GAP 10: Configuration & Settings**
| Configuration | Requirement | Current State |
|--------------|-------------|---------------|
| Quality Review Enabled (facility toggle) | Per-facility setting | ⚠️ Partial - exists in dual approval |
| Bypass QC for urgent cases | Configurable | ❌ Not implemented |
| Mandatory checklist items | Configurable per facility | ❌ Not implemented |
| Auto-routing rules | Define when to route to QC | ⚠️ Dual approval handles this |

**Impact**: MEDIUM - Missing flexibility
**Priority**: P2 - MEDIUM

---

## 📋 Complete Gap Summary Table

| # | Gap | Priority | Impact | Estimated Effort |
|---|-----|----------|--------|------------------|
| 1 | Non-Clinical Field Enforcement | P0 | HIGH | Medium |
| 2 | Quality Review Checklist | P0 | HIGH | High |
| 3 | "Send Back" Action & Terminology | P1 | MEDIUM | Low |
| 4 | Field-Level Validations | P0 | HIGH | Medium |
| 5 | Status Workflow Terminology | P1 | MEDIUM | Low |
| 6 | Dedicated QC Review Interface | P0 | HIGH | High |
| 7 | Edge Cases & System Controls | P1-P2 | MEDIUM | Medium |
| 8 | KPIs & Analytics | P2 | MEDIUM | High |
| 9 | Structured Feedback System | P1 | MEDIUM | Medium |
| 10 | Advanced Configuration | P2 | LOW | Low |

---

## 🎯 Recommended Implementation Phases

### **Phase 1: Critical Gaps (P0) - Core Functionality**
**Timeline**: 2-3 weeks

1. ✅ **Create Dedicated QC Review Interface**
   - New component: `QCReportReviewViewer.tsx`
   - Side-by-side layout: Report preview + QC Checklist
   - Field-level validation UI

2. ✅ **Implement Quality Review Checklist**
   - 5 flag categories (Missing Section, Formatting, Typo, Demographics, Template)
   - Mandatory checkbox UI
   - Cannot approve without checklist completion

3. ✅ **Enforce Non-Clinical Restrictions**
   - Read-only Findings and Impression fields
   - Block any attempt to edit clinical content
   - Audit log for attempted edits

4. ✅ **Add Field-Level Validations**
   - Validate mandatory sections before approval
   - Check patient demographics completeness
   - Verify radiologist signature
   - Visual indicators for missing fields

---

### **Phase 2: High Priority (P1) - UX & Terminology**
**Timeline**: 1-2 weeks

5. ✅ **Update Status Terminology**
   - Rename: "Awaiting Review" → "Pending Quality Review"
   - Rename: "Approved" → "Ready for Release" (in QC context)
   - Rename: "Rejected" → "Needs Correction"
   - Update all UI labels and badges

6. ✅ **Enhance "Send Back" Action**
   - Rename "Reject" button to "Send Back for Correction"
   - Link comments to checklist items
   - Show which flags triggered the send-back
   - Track correction cycles

7. ✅ **Structured Feedback System**
   - Comments linked to specific checklist flags
   - Pre-populated comment templates
   - Feedback visible to radiologist in clear format

---

### **Phase 3: Edge Cases & Controls (P1-P2)**
**Timeline**: 1-2 weeks

8. ✅ **Bypass QC Configuration**
   - Admin setting to bypass QC for STAT/urgent cases
   - Manual override for specific reports
   - Audit log for bypassed reports

9. ✅ **Admin Override Functionality**
   - Admin can force-approve stuck reports
   - Requires reason + audit log
   - Visible to QC technician

10. ✅ **Report Revision Handling**
    - If report edited after QC approval, auto-return to QC
    - Highlight changed sections
    - Re-validation required

---

### **Phase 4: Analytics & Insights (P2)**
**Timeline**: 2-3 weeks

11. ✅ **QC KPI Dashboard**
    - % reports needing correction
    - Avg turnaround time
    - Top error types (bar chart)
    - Radiologist correction cycle times
    - Trend analysis

12. ✅ **Error Type Analytics**
    - Track which checklist flags are most common
    - Per-radiologist error patterns
    - Facility-wide quality trends

---

## 🔧 Technical Implementation Details

### **New Components Needed**

1. **`QCReportReviewViewer.tsx`**
   - Located: `/src/pages/quality-control/QCReportReviewViewer.tsx`
   - Purpose: Dedicated QC review interface
   - Features:
     - Split view: Report preview (60%) + QC Checklist (40%)
     - Read-only report display with Findings/Impression locked
     - Interactive checklist with 5 flag categories
     - Validation warnings
     - Action buttons: Approve / Send Back / Cancel

2. **`QCReviewChecklist.tsx`** (Component)
   - Located: `/src/app/components/quality-control/QCReviewChecklist.tsx`
   - Purpose: Reusable checklist component
   - Features:
     - Checkbox for each quality flag
     - Text area for comments per flag
     - Visual indicators (red/yellow/green)
     - Completion status

3. **`QCAnalyticsDashboard.tsx`**
   - Located: `/src/pages/quality-control/QCAnalyticsDashboard.tsx`
   - Purpose: QC-specific analytics
   - Features:
     - KPI cards
     - Error type charts
     - Turnaround time trends
     - Radiologist performance

---

### **Modified Components**

1. **`QualityControlWorklist.tsx`**
   - Add: Link to new QCReportReviewViewer instead of TechnicianDICOMViewer
   - Add: "Send Back for Correction" action (rename from Reject)
   - Add: Correction cycle count column
   - Update: Status terminology

2. **`AdminFacilityDetails.tsx`**
   - Add: "Bypass QC for Urgent Cases" toggle
   - Add: "Mandatory Checklist Items" configuration
   - Enhance: Dual Stage Approval section with QC settings

3. **`reportTypes.ts` / `report-types.ts`**
   - Add: New statuses: "Pending Quality Review", "Needs Correction", "Ready for Release"
   - Add: QC review data structure:
     ```typescript
     interface QCReview {
       reviewerId: string
       reviewerName: string
       reviewDate: string
       reviewTime: string
       checklist: {
         missingSectionFlag: boolean
         formattingIssueFlag: boolean
         typoGrammarFlag: boolean
         demographicsMismatchFlag: boolean
         templateMismatchFlag: boolean
       }
       comments: {
         missingSection?: string
         formatting?: string
         typoGrammar?: string
         demographics?: string
         template?: string
         general?: string
       }
       action: "approved" | "sent_back"
       correctionCycle: number
     }
     ```

---

### **Backend API Updates Needed**

```typescript
// New endpoints required:

// 1. QC Review with checklist
POST /api/qc-technician/review/{reportId}
Body: {
  action: "approve" | "send_back",
  checklist: {
    missingSectionFlag: boolean,
    formattingIssueFlag: boolean,
    typoGrammarFlag: boolean,
    demographicsMismatchFlag: boolean,
    templateMismatchFlag: boolean
  },
  comments: {
    missingSection?: string,
    formatting?: string,
    typoGrammar?: string,
    demographics?: string,
    template?: string,
    general?: string
  }
}

// 2. Get report with QC validation
GET /api/qc-technician/report/{reportId}/for-review
Response: {
  report: { ... },
  validations: {
    hasMandatorySections: boolean,
    hasDemographics: boolean,
    hasSignature: boolean,
    missingFields: string[]
  },
  previousQCReviews: QCReview[]
}

// 3. Bypass QC for urgent case
POST /api/qc-technician/bypass/{reportId}
Body: {
  reason: string,
  bypassedBy: string
}

// 4. Admin override
POST /api/admin/qc-override/{reportId}
Body: {
  reason: string,
  overriddenBy: string
}

// 5. QC Analytics
GET /api/qc-technician/analytics
Query: ?startDate=...&endDate=...
Response: {
  totalReviewed: number,
  approvalRate: number,
  correctionRate: number,
  avgTurnaroundTime: number,
  topErrorTypes: Array<{ type: string, count: number }>,
  radiologistMetrics: Array<{...}>
}
```

---

## 🎨 UI/UX Mockup Descriptions

### **QC Review Interface Layout**

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Worklist    QC Review - Study #ST-20260205-001    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │  REPORT PREVIEW         │  │  QC CHECKLIST            │  │
│  │  (60% width)            │  │  (40% width)             │  │
│  │                         │  │                          │  │
│  │  Patient: John Doe     │  │  ☐ Missing Section       │  │
│  │  Age: 45, M            │  │     └─ [ Comments... ]   │  │
│  │                         │  │                          │  │
│  │  Modality: CT Chest    │  │  ☐ Formatting Issue      │  │
│  │  Date: 2026-02-05      │  │     └─ [ Comments... ]   │  │
│  │                         │  │                          │  │
│  │  FINDINGS:             │  │  ☐ Typo/Grammar          │  │
│  │  (Read-only - locked)  │  │     └─ [ Comments... ]   │  │
│  │  [Clinical content...] │  │                          │  │
│  │                         │  │  ☐ Demographics Mismatch │  │
│  │  IMPRESSION:           │  │     └─ [ Comments... ]   │  │
│  │  (Read-only - locked)  │  │                          │  │
│  │  [Clinical content...] │  │  ☐ Template Mismatch     │  │
│  │                         │  │     └─ [ Comments... ]   │  │
│  │  Signed by: Dr. Smith  │  │                          │  │
│  │  Date: 2026-02-05      │  │  ⚠️ VALIDATIONS:        │  │
│  └─────────────────────────┘  │  ✅ All sections present│  │
│                                │  ✅ Demographics OK     │  │
│                                │  ✅ Signature present   │  │
│                                └─────────────────────────┘  │
│                                                               │
│  [ 🔙 Cancel ]  [ 📝 Send Back for Correction ]  [ ✅ Approve ] │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Action Items

### **Immediate (This Sprint)**
1. ✅ Create QCReportReviewViewer component
2. ✅ Add QC checklist UI
3. ✅ Enforce read-only on clinical fields
4. ✅ Add field-level validations

### **Next Sprint**
5. ✅ Update status terminology across system
6. ✅ Implement "Send Back" action
7. ✅ Add structured feedback system
8. ✅ Track correction cycles

### **Future Sprints**
9. ✅ Build QC analytics dashboard
10. ✅ Add bypass QC configuration
11. ✅ Implement admin override
12. ✅ Add revision handling

---

## 📊 Success Metrics

After implementing all gaps:

- ✅ 100% of clinical fields are read-only in QC view
- ✅ 100% of reports go through checklist validation
- ✅ 0% of reports approved without completed checklist
- ✅ QC turnaround time reduced by 30% (better UI)
- ✅ Error tracking at 100% (all types categorized)
- ✅ Radiologist correction rate visible
- ✅ Urgent cases can bypass QC when needed
- ✅ Admin has full override capability with audit trail

---

## 📝 Conclusion

**Summary of Gaps**:
- **10 major gaps** identified
- **4 are P0 (Critical)** - Must implement immediately
- **3 are P1 (High)** - Implement in next phase
- **3 are P2 (Medium)** - Implement for completeness

**Current Implementation**: ~40% complete
- ✅ Basic workflow exists
- ✅ Approve/Reject functionality works
- ❌ Missing QC-specific features
- ❌ Missing validations and safeguards
- ❌ Missing analytics

**Recommended Approach**: 
Implement in 4 phases over 6-10 weeks to achieve 100% compliance with user story requirements.

---

**Document Version**: 1.0
**Last Updated**: 2026-02-05
**Author**: System Analyst
