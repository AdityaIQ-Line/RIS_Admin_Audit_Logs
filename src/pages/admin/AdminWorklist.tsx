import { 
  FileText, 
  AlertCircle,
  User,
  Calendar,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  XCircle,
  AlertTriangle,
  Send,
  UserPlus,
  UserX,
  Eye,
  Edit,
} from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../lib/constants"
import { toast } from "sonner"
import { useColumnVisibility, ColumnConfig } from "../../hooks/useColumnVisibility"
import { useNavigate } from "react-router"
import React from "react"
import { Badge } from "../../app/components/ui/badge"
import { Button } from "../../app/components/ui/button"
import { Input } from "../../app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../app/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../app/components/ui/table"
import { Checkbox } from "../../app/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../app/components/ui/dialog"
import { Label } from "../../app/components/ui/label"
import { Textarea } from "../../app/components/ui/textarea"
import { StudyStatus, statusConfig, priorityConfig, getStatusBadgeClass } from "../../lib/report-types"
import { WorklistTableShell } from "../../app/components/tables/worklist-table-shell"
import { WorklistFilterBar, FilterConfig } from "../../app/components/tables/worklist-filter-bar"
import { Pagination } from "../../app/components/ui/pagination"

/**
 * ADMIN ROLE - WORKLIST
 * 
 * RBAC RULES:
 * - Admins can view all studies and their report statuses
 * - Can view reports once they reach "Drafted" status or later
 * - CANNOT create or edit reports (Radiologist only)
 * - Can track report progress: Pending → Drafted → Awaiting Review → Rejected/Approved
 * - Can assign studies to radiologists for reporting
 * 
 * BACKEND INTEGRATION NOTES:
 * - GET /api/admin/worklist - Get all studies with report statuses
 * - Filter by: modality, status, priority, date
 * - Real-time updates for status changes
 */

interface Study {
  id: string
  uhid: string
  patientName: string
  age: number
  gender: string
  phoneNo?: string // Configurable column
  modality: string
  studyDescription: string
  tests: string
  priority: "STAT" | "Urgent" | "Routine"
  status: StudyStatus
  studyDate: string
  studyTime: string
  appointmentTime?: string
  reportGeneratedDate?: string // Configurable column
  reportGeneratedTime?: string // Configurable column
  reportValidatedDate?: string // Configurable column
  reportValidatedTime?: string // Configurable column
  allottedTechnician: string
  referringPhysician: string
  clinicalHistory: string
  accessionNumber: string
  room?: string
  technicalNotes?: string
  isCritical?: boolean
  criticalComment?: string
  assignedRadiologist?: string
  assignedRadiologistId?: string
}

// Mock data - Admin view
const mockWorklistData: Study[] = [
  {
    id: "STU-2024-001",
    uhid: "UHID-45678",
    patientName: "Sarah Johnson",
    age: 45,
    gender: "F",
    phoneNo: "+1 (555) 123-4567",
    modality: "CT",
    studyDescription: "CT Chest with Contrast",
    tests: "Contrast Enhanced CT",
    priority: "STAT",
    status: "Pending",
    studyDate: "2024-01-14",
    studyTime: "09:30",
    appointmentTime: "09:30",
    allottedTechnician: "David Kumar",
    referringPhysician: "Dr. Michael Chen",
    clinicalHistory: "Suspected pulmonary embolism, acute chest pain",
    accessionNumber: "ACC-2024-001",
    room: "CT-1",
  },
  {
    id: "STU-2024-005",
    uhid: "UHID-45682",
    patientName: "James Wilson",
    age: 58,
    gender: "M",
    phoneNo: "+1 (555) 234-5678",
    modality: "CT",
    studyDescription: "CT Abdomen and Pelvis with Contrast",
    tests: "CT Abd/Pelvis",
    priority: "Urgent",
    status: "Drafted",
    studyDate: "2024-01-14",
    studyTime: "08:45",
    appointmentTime: "08:30",
    reportGeneratedDate: "2024-01-14",
    reportGeneratedTime: "10:15",
    allottedTechnician: "David Kumar",
    referringPhysician: "Dr. Robert Lee",
    clinicalHistory: "Abdominal pain, rule out appendicitis",
    accessionNumber: "ACC-2024-005",
    room: "CT-2",
    technicalNotes: "Patient positioned, IV contrast administered",
    assignedRadiologist: "Dr. Sarah Chen",
    assignedRadiologistId: "RAD-001",
  },
  {
    id: "STU-2024-006",
    uhid: "UHID-45683",
    patientName: "Maria Garcia",
    age: 72,
    gender: "F",
    phoneNo: "+1 (555) 345-6789",
    modality: "X-Ray",
    studyDescription: "Chest X-Ray PA & Lateral",
    tests: "X-Ray Chest",
    priority: "Routine",
    status: "Pending",
    studyDate: "2024-01-14",
    studyTime: "10:00",
    appointmentTime: "10:00",
    allottedTechnician: "David Kumar",
    referringPhysician: "Dr. Sarah Johnson",
    clinicalHistory: "Routine pre-op evaluation",
    accessionNumber: "ACC-2024-006",
    room: "XR-1",
  },
  {
    id: "STU-2024-007",
    uhid: "UHID-45684",
    patientName: "John Davis",
    age: 41,
    gender: "M",
    phoneNo: "+1 (555) 456-7890",
    modality: "MRI",
    studyDescription: "MRI Lumbar Spine without Contrast",
    tests: "MRI L-Spine",
    priority: "Routine",
    status: "Awaiting Review",
    studyDate: "2024-01-14",
    studyTime: "11:30",
    appointmentTime: "11:30",
    reportGeneratedDate: "2024-01-14",
    reportGeneratedTime: "13:45",
    allottedTechnician: "David Kumar",
    referringPhysician: "Dr. Emily Wong",
    clinicalHistory: "Lower back pain, radiculopathy",
    accessionNumber: "ACC-2024-007",
    room: "MRI-1",
    assignedRadiologist: "Dr. Michael Chen",
    assignedRadiologistId: "RAD-003",
  },
  {
    id: "STU-2024-008",
    uhid: "UHID-45685",
    patientName: "Patricia Brown",
    age: 55,
    gender: "F",
    phoneNo: "+1 (555) 567-8901",
    modality: "CT",
    studyDescription: "CT Head without Contrast",
    tests: "CT Head",
    priority: "STAT",
    status: "Rejected",
    studyDate: "2024-01-14",
    studyTime: "09:00",
    appointmentTime: "09:00",
    reportGeneratedDate: "2024-01-14",
    reportGeneratedTime: "10:30",
    allottedTechnician: "David Kumar",
    referringPhysician: "Dr. Michael Chen",
    clinicalHistory: "Acute stroke symptoms, onset 2 hours ago",
    accessionNumber: "ACC-2024-008",
    room: "CT-1",
    isCritical: true,
    criticalComment: "Possible acute intracranial hemorrhage. Urgent imaging required for immediate clinical decision-making.",
    assignedRadiologist: "Dr. Sarah Chen",
    assignedRadiologistId: "RAD-001",
  },
  {
    id: "STU-2024-009",
    uhid: "UHID-45686",
    patientName: "Thomas Anderson",
    age: 68,
    gender: "M",
    phoneNo: "+1 (555) 678-9012",
    modality: "X-Ray",
    studyDescription: "Left Knee X-Ray 2 Views",
    tests: "X-Ray Knee",
    priority: "Routine",
    status: "Drafted",
    studyDate: "2024-01-14",
    studyTime: "07:30",
    appointmentTime: "07:30",
    reportGeneratedDate: "2024-01-14",
    reportGeneratedTime: "08:45",
    allottedTechnician: "David Kumar",
    referringPhysician: "Dr. Robert Lee",
    clinicalHistory: "Knee pain and swelling after fall",
    accessionNumber: "ACC-2024-009",
    room: "XR-2",
    technicalNotes: "Standard 2-view knee protocol completed. Patient cooperative.",
    assignedRadiologist: "Dr. David Kumar",
    assignedRadiologistId: "RAD-005",
  },
  {
    id: "STU-2024-010",
    uhid: "UHID-45687",
    patientName: "Elizabeth Martin",
    age: 34,
    gender: "F",
    phoneNo: "+1 (555) 789-0123",
    modality: "MRI",
    studyDescription: "MRI Brain with Contrast",
    tests: "MRI Brain",
    priority: "Urgent",
    status: "Approved",
    studyDate: "2024-01-14",
    studyTime: "08:00",
    appointmentTime: "08:00",
    reportGeneratedDate: "2024-01-14",
    reportGeneratedTime: "09:30",
    reportValidatedDate: "2024-01-14",
    reportValidatedTime: "10:15",
    allottedTechnician: "David Kumar",
    referringPhysician: "Dr. Sarah Lee",
    clinicalHistory: "Persistent migraines, visual disturbances",
    accessionNumber: "ACC-2024-010",
    room: "MRI-2",
    technicalNotes: "Gadolinium contrast administered. No adverse reactions.",
    assignedRadiologist: "Dr. Emily Rodriguez",
    assignedRadiologistId: "RAD-004",
  },
]

// Mock list of radiologists
const mockRadiologists = [
  { id: "RAD-001", name: "Dr. John Smith", specialty: "Chest Imaging" },
  { id: "RAD-002", name: "Dr. Sarah Thompson", specialty: "Neuroradiology" },
  { id: "RAD-003", name: "Dr. Michael Chen", specialty: "Musculoskeletal" },
  { id: "RAD-004", name: "Dr. Emily Rodriguez", specialty: "Abdominal Imaging" },
  { id: "RAD-005", name: "Dr. David Kumar", specialty: "General Radiology" },
]

export function AdminWorklist() {
  const navigate = useNavigate()
  const [studies, setStudies] = React.useState<Study[]>(mockWorklistData)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [modalityFilter, setModalityFilter] = React.useState("all")
  const [studyDescriptionFilter, setStudyDescriptionFilter] = React.useState("all")
  const [priorityFilter, setPriorityFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [assignedRadiologistFilter, setAssignedRadiologistFilter] = React.useState("all")
  const [fromDate, setFromDate] = React.useState("")
  const [toDate, setToDate] = React.useState("")
  
  // Status update dialog
  const [selectedStudy, setSelectedStudy] = React.useState<Study | null>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage] = React.useState(10)

  // Radiologist assignment dialog
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = React.useState(false)
  const [selectedRadiologist, setSelectedRadiologist] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  // Study selection for assignment
  const [selectedStudies, setSelectedStudies] = React.useState<Set<string>>(new Set())

  // Edit dialog state
  const [editStudy, setEditStudy] = React.useState<Study | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editForm, setEditForm] = React.useState({
    patientName: "",
    age: 0,
    gender: "",
    phoneNo: "",
    clinicalHistory: "",
    studyDescription: "",
  })
  
  // Filtered studies
  const filteredStudies = React.useMemo(() => {
    return studies.filter(study => {
      const matchesSearch = 
        study.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesModality = modalityFilter === "all" || study.modality === modalityFilter
      const matchesStudyDescription = studyDescriptionFilter === "all" || study.studyDescription === studyDescriptionFilter
      const matchesPriority = priorityFilter === "all" || study.priority === priorityFilter
      const matchesStatus = statusFilter === "all" || study.status === statusFilter
      const matchesAssignedRadiologist = assignedRadiologistFilter === "all" || study.assignedRadiologistId === assignedRadiologistFilter

      // Date range filtering
      let matchesDateRange = true
      if (fromDate && toDate) {
        matchesDateRange = study.studyDate >= fromDate && study.studyDate <= toDate
      } else if (fromDate) {
        matchesDateRange = study.studyDate >= fromDate
      } else if (toDate) {
        matchesDateRange = study.studyDate <= toDate
      }

      return matchesSearch && matchesModality && matchesStudyDescription && matchesPriority && matchesStatus && matchesAssignedRadiologist && matchesDateRange
    })
  }, [studies, searchQuery, modalityFilter, studyDescriptionFilter, priorityFilter, statusFilter, assignedRadiologistFilter, fromDate, toDate])
  
  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredStudies.length / itemsPerPage))
  const paginatedStudies = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredStudies.slice(startIndex, endIndex)
  }, [filteredStudies, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, modalityFilter, studyDescriptionFilter, priorityFilter, statusFilter, assignedRadiologistFilter, fromDate, toDate])
  
  // Get assignable studies eligible for assignment (all statuses except "Approved")
  const assignableStudies = React.useMemo(() => {
    return filteredStudies.filter(study => study.status !== "Approved")
  }, [filteredStudies])

  // Handle checkbox selection with validation
  const handleSelectStudy = (studyId: string, checked: boolean) => {
    const study = studies.find(s => s.id === studyId)
    if (!study) return

    setSelectedStudies(prev => {
      const newSet = new Set(prev)
      
      if (checked) {
        // Check if we're trying to mix assigned and unassigned studies
        if (newSet.size > 0) {
          const currentlySelected = Array.from(newSet).map(id => studies.find(s => s.id === id))
          const hasAssigned = currentlySelected.some(s => s?.assignedRadiologist)
          const hasUnassigned = currentlySelected.some(s => !s?.assignedRadiologist)
          
          // Prevent mixing
          if ((hasAssigned && !study.assignedRadiologist) || (hasUnassigned && study.assignedRadiologist)) {
            toast.error("Cannot select both assigned and unassigned reports together")
            return prev
          }
        }
        newSet.add(studyId)
      } else {
        newSet.delete(studyId)
      }
      return newSet
    })
  }

  // Handle select all assignable studies on current page
  const handleSelectAllAssignable = (checked: boolean) => {
    if (checked) {
      // Only select assignable studies on the current page
      const assignableIdsOnPage = paginatedStudies
        .filter(s => s.status !== "Approved")
        .map(s => s.id)
      setSelectedStudies(new Set([...selectedStudies, ...assignableIdsOnPage]))
    } else {
      // Deselect all studies on the current page
      const idsOnPage = new Set(paginatedStudies.map(s => s.id))
      setSelectedStudies(new Set([...selectedStudies].filter(id => !idsOnPage.has(id))))
    }
  }

  // Check if all assignable studies on current page are selected
  const assignableOnPage = paginatedStudies.filter(s => s.status !== "Approved")
  const allAssignableSelected = assignableOnPage.length > 0 &&
    assignableOnPage.every(s => selectedStudies.has(s.id))

  // Determine if selected studies are assigned, unassigned, or mixed
  const selectionType = React.useMemo(() => {
    if (selectedStudies.size === 0) return 'none'
    
    const selected = Array.from(selectedStudies).map(id => studies.find(s => s.id === id))
    const hasAssigned = selected.some(s => s?.assignedRadiologist)
    const hasUnassigned = selected.some(s => !s?.assignedRadiologist)
    
    if (hasAssigned && hasUnassigned) return 'mixed'
    if (hasAssigned) return 'assigned'
    if (hasUnassigned) return 'unassigned'
    return 'none'
  }, [selectedStudies, studies])

  // Open radiologist assignment dialog
  const handleOpenAssignment = () => {
    if (selectedStudies.size === 0) {
      toast.error("Please select at least one study to assign")
      return
    }
    setIsAssignmentDialogOpen(true)
  }

  // Handle radiologist assignment
  const handleAssignToRadiologist = async () => {
    if (!selectedRadiologist) {
      toast.error("Please select a radiologist")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // BACKEND: await fetch('/api/admin/assign-to-radiologist', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     studyIds: Array.from(selectedStudies),
      //     radiologistId: selectedRadiologist
      //   })
      // })

      // Update studies with assigned radiologist
      const radiologist = mockRadiologists.find(r => r.id === selectedRadiologist)
      setStudies(prev => prev.map(study => {
        if (selectedStudies.has(study.id)) {
          return {
            ...study,
            assignedRadiologist: radiologist?.name,
            assignedRadiologistId: selectedRadiologist
          }
        }
        return study
      }))

      const actionLabel = selectionType === 'assigned' ? 'reassigned' : 'assigned'
      toast.success(
        `${selectedStudies.size} ${selectedStudies.size === 1 ? 'study' : 'studies'} ${actionLabel} to ${radiologist?.name}`
      )

      // Reset state
      setSelectedStudies(new Set())
      setIsAssignmentDialogOpen(false)
      setSelectedRadiologist("")
    } catch (err) {
      toast.error("Failed to assign studies. Please try again.")
      console.error("Assignment error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle unassign studies
  const handleUnassignStudies = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // BACKEND: await fetch('/api/admin/unassign-studies', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     studyIds: Array.from(selectedStudies)
      //   })
      // })

      // Update studies to remove assigned radiologist
      setStudies(prev => prev.map(study => {
        if (selectedStudies.has(study.id)) {
          return {
            ...study,
            assignedRadiologist: undefined,
            assignedRadiologistId: undefined
          }
        }
        return study
      }))

      toast.success(
        `${selectedStudies.size} ${selectedStudies.size === 1 ? 'study' : 'studies'} unassigned successfully`
      )

      // Reset state
      setSelectedStudies(new Set())
    } catch (err) {
      toast.error("Failed to unassign studies. Please try again.")
      console.error("Unassign error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get selected study details for assignment dialog
  const selectedStudyDetails = React.useMemo(() => {
    return studies.filter(study => selectedStudies.has(study.id))
  }, [studies, selectedStudies])

  // Priority badge variant
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "STAT":
        return <Badge className="bg-red-600 text-white">STAT</Badge>
      case "Urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "Routine":
        return <Badge variant="secondary">Routine</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // Status badge variant
  const getStatusBadge = (status: StudyStatus) => {
    const config = statusConfig[status]
    if (!config) {
      // Fallback for undefined status
      return <Badge variant="outline">{status}</Badge>
    }
    return <Badge className={getStatusBadgeClass(status)}>{config.label}</Badge>
  }

  // Open study details dialog (view only, no status updates)
  const openDetailsDialog = (study: Study) => {
    setSelectedStudy(study)
    setIsStatusDialogOpen(true)
  }

  // Open edit dialog
  const handleOpenEditDialog = (study: Study) => {
    setEditStudy(study)
    setEditForm({
      patientName: study.patientName,
      age: study.age,
      gender: study.gender,
      phoneNo: study.phoneNo || "",
      clinicalHistory: study.clinicalHistory,
      studyDescription: study.studyDescription,
    })
    setIsEditDialogOpen(true)
  }

  // Handle edit study
  const handleEditStudy = async () => {
    if (!editStudy) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // BACKEND: await fetch(`/api/admin/study/${editStudy.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // })

      // Update study in local state
      setStudies(prev => prev.map(study => {
        if (study.id === editStudy.id) {
          return {
            ...study,
            ...editForm
          }
        }
        return study
      }))

      toast.success("Study information updated successfully")

      // Reset state
      setIsEditDialogOpen(false)
      setEditStudy(null)
    } catch (err) {
      toast.error("Failed to update study. Please try again.")
      console.error("Edit error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get status action button - View and Edit available
  const getStatusAction = (study: Study) => {
    return (
      <div className="flex items-center gap-2 justify-end">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            // Navigate to DICOM viewer to view scan images and report (if available)
            navigate(`/admin/dicom-viewer/${study.id}`)
          }}
        >
          <Eye strokeWidth={ICON_STROKE_WIDTH} className="mr-1 h-3 w-3" />
          View
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="h-8 w-8"
          onClick={() => handleOpenEditDialog(study)}
        >
          <Edit strokeWidth={ICON_STROKE_WIDTH} className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Column configuration
  const adminColumns: ColumnConfig[] = [
    // Fixed columns (always visible, cannot be hidden) - Based on RIS requirements
    { id: "checkbox", label: "Case Assignment", isFixed: true, defaultVisible: true },
    { id: "uhid", label: "UHID", isFixed: true, defaultVisible: true },
    { id: "patientName", label: "Patient Name", isFixed: true, defaultVisible: true },
    { id: "modality", label: "Modality", isFixed: true, defaultVisible: true },
    { id: "studyDescription", label: "Study Description", isFixed: true, defaultVisible: true },
    { id: "status", label: "Status", isFixed: true, defaultVisible: true },
    { id: "action", label: "Action", isFixed: true, defaultVisible: true },
    // Configurable columns (can be shown/hidden) - Based on RIS requirements
    { id: "age", label: "Age", isFixed: false, defaultVisible: true },
    { id: "gender", label: "Gender", isFixed: false, defaultVisible: true },
    { id: "phoneNo", label: "Phone No", isFixed: false, defaultVisible: false },
    { id: "tests", label: "Tests", isFixed: false, defaultVisible: true },
    { id: "clinicalHistory", label: "Clinical History", isFixed: false, defaultVisible: true },
    { id: "priority", label: "Priority", isFixed: false, defaultVisible: true },
    { id: "assignmentStatus", label: "Assignment Status", isFixed: false, defaultVisible: true },
    { id: "assignedRadiologist", label: "Assigned Radiologist", isFixed: false, defaultVisible: true },
    { id: "studyDateTime", label: "Study Date/Time", isFixed: false, defaultVisible: false },
    { id: "reportGeneratedDate", label: "Report Generated Date/Time", isFixed: false, defaultVisible: false },
    { id: "reportValidatedDate", label: "Report Validated Date/Time", isFixed: false, defaultVisible: false },
  ]

  const { visibleColumns, toggleColumn, resetColumns, isVisible } = useColumnVisibility(
    "admin-worklist-columns",
    adminColumns
  )

  // Filter configuration for WorklistFilterBar
  const filterConfig: FilterConfig[] = [
    {
      id: "status",
      label: "Status",
      placeholder: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      width: "w-[136px]",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "Pending", label: "Pending" },
        { value: "Drafted", label: "Drafted" },
        { value: "Awaiting Review", label: "Awaiting Review" },
        { value: "Rejected", label: "Rejected" },
        { value: "Approved", label: "Approved" },
      ],
    },
    {
      id: "modality",
      label: "Modalities",
      placeholder: "Modalities",
      value: modalityFilter,
      onChange: setModalityFilter,
      width: "w-[135px]",
      options: [
        { value: "all", label: "All Modalities" },
        { value: "CT", label: "CT" },
        { value: "MRI", label: "MRI" },
        { value: "X-Ray", label: "X-Ray" },
        { value: "Ultrasound", label: "Ultrasound" },
      ],
    },
    {
      id: "studyDescription",
      label: "Studies",
      placeholder: "Studies",
      value: studyDescriptionFilter,
      onChange: setStudyDescriptionFilter,
      width: "w-[136px]",
      options: [
        { value: "all", label: "All Studies" },
        { value: "CT Chest with Contrast", label: "CT Chest with Contrast" },
        { value: "CT Abdomen and Pelvis with Contrast", label: "CT Abdomen and Pelvis" },
        { value: "Chest X-Ray PA & Lateral", label: "Chest X-Ray" },
        { value: "MRI Lumbar Spine without Contrast", label: "MRI Lumbar Spine" },
        { value: "CT Head without Contrast", label: "CT Head" },
        { value: "Left Knee X-Ray 2 Views", label: "Knee X-Ray" },
        { value: "MRI Brain with Contrast", label: "MRI Brain" },
      ],
    },
    {
      id: "priority",
      label: "Priorities",
      placeholder: "Priorities",
      value: priorityFilter,
      onChange: setPriorityFilter,
      width: "w-[135px]",
      options: [
        { value: "all", label: "All Priorities" },
        { value: "STAT", label: "STAT" },
        { value: "Urgent", label: "Urgent" },
        { value: "Routine", label: "Routine" },
      ],
    },
    {
      id: "radiologist",
      label: "Radiologists",
      placeholder: "Radiologists",
      value: assignedRadiologistFilter,
      onChange: setAssignedRadiologistFilter,
      width: "w-[136px]",
      options: [
        { value: "all", label: "All Radiologists" },
        ...mockRadiologists.map(rad => ({
          value: rad.id,
          label: rad.name,
        })),
      ],
    },
  ]

  return (
    <WorklistTableShell
      title="Imaging Worklist"
      showDatePickers={true}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      filterBar={
        <div className="flex items-center gap-3 flex-wrap">
          <WorklistFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search"
            filters={filterConfig}
            columnConfig={{
              columns: adminColumns,
              visibleColumns,
              onToggleColumn: toggleColumn,
              onResetColumns: resetColumns,
              userRole: "admin",
            }}
          />
          {selectedStudies.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="default" className="bg-blue-500/10 text-blue-700 border-blue-200">
                {selectedStudies.size} selected
              </Badge>
              
              {/* Show Assign/Reassign button for unassigned or assigned studies */}
              {(selectionType === 'unassigned' || selectionType === 'assigned') && (
                <Button 
                  onClick={handleOpenAssignment}
                  size="sm"
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" strokeWidth={ICON_STROKE_WIDTH} />
                  {selectionType === 'assigned' ? 'Reassign' : 'Assign to Radiologist'}
                </Button>
              )}
              
              {/* Show Unassign button only for assigned studies */}
              {selectionType === 'assigned' && (
                <Button 
                  onClick={handleUnassignStudies}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  disabled={isSubmitting}
                >
                  <UserX className="h-4 w-4" strokeWidth={ICON_STROKE_WIDTH} />
                  Unassign
                </Button>
              )}
              
              <Button 
                onClick={() => setSelectedStudies(new Set())}
                size="sm"
                variant="ghost"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      }
    >
      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow className="border-b">
                {isVisible("checkbox") && (
                  <TableHead className="w-12 bg-white">
                          {assignableStudies.length > 0 && (
                            <Checkbox
                              checked={allAssignableSelected}
                              onCheckedChange={handleSelectAllAssignable}
                              aria-label="Select all assignable studies"
                            />
                          )}
                        </TableHead>
                      )}
                {isVisible("uhid") && <TableHead className="bg-white">UHID</TableHead>}
                {isVisible("patientName") && <TableHead className="bg-white">Patient Name</TableHead>}
                {isVisible("age") && <TableHead className="bg-white">Age</TableHead>}
                {isVisible("gender") && <TableHead className="bg-white">Gender</TableHead>}
                {isVisible("phoneNo") && <TableHead className="bg-white">Phone No</TableHead>}
                {isVisible("modality") && <TableHead className="bg-white">Modality</TableHead>}
                {isVisible("studyDescription") && <TableHead className="bg-white">Study Description</TableHead>}
                {isVisible("tests") && <TableHead className="bg-white hidden lg:table-cell">Tests</TableHead>}
                {isVisible("clinicalHistory") && <TableHead className="bg-white hidden lg:table-cell">Clinical History</TableHead>}
                {isVisible("priority") && <TableHead className="bg-white">Priority</TableHead>}
                {isVisible("status") && <TableHead className="bg-white">Report Status</TableHead>}
                {isVisible("assignmentStatus") && <TableHead className="bg-white hidden xl:table-cell">Assignment Status</TableHead>}
                {isVisible("assignedRadiologist") && <TableHead className="bg-white">Assigned Radiologist</TableHead>}
                {isVisible("studyDateTime") && <TableHead className="bg-white">Study Date/Time</TableHead>}
                {isVisible("reportGeneratedDate") && <TableHead className="bg-white">Report Generated</TableHead>}
                {isVisible("reportValidatedDate") && <TableHead className="bg-white">Report Validated</TableHead>}
                {isVisible("action") && <TableHead className="text-right bg-white">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudies.length > 0 ? (
                      paginatedStudies.map((study) => (
                        <TableRow key={study.id} className={study.isCritical ? "bg-red-50 dark:bg-red-950/10" : ""}>
                          {isVisible("checkbox") && (
                            <TableCell>
                              {study.status !== "Approved" && (
                                <Checkbox
                                  checked={selectedStudies.has(study.id)}
                                  onCheckedChange={(checked) => handleSelectStudy(study.id, checked as boolean)}
                                  aria-label={`Select ${study.patientName}`}
                                />
                              )}
                            </TableCell>
                          )}
                          {isVisible("uhid") && (
                            <TableCell className="font-mono text-sm">{study.uhid}</TableCell>
                          )}
                          {isVisible("patientName") && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {study.isCritical && (
                                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
                                )}
                                <span className="font-medium">{study.patientName}</span>
                              </div>
                            </TableCell>
                          )}
                          {isVisible("age") && (
                            <TableCell className="text-sm">
                              {study.age}Y
                            </TableCell>
                          )}
                          {isVisible("gender") && (
                            <TableCell className="text-sm">
                              {study.gender}
                            </TableCell>
                          )}
                          {isVisible("phoneNo") && (
                            <TableCell className="text-sm">{study.phoneNo || "N/A"}</TableCell>
                          )}
                          {isVisible("modality") && (
                            <TableCell>
                              <Badge variant="outline">{study.modality}</Badge>
                            </TableCell>
                          )}
                          {isVisible("studyDescription") && (
                            <TableCell className="max-w-[250px]">
                              <div className="text-sm font-medium">{study.studyDescription}</div>
                              <div className="text-xs text-muted-foreground">{study.accessionNumber}</div>
                            </TableCell>
                          )}
                          {isVisible("tests") && (
                            <TableCell className="text-sm hidden lg:table-cell">{study.tests}</TableCell>
                          )}
                          {isVisible("clinicalHistory") && (
                            <TableCell className="max-w-[200px] hidden lg:table-cell">
                              <div className="text-xs text-muted-foreground truncate" title={study.clinicalHistory}>
                                {study.clinicalHistory}
                              </div>
                            </TableCell>
                          )}
                          {isVisible("priority") && (
                            <TableCell>{getPriorityBadge(study.priority)}</TableCell>
                          )}
                          {isVisible("status") && (
                            <TableCell>{getStatusBadge(study.status)}</TableCell>
                          )}
                          {isVisible("assignmentStatus") && (
                            <TableCell className="hidden xl:table-cell">
                              {study.assignedRadiologist ? (
                                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                                  Assigned
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                                  Unassigned
                                </Badge>
                              )}
                            </TableCell>
                          )}
                          {isVisible("assignedRadiologist") && (
                            <TableCell className="text-sm">
                              {study.assignedRadiologist ? (
                                <div className="flex items-center gap-1">
                                  <User strokeWidth={ICON_STROKE_WIDTH} className="h-3 w-3 text-muted-foreground" />
                                  {study.assignedRadiologist}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          )}
                          {isVisible("studyDateTime") && (
                            <TableCell>
                              <div className="text-xs whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Calendar strokeWidth={ICON_STROKE_WIDTH} className="h-3 w-3" />
                                  {study.studyDate}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock strokeWidth={ICON_STROKE_WIDTH} className="h-3 w-3" />
                                  {study.studyTime}
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {isVisible("reportGeneratedDate") && (
                            <TableCell className="text-xs">
                              {study.reportGeneratedDate ? (
                                <div className="whitespace-nowrap">
                                  {study.reportGeneratedDate}
                                  {study.reportGeneratedTime && (
                                    <div className="text-muted-foreground">{study.reportGeneratedTime}</div>
                                  )}
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          )}
                          {isVisible("reportValidatedDate") && (
                            <TableCell className="text-xs">
                              {study.reportValidatedDate ? (
                                <div className="whitespace-nowrap">
                                  {study.reportValidatedDate}
                                  {study.reportValidatedTime && (
                                    <div className="text-muted-foreground">{study.reportValidatedTime}</div>
                                  )}
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          )}
                          {isVisible("action") && (
                            <TableCell className="text-right">
                              {getStatusAction(study)}
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={adminColumns.length} className="text-center py-8 text-muted-foreground">
                          No studies found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredStudies.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>

      {/* Study Details Dialog - View Only */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Study Details</DialogTitle>
            <DialogDescription>
              View study information and report status
            </DialogDescription>
          </DialogHeader>
          {selectedStudy && (
            <div className="space-y-6 py-4">
              {/* Patient Info */}
              <div>
                <h4 className="text-sm font-medium mb-3">Patient Information</h4>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="ml-2 font-medium">{selectedStudy.patientName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">UHID:</span>
                    <span className="ml-2 font-medium">{selectedStudy.uhid}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age/Gender:</span>
                    <span className="ml-2">{selectedStudy.age}Y • {selectedStudy.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accession:</span>
                    <span className="ml-2 font-mono text-xs">{selectedStudy.accessionNumber}</span>
                  </div>
                </div>
              </div>

              {/* Study Info */}
              <div>
                <h4 className="text-sm font-medium mb-3">Study Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Study:</span>
                    <span className="ml-2 font-medium">{selectedStudy.studyDescription}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Modality:</span>
                    <span className="ml-2">{selectedStudy.modality}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <span className="ml-2">{getPriorityBadge(selectedStudy.priority)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Report Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedStudy.status)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Clinical History:</span>
                    <p className="mt-1 text-sm">{selectedStudy.clinicalHistory}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Referring Physician:</span>
                    <span className="ml-2">{selectedStudy.referringPhysician}</span>
                  </div>
                  {selectedStudy.assignedRadiologist && (
                    <div>
                      <span className="text-muted-foreground">Assigned Radiologist:</span>
                      <span className="ml-2">{selectedStudy.assignedRadiologist}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Critical Alert */}
              {selectedStudy.isCritical && selectedStudy.criticalComment && (
                <div className="border-2 border-destructive rounded-lg p-4 bg-destructive/5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" strokeWidth={ICON_STROKE_WIDTH} />
                    <div>
                      <h4 className="text-sm font-semibold text-destructive mb-2">Critical Case Alert</h4>
                      <p className="text-sm text-foreground">{selectedStudy.criticalComment}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Notes (if any) */}
              {selectedStudy.technicalNotes && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Technical Notes</h4>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {selectedStudy.technicalNotes}
                  </div>
                </div>
              )}

              {/* Report Timestamps */}
              {(selectedStudy.reportGeneratedDate || selectedStudy.reportValidatedDate) && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Report Timeline</h4>
                  <div className="space-y-2 text-sm">
                    {selectedStudy.reportGeneratedDate && (
                      <div>
                        <span className="text-muted-foreground">Report Generated:</span>
                        <span className="ml-2">{selectedStudy.reportGeneratedDate} {selectedStudy.reportGeneratedTime}</span>
                      </div>
                    )}
                    {selectedStudy.reportValidatedDate && (
                      <div>
                        <span className="text-muted-foreground">Report Validated:</span>
                        <span className="ml-2">{selectedStudy.reportValidatedDate} {selectedStudy.reportValidatedTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Radiologist Assignment Dialog */}
      <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectionType === 'assigned' ? 'Reassign Studies to Radiologist' : 'Assign Studies to Radiologist'}</DialogTitle>
            <DialogDescription>
              Select a radiologist to {selectionType === 'assigned' ? 'reassign' : 'assign'} the selected studies for reporting
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Selected Studies Summary */}
            <div>
              <h4 className="text-sm font-medium mb-3">Selected Studies ({selectedStudyDetails.length})</h4>
              <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                {selectedStudyDetails.map((study) => (
                  <div key={study.id} className="p-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium">{study.patientName}</div>
                        <div className="text-muted-foreground">{study.studyDescription}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {study.uhid} • {study.accessionNumber} • {getPriorityBadge(study.priority)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Radiologist Selection */}
            <div className="space-y-2">
              <Label htmlFor="radiologist">Select Radiologist</Label>
              <Select value={selectedRadiologist} onValueChange={setSelectedRadiologist}>
                <SelectTrigger id="radiologist">
                  <SelectValue placeholder="Choose a radiologist..." />
                </SelectTrigger>
                <SelectContent>
                  {mockRadiologists.map((rad) => (
                    <SelectItem key={rad.id} value={rad.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{rad.name}</span>
                        <span className="text-xs text-muted-foreground">{rad.specialty}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Studies will appear in the selected radiologist's worklist for reporting
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAssignmentDialogOpen(false)
                setSelectedRadiologist("")
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssignToRadiologist}
              disabled={isSubmitting || !selectedRadiologist}
            >
              {isSubmitting ? "Assigning..." : "Assign to Radiologist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Study Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Study Information</DialogTitle>
            <DialogDescription>
              Update demographics, clinical history, and study description
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Demographics */}
            <div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    value={editForm.patientName}
                    onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 0 })}
                    placeholder="Enter age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={editForm.gender} onValueChange={(value) => setEditForm({ ...editForm, gender: value })}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="O">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone Number</Label>
                  <Input
                    id="phoneNo"
                    value={editForm.phoneNo}
                    onChange={(e) => setEditForm({ ...editForm, phoneNo: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Study Information */}
            <div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studyDescription">Study Description *</Label>
                  <Input
                    id="studyDescription"
                    value={editForm.studyDescription}
                    onChange={(e) => setEditForm({ ...editForm, studyDescription: e.target.value })}
                    placeholder="Enter study description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicalHistory">Clinical History *</Label>
                  <Textarea
                    id="clinicalHistory"
                    value={editForm.clinicalHistory}
                    onChange={(e) => setEditForm({ ...editForm, clinicalHistory: e.target.value })}
                    placeholder="Enter clinical history"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditStudy(null)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditStudy}
              disabled={isSubmitting || !editForm.patientName || !editForm.studyDescription || !editForm.clinicalHistory}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WorklistTableShell>
  )
}