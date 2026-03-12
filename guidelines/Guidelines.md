# design-rules.md

This document serves as the **single source of truth** for design implementation fidelity. It outlines strict rules for layout, behavior, and styling that must be followed when regenerating or expanding this codebase.

## 1. General Implementation Principles

### 1.1. Layout & Sizing

- **Hug vs. Fill**:
  - **Buttons & Chips**: Always **Hug Contents**. Never set fixed widths unless specifically required for a grid.
  - **Inputs & Search Bars**:
    - Default: **Hug Contents** or Fixed Width (e.g., `w-64`).
    - **FORBIDDEN**: Do `width: 100%` or `flex: 1` on search inputs within a toolbar context unless explicitly the main feature of a mobile view.
  - **Cards**: **Fill Container** width in grids, but **Hug Contents** height (let content drive height).

### 1.2. Design Tokens

- **Colors**: **NEVER** hardcode hex values (e.g., `#FFFFFF`, `#000000`). Always use semantic classes:
  - `bg-background`, `bg-card`, `bg-primary`
  - `text-foreground`, `text-muted-foreground`, `text-primary-foreground`
  - `border-border`, `border-input`
- **Spacing**: Use standard tailwind spacing (multiples of 4px). Avoid arbitrary values like `13px`.
- **Radius**: Use `rounded-md`, `rounded-sm`, or `rounded-lg` variables. Do not hardcode pixels.

### 1.3. Icons

- **Library**: Use **Lucide React** (`lucide-react`) exclusively.
- **Size**: Default icon size should be `size-4` (16px) for inner component icons, or `size-5` (20px) for navigation.

### 1.4. Conditional Subtext

- **Usage**: Descriptions under page, modal, or table titles should be used only when necessary for clarity. Avoid including subtext if the title is self-explanatory to prevent visual clutter.

### 1.5. Scrollbars

- **Theme**: Must use **Light Theme** / Neutral styling. Avoid dark or heavy scrollbars.

---

## 2. Component-Specific Rules

### 2.1. Search Bar & Inputs

- **Width**: As stated above, **Hug the content** or use a specific max-width. Do not fill the parent container aggressively.
- **Icon Placement**:
  - **Search Icon**: Left side (prefix).
  - **Calendar/Date Icon**: **RIGHT SIDE (Suffix)**.
    - **Critical**: The date picker trigger icon must be on the far right.
    - **Rationale**: Prevents confusion with text input start position.
- **Clear Actions**: "X" clear buttons must always be on the right.

### 2.2. Buttons

- **Variants**: Strictly adhere to `variant` props (`default`, `secondary`, `ghost`, `outline`, `destructive`).
- **Icons**:
  - Leading icon: `mr-2 size-4`
  - Trailing icon: `ml-2 size-4`
- **States**: Ensure `disabled` states are visually distinct (opacity-50).

### 2.3. Calendar & Date Picker

- **Composition**: Use a `Popover` > `PopoverTrigger` > `Button` (mimicking input) structure.
- **Calendar Component**:
  - Navigation arrows must be **Lucide Icons** (`ChevronLeft`, `ChevronRight`).
  - Selected state must use `bg-primary` text `text-primary-foreground`.
  - Today's date must be highlighted (e.g., `bg-accent text-accent-foreground`).

### 2.4. Cards & Containers

- **Borders**: All cards must have `border border-border`.
- **Shadows**: Use `shadow-sm` for standard cards. `shadow-md` for floating elements.
- **Header/Content/Footer**: Strictly separate these sections to maintain padding consistency.
- **Usage**: **Avoid Overusing Cards**. Only use cards when content needs distinct encapsulation or groupings. Do not use cards for simple lists or layouts where whitespace is sufficient.

### 2.5. Dialogs & Sheets (Modals)

- **Overlay**: Must include a backdrop blur (`backdrop-blur-sm`).
- **Fixed Modal**: **Upload Documents / View Modals** must use a **Fixed Modal** layout.
  - **Usage**: Use a **Fixed Modal** (Dialog) for Document Upload and Preview tasks.
  - **Single Column**: Do not use multi-column layouts for simple document uploads.
  - **Max Width**: Set a consistent max-width (e.g., `max-w-md` or `max-w-lg`) effectively.
- **Positions**:
  - **Dialog**: Centered.
  - **Sheet**: Side-anchored (usually Right).
- **Close Button**: Must be present in the top-right corner (`X` icon).

### 2.6. Sidebar

- **State**: Must support `expanded` and `collapsed` states via data attributes (`data-state="expanded"`).
- **Mobile**: Must render as a `Sheet` (Drawer) on mobile viewports.
- **Menu Items**: Use `SidebarMenuButton` with `asChild` for custom links.

### 2.7. Tables (Data Table)

**Core Principle**: Tables are for comparison, scanning, and batch actions. They must **NOT** be used to represent workflows or step-by-step tasks.

#### 2.7.1. Structure & Layout

- **Top Bar Layout**:
  - **Top Left**: Date Picker (if present) -> Search Bar -> Tabs -> Filters.
  - **Top Right**: Primary Action Buttons.
- **Columns**:
  - **First Column**: By default, the first column should be **Sr. No.** (Serial Number).
- **Footer Area**:
  - Must contain **Table Brief** (e.g., "Showing 1-10 of 100") and **Pagination**.
- **Styling**:
  - Header: `text-muted-foreground`, `font-medium`, `text-sm`.
  - Rows: Hover effect `hover:bg-muted/50`.
  - Cells: Padding `p-4`, vertically aligned middle.

#### 2.7.2. Column Customization

- **Visibility**: Provide a **Dropdown Menu** (e.g., "Columns") in the top-right toolbar to toggle column visibility.
- **Reordering**: Users must be able to **drag and drop** items _within the dropdown list_ to reorder columns in the table.
- **Locking**: Include a **Lock Icon** next to each item in the dropdown.
  - **Behavior**: Clicking the lock fixes the column's position, preventing it from being reordered or hidden.

#### 2.7.3. Alignment, Sorting & Formatting

- **Alignment Rules**:
  - **Text**: Left Aligned.
  - **Numbers**: **Right Aligned** (Must be in **Monospace Font**).
  - **Heads**: Match the content alignment (e.g., Number headers should be Right Aligned).
- **Sorting**:
  - **Indicator**: Sortable headers must show a clear arrow indicator.
  - **Constraint**: Only **ONE** active sort column at a time.
  - **Default**: Default sorting logic must be defined intentionally (e.g., "Created Date" descending).
- **Formatting**:
  - **Dates**: **Strict Format** & Monospace Font.
    - Format: `DD-MMM-YY, hh:mm AM/PM` (e.g., `23-FEB-25, 04:30 PM`).

#### 2.7.4. Advanced Table Types

1.  **Action-Driven Table**:
    - **Purpose**: Performing actions on individual records.
    - **Actions**: Inline actions limited to **1-2 primary actions** max.
      - **Placement**: Must be in the **right-most column**.
      - **Constraint**: No more than 2 columns of actions.
    - **Safety**: **Destructive actions** must NOT be the default inline action. Move to overflow menu.
2.  **Selection Table**:
    - **Purpose**: Bulk actions or assignment.
    - **Controls**: Use checkboxes (multi) or radio buttons (single) in the first column.
    - **Behavior**: Selecting an entry opens a **System Tray** (floating bar) where users can perform actions related to the specific entry/entries.
    - **Visual**: Selection controls must be visually distinct from row actions.

#### 2.7.5. Table Do's & Don'ts

- **DO**:
  - Use for comparison and overview.
  - Keep primary actions visually discoverable.
  - Maintain consistent column order.
- **DON'T**:
  - Use tables for guided workflows.
  - Overload rows with hidden content.
  - Place irreversible actions inside overflow menus by default.
  - Add decorative icons in data columns (Only Action column should have icons).

### 2.8. Dropdowns & Popovers

- **Offset**: Always use `sideOffset={4}` to prevent merging with triggers.
- **Animation**: Implement `fade-in` and `zoom-in` transitions (standard in Shadcn).

### 2.9. Navigation Menu

- **Indicator**: Must have active state indicator (e.g., underline or background pill).
- **Responsive**: Collapse to hamburger menu on mobile.

### 2.10. Form Fields

- **Labels**: Always include a `Label` component linked via `htmlFor`.
- **Error Messages**: Render below input in `text-destructive` color and `text-sm`.
- **Required Fields**: Mark with a red asterisk `*` or clear "(required)" label.

### 2.11. Badge System

**Purpose**: Badges are compact UI elements used to communicate state, priority, or context at a glance. They help users scan faster and understand system meaning without reading full text. Badges should clarify, not decorate.

#### 2.11.1. Badge vs Status Badge

- **Badge**:
  - **Usage**: Used to describe what kind of thing this is. Badges are **descriptive** and usually **stable**.
  - **Examples**: "Label", "Category", "Verified".
- **Status Badge**:
  - **Usage**: Used to represent the current system state. Status badges **change based on system logic**.
  - **Examples**: "Active", "Moderate", "Destructive".

#### 2.11.2. Badge Variants

Badge variants indicate visual importance. Use variants intentionally (More emphasis ≠ better clarity).

- **Primary**: Important contextual label.
- **Secondary**: Neutral or supporting info.
- **Outline**: Informational, low emphasis.
- **Ghost**: Very subtle context.
- **Destructive**: Negative or cautionary context.

#### 2.11.3. Status Badge Severity

Status badges communicate severity and impact. Severity must always reflect actual system behavior.

- **Primary**: Normal or successful state.
- **Moderate**: Needs attention or pending.
- **Destructive**: Blocking, failed, or high risk.
- **Visual Distinction**: Status badges must be visually distinct from buttons. They are **informative**, not interactive.

#### 2.11.4. Shapes & States

- **Shapes**: Both Badges and Status Badges support:
  - **Default**: Standard rounded corners (`rounded-md`).
  - **Round**: Fully rounded pill shape (`rounded-full`).
- **States**: Must support `Default` and `Focus` states.

#### 2.11.5. Color Semantics

Color represents meaning, not category. Usage must stay consistent across the system.

- **Positive** -> Success, Active.
- **Warning** -> Pending, Needs attention.
- **Error** -> Failed, Blocked.
- **Neutral** -> Draft, Archived.

#### 2.11.6. Badges Inside Tables

Tables are high-density views. Avoid badge overload; they are for scanning, not decoration.

- **Maximum one** status badge per row.
- **Optional one** supporting badge.
- **Placement**: Near the primary identifier.

#### 2.11.7. When Not to Use Badges

Do not use badges when:

- Explanation is required.
- The state affects the entire page.
- Full sentences are more appropriate.
  **Rule**: Badges signal what to notice, not what to understand fully. If a badge doesn't change understanding immediately, remove it.

#### 2.11.8. Badge Do's & Don'ts

| Do's                                   | Don'ts                                |
| :------------------------------------- | :------------------------------------ |
| Use short, clear labels (1–2 words).   | Create new badge styles without need. |
| Match badge meaning with system logic. | Mix status and labels visually.       |
| Keep visual hierarchy clean.           | Overuse destructive variants.         |

#### 2.11.9. Summary

- **Badge** -> Describes what it is.
- **Status Badge** -> Shows current state.
- **Variant & color** -> Indicates importance and severity.

---

### 2.12. Read-Only / Details Views

- **Rule**: Use **Plain Text** for static or read-only information.
- **Prohibition**: Do NOT use `disabled` input fields to display read-only data.
- **Styling**: Labels should be `text-muted-foreground` (small), and values should be `text-foreground` (medium/base).

---

### 2.13. Page Headers & Navigation

- **Back Button**: Must be placed strictly to the **LEFT** of the Page Title.

---

## 3. Strict Prohibitions (Do Not Do)

1.  **Do NOT** use `style={{ ... }}` for layout. use Tailwind classes.
2.  **Do NOT** use grid layouts for simple linear lists (use Flexbox `flex-col`).
3.  **Do NOT** place action buttons (Save, Cancel) in random places. Put them in `CardFooter` or `DialogFooter`.
4.  **Do NOT** mix icon sets (e.g., FontAwesome + Lucide).

## 4. Accessibility Mandates

- **Focus Rings**: All interactive elements must have visible focus rings (`ring-2 ring-ring ring-offset-2`).
- **Aria Labels**: Icon-only buttons MUST have `sr-only` text or `aria-label`.

---

title: IQLDS — Complete Reference & Checklist
created on: 2026-02-25
modified on: 2026-02-25
tags:

- permanent
  author:
- Aditya
  noteid: 202602251223
  project:

---

# Title : [[IQLDS — Complete Reference & ChecklistUntitled]]

---

> **Single source of truth.** Foundations · Structure · Block Components · All 54 Primitives · Risk & Error Framework · System-Wide & Per-Component Checklists.  
> Verified against source code. Read before writing any page, component, or feature.

---

## TABLE OF CONTENTS

**FOUNDATIONS**
[[#1. Tech Stack]]
[[#2. Design Tokens]]
[[#3. App Entry — Canonical Pattern]]
[[#4. Router — Lazy Loading Pattern]]

**STRUCTURE**
[[#5. Full Layer Stack & DOM Anatomy]]
[[#6. Z-Index Map & Heights]]
[[#7. AppShell]]
[[#8. PageShell]]
[[#9. Page Headers]]
[[#10. Page Layouts]]
[[#11. Page Sections]]

**BLOCK COMPONENTS**
[[#12. DataTable]]
[[#13. FilterBar]]
[[#14. State Components — Loading, Empty, Error]]
[[#15. ConfirmDialog]]
[[#16. StatList — Key/Value Display]]
[[#17. Stepper]]
[[#18. AvatarGroup]]
[[#19. Timeline]]
[[#20. Form Components]]
[[#21. Toast Notifications]]
[[#22. Sheet, Dialog, Drawer]]
[[#23. Charts]]
[[#24. MetricCard]]
[[#25. Calendar Blocks]]
[[#26. Auth Blocks]]
[[#27. Item Lists]]
[[#28. Tabs, Badges, Buttons, Icons, Kbd]]
[[#29. ButtonGroup & InputGroup]]
[[#30. ThemeToggle & useIsMobile]]
[[#31. Navigation Utilities]]
[[#32. Page Templates]]

**ARCHITECTURE**
[[#33. Architecture Patterns]]

**PRIMITIVE COMPONENTS**
[[#34. Button]]
[[#35. Badge]]
[[#36. Separator]]
[[#37. Skeleton]]
[[#38. Spinner]]
[[#39. Input]]
[[#40. Textarea]]
[[#41. Label]]
[[#42. Field]]
[[#43. Checkbox]]
[[#44. Radio Group]]
[[#45. Switch]]
[[#46. Select]]
[[#47. Native Select]]
[[#48. Combobox]]
[[#49. Input Group]]
[[#50. Input OTP]]
[[#51. Slider]]
[[#52. Card]]
[[#53. Scroll Area]]
[[#54. Aspect Ratio]]
[[#55. Resizable]]
[[#56. Dialog]]
[[#57. Alert Dialog]]
[[#58. Sheet]]
[[#59. Drawer]]
[[#60. Popover]]
[[#61. Hover Card]]
[[#62. Tooltip]]
[[#63. Breadcrumb]]
[[#64. Tabs]]
[[#65. Dropdown Menu]]
[[#66. Context Menu]]
[[#67. Command]]
[[#68. Menubar]]
[[#69. Navigation Menu]]
[[#70. Sidebar]]
[[#71. Accordion]]
[[#72. Collapsible]]
[[#73. Alert]]
[[#74. Empty]]
[[#75. Progress]]
[[#76. Pagination]]
[[#77. Toggle & Toggle Group]]
[[#78. Calendar]]
[[#79. Table]]
[[#80. Chart]]
[[#81. Carousel]]
[[#82. Avatar]]
[[#83. Button Group]]
[[#84. Kbd & KbdGroup]]
[[#85. Item]]
[[#86. Sonner (Toast)]]

**RISK, SEVERITY & ERROR HANDLING**
[[#87. Action Risk Levels]]
[[#88. Risk Classification Matrix]]
[[#89. Confirmation Patterns by Risk Level]]
[[#90. Irreversible Actions — Rules & Implementation]]
[[#91. Error Categories]]
[[#92. Recovery Patterns by Error Category]]
[[#93. Error Component Selection Guide]]
[[#94. Loading & Async State Machine]]
[[#95. Implementation Checklists]]

**CHECKLISTS — PART 1: SYSTEM-WIDE**
[[#1.1. App Entry (App.tsx)]]
[[#1.2. Router (router.tsx)]]
[[#1.3. Color & Tokens]]
[[#1.4. Spacing & Sizing]]
[[#1.5. Icons]]
[[#1.6. Typography & Numbers]]
[[#1.7. Accessibility]]
[[#1.8. Page Structure]]
[[#1.9. Actions & Feedback]]
[[#1.10. Sidebar Config]]

**CHECKLISTS — PART 2: PER-COMPONENT**
[[#LAYOUTS]]
[[#PAGE HEADERS]]
[[#PAGE STRUCTURE]]
[[#DATA DISPLAY]]
[[#STATE COMPONENTS]]
[[#ACTIONS & DIALOGS]]
[[#FORMS]]
[[#NAVIGATION]]
[[#CALENDAR]]
[[#AUTH]]
[[#FEEDBACK]]
[[#PRIMITIVES]]

---

# FOUNDATIONS

## 1. Tech Stack

| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| Framework     | React 18 + TypeScript                                       |
| Routing       | React Router v6                                             |
| Styling       | Tailwind CSS v4                                             |
| UI Primitives | shadcn/ui (customized)                                      |
| Icons         | Lucide React — `strokeWidth={2}` always                     |
| Tables        | @tanstack/react-table v8                                    |
| Charts        | Recharts (via `ChartContainer`)                             |
| Font          | Inter Variable (`@fontsource-variable/inter`) & Roboto Mono |
| Color system  | oklch design tokens                                         |
| Toast         | Sonner                                                      |
| Theme         | next-themes                                                 |

---

## 2. Design Tokens

### Color tokens — USE ONLY THESE, never hardcode

```
Background:     bg-background, bg-card, bg-muted, bg-popover
Foreground:     text-foreground, text-card-foreground, text-muted-foreground
Primary:        bg-primary, text-primary, text-primary-foreground
Secondary:      bg-secondary, text-secondary-foreground
Destructive:    bg-destructive, text-destructive, bg-destructive/10
Accent:         bg-accent, text-accent-foreground
Border:         border-border, border-input
Charts:         var(--chart-1) through var(--chart-5)
```

```tsx
// Soft tints (always use semantic tokens with opacity modifier)
<div className="bg-primary/10 text-primary">      // info / highlight
<div className="bg-destructive/10 text-destructive"> // error bg
<div className="bg-muted text-muted-foreground">   // muted section

// ❌ NEVER — hardcoded colors break the theme system
// <div style={{ color: "#2563eb" }}>
// <div className="bg-white dark:bg-gray-900">
// <div className="text-blue-600">
```

Dark mode adapts **automatically** via semantic tokens. Never use `dark:` modifier for colors.

### Typography

```tsx
<h1 className="text-lg font-semibold tracking-tight">   // page title
<h2 className="text-base font-semibold">                // section title
<h3 className="text-sm font-semibold">                  // subsection title
<p className="text-sm">                                 // body
<p className="text-sm text-muted-foreground">           // secondary text
<span className="text-xs text-muted-foreground">        // caption/metadata
<span className="roboto-mono text-sm tabular-nums">       // IDs, codes, numbers
<div className="text-2xl font-bold tabular-nums">       // display number (KPI)
```

### Icons — mandatory rules

```tsx
import { SomeIcon } from "lucide-react";
import { ICON_STROKE_WIDTH } from "@/lib/constants"; // = 2

// ✓ Always pass strokeWidth
<SomeIcon strokeWidth={ICON_STROKE_WIDTH} className="size-4" />;

// Size guide:
// size-3  → dense/badge context
// size-4  → default (most icons)
// size-5  → header/prominent
// size-8  → empty state (decorative)
```

### Spacing

```
Page horizontal:   px-4 or px-6
Page vertical:     py-6
Section gaps:      space-y-8 or space-y-6
Card padding:      p-4 or p-6
Grid gaps:         gap-4
Item/button gaps:  gap-2
```

---

## 3. App Entry — Canonical Pattern

```tsx
// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/components/blocks/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { router } from "./router";

export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />{" "}
      {/* mount once here — enables toast() everywhere */}
    </ErrorBoundary>
  );
}
```

---

## 4. Router — Lazy Loading Pattern

```tsx
// src/app/router.tsx
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layouts/app-shell";
import { RouteErrorBoundary } from "@/components/blocks/route-error-boundary";
import { LoadingState } from "@/components/blocks/loading-state";
import { NotFoundPage } from "@/pages/templates/NotFoundPage"; // eager

const DashboardPage = lazy(() =>
  import("@/pages/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <LoadingState
          message="Loading..."
          size="lg"
          className="min-h-[50vh]"
        />
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  // Authenticated — AppShell wraps all protected routes
  {
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />, // ← always add this
    children: [
      {
        path: "/",
        element: (
          <LazyPage>
            <DashboardPage />
          </LazyPage>
        ),
      },
    ],
  },
  // Public — outside AppShell
  {
    path: "/login",
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: (
      <NotFoundPage
        homeButton={{ href: "/", label: "Go Home" }}
      />
    ),
  },
]);
```

---

# STRUCTURE

## 5. Full Layer Stack & DOM Anatomy

```
┌─────────────────────────────────────────────────────────────────────────┐
│  <React.StrictMode>                                                     │
│  └─ <ErrorBoundary>                    catches all JS crashes           │
│     └─ <RouterProvider router={router}>                                 │
│        └─ <Toaster />                  toast() available anywhere       │
│                                                                         │
│        AUTHENTICATED ROUTES                                             │
│        └─ <AppShell>                   ← element in router             │
│           └─ <SidebarProvider>                                          │
│              └─ <div className="flex h-screen w-full">                  │
│                 ├─ <GlobalSidebar>     h-screen, collapsible icon↔full │
│                 │  ├─ Logo / brand                                      │
│                 │  └─ Nav items from SIDEBAR_ITEMS                      │
│                 │                                                       │
│                 └─ <SidebarInset>      flex-col, overflow-hidden        │
│                    ├─ <GlobalHeader>   sticky top-0 z-40 h-10          │
│                    │  ├─ SidebarTrigger                                 │
│                    │  ├─ Breadcrumbs (auto from pathname or manual)     │
│                    │  ├─ Bell                                           │
│                    │  ├─ ThemeToggle                                    │
│                    │  ├─ Settings                                       │
│                    │  └─ User avatar dropdown                           │
│                    │                                                    │
│                    ├─ <main className="flex-1 overflow-auto">           │
│                    │  └─ <Outlet />    ← YOUR PAGE RENDERS HERE        │
│                    │     └─ <PageShell>    flex h-full flex-col        │
│                    │        ├─ <PageHeader>  sticky top-0 z-30 h-14   │
│                    │        ├─ [<PageTabs>]  border-b h-9 z-30        │
│                    │        └─ <div className="flex-1 overflow-auto">   │
│                    │           └─ page content                          │
│                    │                                                    │
│                    └─ <GlobalFooter>   border-t py-2                   │
│                                                                         │
│        PUBLIC ROUTES (no AppShell)                                      │
│        ├─ /login    → <LoginPage>                                      │
│        ├─ /signup   → <SignupPage>                                     │
│        └─ *         → <NotFoundPage>                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Z-Index Map & Heights

```
z-50   Dialogs, Sheets, Drawers, Popovers, Dropdowns, Tooltips  (Radix)
z-40   GlobalHeader  (sticky top-0)
z-30   PageHeader    (sticky top-0, inside main scroll)
z-30   PageTabs      (sticky, directly below PageHeader)
z-10   Resizable handles, Select scroll buttons
```

```
GlobalHeader:   h-10   (40px)   sticky, always visible
PageHeader:     h-14   (56px)   sticky within page scroll
PageTabs:       h-9    (36px)   sticky, tab pattern only
Button default: h-8    (32px)
Button sm:      h-7    (28px)
Button lg:      h-9    (36px)
Input:          h-8    (32px)
Badge:          h-5    (20px)
```

---

## 7. AppShell

Root layout for all authenticated routes. Used as `element` in the router — never inside a page.

```tsx
import { AppShell } from "@/components/layouts/app-shell"

// In router:
{ element: <AppShell />, errorElement: <RouteErrorBoundary />, children: [...] }

// With props:
{ element: <AppShell userName="Jane Doe" userEmail="jane@example.com" onLogout={handleLogout} />, ... }
```

**Props:** `onLogout?`, `userName?`, `userEmail?`, `userAvatar?`, `breadcrumbs?`, `sidebarHeader?`

**Configure sidebar navigation** in `src/lib/sidebar-config.ts`:

```tsx
import { Home, Users, Settings } from "lucide-react";
import { type SidebarItem } from "@/lib/sidebar-config";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Patients", icon: Users, href: "/patients" },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    roles: ["admin"],
  },
];
```

---

## 8. PageShell

Required wrapper for every page component. `= <div className="flex h-full flex-col">`.

```tsx
import { PageShell } from "@/components/layouts/page-shell";

export function MyPage() {
  return (
    <PageShell>
      {/* PageHeader variant here */}
      {/* flex-1 overflow-auto content here */}
    </PageShell>
  );
}
```

---

## 9. Page Headers

### Page Headers — PageHeader

```tsx
import { PageHeader } from "@/components/blocks/page-header"

// Plain
<PageHeader title="Patients" />

// With actions
<PageHeader
  title="Patients"
  noBorder                  // use when tabs follow immediately below
  actions={
    <>
      <Button variant="outline">Export</Button>
      <Button><Plus className="size-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />Add</Button>
    </>
  }
/>
```

**Props:** `title` (string), `leading?` (left of title), `actions?` (right), `noBorder?`  
**Renders:** `sticky top-0 z-30 h-14 bg-background px-6 border-b`

### Page Headers — PageHeaderWithBack

```tsx
import { PageHeaderWithBack } from "@/components/patterns/page-header-with-back";

<PageHeaderWithBack
  title="Patient Details"
  backButton={{ href: "/patients" }} // or onClick={} or omit for navigate(-1)
  actions={<Button>Edit</Button>}
/>;
```

### Page Headers — PageHeaderWithTabs

```tsx
import { PageHeaderWithTabs } from "@/components/patterns/page-header-with-tabs"

const [tab, setTab] = React.useState("all")

<PageHeaderWithTabs
  title="Orders"
  tabs={[
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "complete", label: "Complete" },
  ]}
  value={tab}
  onValueChange={setTab}
  actions={<Button>New Order</Button>}
/>
```

---

## 10. Page Layouts

### Standard scrollable (most pages)

```tsx
<PageShell>
  <PageHeader title="..." />
  <div className="flex-1 overflow-auto">
    <div className="container mx-auto py-6 px-4">
      {/* content */}
    </div>
  </div>
</PageShell>
```

### TwoColumnLayout (resizable panels)

```tsx
import { TwoColumnLayout } from "@/components/layouts/two-column-layout";

<PageShell>
  <PageHeader title="..." />
  <div className="flex-1 overflow-hidden">
    {" "}
    {/* overflow-hidden — panels scroll internally */}
    <TwoColumnLayout
      left={<LeftPanel />}
      right={<RightPanel />}
      defaultLeftWidth={40}
      defaultRightWidth={60}
      resizable // default: true
      scrollable // default: true
      leftHeader={<h3>List</h3>}
      rightHeader={<h3>Detail</h3>}
    />
  </div>
</PageShell>;
```

> `TwoColumnLayout` uses `style={{ width }}` internally — this is intentional and correct.

**All props:** `left`, `right`, `resizable?`, `defaultLeftWidth?`, `defaultRightWidth?`, `minLeftWidth?`, `minRightWidth?`, `leftWidth?`, `rightWidth?`, `leftHeader?`, `leftFooter?`, `rightHeader?`, `rightFooter?`, `showSeparator?`, `scrollable?`, `noPadding?`, `leftClassName?`, `rightClassName?`

### Page Layouts — ThreeColumnLayout

```tsx
import { ThreeColumnLayout } from "@/components/layouts/three-column-layout";

<ThreeColumnLayout
  left={<NavPanel />}
  content={<MainContent />}
  right={<PropertiesPanel />}
  defaultLeftWidth={20}
  defaultContentWidth={60}
  defaultRightWidth={20}
  resizable
/>;
```

### PageWithProperties (fixed right panel)

```tsx
import { PageWithProperties } from "@/components/layouts/page-with-properties";

<PageWithProperties
  content={<MainContent />}
  properties={<SidePanel />}
  propertiesWidth="320px" // default
/>;
```

### SplitLayout (simple, no resize)

```tsx
import { SplitLayout } from "@/components/layouts/split-layout";

<SplitLayout
  left={<List />}
  right={<Detail />}
  leftWidth="70%"
  rightWidth="30%"
/>;
```

### Page Layouts — CalendarLayout

```tsx
import { CalendarLayout } from "@/components/layouts/calendar-layout";

<PageShell>
  <PageHeader title="Schedule" />
  <div className="flex-1 overflow-hidden">
    <CalendarLayout
      sidebar={<CalendarSidebar />}
      calendar={<CalendarMonthView />}
      details={<CalendarDayDetails />}
      sidebarWidth="280px" // default; hidden on < lg
      detailsWidth="320px" // default; hidden on < xl
    />
  </div>
</PageShell>;
```

---

## 11. Page Sections

Structured content groups within a page. Replaces raw `div + h2` patterns.

```tsx
import { PageSection, PageSectionGrid } from "@/components/blocks/page-section"

// Titled section with divider
<PageSection title="Personal Information" description="Update your profile." divider>
  <ProfileForm />
</PageSection>

// With header action
<PageSection
  title="Team Members"
  divider
  actions={<Button size="sm"><Plus className="mr-2 size-4" />Invite</Button>}
>
  <TeamList />
</PageSection>

// With responsive grid
<PageSection title="Metrics">
  <PageSectionGrid cols={4}>
    <MetricCard ... />
    <MetricCard ... />
    <MetricCard ... />
    <MetricCard ... />
  </PageSectionGrid>
</PageSection>

// Settings page: multiple sections
<div className="space-y-12">
  <PageSection title="Profile" divider>...</PageSection>
  <PageSection title="Notifications" divider>...</PageSection>
  <PageSection title="Danger Zone" divider>...</PageSection>
</div>
```

**PageSection props:** `title?`, `description?`, `actions?`, `divider?` (below header), `topDivider?`, `spacing?` (`sm`/`default`/`lg`)  
**PageSectionGrid props:** `cols?` (1–6, responsive breakpoints built in)

---

# COMPONENTS

## 12. DataTable

### Client-Side (default)

```tsx
import { DataTable } from "@/components/blocks/data-table"
import { type ColumnDef } from "@tanstack/react-table"

type Patient = { id: string; name: string; mrn: string; status: string }

const columns: ColumnDef<Patient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "mrn",
    header: "MRN",
    cell: ({ row }) => <span className="roboto-mono text-sm tabular-nums">{row.getValue("mrn")}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
        Name <ArrowUpDown strokeWidth={ICON_STROKE_WIDTH} className="ml-2 size-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === "active" ? "default" : "outline"}>
        {row.getValue("status")}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Row actions">
            <MoreHorizontal strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

<DataTable
  data={patients}
  columns={columns}
  searchPlaceholder="Search patients..."
  searchColumn="name"
  filters={[{
    key: "status",
    label: "Status",
    options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }],
  }]}
  actions={<Button><Plus className="mr-2 size-4" />Add</Button>}
  enableSelection
  enableColumnVisibility
  enablePagination
  pageSizeOptions={[10, 20, 50]}
  emptyMessage="No patients found."
  isLoading={isLoading}
  onRowSelectionChange={(rows) => setSelectedRows(rows)}
/>
```

### Server-Side Pagination + Sorting

```tsx
import {
  useReactTable,
  getCoreRowModel,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";

const [sorting, setSorting] = React.useState<SortingState>([]);
const [pagination, setPagination] =
  React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

const { data, totalCount } = usePatients({
  page: pagination.pageIndex,
  pageSize: pagination.pageSize,
  sortBy: sorting[0]?.id,
  sortDir: sorting[0]?.desc ? "desc" : "asc",
});

const table = useReactTable({
  data: data ?? [],
  columns,
  manualPagination: true, // ← don't paginate client-side
  manualSorting: true, // ← don't sort client-side
  pageCount: Math.ceil(totalCount / pagination.pageSize),
  state: { sorting, pagination },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
});
```

---

## 13. FilterBar

For filtering card grids, lists, or any non-DataTable content.

```tsx
import { FilterBar } from "@/components/blocks/filter-bar"

const [search, setSearch] = React.useState("")
const [statusFilter, setStatusFilter] = React.useState<string[]>([])

<FilterBar
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search patients..."
  filters={[
    {
      key: "status",
      label: "Status",
      options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }],
      selected: statusFilter,
      onChange: setStatusFilter,
    },
  ]}
  onClearAll={() => { setSearch(""); setStatusFilter([]) }}
  actions={<Button variant="outline" size="sm"><LayoutGrid className="size-4" /></Button>}
/>
```

---

## 14. State Components — Loading, Empty, Error

### Decision tree

```
Is it a React component crash?
  → ErrorBoundary (class, wraps subtrees)
  → RouteErrorBoundary (for React Router errorElement)

Is it an API/HTTP error? (have a status code or type)
  → ApiError  ({ status: 404, type: "network" | "timeout" | "http" })

Is it a JS Error object from data fetching/parsing?
  → DataError  (variant: "inline" | "card" | "full-page")

Is it no-data / no-results / no-permission?
  → EmptyState  (variant: "no-data" | "no-results" | "no-permission")

Generic custom error (own icon, own message)?
  → ErrorState

Initial page/section loading?
  → LoadingState  (variant: "spinner" | "skeleton" | "dots")

Specific shape skeleton?
  → SkeletonLoader  (variant: "table" | "card" | "list" | "lines" | "avatar")

Form submitting / table reloading (content still visible)?
  → LoadingOverlay  (wraps children — has isLoading + children props)

API might be slow (> 3s)?
  → SlowApiHandler  (wraps content, shows amber warning after delay ms)

Operation might time out entirely?
  → TimeoutHandler  (replaces children with error card after timeout ms)
```

### State Components — Loading, Empty, Error — Usage

```tsx
// EmptyState
<EmptyState variant="no-data" title="No patients yet" description="Add your first patient." action={<Button>Add Patient</Button>} />
<EmptyState variant="no-results" title="No matches" description="Try different filters." action={<Button variant="outline">Clear</Button>} />
<EmptyState variant="no-permission" title="Access restricted" description="Contact your admin." />
<EmptyState variant="no-data" icon={CalendarOff} title="No appointments" />

// LoadingState
<LoadingState message="Loading patients..." variant="spinner" size="md" />
<LoadingState variant="skeleton" />   // size: "sm" | "md" | "lg"

// SkeletonLoader
<SkeletonLoader variant="table" />
<SkeletonLoader variant="card" />
<SkeletonLoader variant="list" lines={5} />

// LoadingOverlay — must wrap children
<LoadingOverlay isLoading={isSubmitting} message="Saving...">
  <FormContent />
</LoadingOverlay>

// ApiError
<ApiError error={{ status: 404, message: "Not found", type: "http" }} onRetry={refetch} />
<ApiError error={{ type: "network" }} onRetry={refetch} />

// DataError
<DataError error={fetchError} variant="inline" onRetry={refetch} />
<DataError error={fetchError} variant="card" onRetry={refetch} />
<DataError error={fetchError} variant="full-page" onRetry={refetch} />

// ErrorState
<ErrorState title="Failed to load records" description="Try again." actions={<Button onClick={retry}>Retry</Button>} />

// SlowApiHandler
<SlowApiHandler delay={3000} onSlowApi={() => logSlowApi()}>
  <DataComponent />
</SlowApiHandler>

// TimeoutHandler
<TimeoutHandler timeout={10000} onTimeout={() => logTimeout()} onRetry={() => refetch()}>
  <DataComponent />
</TimeoutHandler>

// ErrorBoundary
<ErrorBoundary onError={(err, info) => logError(err, info)}>
  <RiskyComponent />
</ErrorBoundary>

// RouteErrorBoundary — in router only
{ element: <AppShell />, errorElement: <RouteErrorBoundary />, children: [...] }
```

---

## 15. ConfirmDialog

```tsx
import { ConfirmDialog } from "@/components/blocks/confirm-dialog"

// Destructive
<ConfirmDialog
  trigger={<Button variant="destructive">Delete Patient</Button>}
  title="Delete Patient"
  description="This action cannot be undone. All records will be permanently deleted."
  confirmLabel="Delete"
  variant="destructive"
  onConfirm={async () => {
    await deletePatient(patient.id)
    navigate("/patients")
  }}
/>

// Non-destructive
<ConfirmDialog
  trigger={<Button>Submit for Review</Button>}
  title="Submit Order"
  description="Once submitted, the order will be sent immediately."
  confirmLabel="Submit"
  variant="default"
  onConfirm={handleSubmit}
/>
```

**Props:** `trigger`, `title?`, `description?`, `confirmLabel?`, `cancelLabel?`, `variant?` (`"destructive"` | `"default"`), `icon?`, `onConfirm`, `onCancel?`, `isLoading?`, `open?`, `onOpenChange?`

---

## 16. StatList — Key/Value Display

Use for: detail panels, record views, entity summaries. Do NOT use a table for label/value pairs.

```tsx
import { StatList, StatItem, StatSeparator } from "@/components/blocks/stat-list"

// Basic
<StatList>
  <StatItem label="Patient ID" value="P-00123" />
  <StatItem label="Date of Birth" value="Jan 12, 1985" />
  <StatItem label="MRN" value="MRN-456789" copyable />
</StatList>

// Rich values (children)
<StatList>
  <StatItem label="Status"><Badge variant="default">Active</Badge></StatItem>
  <StatItem label="Assigned To"><AvatarGroup avatars={staff} size="sm" /></StatItem>
  <StatSeparator label="Contact" />
  <StatItem label="Email" value="john@example.com" copyable />
</StatList>

// Loading skeleton
<StatList isLoading={isLoading} skeletonRows={5} />

// Variants
<StatList variant="default" />   // divider lines
<StatList variant="spaced" />    // more breathing room
<StatList variant="flush" />     // no lines
```

---

## 17. Stepper

```tsx
import { Stepper, StepperContent } from "@/components/blocks/stepper"

const steps = [
  { id: "info", label: "Patient Info", description: "Basic details" },
  { id: "samples", label: "Samples", description: "Collection details" },
  { id: "review", label: "Review", description: "Confirm and submit" },
]
const [currentStep, setCurrentStep] = React.useState(0)

// Horizontal (default)
<Stepper steps={steps} currentStep={currentStep} />

// Vertical
<Stepper steps={steps} currentStep={currentStep} orientation="vertical" />

// Step content (only active step renders)
<StepperContent step={0} currentStep={currentStep}><PatientInfoForm /></StepperContent>
<StepperContent step={1} currentStep={currentStep}><SampleForm /></StepperContent>
<StepperContent step={2} currentStep={currentStep}><ReviewPanel /></StepperContent>

// Navigation
<div className="flex justify-between mt-8">
  <Button variant="outline" onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}>
    Back
  </Button>
  <Button onClick={() => currentStep < steps.length - 1 ? setCurrentStep(s => s + 1) : handleSubmit()}>
    {currentStep === steps.length - 1 ? "Submit" : "Next"}
  </Button>
</div>
```

---

## 18. AvatarGroup

```tsx
import { AvatarGroup } from "@/components/blocks/avatar-group";

<AvatarGroup
  avatars={[
    { id: 1, name: "Sarah Chen", src: "/avatars/sarah.jpg" },
    { id: 2, name: "Mark Johnson" }, // no src → initials fallback
    { id: 3, name: "Alex Rivera" },
    { id: 4, name: "Priya Patel" },
    { id: 5, name: "Omar Hassan" },
  ]}
  max={3} // shows 3 avatars + "+2" overflow badge
  size="md" // "sm" | "md" | "lg"
  showTooltips // name tooltip on hover (default: true)
/>;
```

---

## 19. Timeline

```tsx
import { Timeline, type TimelineItemData } from "@/components/blocks/timeline"

const events: TimelineItemData[] = [
  {
    id: 1,
    title: "Sample collected",
    description: "Blood draw completed by Dr. Chen",
    timestamp: new Date("2026-02-23T10:30:00"),
    iconColor: "success",
    user: { name: "Dr. Sarah Chen" },
  },
  {
    id: 2,
    title: "Request sent to lab",
    timestamp: "2026-02-23T09:15",
    iconColor: "primary",
    content: <Badge variant="outline">Lab A</Badge>,
  },
]

<Timeline items={events} />
<Timeline items={events} variant="compact" />
<Timeline items={events} isLoading={isLoading} skeletonRows={4} />
```

**iconColor:** `"default"` | `"primary"` | `"success"` | `"warning"` | `"destructive"`

---

## 20. Form Components

### Label + Input (simple)

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="m@example.com" />
</div>
```

### Field system (structured forms with validation)

```tsx
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet } from "@/components/ui/field"

// Vertical field
<Field>
  <FieldLabel>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" aria-invalid={!!errors.email} />
  </FieldLabel>
  <FieldDescription>We'll never share your email.</FieldDescription>
  <FieldError errors={[errors.email]} />
</Field>

// Horizontal toggle
<Field orientation="horizontal">
  <FieldTitle>Email notifications</FieldTitle>
  <Switch />
</Field>

// Grouped fields
<FieldGroup>
  <Field>...</Field>
  <Field>...</Field>
</FieldGroup>
```

### Form validation (react-hook-form + zod)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
});

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        <FieldError errors={[errors.name]} />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
```

### Form controls quick reference

```tsx
<Textarea />                           // multi-line text
<Select>...</Select>                   // 4+ enum options
<RadioGroup>...</RadioGroup>           // 2–4 exclusive options visible at once
<Switch />                             // boolean on/off settings
<Checkbox />                           // explicit agreement (terms/conditions)
<Combobox />                           // searchable list 10+ options
<InputOTP />                           // 4–8 char verification codes
<Slider />                             // range values
<NativeSelect />                       // native HTML select (mobile-friendly)
```

---

## 21. Toast Notifications

Mount `<Toaster />` once in `App.tsx`, use `toast()` from `sonner` anywhere.

```tsx
import { toast } from "sonner";

toast.success("Patient saved successfully");
toast.error("Failed to save", {
  description: "Please try again.",
});
toast.info("Update available");
toast.warning("Session expiring in 5 minutes");

// Loading → resolve
const id = toast.loading("Saving patient...");
toast.dismiss(id);
toast.success("Saved!");

// Promise pattern (recommended for async actions)
toast.promise(savePatient(data), {
  loading: "Saving patient...",
  success: "Patient saved successfully",
  error: "Failed to save patient",
});
```

---

## 22. Sheet, Dialog, Drawer

```tsx
// Sheet — slide-in panel (forms, detail views)
<Sheet>
  <SheetTrigger asChild><Button>Open Panel</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit Patient</SheetTitle>
      <SheetDescription>Make changes to patient details.</SheetDescription>
    </SheetHeader>
    <div className="py-4">{/* form */}</div>
    <SheetFooter>
      <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>

// Dialog — centered modal
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Drawer — bottom sheet (mobile-friendly)
<Drawer>
  <DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader><DrawerTitle>Title</DrawerTitle></DrawerHeader>
    {/* content */}
  </DrawerContent>
</Drawer>
```

---

## 23. Charts

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
}

<ChartContainer config={chartConfig} className="h-64 w-full">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <YAxis tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
  </BarChart>
</ChartContainer>
```

Chart colors: `var(--chart-1)` through `var(--chart-5)` — never use hardcoded colors.

---

## 24. MetricCard

```tsx
import { MetricCard } from "@/components/blocks/metric-card"

// Default (with footer description)
<MetricCard title="Total Revenue" value="$45,231" change="+12.5%" trend="up" icon={DollarSign} description="Last 30 days" />

// Compact (header + value only)
<MetricCard variant="compact" title="Active Users" value="2,350" change="+8.2%" trend="up" icon={Users} />

// In a PageSectionGrid
<PageSectionGrid cols={4}>
  <MetricCard ... />
  <MetricCard ... />
  <MetricCard ... />
  <MetricCard ... />
</PageSectionGrid>
```

---

## 25. Calendar Blocks

```tsx
import { CalendarMonthView } from "@/components/blocks/calendar-month-view"
import { CalendarWeekView } from "@/components/blocks/calendar-week-view"
import { CalendarDayDetails } from "@/components/blocks/calendar-day-details"
import { CalendarSidebar } from "@/components/blocks/calendar-sidebar"

// CalendarEvent shape:
// { id, title, date: Date, startTime?: "14:00", endTime?: "15:00",
//   color?: "red"|"green"|"blue"|"orange"|"purple"|"teal",
//   allDay?, location?, attendees?, description? }

const [selectedDate, setSelectedDate] = React.useState(new Date())

<CalendarLayout
  sidebar={<CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} accounts={accounts} />}
  calendar={<CalendarMonthView selectedDate={selectedDate} events={events} onDateSelect={setSelectedDate} onMonthChange={fetchEventsForMonth} />}
  details={<CalendarDayDetails selectedDate={selectedDate} events={events} onCreateEvent={() => setCreating(true)} />}
/>
```

---

## 26. Auth Blocks

```tsx
import { LoginForm } from "@/components/blocks/login-form"
import { PasswordResetForm } from "@/components/blocks/password-reset-form"

<LoginForm
  onLogin={(email, password) => handleLogin(email, password)}
  onGoogleLogin={() => handleGoogleLogin()}
  showSignupLink signupLink="/signup"
  showForgotPassword forgotPasswordLink="/forgot-password"
/>

<PasswordResetForm
  onReset={(email) => handleReset(email)}
  showLoginLink loginLink="/login"
  isLoading={isResetting}
/>
```

---

## 27. Item Lists

For non-tabular list content with icon/title/description:

```tsx
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";

<ItemGroup>
  {items.map((item) => (
    <Item key={item.id} variant="outline" size="default">
      <ItemMedia variant="icon">
        <FileText
          strokeWidth={ICON_STROKE_WIDTH}
          className="size-4"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{item.name}</ItemTitle>
        <ItemDescription>{item.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="secondary">{item.status}</Badge>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="More actions"
        >
          <MoreHorizontal
            strokeWidth={ICON_STROKE_WIDTH}
            className="size-4"
          />
        </Button>
      </ItemActions>
    </Item>
  ))}
</ItemGroup>;
```

**Item variants:** `default` | `outline` | `muted`  
**Item sizes:** `default` | `sm` | `xs`

---

## 28. Tabs, Badges, Buttons, Icons, Kbd

### Tabs

```tsx
// Pill (default) — inside cards/sections
<Tabs defaultValue="details">
  <TabsList>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="history">History</TabsTrigger>
  </TabsList>
  <TabsContent value="details">...</TabsContent>
</Tabs>

// Line — page-level (used inside PageHeaderWithTabs / PageTabs)
<TabsList variant="line">
  <TabsTrigger value="all">All</TabsTrigger>
  <TabsTrigger value="active">Active</TabsTrigger>
</TabsList>
```

### Badges

```
variant="default"      Active, positive: "Active", "Live", "Assigned"
variant="secondary"    Neutral type: "Admin", "Inpatient", "Lab A"
variant="outline"      Inactive, pending: "Inactive", "Draft", "Pending"
variant="destructive"  Error, urgent: "Failed", "Urgent", "Blocked"
variant="ghost"        Very subtle background label
```

### Buttons

```
variant="default"     One primary per toolbar
variant="outline"     Secondary action, export
variant="secondary"   Tertiary, low emphasis
variant="ghost"       Icon-only toolbar buttons, row actions
variant="destructive" Destructive (always wrap in ConfirmDialog)
variant="link"        Inline links, auth form links

size="default"  h-8   Most buttons
size="sm"       h-7   Dense contexts
size="lg"       h-9   Primary CTA, empty state actions
size="xs"       h-6   Very compact, inline
size="icon"           Square icon button h-8 w-8
size="icon-sm"        h-7 w-7
size="icon-xs"        h-6 w-6 (input group addons)
```

### Kbd

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"

<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>

// In tooltip (dark styling applies automatically)
<TooltipContent>Search <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup></TooltipContent>
```

---

## 29. ButtonGroup & InputGroup

```tsx
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"

// Attached button strip
<ButtonGroup>
  <Button variant="outline">Day</Button>
  <Button variant="outline">Week</Button>
  <Button>Month</Button>
</ButtonGroup>

// With label
<ButtonGroup>
  <ButtonGroupText>Sort by</ButtonGroupText>
  <Button variant="outline">Name</Button>
  <Button variant="outline">Date</Button>
</ButtonGroup>
```

```tsx
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"

// Icon prefix
<InputGroup>
  <InputGroupAddon align="inline-start"><Search className="size-4 text-muted-foreground" /></InputGroupAddon>
  <Input placeholder="Search..." />
</InputGroup>

// Text prefix
<InputGroup>
  <InputGroupAddon align="inline-start">https://</InputGroupAddon>
  <Input placeholder="yoursite.com" />
</InputGroup>
```

---

## 30. ThemeToggle & useIsMobile

```tsx
import { ThemeToggle } from "@/components/theme-toggle";
// Drop-in toggle (light / dark / system) — already in GlobalHeader

import { useIsMobile } from "@/hooks/use-mobile";
const isMobile = useIsMobile(); // boolean, breakpoint: 768px
```

---

## 31. Navigation Utilities

```tsx
import {
  generateBreadcrumbs,
  isActiveRoute,
  buildPath,
} from "@/lib/navigation";

generateBreadcrumbs("/patients/123/details");
// → [{ label: "Home", href: "/" }, { label: "Patients", href: "/patients" },
//    { label: "123", href: "/patients/123" }, { label: "Details" }]

isActiveRoute("/dashboard/settings", "/dashboard"); // true (prefix)
isActiveRoute("/dashboard/settings", "/dashboard", true); // false (exact)

buildPath("patients", patientId, "reports", reportId); // "/patients/123/reports/456"
```

---

## 32. Page Templates

```tsx
import {
  LoginPage, SignupPage, PasswordResetPage,
  NotFoundPage, ServerErrorPage, MaintenancePage,
  LandingPage, DashboardHomePage,
} from "@/pages/templates"

<LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogle} signupLink="/signup" />
<SignupPage onSignup={handleSignup} loginLink="/login" />
<PasswordResetPage onReset={handleReset} loginLink="/login" />

<NotFoundPage homeButton={{ href: "/", label: "Go Home" }} showBackButton />
<ServerErrorPage onRetry={() => location.reload()} homeButton={{ href: "/" }} />
<MaintenancePage estimatedTime="2 hours" statusPageUrl="https://status.example.com" />

<LandingPage companyName="Acme" tagline="Build faster" loginLink="/login" signupLink="/signup" />
<DashboardHomePage user={{ name: "Jane", role: "admin" }} metrics={metrics} onNavigate={navigate} />
```

**Reference/demo templates** (in `src/pages/templates/`): `CalendarPage`, `ChartsPage`, `FormsPage`, `CardsPage`, `SettingsPage`, `ComponentsPage`, `LayoutsPage`, `ThemesPage`, `TraysPage`, `EdgeCasesDemoPage`

---

# ARCHITECTURE

## 33. Architecture Patterns

### Choose by scale

| Scale      | Pages  | Architecture                                           |
| ---------- | ------ | ------------------------------------------------------ |
| Small      | 1–5    | Simple (flat `pages/`)                                 |
| Medium     | 5–20   | Feature-Based (`features/auth/`, `features/patients/`) |
| Large      | 20–100 | Module-Based with RBAC                                 |
| Enterprise | 50+    | Domain-Driven Design                                   |

### Feature-Based structure (recommended default)

```
src/
├─ components/          # shared only (ui/, blocks/, layouts/, patterns/)
├─ features/
│  └─ patients/
│     ├─ components/    # patients-only components
│     ├─ hooks/
│     ├─ services/      # patients.service.ts
│     ├─ pages/
│     ├─ routes.tsx
│     └─ types.ts
├─ shared/
│  ├─ api/client.ts
│  └─ hooks/
└─ main.tsx
```

### Component placement rule

```
shadcn primitive?         → components/ui/
Reusable block/section?   → components/blocks/
Multiple blocks composed? → components/patterns/
Page layout wrapper?      → components/layouts/
Feature-specific only?    → features/[name]/components/
Full page/route?          → features/[name]/pages/
Shared between features?  → shared/hooks/ or shared/utils/
```

---

---

# PRIMITIVE COMPONENTS

> All shadcn/ui primitives and utility components. Each section covers: variants, implementation example, props, and checklist.

---

## 34. Button

`@/components/ui/button`

### Button — Variants

```tsx
// Variants: default, outline, secondary, ghost, destructive, link
<Button variant="default">Save</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link Text</Button>

// Sizes: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg
<Button size="default">Normal</Button>
<Button size="sm">Small</Button>
<Button size="xs">Extra Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><ChevronRight strokeWidth={2} /></Button>
<Button size="icon-sm"><ChevronRight strokeWidth={2} /></Button>
```

### Button — Implementation

```tsx
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function ButtonDemo() {
  return (
    <div className="flex gap-2">
      <Button onClick={() => console.log("clicked")}>
        Action Button
      </Button>
      <Button disabled>Disabled</Button>
      <Button size="icon">
        <ChevronRight strokeWidth={2} className="size-4" />
      </Button>
    </div>
  );
}
```

### Button — Props

```tsx
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  asChild?: boolean;
}
```

### Button — Checklist

```
☐ Use semantic variant for intent (destructive for delete actions, link for secondary navigation)
☐ Pair icon with text when possible (icon-only used with clear iconography)
☐ disabled={true} prevents interaction and lowers opacity automatically
☐ Icon buttons always receive explicit size props
☐ Lucide icons use strokeWidth={2} — pass via constant ICON_STROKE_WIDTH
☐ Button text is action-oriented ("Save", "Delete", not "OK", "Submit")
☐ Focus styles are automatic via focus-visible ring
```

---

## 35. Badge

`@/components/ui/badge`

### Badge — Variants

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>
<Badge variant="link">Link</Badge>

// With icon
<Badge variant="destructive">
  <XIcon className="size-3" />
  Close
</Badge>
```

### Badge — Implementation

```tsx
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

export function BadgeDemo() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge>Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">
        <XIcon className="size-3" />
        Failed
      </Badge>
      <Badge variant="outline" asChild>
        <a href="/tag/new">New Tag</a>
      </Badge>
    </div>
  );
}
```

### Badge — Props

```tsx
interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  asChild?: boolean;
}
```

### Badge — Checklist

```
☐ Badge text is concise (1-3 words, "Active", not "Currently Active")
☐ Status badges use semantic variants (destructive for error/failed)
☐ Dismissible badges include icon button inside
☐ asChild enables wrapping as links or buttons
☐ Do not nest badge inside another interactive element unless using asChild
☐ Badges with icons keep icon size at size-3
```

---

## 36. Separator

`@/components/ui/separator`

### Separator — Usage

```tsx
import { Separator } from "@/components/ui/separator";

export function SeparatorDemo() {
  return (
    <div className="w-full">
      <h2 className="text-base font-semibold">Section One</h2>
      <Separator className="my-4" />
      <h2 className="text-base font-semibold">Section Two</h2>
    </div>
  );
}
```

### Separator — Props

```tsx
interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}
```

### Separator — Checklist

```
☐ Horizontal separator (default) divides sections vertically
☐ Vertical separator used in button groups or inline layouts
☐ decorative={true} when purely visual (no semantic meaning)
☐ Apply custom margins (my-4, my-6) to control spacing around separator
☐ Separator color is border-border (respects theme automatically)
```

---

## 37. Skeleton

`@/components/ui/skeleton`

### Skeleton — Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  );
}

// Skeleton card
function SkeletonCard() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <Skeleton className="h-3 w-full rounded" />
    </div>
  );
}
```

### Skeleton — Checklist

```
☐ Skeleton height matches the expected content (h-4 for text, h-8 for inputs)
☐ Width set to w-full or specific width (w-3/4, w-2/3)
☐ Rounded applied for visual consistency
☐ Multiple skeletons stacked with space-y-* for layout preview
☐ Duration of animation is 2 seconds (built-in)
```

---

## 38. Spinner

`@/components/ui/spinner`

### Spinner — Usage

```tsx
import { Spinner } from "@/components/ui/spinner";

export function SpinnerDemo() {
  return (
    <div className="flex gap-4">
      <Spinner />
      <Spinner className="size-6" />
      <Spinner className="size-8 text-primary" />
    </div>
  );
}
```

### Spinner — Props

```tsx
interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement> {
  // Inherits all SVG props
}
```

### Spinner — Checklist

```
☐ Default size is size-4
☐ size-6 or size-8 for loading states
☐ Spinner color inherits from text color (text-primary by default)
☐ Use inside LoadingState block (not standalone in most cases)
☐ Paired with message text for UX context
```

---

# FORM & INPUT

## 39. Input

`@/components/ui/input`

### Input — Usage

```tsx
import { Input } from "@/components/ui/input";

export function InputDemo() {
  return (
    <div className="space-y-2">
      <Input placeholder="Enter text..." />
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      <Input disabled placeholder="Disabled input" />
      <Input aria-invalid="true" placeholder="Invalid state" />
    </div>
  );
}
```

### Input — Props

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Standard HTML input attributes
  type?: string
  placeholder?: string
  disabled?: boolean
  aria-invalid?: boolean
}
```

### Input — Checklist

```
☐ Height is h-8 (always)
☐ Placeholder text is light and descriptive
☐ type attribute set correctly (email, password, number, date, etc.)
☐ aria-invalid paired with validation error message
☐ Never use Input directly — always wrap in Field for labels
☐ Border and focus styles are automatic via semantic tokens
```

---

## 40. Textarea

`@/components/ui/textarea`

### Textarea — Usage

```tsx
import { Textarea } from "@/components/ui/textarea";

export function TextareaDemo() {
  return (
    <div className="space-y-2">
      <Textarea placeholder="Enter your message..." />
      <Textarea placeholder="Comments" rows={5} />
      <Textarea disabled placeholder="Disabled textarea" />
      <Textarea aria-invalid="true" placeholder="Error state" />
    </div>
  );
}
```

### Textarea — Props

```tsx
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number
  disabled?: boolean
  aria-invalid?: boolean
}
```

### Textarea — Checklist

```
☐ rows attribute defines default height (3-5 typical)
☐ Resize handles are enabled by default (resize-vertical)
☐ Placeholder text is clear and guides expected input
☐ Wrap in Field with label — do not use standalone
☐ aria-invalid paired with validation messaging
☐ Focus and border styles automatic via semantic tokens
```

---

## 41. Label

`@/components/ui/label`

### Label — Usage

```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function LabelDemo() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" placeholder="you@example.com" />
    </div>
  );
}
```

### Label — Props

```tsx
interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}
```

### Label — Checklist

```
☐ htmlFor attribute always matches input id
☐ Label text is concise and action-oriented
☐ Label is always explicitly associated (not placeholder text)
☐ Use Field component instead of standalone Label + Input
☐ Text color and size are automatic (text-sm)
```

---

## 42. Field

`@/components/ui/field`

### Field — Components

- **FieldSet** — Container for grouped form inputs
- **FieldGroup** — Wrapper for input + label + help text
- **FieldLegend** — Label or legend text for fieldsets
- **FieldDescription** — Helper text below input
- **FieldError** — Error message display

### Field — Usage

```tsx
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FieldDemo() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  return (
    <Field>
      <FieldGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={!!error}
        />
        <FieldDescription>
          3-20 characters, letters and numbers only
        </FieldDescription>
        {error && <FieldError>{error}</FieldError>}
      </FieldGroup>
    </Field>
  );
}

// Grouped checkboxes
function CheckboxFieldDemo() {
  return (
    <FieldSet>
      <FieldLegend>Permissions</FieldLegend>
      <FieldGroup>
        <Checkbox id="read" />
        <Label htmlFor="read">Read</Label>
      </FieldGroup>
      <FieldGroup>
        <Checkbox id="write" />
        <Label htmlFor="write">Write</Label>
      </FieldGroup>
    </FieldSet>
  );
}
```

### Field — Props

```tsx
// FieldSet
interface FieldSetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {}

// FieldGroup
interface FieldGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// FieldLegend
interface FieldLegendProps
  extends React.LegendHTMLAttributes<HTMLLegendElement> {
  variant?: "legend" | "label";
}

// FieldDescription
interface FieldDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

// FieldError
interface FieldErrorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  role?: "alert";
}
```

### Field — Checklist

```
☐ FieldSet wraps groups of related inputs (checkboxes, radios)
☐ FieldLegend provides semantic heading for fieldset
☐ FieldGroup wraps input + label (not used for checkboxes/radios)
☐ FieldDescription always provided for complex inputs
☐ FieldError displayed only when validation fails
☐ aria-invalid on input paired with FieldError display
☐ Label htmlFor always matches input id
```

---

## 43. Checkbox

`@/components/ui/checkbox`

### Checkbox — Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id="agree"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Label htmlFor="agree">I agree to the terms</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled checkbox</Label>
      </div>
    </div>
  );
}
```

### Checkbox — Props

```tsx
interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (
    checked: boolean | "indeterminate",
  ) => void;
}
```

### Checkbox — Checklist

```
☐ Checkbox size is always size-4
☐ Paired with Label via htmlFor
☐ checked and onCheckedChange form controlled pair
☐ Indeterminate state used for "select all" scenarios
☐ Used in groups under FieldSet with FieldLegend
☐ Focus ring is automatic
☐ Disabled state lowers opacity and removes pointer events
```

---

## 44. Radio Group

`@/components/ui/radio-group`

### Radio Group — Usage

```tsx
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="opt1" />
        <Label htmlFor="opt1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="opt2" />
        <Label htmlFor="opt2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="opt3" disabled />
        <Label htmlFor="opt3">Option 3 (disabled)</Label>
      </div>
    </RadioGroup>
  );
}
```

### Radio Group — Props

```tsx
// RadioGroup
interface RadioGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

// RadioGroupItem
interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}
```

### Radio Group — Checklist

```
☐ RadioGroup wraps all RadioGroupItem elements
☐ defaultValue or value (for controlled) set on RadioGroup, not item
☐ Each RadioGroupItem has unique value prop
☐ Paired with Label via htmlFor matching RadioGroupItem id
☐ Only one option can be selected at a time
☐ Used in FieldSet with FieldLegend
☐ Disabled disables entire group or individual items
```

---

## 45. Switch

`@/components/ui/switch`

### Switch — Usage

```tsx
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SwitchDemo() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Switch
          id="notifications"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <Label htmlFor="notifications">
          Enable notifications
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled">Disabled toggle</Label>
      </div>
    </div>
  );
}
```

### Switch — Props

```tsx
interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}
```

### Switch — Checklist

```
☐ Switch used for binary on/off settings (not multi-option selection)
☐ checked and onCheckedChange form controlled pair
☐ Paired with Label
☐ Accessible thumb animation (50ms transition)
☐ Disabled state grayed and non-interactive
☐ Aria attributes automatic via Radix
```

---

## 46. Select

`@/components/ui/select`

### Select — Components

- **Select** — Container
- **SelectGroup** — Option grouping
- **SelectValue** — Display area for selected value
- **SelectTrigger** — Clickable button
- **SelectContent** — Dropdown container
- **SelectItem** — Individual option
- **SelectSeparator** — Divider between groups

### Select — Usage

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";

export function SelectDemo() {
  return (
    <Select defaultValue="apple">
      <SelectTrigger>
        <SelectValue placeholder="Select a fruit..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="lettuce">Lettuce</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

### Select — Props

```tsx
// Select
interface SelectProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

// SelectTrigger
interface SelectTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

// SelectItem
interface SelectItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}
```

### Select — Checklist

```
☐ SelectTrigger is the clickable button (h-8, full width expected)
☐ SelectValue shows selected text or placeholder
☐ SelectContent contains all SelectItem elements
☐ SelectItem value must be unique and provided
☐ SelectGroup + SelectLabel used to organize options
☐ SelectSeparator used between groups
☐ onValueChange receives string value, not event
☐ defaultValue or value (controlled) set on Select, not trigger
```

---

## 47. Native Select

`@/components/ui/native-select`

### Native Select — Usage

```tsx
import { NativeSelect } from "@/components/ui/native-select";

export function NativeSelectDemo() {
  return (
    <NativeSelect>
      <option value="">Choose an option...</option>
      <optgroup label="Group 1">
        <option value="opt-1">Option 1</option>
        <option value="opt-2">Option 2</option>
      </optgroup>
      <optgroup label="Group 2">
        <option value="opt-3">Option 3</option>
        <option value="opt-4">Option 4</option>
      </optgroup>
    </NativeSelect>
  );
}
```

### Native Select — Checklist

```
☐ Uses native <select> element (better mobile support)
☐ Wrap in Field with Label
☐ optgroup used for option grouping
☐ First option can be empty placeholder
☐ Simpler than shadcn/ui Select for simple lists
☐ Native browser styling applied on mobile
```

---

## 48. Combobox

`@/components/ui/combobox`

### Combobox — Usage

```tsx
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxInput,
} from "@/components/ui/combobox";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
];

export function ComboboxDemo() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Combobox
      open={open}
      onOpenChange={setOpen}
      value={value}
      onValueChange={setValue}
    >
      <ComboboxInput placeholder="Search fruits..." />
      <ComboboxContent>
        {options.map((option) => (
          <ComboboxItem key={option.value} value={option.value}>
            {option.label}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  );
}
```

### Combobox — Props

```tsx
// Combobox
interface ComboboxProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
}

// ComboboxInput
interface ComboboxInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// ComboboxItem
interface ComboboxItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
```

### Combobox — Checklist

```
☐ Combobox combines input with searchable dropdown
☐ ComboboxInput used for user typing/filtering
☐ ComboboxContent holds filtered ComboboxItem list
☐ Value controlled via open/onOpenChange and value/onValueChange
☐ Filtering logic implemented in parent component
☐ Used for searchable lists (not simple select)
☐ Keyboard navigation automatic (arrow keys, Enter)
```

---

## 49. Input Group

`@/components/ui/input-group`

### Input Group — Components

- **InputGroup** — Container
- **InputGroupAddon** — Prefix/suffix element (icon, text, button)

### Input Group — Usage

```tsx
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { SearchIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InputGroupDemo() {
  return (
    <div className="space-y-4">
      {/* Prefix icon */}
      <InputGroup align="inline-start">
        <InputGroupAddon>
          <SearchIcon className="size-4" />
        </InputGroupAddon>
        <Input placeholder="Search..." />
      </InputGroup>

      {/* Suffix button */}
      <InputGroup align="inline-end">
        <Input placeholder="Copy me" />
        <InputGroupAddon>
          <Button size="sm" variant="ghost">
            <CopyIcon className="size-4" />
          </Button>
        </InputGroupAddon>
      </InputGroup>

      {/* Top label addon */}
      <InputGroup align="block-start">
        <InputGroupAddon>Price (USD)</InputGroupAddon>
        <Input type="number" placeholder="0.00" />
      </InputGroup>
    </div>
  );
}
```

### Input Group — Props

```tsx
// InputGroup
interface InputGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// InputGroupAddon
interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?:
    | "inline-start"
    | "inline-end"
    | "block-start"
    | "block-end";
}
```

### Input Group — Checklist

```
☐ InputGroup is a flex container wrapping Input + addons
☐ align="inline-start" for left-side addons (search icons, prefixes)
☐ align="inline-end" for right-side addons (copy buttons, units)
☐ align="block-start" for top addon (label above input)
☐ align="block-end" for bottom addon (helper text below input)
☐ Input inside InputGroup does not need its own border
☐ Addon content can be icon, text, or button
☐ Never use InputGroup directly in Field — Field handles it
```

---

## 50. Input OTP

`@/components/ui/input-otp`

### Input OTP — Usage

```tsx
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export function InputOTPDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2">
      <label htmlFor="otp">Enter OTP (6 digits)</label>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
        id="otp"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
```

### Input OTP — Props

```tsx
// InputOTP
interface InputOTPProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
}

// InputOTPSlot
interface InputOTPSlotProps {
  index: number;
}
```

### Input OTP — Checklist

```
☐ maxLength is required (4-8 typical for OTP)
☐ value and onChange form controlled pair
☐ InputOTPGroup containers separate visual slots
☐ InputOTPSeparator used between groups (optional)
☐ Each InputOTPSlot has index prop (0-based)
☐ Numberic input only (controlled via maxLength)
☐ Auto-advances to next slot on input
☐ Tab and arrow keys for navigation
```

---

## 51. Slider

`@/components/ui/slider`

### Slider — Usage

```tsx
import { Slider } from "@/components/ui/slider";

export function SliderDemo() {
  const [value, setValue] = useState([50]);

  return (
    <div className="space-y-4">
      {/* Single value */}
      <div className="w-full space-y-2">
        <label>Volume: {value[0]}%</label>
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
        />
      </div>

      {/* Range slider */}
      <div className="w-full space-y-2">
        <label>
          Price Range: ${value[0]} - ${value[1]}
        </label>
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={1000}
          step={50}
        />
      </div>
    </div>
  );
}
```

### Slider — Props

```tsx
interface SliderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}
```

### Slider — Checklist

```
☐ value is array (single or multiple values for range)
☐ min and max define slider bounds
☐ step controls increment precision
☐ onValueChange receives array of numbers
☐ Range slider supports 2+ values
☐ Disabled state grayed and non-interactive
☐ Keyboard navigation: arrow keys, Home, End
```

---

# CONTAINERS & LAYOUT

## 52. Card

`@/components/ui/card`

### Card — Components

- **Card** — Container
- **CardHeader** — Top section (title, description)
- **CardTitle** — Main heading
- **CardDescription** — Subtitle
- **CardContent** — Main content area
- **CardFooter** — Bottom section (actions, metadata)

### Card — Usage

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CardDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          Card description goes here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content area</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}
```

### Card — Props

```tsx
// Card
interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// CardHeader
interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// CardTitle
interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

// CardDescription
interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

// CardContent
interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// CardFooter
interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}
```

### Card — Checklist

```
☐ Card is semantic container with border and padding
☐ CardHeader always includes CardTitle
☐ CardTitle is h3 level (use text-base font-semibold)
☐ CardDescription kept to 1 sentence
☐ CardContent for main content
☐ CardFooter for buttons, links, metadata
☐ Border color uses border-border (respects theme)
☐ Background uses bg-card (respects theme)
```

---

## 53. Scroll Area

`@/components/ui/scroll-area`

### Scroll Area — Components

- **ScrollArea** — Container
- **ScrollAreaViewport** — Content area
- **ScrollAreaScrollbar** — Scrollbar track
- **ScrollAreaThumb** — Scrollbar thumb

### Scroll Area — Usage

```tsx
import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@/components/ui/scroll-area";

export function ScrollAreaDemo() {
  const items = Array.from({ length: 50 }).map(
    (_, i) => `Item ${i + 1}`,
  );

  return (
    <ScrollArea className="h-64 w-48 border rounded">
      <div className="p-4">
        <h4 className="text-sm font-semibold mb-4">Tags</h4>
        {items.map((item) => (
          <div key={item} className="text-sm py-1">
            {item}
          </div>
        ))}
      </div>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
}
```

### Scroll Area — Checklist

```
☐ ScrollArea wraps overflowing content
☐ Explicit height (h-64, h-80) required
☐ ScrollAreaViewport optional (used for direct control)
☐ ScrollAreaScrollbar shows vertical or horizontal
☐ ScrollAreaThumb is the draggable handle
☐ Scrollbar hidden on desktop, visible when hovering
☐ Mobile: native scrolling
```

---

## 54. Aspect Ratio

`@/components/ui/aspect-ratio`

### Aspect Ratio — Usage

```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function AspectRatioDemo() {
  return (
    <div className="space-y-4">
      {/* 16:9 video */}
      <AspectRatio ratio={16 / 9}>
        <img
          src="video-thumbnail.jpg"
          alt="Video"
          className="h-full w-full object-cover"
        />
      </AspectRatio>

      {/* 1:1 square */}
      <AspectRatio ratio={1 / 1}>
        <img
          src="profile.jpg"
          alt="Profile"
          className="h-full w-full object-cover rounded-lg"
        />
      </AspectRatio>

      {/* Custom ratio */}
      <AspectRatio ratio={3 / 2}>
        <div className="bg-muted flex items-center justify-center">
          <span>3:2 Aspect Ratio</span>
        </div>
      </AspectRatio>
    </div>
  );
}
```

### Aspect Ratio — Props

```tsx
interface AspectRatioProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number; // width / height (default: 1)
}
```

### Aspect Ratio — Checklist

```
☐ ratio prop is width / height (16/9, 1/1, 3/2)
☐ Children scale to fill container maintaining ratio
☐ Use object-cover on images to prevent distortion
☐ Container width set by parent (w-full, w-80)
```

---

## 55. Resizable

`@/components/ui/resizable`

### Resizable — Components

- **ResizablePanelGroup** — Container
- **ResizablePanel** — Draggable panel
- **ResizableHandle** — Divider between panels

### Resizable — Usage

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export function ResizableDemo() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full"
    >
      <ResizablePanel defaultSize={25}>
        <div className="p-4 bg-muted">
          <h4>Left Panel</h4>
          <p className="text-sm text-muted-foreground">
            Draggable
          </p>
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={75}>
        <div className="p-4">
          <h4>Right Panel</h4>
          <p className="text-sm">Main content area</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
```

### Resizable — Props

```tsx
// ResizablePanelGroup
interface ResizablePanelGroupProps {
  direction?: "horizontal" | "vertical";
  onLayout?: (sizes: number[]) => void;
  className?: string;
}

// ResizablePanel
interface ResizablePanelProps {
  defaultSize?: number; // percentage (0-100)
  minSize?: number;
  maxSize?: number;
}

// ResizableHandle
interface ResizableHandleProps {
  withHandle?: boolean; // show drag indicator
}
```

### Resizable — Checklist

```
☐ ResizablePanelGroup direction is "horizontal" or "vertical"
☐ ResizablePanel defaultSize is percentage (0-100)
☐ minSize and maxSize prevent excessive resizing
☐ ResizableHandle always between panels
☐ withHandle shows drag indicator
☐ Stores layout in localStorage or state
☐ Touch-friendly (handle width 8px)
```

---

# OVERLAY & DIALOGS

## 56. Dialog

`@/components/ui/dialog`

### Dialog — Components

- **Dialog** — Container
- **DialogTrigger** — Button that opens dialog
- **DialogContent** — Modal content container
- **DialogHeader** — Top section
- **DialogTitle** — Main heading
- **DialogDescription** — Subtitle
- **DialogFooter** — Bottom section (buttons)
- **DialogClose** — Close button

### Dialog — Usage

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            Dialog description provides context
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Dialog — Props

```tsx
// Dialog
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// DialogContent
interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// DialogTrigger
interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}
```

### Dialog — Checklist

```
☐ DialogTrigger with asChild wraps existing button
☐ DialogContent centered and scrollable
☐ DialogTitle always provided (h2 level)
☐ DialogDescription for context
☐ DialogFooter holds action buttons
☐ DialogClose for cancel/dismiss
☐ X button built-in, do not duplicate
☐ Overlay is dark and clickable to close (optional)
☐ Keyboard: Escape closes, Tab cycles focus
```

---

## 57. Alert Dialog

`@/components/ui/alert-dialog`

### Alert Dialog — Components

Same as Dialog, but for critical actions (delete, confirm dangerous operations)

### Alert Dialog — Usage

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently
            delete the item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Alert Dialog — Checklist

```
☐ Used only for critical/destructive actions
☐ Title is a clear question ("Are you sure?")
☐ Description explains consequences
☐ AlertDialogCancel is primary button (prevent accidental action)
☐ AlertDialogAction styled as destructive (red)
☐ No undo — make user confirm twice if very destructive
☐ Focus returned to trigger after close
```

---

## 58. Sheet

`@/components/ui/sheet`

### Sheet — Components

- **Sheet** — Container
- **SheetTrigger** — Button to open sheet
- **SheetContent** — Slide-in panel (animates from edge)
- **SheetHeader** — Top section
- **SheetTitle** — Heading
- **SheetDescription** — Subtitle
- **SheetFooter** — Bottom section
- **SheetClose** — Close button

### Sheet — Usage

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            Sheet description and context
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Sheet content goes here</p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

### Sheet — Props

```tsx
// SheetContent
interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
}
```

### Sheet — Checklist

```
☐ side="right" (most common), can be top/bottom/left
☐ SheetContent slides in from edge (fixed width)
☐ Overlay darkens background
☐ SheetTitle always provided
☐ SheetDescription optional but recommended
☐ X button built-in (do not duplicate)
☐ Content scrollable if tall
☐ Keyboard: Escape closes, Tab cycles
```

---

## 59. Drawer

`@/components/ui/drawer`

### Drawer — Components

Same as Sheet, but for mobile-first experiences (animates from bottom on mobile, side on desktop)

### Drawer — Usage

```tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            Drawer description
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Content here</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
          <Button>Confirm</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

### Drawer — Checklist

```
☐ Responsive: bottom sheet on mobile, side panel on desktop
☐ Drawer content scrollable on mobile
☐ Touch-friendly (swipe down to close)
☐ Keyboard: Escape closes
☐ Use for non-blocking workflows (filters, settings)
```

---

## 60. Popover

`@/components/ui/popover`

### Popover — Components

- **Popover** — Container
- **PopoverTrigger** — Button that opens popover
- **PopoverContent** — Floating panel

### Popover — Usage

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            Popover Title
          </h4>
          <p className="text-sm text-muted-foreground">
            Popover content appears near the trigger
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Popover — Checklist

```
☐ PopoverContent floats near trigger (not fixed overlay)
☐ Appears on hover or click (controlled by user)
☐ Closes on Escape or outside click
☐ Side inference: avoids viewport edges automatically
☐ Used for inline help, quick actions, dropdowns
☐ sideOffset controls distance from trigger
```

---

## 61. Hover Card

`@/components/ui/hover-card`

### Hover Card — Usage

```tsx
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="#" className="underline">
          Hover over me
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Preview</h4>
          <p className="text-sm">
            Shows on hover, hides on mouse leave
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
```

### Hover Card — Checklist

```
☐ Shows on hover, hides on mouse leave
☐ Used for previews, tooltips, user cards
☐ Closes if focus leaves
☐ Does not block content behind
☐ openDelay and closeDelay control timing (default 200ms)
```

---

## 62. Tooltip

`@/components/ui/tooltip`

### Tooltip — Components

- **TooltipProvider** — Wrapper (mount once in App.tsx)
- **Tooltip** — Container
- **TooltipTrigger** — Element that triggers tooltip
- **TooltipContent** — Tooltip text/content

### Tooltip — Usage

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="size-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a helpful tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// With keyboard shortcut hint
export function TooltipWithKbd() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button>Keyboard Shortcut</button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <span>Open search</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Tooltip — Checklist

```
☐ TooltipProvider wraps app or entire page
☐ Used for icon descriptions, keyboard hints
☐ Content kept short (1 sentence max)
☐ Shows on hover, hides on mouse leave
☐ Keyboard accessible: Escape closes
☐ Side inference avoids viewport edges
☐ Dark styling automatic inside TooltipContent
```

---

# NAVIGATION & MENUS

## 63. Breadcrumb

`@/components/ui/breadcrumb`

### Breadcrumb — Components

- **Breadcrumb** — Container
- **BreadcrumbList** — List of items
- **BreadcrumbItem** — Individual breadcrumb
- **BreadcrumbLink** — Linked breadcrumb
- **BreadcrumbPage** — Current page (not linked)
- **BreadcrumbSeparator** — "/" divider

### Breadcrumb — Usage

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">
            Documentation
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

### Breadcrumb — Checklist

```
☐ Auto-generated in GlobalHeader from pathname (in most pages)
☐ Override only when needed (pass breadcrumbs prop to AppShell)
☐ BreadcrumbLink for navigable items
☐ BreadcrumbPage for current location (not linked, aria-current)
☐ BreadcrumbSeparator auto-added (text: "/")
☐ First item should be Home or app root
☐ Do not exceed 5 items
```

---

## 64. Tabs

`@/components/ui/tabs`

### Tabs — Components

- **Tabs** — Container
- **TabsList** — Tab button group
- **TabsTrigger** — Individual tab button
- **TabsContent** — Content for active tab

### Tabs — Usage

```tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export function TabsDemo() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p>Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p>Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p>Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  );
}
```

### Tabs — Props

```tsx
// Tabs
interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

// TabsTrigger
interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

// TabsContent
interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
```

### Tabs — Checklist

```
☐ TabsList contains all TabsTrigger elements
☐ TabsTrigger value matches TabsContent value
☐ defaultValue or value (controlled) set on Tabs
☐ orientation="horizontal" (default) or "vertical"
☐ Only one TabsContent visible at a time
☐ Keyboard: arrow keys navigate, Enter activates
☐ Tab button animations handled automatically
```

---

## 65. Dropdown Menu

`@/components/ui/dropdown-menu`

### Dropdown Menu — Components

- **DropdownMenu** — Container
- **DropdownMenuTrigger** — Button that opens menu
- **DropdownMenuContent** — Menu panel
- **DropdownMenuItem** — Menu option
- **DropdownMenuCheckboxItem** — Checkable option
- **DropdownMenuRadioGroup/Item** — Radio option group
- **DropdownMenuLabel** — Section heading
- **DropdownMenuSeparator** — Divider
- **DropdownMenuShortcut** — Keyboard shortcut hint

### Dropdown Menu — Usage

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";

export function DropdownMenuDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Edit
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={checked}
          onCheckedChange={setChecked}
        >
          Pin to sidebar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Dropdown Menu — Checklist

```
☐ DropdownMenuTrigger with asChild wraps button
☐ DropdownMenuContent anchors to trigger
☐ align="start" (default), "center", or "end"
☐ DropdownMenuItem for single actions
☐ DropdownMenuCheckboxItem for toggles
☐ DropdownMenuRadioGroup for exclusive choices
☐ DropdownMenuLabel for section headings
☐ DropdownMenuSeparator for visual groups
☐ DropdownMenuShortcut for keyboard hints
☐ Keyboard: arrow keys navigate, Enter activates
```

---

## 66. Context Menu

`@/components/ui/context-menu`

### Context Menu — Components

Same as Dropdown Menu, but triggered by right-click

### Context Menu — Usage

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="bg-muted p-4 rounded border-2 border-dashed text-center cursor-context-menu">
          Right-click on me
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Cut</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

### Context Menu — Checklist

```
☐ ContextMenuTrigger wraps the element
☐ Right-click (or long-press on touch) opens menu
☐ Same structure as DropdownMenu
☐ Cursor changes to context-menu on trigger
☐ Used for file operations, text editing
```

---

## 67. Command

`@/components/ui/command`

### Command — Components

- **Command** — Container
- **CommandInput** — Search/filter input
- **CommandList** — Results list
- **CommandGroup** — Option group
- **CommandItem** — Individual command
- **CommandSeparator** — Divider
- **CommandEmpty** — Empty state message

### Command — Usage

```tsx
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Command>
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No commands found</CommandEmpty>
        <CommandGroup heading="File">
          <CommandItem>New File</CommandItem>
          <CommandItem>Open</CommandItem>
          <CommandItem>Save</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem>Undo</CommandItem>
          <CommandItem>Redo</CommandItem>
          <CommandItem>Cut</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
```

### Command — Checklist

```
☐ CommandInput filters items via search
☐ CommandList contains CommandGroup elements
☐ CommandGroup has heading prop
☐ CommandItem individual commands
☐ CommandEmpty shown when no results
☐ Keyboard: arrow keys navigate, Enter activates
☐ Used in Cmdk palette, search, navigation
```

---

## 68. Menubar

`@/components/ui/menubar`

### Menubar — Components

- **Menubar** — Container
- **MenubarMenu** — Individual menu (File, Edit, View)
- **MenubarTrigger** — Menu button
- **MenubarContent** — Menu panel
- **MenubarItem** — Menu item
- **MenubarLabel** — Section heading
- **MenubarSeparator** — Divider
- **MenubarCheckboxItem** — Checkable item
- **MenubarRadioGroup/Item** — Radio option group

### Menubar — Usage

```tsx
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarSeparator,
} from "@/components/ui/menubar";

export function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

### Menubar — Checklist

```
☐ Menubar top-level container (typically in header)
☐ MenubarMenu wraps each menu (File, Edit, View)
☐ MenubarTrigger is the visible label
☐ MenubarContent holds MenubarItem elements
☐ Similar to DropdownMenu but for multi-column menus
☐ Keyboard: Tab moves between menus, arrow keys navigate
```

---

## 69. Navigation Menu

`@/components/ui/navigation-menu`

### Navigation Menu — Components

- **NavigationMenu** — Container
- **NavigationMenuList** — Menu items list
- **NavigationMenuItem** — Individual menu item
- **NavigationMenuTrigger** — Expandable button
- **NavigationMenuContent** — Content panel
- **NavigationMenuLink** — Link item
- **NavigationMenuViewport** — Content viewport

### Navigation Menu — Usage

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4">
              <NavigationMenuLink href="/docs">
                Documentation
              </NavigationMenuLink>
              <NavigationMenuLink href="/examples">
                Examples
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}
```

### Navigation Menu — Checklist

```
☐ Used for multi-level primary navigation
☐ NavigationMenuLink for simple links
☐ NavigationMenuTrigger for expandable sections
☐ NavigationMenuContent displayed in viewport
☐ Keyboard accessible (Tab, arrow keys)
```

---

## 70. Sidebar

`@/components/ui/sidebar`

### Components (from shadcn/ui)

- **Sidebar** — Container
- **SidebarProvider** — Context wrapper
- **SidebarTrigger** — Collapse button
- **SidebarContent** — Navigation items
- **SidebarFooter** — Bottom section
- **SidebarGroup** — Section grouping
- **SidebarGroupLabel** — Section heading
- **SidebarMenu** — Menu list
- **SidebarMenuItem** — Menu item
- **SidebarMenuButton** — Clickable item
- **SidebarMenuSub** — Nested menu

### Note

The IQLDS uses a custom **GlobalSidebar** component (not directly shadcn sidebar). Configuration is via `src/lib/sidebar-config.ts`.

### Sidebar Configuration

```tsx
// src/lib/sidebar-config.ts
import {
  SettingsIcon,
  FileTextIcon,
  UsersIcon,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  roles?: string[]; // Only show for specific roles
  items?: SidebarItem[]; // Nested items
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: <FileTextIcon className="size-4" />,
    badge: 12,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: <SettingsIcon className="size-4" />,
    roles: ["admin"],
  },
  {
    title: "Team",
    url: "/team",
    icon: <UsersIcon className="size-4" />,
    items: [
      { title: "Members", url: "/team/members" },
      { title: "Roles", url: "/team/roles" },
    ],
  },
];
```

### Sidebar — Checklist

```
☐ Configure items in src/lib/sidebar-config.ts
☐ Each item has title, url, and optional icon
☐ badge shows notification count or "New" label
☐ roles array restricts visibility to user roles
☐ disabled prevents navigation but shows item
☐ Nested items under items array (one level only)
☐ Icons use size-4 and strokeWidth={2}
☐ ActiveLink indicators automatic via pathname
```

---

# DISPLAY & FEEDBACK

## 71. Accordion

`@/components/ui/accordion`

### Accordion — Components

- **Accordion** — Container
- **AccordionItem** — Individual accordion
- **AccordionTrigger** — Clickable header
- **AccordionContent** — Collapsible content

### Accordion — Usage

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles you can customize.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it
          if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Accordion — Props

```tsx
// Accordion
interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean; // Allow closing open accordion
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

// AccordionItem
interface AccordionItemProps {
  value: string;
}
```

### Accordion — Checklist

```
☐ Accordion type="single" (only one open) or "multiple" (many open)
☐ collapsible={true} allows closing last open item
☐ AccordionItem value must be unique
☐ AccordionTrigger shows chevron indicator (automatic)
☐ Keyboard: Tab navigates, Space/Enter toggles
☐ Each AccordionItem has border-bottom
```

---

## 72. Collapsible

`@/components/ui/collapsible`

### Collapsible — Components

- **Collapsible** — Container
- **CollapsibleTrigger** — Button to toggle
- **CollapsibleContent** — Hidden/visible content

### Collapsible — Usage

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline">
          Advanced Options
          <ChevronDown
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <p className="text-sm">Hidden options appear here</p>
        <p className="text-sm">
          Add complex settings or advanced controls
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

### Collapsible — Props

```tsx
interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
```

### Collapsible — Checklist

```
☐ Simpler than Accordion (single toggle)
☐ CollapsibleTrigger can be any element (button, link, div)
☐ open and onOpenChange form controlled pair
☐ Content animates smoothly (height animation)
☐ Use for "show more" and "advanced options"
```

---

## 73. Alert

`@/components/ui/alert`

### Alert — Components

- **Alert** — Container
- **AlertTitle** — Heading
- **AlertDescription** — Description text

### Alert — Usage

```tsx
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export function AlertDemo() {
  return (
    <div className="space-y-4">
      {/* Default */}
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the code
          below.
        </AlertDescription>
      </Alert>

      {/* Destructive */}
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again.
        </AlertDescription>
      </Alert>

      {/* Success (default variant, custom icon) */}
      <Alert>
        <CheckCircle className="size-4 text-green-600" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved.
        </AlertDescription>
      </Alert>
    </div>
  );
}
```

### Alert — Props

```tsx
interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}
```

### Alert — Checklist

```
☐ Alert displays info, warning, or error
☐ variant="destructive" for errors/warnings
☐ Always includes icon (passed as child)
☐ AlertTitle for short heading
☐ AlertDescription for context
☐ Used standalone (not in toast or dialog)
☐ Icon positioned left automatically
```

---

## 74. Empty

`@/components/ui/empty`

### Empty — Usage

```tsx
import { Empty } from "@/components/ui/empty";
import { InboxIcon } from "lucide-react";

export function EmptyDemo() {
  return (
    <Empty
      icon={<InboxIcon className="size-12" />}
      title="No items found"
      description="Try adjusting your filters or create a new item"
      action={<Button>Create Item</Button>}
    />
  );
}
```

### Empty — Props

```tsx
interface EmptyProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}
```

### Empty — Checklist

```
☐ Used for empty states (no results, no data)
☐ Icon is size-12 (decorative)
☐ Title is short ("No items", not "There are currently no items")
☐ Description explains why (filter, create new)
☐ action is a Button or link
☐ Centered on page
☐ Matches loading and error state patterns
```

---

## 75. Progress

`@/components/ui/progress`

### Progress — Usage

```tsx
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export function ProgressDemo() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <Progress value={progress} />
      <Progress value={progress} className="h-2" />
      <Progress value={100} /> {/* Completed */}
    </div>
  );
}
```

### Progress — Props

```tsx
interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100
  max?: number;
}
```

### Progress — Checklist

```
☐ value is percentage (0-100)
☐ max defaults to 100
☐ Used for progress bars, uploads, file operations
☐ Smooth animation (1s transition)
☐ Color is text-primary by default
☐ Height is h-2 (customizable with className)
```

---

## 76. Pagination

`@/components/ui/pagination`

### Pagination — Components

- **Pagination** — Container
- **PaginationContent** — Items list
- **PaginationItem** — Individual item
- **PaginationLink** — Page number link
- **PaginationPrevious** — Previous button
- **PaginationNext** — Next button
- **PaginationEllipsis** — "..." separator

### Pagination — Usage

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
```

### Pagination — Checklist

```
☐ PaginationLink isActive highlights current page
☐ PaginationPrevious/Next at ends
☐ PaginationEllipsis for skipped pages
☐ href or onClick for page navigation
☐ Keyboard: Tab navigates, Enter activates
☐ Aria labels automatic
```

---

## 77. Toggle & Toggle Group

`@/components/ui/toggle`

### Toggle & Toggle Group — Components

**Toggle** — Single toggle button

**ToggleGroup** — Multiple exclusive toggles

### Toggle & Toggle Group — Usage

```tsx
import { Toggle } from "@/components/ui/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react";

export function ToggleDemo() {
  const [bold, setBold] = useState(false);

  return (
    <div className="space-y-4">
      {/* Single toggle */}
      <Toggle pressed={bold} onPressedChange={setBold}>
        <BoldIcon className="size-4" />
      </Toggle>

      {/* Group (exclusive selection) */}
      <ToggleGroup type="single" defaultValue="bold">
        <ToggleGroupItem value="bold">
          <BoldIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic">
          <ItalicIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline">
          <UnderlineIcon className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Multiple selection */}
      <ToggleGroup
        type="multiple"
        defaultValue={["bold", "italic"]}
      >
        <ToggleGroupItem value="bold">B</ToggleGroupItem>
        <ToggleGroupItem value="italic">I</ToggleGroupItem>
        <ToggleGroupItem value="underline">U</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
```

### Toggle & Toggle Group — Props

```tsx
// Toggle
interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

// ToggleGroup
interface ToggleGroupProps {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

// ToggleGroupItem
interface ToggleGroupItemProps {
  value: string;
}
```

### Toggle & Toggle Group — Checklist

```
☐ Toggle for single on/off action
☐ ToggleGroup for exclusive or multiple selections
☐ type="single" (exclusive) or "multiple" (many selected)
☐ pressed and onPressedChange form controlled pair
☐ Icon buttons (no text, usually)
☐ Aria-pressed state automatic
```

---

## 78. Calendar

`@/components/ui/calendar`

### Calendar — Usage

```tsx
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(
    new Date(),
  );

  return (
    <div className="flex gap-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(date) => date < new Date()} // Disable past dates
      />
    </div>
  );
}

// Range selection
export function CalendarRangeDemo() {
  const [range, setRange] = useState({
    from: undefined,
    to: undefined,
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
    />
  );
}
```

### Calendar — Props

```tsx
interface CalendarProps {
  mode?: "single" | "range" | "multiple";
  selected?: Date | { from?: Date; to?: Date } | Date[];
  onSelect?: (date: any) => void;
  disabled?: (date: Date) => boolean;
  month?: Date;
  onMonthChange?: (date: Date) => void;
}
```

### Calendar — Checklist

```
☐ mode="single" (one date), "range" (date range), "multiple" (many dates)
☐ selected and onSelect form controlled pair
☐ disabled function returns true for un-selectable dates
☐ month and onMonthChange for month navigation
☐ Keyboard: arrow keys navigate, Enter selects
☐ Calendar used in CalendarSidebar (not standalone)
```

---

# DATA & RICH CONTENT

## 79. Table

`@/components/ui/table`

### Table — Components

- **Table** — Container
- **TableHeader** — Header rows
- **TableBody** — Body rows
- **TableFooter** — Footer rows
- **TableHead** — Header cell
- **TableRow** — Row
- **TableCell** — Cell

### Table — Usage

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

const invoices = [
  {
    id: "INV-1",
    customer: "John Doe",
    amount: "$500",
    status: "Paid",
  },
  {
    id: "INV-2",
    customer: "Jane Smith",
    amount: "$300",
    status: "Pending",
  },
];

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
            <TableCell>{invoice.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell>$800</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
```

### Table — Checklist

```
☐ Use @tanstack/react-table for DataTable (not this basic Table)
☐ This Table for simple static tables
☐ TableHeader wraps header rows
☐ TableBody wraps data rows
☐ TableFooter optional (summary row)
☐ TableHead for header cells
☐ TableCell for data cells
☐ Striped rows via TableRow hover state
```

---

## 80. Chart

`@/components/ui/chart`

### Chart — Components

- **ChartContainer** — Wrapper with config
- **ChartTooltip** — Tooltip handler
- **ChartTooltipContent** — Tooltip content
- **ChartLegend** — Legend handler
- **ChartLegendContent** — Legend content

### Chart — Usage

```tsx
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
};

export function ChartDemo() {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-64 w-full"
    >
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="var(--chart-1)"
        />
        <Line
          type="monotone"
          dataKey="mobile"
          stroke="var(--chart-2)"
        />
      </LineChart>
    </ChartContainer>
  );
}
```

### Chart — Props

```tsx
// ChartContainer
interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  config: Record<string, { label: string; color: string }>;
}
```

### Chart — Checklist

```
☐ config object defines all data keys with label and color
☐ color values use var(--chart-1) through var(--chart-5)
☐ className includes explicit height (h-64, h-80)
☐ All Recharts components are children of ChartContainer
☐ ChartTooltip with ChartTooltipContent for styling
☐ ChartLegend with ChartLegendContent for styling
☐ CartesianGrid uses vertical={false}
☐ XAxis and YAxis both have tickLine={false} axisLine={false}
```

---

## 81. Carousel

`@/components/ui/carousel`

### Carousel — Components

- **Carousel** — Container
- **CarouselContent** — Items wrapper
- **CarouselItem** — Individual slide
- **CarouselPrevious** — Previous button
- **CarouselNext** — Next button

### Carousel — Usage

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export function CarouselDemo() {
  return (
    <Carousel opts={{ align: "start", loop: true }}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold">
                Slide {index + 1}
              </h3>
              <p className="text-sm text-muted-foreground">
                Carousel item content
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

### Carousel — Props

```tsx
// Carousel
interface CarouselProps {
  opts?: {
    align?: "start" | "center" | "end";
    loop?: boolean;
    skipSnaps?: boolean;
    dragFree?: boolean;
    direction?: "ltr" | "rtl";
  };
  plugins?: any[];
  orientation?: "horizontal" | "vertical";
}

// CarouselItem
interface CarouselItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}
```

### Carousel — Checklist

```
☐ opts.align controls item positioning
☐ opts.loop allows cycling back to first item
☐ opts.dragFree allows free dragging (not snapped)
☐ CarouselContent wraps all CarouselItem elements
☐ CarouselItem uses basis-* for responsive sizing
☐ CarouselPrevious/Next positioned outside carousel
☐ Touch-friendly (swipe to navigate)
☐ Keyboard: arrow keys navigate
```

---

# COMPOSED & UTILITY

## 82. Avatar

`@/components/ui/avatar`

### Avatar — Components

- **Avatar** — Container
- **AvatarImage** — Image element
- **AvatarFallback** — Text/initials when image fails

### Avatar — Usage

```tsx
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

export function AvatarDemo() {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="@shadcn"
        />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>

      <Avatar className="h-12 w-12">
        <AvatarImage src="broken-image.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  );
}
```

### Avatar — Props

```tsx
interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // Defaults: size-10 (40x40px)
}

interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement> {}
```

### Avatar — Checklist

```
☐ Avatar size defaults to size-10 (40x40px)
☐ AvatarImage src and alt required
☐ AvatarFallback shown when image loads fails
☐ Fallback usually 2 initials (JD, SC)
☐ Size customizable with className (size-8, size-12)
☐ Used in AvatarGroup for multiple avatars
```

---

## 83. Button Group

`@/components/ui/button-group`

### Button Group — Components

- **ButtonGroup** — Container
- **ButtonGroupText** — Non-interactive label
- **ButtonGroupSeparator** — Visual divider

### Button Group — Usage

```tsx
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm">
        Day
      </Button>
      <Button variant="outline" size="sm">
        Week
      </Button>
      <Button variant="outline" size="sm">
        Month
      </Button>
    </ButtonGroup>
  );
}

// With label and separator
export function ButtonGroupLabelDemo() {
  return (
    <ButtonGroup>
      <ButtonGroupText>Sort by</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline" size="sm">
        Name
      </Button>
      <Button variant="outline" size="sm">
        Date
      </Button>
    </ButtonGroup>
  );
}
```

### Button Group — Checklist

```
☐ ButtonGroup wraps 2+ Buttons
☐ All buttons use same size (usually sm)
☐ Buttons have outline or ghost variant
☐ ButtonGroupText for non-interactive label
☐ ButtonGroupSeparator for visual divider
☐ orientation="horizontal" (default) or "vertical"
☐ Border handled by group (not individual buttons)
```

---

## 84. Kbd & KbdGroup

`@/components/ui/kbd`

### Kbd & KbdGroup — Components

- **Kbd** — Single key
- **KbdGroup** — Multiple keys

### Kbd & KbdGroup — Usage

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export function KbdDemo() {
  return (
    <div className="space-y-4">
      {/* Single key */}
      <p className="text-sm">
        Press <Kbd>Enter</Kbd> to confirm
      </p>

      {/* Key combination */}
      <p className="text-sm">
        Open search:
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </p>

      {/* Multiple combinations */}
      <p className="text-sm">
        Save file:
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
        or
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </p>
    </div>
  );
}
```

### Kbd & KbdGroup — Checklist

```
☐ Kbd wraps single key label (⌘, K, Enter, Shift)
☐ KbdGroup wraps multiple Kbd for combinations
☐ Used inside Tooltip content for shortcut hints
☐ Used in help text or empty states
☐ Styling automatic (dark background, monospace)
```

---

## 85. Item

`@/components/ui/item`

### Item — Components

- **Item** — Container (list item)
- **ItemHeader** — Top section
- **ItemTitle** — Main title
- **ItemDescription** — Subtitle
- **ItemMetadata** — Right-side info
- **ItemAction** — Action buttons/icons

### Item — Usage

```tsx
import {
  Item,
  ItemHeader,
  ItemTitle,
  ItemDescription,
  ItemMetadata,
  ItemAction,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";

export function ItemDemo() {
  return (
    <div className="space-y-2 border rounded p-4">
      <Item>
        <ItemHeader>
          <ItemTitle>Item Title</ItemTitle>
          <ItemDescription>
            Item description or subtitle
          </ItemDescription>
        </ItemHeader>
        <ItemMetadata>
          <span className="text-xs text-muted-foreground">
            2 hours ago
          </span>
        </ItemMetadata>
        <ItemAction>
          <Button size="icon" variant="ghost">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </ItemAction>
      </Item>
    </div>
  );
}
```

### Item — Checklist

```
☐ Item is a flex container for list items
☐ ItemHeader for title and description
☐ ItemTitle is h4 level (text-sm font-semibold)
☐ ItemDescription is muted text
☐ ItemMetadata right-aligned (timestamps, counts)
☐ ItemAction for buttons/icons (far right)
☐ Used in item lists, search results, tables
```

---

## 86. Sonner (Toast)

`@/components/ui/sonner`

### Sonner (Toast) — Usage

```tsx
import { Toaster, toast } from "sonner";

// In App.tsx (mount once)
export function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  );
}

// Anywhere in app
export function ToastDemo() {
  return (
    <div className="flex gap-2">
      <button onClick={() => toast.success("Saved!")}>
        Success
      </button>
      <button
        onClick={() =>
          toast.error("Error saving", {
            description: "Please try again",
          })
        }
      >
        Error
      </button>
      <button onClick={() => toast.loading("Loading...")}>
        Loading
      </button>
      <button
        onClick={() =>
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: "Loading...",
              success: "Done!",
              error: "Failed",
            },
          )
        }
      >
        Promise
      </button>
      <button onClick={() => toast.warning("Be careful!")}>
        Warning
      </button>
      <button onClick={() => toast.info("FYI")}>Info</button>
    </div>
  );
}
```

### Toast Methods

```tsx
toast.success(message, options); // Green checkmark
toast.error(message, options); // Red X icon
toast.warning(message, options); // Yellow warning
toast.info(message, options); // Blue info
toast.loading(message, options); // Spinner
toast.promise(promise, options); // Auto-update on resolve/reject
toast.custom(component, options); // Custom component
toast.dismiss(); // Close all
toast.dismiss(toastId); // Close specific
```

### Options

```tsx
interface ToastOptions {
  description?: string;
  duration?: number; // ms (default: 4000)
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  cancel?: { label: string; onClick: () => void };
  onDismiss?: (toast: Toast) => void;
  onAutoClose?: (toast: Toast) => void;
}
```

### Sonner (Toast) — Checklist

```
☐ <Toaster /> mounted exactly once in App.tsx
☐ import toast from "sonner" (not from component file)
☐ toast.success() for completed actions
☐ toast.error() for failed actions (always include description)
☐ toast.loading() / toast.dismiss() for manual loading → resolve
☐ toast.promise() for async actions (preferred)
☐ Messages short and action-oriented ("Saved", not "Item saved successfully")
☐ Position defaults to "bottom-right"
☐ duration defaults to 4000ms
```

---

# COMPONENT IMPLEMENTATION CHECKLIST

## Universal Rules (All Components)

```
✓ Use semantic tokens for colors (never hardcode #hex)
✓ All Lucide icons use strokeWidth={2}
✓ Icon sizes: size-3 (small), size-4 (default), size-5 (prominent)
✓ Spacing: px-4/px-6 horizontal, py-6 vertical, gap-2 inline, gap-4 blocks
✓ Typography: text-base default, text-sm secondary, text-xs caption
✓ Focus rings: automatic via focus-visible (3px ring)
✓ Disabled state: disabled:opacity-50, disabled:pointer-events-none
✓ Aria attributes: role, aria-label, aria-invalid, aria-current as needed
✓ Keyboard navigation: Tab, Escape, Enter, arrow keys (automatic via Radix)
✓ Dark mode: automatic via semantic tokens (never use dark: modifier for colors)
✓ Responsive: mobile-first, use Tailwind breakpoints (md:, lg:, xl:)
✓ Data attributes: data-slot="component-name" for targeting
```

---

# QUICK REFERENCE BY USE CASE

## Form Inputs

Field, Input, Textarea, Label, Checkbox, Radio Group, Switch, Select, Native Select, Combobox, Input Group, Input OTP, Slider

## Display Data

Table, DataTable, Chart, Carousel, Pagination, Item, Avatar, AvatarGroup

## User Feedback

Toast (Sonner), Alert, AlertDialog, Progress, Spinner, Skeleton

## Navigation Components

Tabs, Breadcrumb, Sidebar, Dropdown Menu, Context Menu, Command, Menubar, Navigation Menu

## Containers & Layout

Card, Scroll Area, Aspect Ratio, Resizable, PageSection

## Overlays & Interaction

Dialog, Alert Dialog, Sheet, Drawer, Popover, Hover Card, Tooltip

## Toggles & States

Toggle, Toggle Group, Accordion, Collapsible, Checkbox, Switch, Radio Group

## Media & Rich

Calendar, Chart, Carousel, Image, Video (AspectRatio)

## Utility

## Badge, Separator, Button Group, Input Group, Kbd, Empty, Skeleton, Spinner, Progress

---

# RISK, SEVERITY & ERROR HANDLING

> Defines how every action, mutation, and failure state is classified and handled across the system.  
> Every developer must read this before implementing any write operation, confirmation dialog, or error state.

---

## 87. Action Risk Levels

Every user-triggered action in the system has a risk level. Risk is determined by two factors: **reversibility** (can the user undo it?) and **impact scope** (how many records or users does it affect?).

### Low Risk

Actions that are safe, reversible, or have no persistent side effects.

```
READ / VIEW
  Viewing a record, page, or list
  Searching or filtering
  Sorting columns
  Expanding/collapsing UI elements
  Copying text to clipboard

NAVIGATION
  Clicking a link or sidebar item
  Paginating through results
  Switching tabs

SAFE WRITES
  Saving a draft (auto-saved, recoverable)
  Updating personal preferences / UI settings
  Toggling notifications on/off
  Adding a comment
```

**UI treatment:** No confirmation required. Immediate feedback via `toast.success()` after mutation completes.

---

### Medium Risk

Actions that persist data or have side effects, but are recoverable or reversible with reasonable effort.

```
DATA CREATION
  Creating a new record (patient, order, report)
  Uploading a file or attachment
  Submitting a form for review

DATA MODIFICATION
  Editing and saving an existing record
  Reassigning ownership (a task, case, order)
  Changing status (Pending → Active)
  Sending a notification or email to one person
  Adding/removing a single relationship (tag, label, member)

BULK WRITES (recoverable)
  Updating a field across selected records
  Moving multiple records to a different category
```

**UI treatment:** No confirmation dialog for individual updates. Show `toast.promise()` with loading state. Show `toast.error()` with retry on failure. Bulk operations show a summary count before proceeding.

---

### High Risk

Actions that are **difficult or impossible to reverse**, affect multiple users/records, or have significant financial, clinical, or regulatory consequences.

```
PERMANENT DELETION
  Deleting a patient record, order, report
  Removing an account or user
  Purging archived data
  Deleting an attachment or uploaded file

IRREVERSIBLE STATE CHANGES
  Submitting a finalized order or report (cannot be recalled)
  Marking a case as permanently closed
  Archiving or deactivating an account
  Publishing content that triggers downstream systems

BULK DESTRUCTIVE
  Deleting multiple selected records
  Bulk status change that triggers irreversible workflows
  Revoking access for multiple users at once

SYSTEM / SECURITY
  Changing billing information
  Modifying permissions for a role
  Resetting another user's credentials
  Transferring ownership of an account
```

**UI treatment:** Always requires `ConfirmDialog` with `variant="destructive"`. The confirm button label must match the action word exactly. High-stakes bulk or system actions may require typed confirmation.

---

## 88. Risk Classification Matrix

| Action Type                 | Risk     | Confirmation                    | Toast                     | Undo                   |
| --------------------------- | -------- | ------------------------------- | ------------------------- | ---------------------- |
| View, search, filter        | Low      | None                            | None                      | N/A                    |
| Copy to clipboard           | Low      | None                            | `toast.success("Copied")` | N/A                    |
| Save draft                  | Low      | None                            | `toast.success()`         | N/A                    |
| Toggle setting              | Low      | None                            | `toast.success()`         | Implicit (toggle back) |
| Create new record           | Medium   | None                            | `toast.promise()`         | Navigate back          |
| Edit existing record        | Medium   | None                            | `toast.promise()`         | Manual re-edit         |
| Change record status        | Medium   | None                            | `toast.success()`         | Status change back     |
| Upload file                 | Medium   | None                            | `toast.promise()`         | Delete upload          |
| Send notification (1 user)  | Medium   | None                            | `toast.success()`         | N/A                    |
| Bulk update (reversible)    | Medium   | Count summary                   | `toast.promise()`         | Manual                 |
| Delete single record        | **High** | `ConfirmDialog` destructive     | `toast.success()`         | None                   |
| Archive / deactivate        | **High** | `ConfirmDialog` destructive     | `toast.success()`         | Unarchive manually     |
| Submit finalized form       | **High** | `ConfirmDialog` default         | `toast.success()`         | None                   |
| Bulk delete                 | **High** | `ConfirmDialog` + count         | `toast.promise()`         | None                   |
| Revoke access / permissions | **High** | `ConfirmDialog` destructive     | `toast.success()`         | Re-grant manually      |
| Reset credentials           | **High** | `ConfirmDialog` destructive     | `toast.success()`         | N/A                    |
| Transfer ownership          | **High** | `ConfirmDialog` + typed confirm | `toast.success()`         | N/A                    |
| Purge / hard delete         | **High** | `ConfirmDialog` + typed confirm | `toast.success()`         | **Impossible**         |

---

## 89. Confirmation Patterns by Risk Level

### Pattern A — No Confirmation (Low / Medium)

```tsx
// Direct mutation — no dialog
async function handleSave() {
  toast.promise(updatePatient(data), {
    loading: "Saving changes...",
    success: "Changes saved",
    error: "Failed to save — please try again",
  });
}

<Button onClick={handleSave}>Save</Button>;
```

---

### Pattern B — Standard ConfirmDialog (High, single record)

Use when the action deletes or permanently modifies one record.

```tsx
import { ConfirmDialog } from "@/components/blocks/confirm-dialog";
import { Trash2 } from "lucide-react";

<ConfirmDialog
  trigger={
    <Button variant="destructive" size="sm">
      <Trash2
        strokeWidth={ICON_STROKE_WIDTH}
        className="mr-2 size-4"
      />
      Delete Patient
    </Button>
  }
  title="Delete Patient"
  description="This will permanently delete the patient record and all associated data. This action cannot be undone."
  confirmLabel="Delete Patient"
  cancelLabel="Cancel"
  variant="destructive"
  onConfirm={async () => {
    await deletePatient(patient.id);
    toast.success("Patient deleted");
    navigate("/patients");
  }}
/>;
```

**Rules:**

- `confirmLabel` must match the action — "Delete Patient" not "Delete" not "Yes" not "OK"
- `description` must state the consequence and mention "cannot be undone" for irreversible actions
- `variant="destructive"` turns the confirm button red
- `onConfirm` is async — the button shows a loading state automatically

---

### Pattern C — ConfirmDialog with Count (High, bulk)

Use when the action affects multiple selected records.

```tsx
<ConfirmDialog
  trigger={
    <Button
      variant="destructive"
      size="sm"
      disabled={selectedRows.length === 0}
    >
      Delete Selected ({selectedRows.length})
    </Button>
  }
  title={`Delete ${selectedRows.length} Patient${selectedRows.length !== 1 ? "s" : ""}`}
  description={`This will permanently delete ${selectedRows.length} patient record${selectedRows.length !== 1 ? "s" : ""} and all associated data. This action cannot be undone.`}
  confirmLabel={`Delete ${selectedRows.length} Patient${selectedRows.length !== 1 ? "s" : ""}`}
  variant="destructive"
  onConfirm={async () => {
    await bulkDeletePatients(selectedRows.map((r) => r.id));
    toast.success(`${selectedRows.length} patients deleted`);
  }}
/>
```

---

### Pattern D — ConfirmDialog for Non-Destructive Irreversible (High, default)

Use when the action is irreversible but not a deletion (submit finalized form, publish, transfer).

```tsx
<ConfirmDialog
  trigger={<Button>Submit for Final Review</Button>}
  title="Submit Order"
  description="Once submitted, this order will be sent to the lab immediately and cannot be recalled or edited."
  confirmLabel="Submit Order"
  variant="default"
  icon={Send}
  onConfirm={async () => {
    await submitOrder(order.id);
    toast.success("Order submitted to lab");
  }}
/>
```

---

### Pattern E — Typed Confirmation (Highest risk)

Use only for the most irreversible, highest-impact actions: account deletion, data purge, ownership transfer.

```tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function TypedConfirmDialog({
  resourceName,
  onConfirm,
}: {
  resourceName: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const matches = typed === resourceName;

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
      >
        Delete Account
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete Account Permanently
            </DialogTitle>
            <DialogDescription>
              This will immediately and permanently delete the
              account, all records, all files, and all
              associated data. This cannot be undone, and our
              team cannot recover this data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="confirm-input">
              Type{" "}
              <span className="froboto-mono font-semibold text-foreground">
                {resourceName}
              </span>{" "}
              to confirm
            </Label>
            <Input
              id="confirm-input"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={resourceName}
              aria-invalid={typed.length > 0 && !matches}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setTyped("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!matches || isLoading}
              onClick={async () => {
                setIsLoading(true);
                await onConfirm();
                setIsLoading(false);
                setOpen(false);
              }}
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## 90. Irreversible Actions — Rules & Implementation

### What makes an action irreversible?

An action is **irreversible** if any of these are true:

```
☐ Data is hard-deleted from the database (no soft-delete/trash)
☐ A finalized record is transmitted to an external system
☐ A downstream workflow is triggered that cannot be cancelled
☐ An email, SMS, or notification has been sent to real users
☐ A billing event has been posted
☐ A cryptographic key or token has been invalidated
☐ A permission or role has been revoked for another user
```

### Irreversibility labeling rules

Every `ConfirmDialog` for an irreversible action must include one of these phrases in its `description`:

```
"This action cannot be undone."
"This cannot be reversed."
"Once submitted, this cannot be recalled."
"This will permanently delete..."
```

**Never soften irreversible language.** Do not write:

```
❌ "Are you sure you want to delete this item?"
❌ "This will remove the record."
❌ "Proceed with deletion?"
```

Write instead:

```
✓ "This will permanently delete the patient and all associated data. This action cannot be undone."
✓ "Once submitted to the lab, this order cannot be recalled or modified."
```

### Soft-delete vs. hard-delete

If the system supports soft-delete (trash/archive pattern):

```tsx
// For soft-delete — "Archive" not "Delete"
<ConfirmDialog
  title="Archive Patient"
  description="This patient will be moved to the archive and will no longer appear in active lists. You can restore them from the archive at any time."
  confirmLabel="Archive Patient"
  variant="destructive"  // still destructive — significant state change
  onConfirm={archivePatient}
/>

// For hard-delete — only after soft-delete, use hardest language
<ConfirmDialog
  title="Permanently Delete Patient"
  description="This will permanently and irreversibly delete the patient and all data. This cannot be undone by anyone, including our support team."
  confirmLabel="Permanently Delete"
  variant="destructive"
  onConfirm={hardDeletePatient}
/>
```

---

## 91. Error Categories

Every error in the system falls into one of these categories. Knowing the category determines which component to use and what recovery to offer.

### Category 1 — Network Error

**Definition:** The request never reached the server. The device is offline or DNS failed.

```
Causes:   Device offline, WiFi disconnected, VPN failure, DNS resolution failed
Signal:   fetch() throws TypeError: Failed to fetch
          axios throws Network Error
          status = 0, no response object
User sees: "Unable to connect. Check your internet connection."
Recovery:  Wait and retry, check connection
```

```tsx
// Detection
try {
  const data = await fetchPatients();
} catch (err) {
  if (
    err instanceof TypeError &&
    err.message === "Failed to fetch"
  ) {
    // Network error
    return (
      <ApiError error={{ type: "network" }} onRetry={refetch} />
    );
  }
}
```

---

### Category 2 — HTTP Error (4xx/5xx)

**Definition:** Request reached the server; server returned an error status.

```
400 Bad Request      Invalid input, malformed request body
                     → Show inline field validation, do not retry automatically

401 Unauthorized     No valid session/token
                     → Redirect to /login, clear local auth state

403 Forbidden        Authenticated but lacks permission
                     → Show permission error, offer navigation away

404 Not Found        Resource does not exist or was deleted
                     → Show not-found state, offer navigation to list

409 Conflict         Concurrent edit or duplicate record
                     → Show conflict message, offer refresh to see latest

422 Unprocessable    Server-side validation failed
                     → Show field-level errors from response body

429 Too Many         Rate limited
Requests             → Show retry-after message, back off automatically

500 Server Error     Unexpected server failure
                     → Show generic error, offer retry, log to monitoring

503 Unavailable      Server is down or under maintenance
                     → Show maintenance/unavailable state, auto-retry
```

---

### Category 3 — Timeout Error

**Definition:** Request reached the server but did not complete within the allowed time window.

```
Causes:   Slow database query, heavy computation, overloaded server
Signal:   AbortController timeout, axios timeout, fetch AbortError
User sees: "Request timed out. The server took too long to respond."
Recovery:  Retry (may succeed if load was temporary), contact support if persists
```

```tsx
// AbortController pattern
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s

try {
  const response = await fetch("/api/reports/generate", {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
} catch (err) {
  if (err.name === "AbortError") {
    return (
      <ApiError error={{ type: "timeout" }} onRetry={refetch} />
    );
  }
}
```

---

### Category 4 — Validation Error

**Definition:** Input failed validation — either client-side (before sending) or server-side (in response body).

```
Client-side:  react-hook-form + zod catches invalid values before the request is made
              → Never show toast for client validation — show inline FieldError only

Server-side:  API returns 400 or 422 with structured field errors in body
              → Map errors back to form fields, show inline FieldError
              → Show toast.error("Please fix the highlighted fields")
```

```tsx
// Server-side validation mapping
try {
  await savePatient(data);
} catch (err) {
  if (err.status === 422 && err.body?.errors) {
    // Map errors to form fields
    Object.entries(err.body.errors).forEach(
      ([field, messages]) => {
        setError(field, { message: messages[0] });
      },
    );
    toast.error("Please fix the highlighted fields");
  }
}
```

---

### Category 5 — Business Logic Error

**Definition:** Request was technically valid but the business rules prevented it.

```
Examples:
  "Cannot delete a patient with active orders"
  "This report has already been submitted"
  "Order cannot be modified after 24 hours"
  "Lab capacity exceeded for this date"

Signal:   Usually 409 Conflict or 422 with a business_error code
User sees: The specific business reason — not a generic error
Recovery:  The UI should guide toward the correct action
```

```tsx
// Business logic error — show specific message
catch (err) {
  if (err.status === 409 && err.body?.code === "ACTIVE_ORDERS_EXIST") {
    toast.error("Cannot delete patient", {
      description: "This patient has active orders. Complete or cancel them first.",
      action: {
        label: "View Orders",
        onClick: () => navigate(`/patients/${patient.id}/orders`)
      }
    })
  }
}
```

---

### Category 6 — Data Integrity Error

**Definition:** Data returned from the server is malformed, missing expected fields, or fails to parse.

```
Causes:   API contract change (schema migration), encoding error, partial response
Signal:   JSON.parse throws, TypeScript type mismatch, undefined access
User sees: "Failed to load data. The data format was unexpected."
Recovery:  Refresh, contact support if persists
```

```tsx
// Data parsing error
try {
  const raw = await response.json();
  const validated = PatientSchema.parse(raw); // zod parse
} catch (err) {
  if (err instanceof ZodError) {
    return (
      <DataError
        error={new Error("Invalid data format from server")}
        variant="card"
        onRetry={refetch}
      />
    );
  }
}
```

---

### Category 7 — Permission Error

**Definition:** The current user's role or permissions do not allow the requested action.

```
Causes:   Role change without re-login, feature flag disabled, org-level restriction
Signal:   403 Forbidden, or a feature_disabled flag in the response
User sees: "You don't have permission to do this. Contact your administrator."
Recovery:  Navigate away, request access from admin
```

```tsx
// Feature-level permission check (pre-request)
if (!currentUser.permissions.includes("patient:delete")) {
  return (
    <EmptyState
      variant="no-permission"
      title="Action not permitted"
      description="You don't have permission to delete patients. Contact your administrator to request access."
    />
  );
}
```

---

## 92. Recovery Patterns by Error Category

For each error category, there is a defined recovery path. Always implement all applicable recovery options.

### Recovery Decision Table

| Error Category   | Primary Recovery          | Secondary Recovery       | Auto-Retry?       |
| ---------------- | ------------------------- | ------------------------ | ----------------- |
| Network          | Retry button              | Check connection message | No                |
| 400 Bad Request  | Fix input (inline errors) | —                        | No                |
| 401 Unauthorized | Redirect to /login        | —                        | No                |
| 403 Forbidden    | Navigate away             | Request access link      | No                |
| 404 Not Found    | Navigate to list          | —                        | No                |
| 409 Conflict     | Refresh to see latest     | Manual resolution        | No                |
| 422 Validation   | Fix fields (inline)       | —                        | No                |
| 429 Rate Limit   | Show wait time            | Auto-retry after backoff | Yes (after delay) |
| 500 Server Error | Retry button              | Contact support          | Once, then stop   |
| 503 Unavailable  | Auto-retry (exponential)  | Status page link         | Yes               |
| Timeout          | Retry button              | —                        | Once              |
| Business Logic   | Guide to correct action   | —                        | No                |
| Data Integrity   | Refresh                   | Contact support          | No                |
| Permission       | Navigate away             | Request access           | No                |

### Retry implementation

```tsx
// Exponential backoff for 503/network errors
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1s

async function fetchWithRetry(
  url: string,
  retries = 0,
): Promise<Response> {
  try {
    const response = await fetch(url);
    if (response.status === 503 && retries < MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, BASE_DELAY * Math.pow(2, retries)),
      );
      return fetchWithRetry(url, retries + 1);
    }
    return response;
  } catch (err) {
    if (retries < MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, BASE_DELAY * Math.pow(2, retries)),
      );
      return fetchWithRetry(url, retries + 1);
    }
    throw err;
  }
}
```

### 401 redirect pattern

```tsx
// Centralized auth error handling in API client
export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, options);

  if (response.status === 401) {
    // Clear auth state before redirecting
    clearAuthToken();
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new ApiError(response.status, await response.json());
  }

  return response.json();
}
```

### Toast with action link (business logic)

```tsx
// Guide user toward resolution
toast.error("Cannot delete patient", {
  description: "This patient has 3 active orders.",
  action: {
    label: "View Orders",
    onClick: () => navigate(`/patients/${id}/orders`),
  },
  duration: 8000, // longer duration when action is available
});
```

---

## 93. Error Component Selection Guide

```
WHAT DO YOU HAVE?                              WHICH COMPONENT?
│
├─ A JavaScript crash in a React component
│  └─ Use ErrorBoundary (class, wraps the subtree)
│
├─ A React Router navigation failure
│  └─ Use RouteErrorBoundary (as errorElement in router)
│
├─ An HTTP error with a status code
│  └─ Use ApiError
│     error={{ status: 404, type: "http" }}
│     error={{ type: "network" }}
│     error={{ type: "timeout" }}
│
├─ A JavaScript Error object from a failed fetch/parse
│  └─ Use DataError
│     Inline alert     → variant="inline"
│     Card block       → variant="card"   (default)
│     Full page area   → variant="full-page"
│
├─ No results from a search or filter
│  └─ Use EmptyState variant="no-results"
│     + action={<Button variant="outline">Clear filters</Button>}
│
├─ Collection is empty (nothing created yet)
│  └─ Use EmptyState variant="no-data"
│     + action={<Button>Create first [item]</Button>}
│
├─ User lacks permission to view the content
│  └─ Use EmptyState variant="no-permission"
│     (no action — user cannot fix this themselves)
│
├─ Custom business logic error (your own message/icon)
│  └─ Use ErrorState
│     title="Cannot process order"
│     description="Specific reason here"
│     actions={<Button>Guide to fix</Button>}
│
├─ API is running but slow (> 3 seconds)
│  └─ Wrap content in SlowApiHandler
│     delay={3000}
│     onSlowApi={() => logSlowQuery()}
│
└─ Operation may time out completely
   └─ Wrap content in TimeoutHandler
      timeout={10000}
      onRetry={() => refetch()}
```

### Placement rules for error components

```
CONTEXT                         PLACEMENT
─────────────────────────────── ──────────────────────────────────────────
Entire page failed to load      Replace page content, centered
Table/list failed to load       Replace table area (full width of content area)
Card section failed             Replace card content, DataError variant="card"
Inline field error              Directly below the input, FieldError component
Form submission failed          toast.error() + field-level FieldError
Row-level error in table        Inline in the row, not a full overlay
Background sync failed          toast.error() only — do not block UI
```

---

## 94. Loading & Async State Machine

Every async operation in the system follows this 4-state machine:

```
            idle
             │
    user triggers action
             │
             ▼
          loading ──── timeout ──── TimeoutHandler replaces UI
             │
       ┌─────┴──────┐
       │             │
    success        error
       │             │
   toast.success   toast.error
   show content    show error component
                   offer recovery
```

### State implementation

```tsx
type AsyncState = "idle" | "loading" | "error" | "success"

const [state, setState] = useState<AsyncState>("idle")
const [error, setError] = useState<Error | null>(null)

async function loadData() {
  setState("loading")
  setError(null)
  try {
    const data = await fetchData()
    setData(data)
    setState("success")
  } catch (err) {
    setError(err instanceof Error ? err : new Error(String(err)))
    setState("error")
    // Also show toast for non-silent errors
    toast.error("Failed to load data", { description: err.message })
  }
}

// Render map:
if (state === "loading") return <SkeletonLoader variant="table" />
if (state === "error")   return <DataError error={error!} onRetry={loadData} />
if (state === "idle")    return <EmptyState variant="no-data" ... />
return <DataTable data={data} ... />
```

### Mutation state (write operations)

```tsx
const [isMutating, setIsMutating] = useState(false);

async function handleDelete() {
  setIsMutating(true);
  try {
    await deleteRecord(id);
    toast.success("Record deleted");
    navigate(-1);
  } catch (err) {
    toast.error("Failed to delete", {
      description: classifyError(err).message,
    });
  } finally {
    setIsMutating(false);
  }
}

// Wrap the content area with LoadingOverlay during mutation
<LoadingOverlay isLoading={isMutating} message="Deleting...">
  {/* page content stays visible beneath */}
</LoadingOverlay>;
```

---

## 95. Implementation Checklists

### ☐ Before writing any write operation

```
☐ Classified the action risk level (Low / Medium / High)
☐ If High risk: ConfirmDialog added with correct variant
☐ If irreversible: description says "cannot be undone" or equivalent
☐ confirmLabel matches the action word exactly
☐ onConfirm is async and handles success + error
☐ toast.promise() or toast.success()/error() after mutation
☐ Loading state shown during in-flight mutation
☐ Button disabled while mutation is in flight
```

### ☐ Before shipping any error state

```
☐ Identified the error category (network, HTTP, timeout, validation, business, etc.)
☐ Used the correct error component for the category
☐ Error component placed where content would appear (not appended below)
☐ onRetry provided when a retry makes sense for this error type
☐ 401 errors redirect to /login (centralized in API client)
☐ 403 errors show EmptyState variant="no-permission", not a blank screen
☐ 404 errors offer navigation to the parent list
☐ 500 errors offer retry once, then suggest contact support
☐ Validation errors shown inline on fields, not only as toast
☐ Business logic errors include a path to resolution (guide link or action)
☐ No silent catch blocks (every error surfaces feedback to the user)
```

### ☐ Irreversible action checklist

```
☐ ConfirmDialog is used — no bare onClick deletion
☐ variant="destructive" for deletes and revokes
☐ variant="default" for submissions and publishes
☐ description mentions irreversibility explicitly
☐ confirmLabel is specific ("Delete Patient" not "Confirm")
☐ Bulk actions show record count in title and confirmLabel
☐ Typed confirmation used for account/data purge scenarios
☐ Toast shown after success with specific message
☐ User navigated away from the deleted resource after completion
```

### ☐ Full async flow checklist

```
☐ Idle state: content or EmptyState shown
☐ Loading state: SkeletonLoader or LoadingState (not blank)
☐ Success state: content rendered
☐ Error state: ApiError / DataError / ErrorState shown (not blank)
☐ Mutation loading: LoadingOverlay wrapping content
☐ Slow API (> 3s): SlowApiHandler wrapping content
☐ Timeout: TimeoutHandler with onRetry
☐ Every success calls toast.success() or toast.promise()
☐ Every error calls toast.error() (in addition to inline component)
☐ No state transition leaves the user looking at a blank area
```

---

## Summary Card

```
RISK     ACTION TYPE                  CONFIRMATION        TOAST
─────    ──────────────────────────   ─────────────────   ───────────────
Low      View, search, copy, toggle   None                None or success
Medium   Create, edit, upload         None                toast.promise()
High     Delete, submit final,        ConfirmDialog       toast.success()
         revoke, archive              destructive/default
Highest  Purge, transfer ownership   ConfirmDialog       toast.success()
                                      + typed input


ERROR CATEGORY         COMPONENT              RECOVERY
──────────────────     ───────────────────    ────────────────────────────
Network                ApiError (network)     Retry button
HTTP 400/422           FieldError inline      Fix input
HTTP 401               (redirect to login)    Auto-redirect
HTTP 403               EmptyState no-perm     Navigate away
HTTP 404               EmptyState no-data     Navigate to list
HTTP 409               DataError card         Refresh
HTTP 500               ApiError (http)        Retry once
HTTP 503               ApiError + backoff     Auto-retry
Timeout                TimeoutHandler         Retry button
Business logic         ErrorState / toast     Action link
Data integrity         DataError              Refresh
JS component crash     ErrorBoundary          Reset / Go Home
Router error           RouteErrorBoundary     Go Home / Reload
```

---

# CHECKLISTS

> **Part 1** — System-wide rules that apply everywhere in the project.  
> **Part 2** — A focused checklist for every single component.

---

# PART 1 — SYSTEM-WIDE CHECKLIST

Run this against the whole project, not any single page.

---

## 1.1 App Entry (`App.tsx`)

```
☐ <ErrorBoundary> is the outermost wrapper around <RouterProvider>
☐ <Toaster /> is mounted once inside App.tsx (not in individual pages)
☐ No other global providers are added outside this pattern
```

---

## 1.2 Router (`router.tsx`)

```
☐ All authenticated routes are children of a single AppShell segment
☐ AppShell segment has errorElement: <RouteErrorBoundary />
☐ Every other router segment also has errorElement: <RouteErrorBoundary />
☐ Public routes (/login, /signup, /password-reset) are OUTSIDE the AppShell segment
☐ The catch-all { path: "*" } uses <NotFoundPage>
☐ Every page except NotFoundPage and the first critical route is loaded with React.lazy()
☐ Every lazy page is wrapped in the <LazyPage> Suspense wrapper
☐ SIDEBAR_ITEMS hrefs match router paths character-for-character
```

---

## 1.3 Color & Tokens

```
☐ Zero hardcoded hex colors anywhere (#abc, #2563eb)
☐ Zero hardcoded rgb/hsl values (rgb(37, 99, 235))
☐ Zero named CSS colors (blue, red, white, black)
☐ Zero Tailwind color utilities (text-blue-600, bg-gray-900, border-red-500)
☐ Zero dark: modifier for colors — semantic tokens adapt automatically
☐ Opacity modifiers on semantic tokens are allowed (bg-primary/10, bg-destructive/10)
☐ Chart colors use var(--chart-1) through var(--chart-5) only
```

---

## 1.4 Spacing & Sizing

```
☐ Zero arbitrary Tailwind values (p-[18px], w-[320px], text-[14px], gap-[6px])
☐ Zero inline styles for color, spacing, or layout
   (exception: TwoColumnLayout, ThreeColumnLayout, SplitLayout, CalendarLayout,
    PageWithProperties use style={{ width }} internally — this is intentional and correct)
☐ Page horizontal padding is px-4 or px-6
☐ Page vertical padding is py-6
☐ Grid gaps are gap-4
☐ Card padding is p-4 or p-6
```

---

## 1.5 Icons

```
☐ All icons imported from "lucide-react" — no other icon library
☐ ICON_STROKE_WIDTH imported from "@/lib/constants" (= 2)
☐ Every icon has strokeWidth={ICON_STROKE_WIDTH}
☐ Every icon-only button has aria-label
☐ Decorative icons (no semantic meaning) have aria-hidden="true"
☐ No emoji used as icons
```

---

## 1.6 Typography & Numbers

```
☐ All IDs, MRNs, codes, reference numbers use roboto-mono or tabular-nums
☐ All currency, quantities, and numeric displays use tabular-nums
☐ All page titles use text-lg font-semibold (inside PageHeader)
☐ All section titles use text-base font-semibold (inside PageSection)
☐ No h1 tags outside of PageHeader
☐ Heading hierarchy never skips levels (h1 → h2 → h3)
```

---

## 1.7 Accessibility

```
☐ Every form input paired with <Label htmlFor="id"> with matching id
☐ No disabled inputs used for read-only display — use plain <p> text instead
☐ aria-invalid={!!error} on all inputs with validation errors
☐ Focus rings never removed without a visual replacement
☐ Color is never the only way to convey meaning (badges have text + color)
☐ Images have alt text, decorative images have alt=""
☐ Modals and dialogs trap focus correctly (Radix handles this automatically)
```

---

## 1.8 Page Structure

```
☐ Every page component returns <PageShell> as its outermost element
☐ AppShell is used only as a router element — never inside a page component
☐ GlobalHeader, GlobalSidebar, GlobalFooter are never used directly in pages
☐ Every page has a loading state (not just a blank area)
☐ Every page has an empty state (not just a blank area)
☐ Every page has an error state (not just a silent failure)
```

---

## 1.9 Actions & Feedback

```
☐ Every destructive action is wrapped in <ConfirmDialog>
☐ Every async mutation shows a loading state while in flight
☐ Every async mutation calls toast.success() or toast.promise() on success
☐ Every async mutation calls toast.error() on failure
☐ No button click handlers directly perform deletion without confirmation
☐ No silent failures — every catch block shows feedback to the user
```

---

## 1.10 Sidebar Config

```
☐ SIDEBAR_ITEMS is defined in src/lib/sidebar-config.ts — not inline in any component
☐ Every item's href exactly matches its corresponding route path
☐ Role-restricted items use the roles: string[] field
☐ Disabled items use disabled: true
☐ No navigation is hardcoded anywhere else in the codebase
```

---

---

# PART 2 — PER-COMPONENT CHECKLIST

One section per component. Each checklist is: did I use it correctly?

---

## LAYOUTS

---

### AppShell

`@/components/layouts/app-shell`

```
☐ Used only as element in a router segment — never rendered inside a page
☐ The router segment containing AppShell has errorElement: <RouteErrorBoundary />
☐ Props passed to AppShell (onLogout, userName, userEmail, userAvatar) come from
  an auth context or router loader — not hardcoded
☐ sidebarHeader is only passed when replacing the default IQLine logo
☐ breadcrumbs prop is only passed when overriding automatic breadcrumbs
☐ Public routes (/login, /signup) are in their own segment, not children of AppShell
```

---

### PageShell

`@/components/layouts/page-shell`

```
☐ Every page component wraps its entire return in <PageShell>
☐ PageShell is the direct child of <Outlet /> (rendered by AppShell's <main>)
☐ No extra wrappers between AppShell's <main> and PageShell
☐ Children follow the pattern: header → (optional tabs) → flex-1 content area
```

---

### TwoColumnLayout

`@/components/layouts/two-column-layout`

```
☐ Parent div uses overflow-hidden (not overflow-auto) — panels manage their own scroll
☐ resizable defaults to true — only set false for truly static layouts
☐ scrollable is set when content inside panels should scroll independently
☐ leftHeader / rightHeader are used for panel-level titles (not page-level titles)
☐ defaultLeftWidth + defaultRightWidth add up to 100
☐ minLeftWidth and minRightWidth are set to prevent panels from collapsing too small
☐ The inline style={{ width }} inside this component is intentional — do not flag it
```

---

### LAYOUTS — ThreeColumnLayout

`@/components/layouts/three-column-layout`

```
☐ Parent div uses overflow-hidden
☐ defaultLeftWidth + defaultContentWidth + defaultRightWidth add up to 100
☐ left slot is navigation/index content
☐ content slot is the primary working area
☐ right slot is properties/details
☐ The inline style={{ width }} inside this component is intentional
```

---

### PageWithProperties

`@/components/layouts/page-with-properties`

```
☐ Used when right panel is fixed-width and non-resizable
☐ propertiesWidth is set explicitly (default: "320px")
☐ content slot has its own overflow handling
☐ The inline style={{ width: propertiesWidth }} inside is intentional
```

---

### SplitLayout

`@/components/layouts/split-layout`

```
☐ Used only for simple, non-resizable splits
☐ For resizable panels, TwoColumnLayout is used instead
☐ leftWidth + rightWidth account for 100% of space (e.g. "70%" + "30%")
☐ The inline style={{ width }} inside is intentional
```

---

### LAYOUTS — CalendarLayout

`@/components/layouts/calendar-layout`

```
☐ Parent div uses overflow-hidden
☐ All three slots (sidebar, calendar, details) are provided
☐ sidebar is hidden automatically on < lg screens (built in)
☐ details is hidden automatically on < xl screens (built in)
☐ The inline style={{ width: sidebarWidth/detailsWidth }} inside is intentional
```

---

## PAGE HEADERS

---

### Checklist — PageHeader

```
☐ title is a plain string — no JSX, no icons embedded in the title
☐ leading slot used only for a BackButton or similar prefix element
☐ actions slot contains Button components only — no forms, no inputs
☐ noBorder is set when PageTabs or PageHeaderWithTabs follows immediately below
☐ Only ONE PageHeader per page (never two stacked headers)
☐ Never placed inside a Card or inside page content — it must be a direct child of PageShell
```

---

### Checklist — PageHeaderWithBack

`@/components/patterns/page-header-with-back`

```
☐ Used on all detail/secondary pages that have a parent list page
☐ backButton.href set for explicit destination, omitted to navigate(-1) automatically
☐ backButton.onClick set only when custom navigation logic is needed
☐ actions slot contains only Button components
☐ noBorder set when PageTabs follows below
```

---

### Checklist — PageHeaderWithTabs

`@/components/patterns/page-header-with-tabs`

```
☐ tabs array has at least 2 items
☐ value and onValueChange are both provided (controlled pattern)
☐ defaultValue used only for uncontrolled (rare) cases
☐ The first tab value matches the default visible content on page load
☐ Tab content is NOT rendered inside this component — it renders below it in PageShell
☐ Renders PageHeader with noBorder + PageTabs together — do not add a separate PageHeader
```

---

### PageTabs

`@/components/blocks/page-tabs`

```
☐ Used standalone only when PageHeaderWithTabs is not sufficient
☐ Placed directly after a PageHeader that has noBorder
☐ value and onValueChange both provided for controlled tabs
☐ Tab labels are short (1–3 words) — not full sentences
```

---

## PAGE STRUCTURE

---

### PageSection

`@/components/blocks/page-section`

```
☐ Used to wrap every named content group on a page
☐ title provided whenever the section has a name (omit only for anonymous wrappers)
☐ description provided when additional context helps the user
☐ actions slot contains only small Buttons (size="sm") — not full toolbar
☐ divider set when a visual separator below the header helps readability
☐ topDivider set when separating from the section above
☐ spacing="sm" used only in dense/compact UIs
☐ spacing="lg" used only for top-level sections with lots of breathing room
☐ Never nested more than one level deep
```

---

### PageSectionGrid

`@/components/blocks/page-section`

```
☐ Always used inside a PageSection — never freestanding
☐ cols value chosen to match the content (4 for KPIs, 2–3 for cards)
☐ Responsive breakpoints are built in — do not override with custom grid classes
```

---

## DATA DISPLAY

---

### DataTable

`@/components/blocks/data-table`

```
☐ data is the typed array of records
☐ columns is typed as ColumnDef<T>[]
☐ searchColumn matches an accessorKey in columns
☐ emptyMessage is set — never left as the default
☐ isLoading passed when fetching data
☐ filters[].options includes all filterable values for that column
☐ Filterable columns have filterFn: (row, id, value) => value.includes(row.getValue(id))
☐ actions slot contains page-level buttons (Add, Export) — not row-level actions
☐ Row actions are in the rightmost "actions" column with DropdownMenu
☐ Sortable columns use Button variant="ghost" with ArrowUpDown icon in the header
☐ ID/code columns use roboto-mono tabular-nums in cell renderer
☐ Currency/numeric columns use text-right tabular-nums in cell renderer
☐ Status columns use Badge with semantic variant in cell renderer
☐ The "select" column (if used) is leftmost and has enableSorting: false, enableHiding: false
☐ The "actions" column (if used) is rightmost and has enableHiding: false
☐ onRowSelectionChange provided when selected rows are used elsewhere
☐ For server-side data: manualPagination and manualSorting are both set to true
☐ For server-side data: pageCount is calculated from total record count
```

---

### FilterBar

`@/components/blocks/filter-bar`

```
☐ Used for filtering card grids, lists, or non-DataTable content
☐ NOT used alongside DataTable — DataTable has its own built-in filters prop
☐ searchValue and onSearchChange both provided when search is needed
☐ filters[].selected and filters[].onChange are both provided (controlled)
☐ onClearAll resets all filters AND search to their empty state
☐ actions slot is used for view toggles, sort controls — not primary actions
```

---

### StatList

`@/components/blocks/stat-list`

```
☐ Used for key/value data on detail/view pages — not for tabular data
☐ isLoading and skeletonRows set when data is fetching
☐ variant chosen based on visual density needs (default most of the time)
☐ Never use a <table> where StatList is the correct choice
```

---

### StatItem

`@/components/blocks/stat-list`

```
☐ label is a plain string — always provided
☐ value used for plain string/number display
☐ children used instead of value when displaying Badge, Link, AvatarGroup, etc.
☐ value and children never both provided simultaneously
☐ copyable only set when the value is something a user would realistically copy
  (IDs, MRNs, emails, phone numbers — not status labels)
☐ Null/undefined value renders as "—" automatically — no manual null check needed
```

---

### StatSeparator

`@/components/blocks/stat-list`

```
☐ Used inside StatList only — never freestanding
☐ label is a short group title (e.g. "Contact", "Clinical Info")
☐ Used to separate 2+ meaningful groups — not just for decoration
```

---

### MetricCard

`@/components/blocks/metric-card`

```
☐ title is a short label (2–4 words)
☐ value is pre-formatted as a string ("$45,231" not 45231)
☐ change is pre-formatted as a string ("+12.5%" not 12.5)
☐ trend is "up" or "down" — drives the color and icon automatically
☐ icon is a Lucide icon component (not a JSX element) — passed as the component itself
☐ description is optional — only add when extra context is valuable
☐ variant="compact" used in dense contexts (sidebar widgets, inline summaries)
☐ variant="default" used in dashboard grids
☐ Always placed inside PageSectionGrid for dashboard layouts
```

---

### Timeline

`@/components/blocks/timeline`

```
☐ items is an array of TimelineItemData
☐ Each item has a unique id
☐ timestamp is a Date object or ISO string — not pre-formatted
☐ iconColor chosen semantically: success=green, warning=amber, destructive=red,
  primary=brand, default=neutral
☐ user.name provided when the actor matters
☐ content slot used for extra rich content (Badge, Link) — not for long paragraphs
☐ variant="compact" used in dashboard summaries or tight spaces
☐ isLoading and skeletonRows set when data is fetching
☐ Empty state handled in the parent — Timeline renders nothing for empty items array
```

---

### DATA DISPLAY — AvatarGroup

`@/components/blocks/avatar-group`

```
☐ Each avatar item has a unique id
☐ name is always provided — used for tooltip and fallback initials
☐ src provided when an actual photo is available
☐ max set to prevent the row from overflowing (default: 4)
☐ size consistent with surrounding context (sm for table cells, md for cards)
☐ showTooltips left true unless tooltips are genuinely disruptive
```

---

## STATE COMPONENTS

---

### LoadingState

`@/components/blocks/loading-state`

```
☐ Used for initial, full-section loading — not for inline/overlay loading
☐ variant="spinner" for most cases
☐ variant="skeleton" when the general shape of content is known
☐ variant="dots" for branding-driven or playful contexts
☐ size="lg" when filling a large area (min-h-[50vh])
☐ size="sm" in compact contexts (inside a Card)
☐ message is descriptive ("Loading patients..." not just "Loading...")
```

---

### SkeletonLoader

`@/components/blocks/skeleton-loader`

```
☐ Used when a specific content shape should be previewed while loading
☐ variant matches the content type being loaded (table/card/list/avatar/lines)
☐ lines set for "list" and "lines" variants to match expected row count
☐ Placed exactly where the real content will appear — not in a separate area
```

---

### LoadingOverlay

`@/components/blocks/loading-overlay`

```
☐ children is ALWAYS provided — this is a wrapper component, not standalone
☐ isLoading is a boolean — the overlay shows when true, hides when false
☐ Used when existing content should stay visible beneath the loading state
  (form submission, table reloading, save in progress)
☐ message describes the action in progress ("Saving patient..." not "Loading...")
☐ NOT used for initial page load — use LoadingState instead
☐ overlayClassName only set when the default backdrop needs overriding
```

---

### SlowApiHandler

`@/components/blocks/slow-api-handler`

```
☐ children is provided — wraps the content that is waiting on the API
☐ delay set based on expected API response time (default 3000ms is appropriate for most)
☐ onSlowApi used to log/track slow API events — not for UI side effects
☐ The amber warning appears automatically after delay — no manual state needed
☐ Used when the API is known to occasionally be slow (> 3s)
☐ Composed with TimeoutHandler when both slow AND timeout scenarios are possible
```

---

### TimeoutHandler

`@/components/blocks/timeout-handler`

```
☐ children is provided — wraps the content that may time out
☐ timeout set in milliseconds to match the actual API timeout limit
☐ onTimeout used to log the timeout event
☐ onRetry provided — causes the "Retry Request" button to appear
☐ showRetry defaults to true — only set false when retry is not possible
☐ After timeout, children are completely replaced by the timeout error card
☐ NOT combined with LoadingState — TimeoutHandler replaces the entire child area
```

---

### EmptyState

`@/components/blocks/empty-state`

```
☐ variant chosen semantically:
  "no-data"       when there is genuinely nothing yet (first use, empty collection)
  "no-results"    when filters or search produced zero matches
  "no-permission" when the user cannot see data due to access restrictions
☐ title overrides the default only when it's more specific to the context
☐ description overrides the default only when it's more helpful than the default
☐ icon overrides the default only when a more specific icon fits better
☐ action provided with a relevant Button when the user can do something about it:
  "no-data" → "Add [item]" button
  "no-results" → "Clear filters" button
  "no-permission" → no action (user can't fix this themselves)
☐ Placed in the exact area where content would appear — not at the bottom of the page
```

---

### ErrorState

`@/components/blocks/error-state`

```
☐ title is always provided and describes what failed
☐ description gives the user context on what went wrong and what they can do
☐ icon overrides AlertCircle only when a more specific icon better represents the error
☐ actions contains a retry Button or a navigation Button — not both unless both are useful
☐ Used when ApiError and DataError don't cover the scenario
  (e.g. a custom business logic error, not an HTTP or JS Error)
```

---

### ApiError

`@/components/blocks/api-error`

```
☐ error.type set to "network", "timeout", or "http" based on what actually happened
☐ error.status set to the HTTP status code (400, 401, 403, 404, 500)
☐ error.message set to the message from the API response (not a hardcoded string)
☐ type and status are not both set — use type for network/timeout, status for HTTP
☐ onRetry provided when the request can be retried by the user
☐ 401 errors automatically show a "Go to Login" button — no manual handling needed
☐ title and description only overridden when the default message is not contextual enough
```

---

### DataError

`@/components/blocks/data-error`

```
☐ error is an Error object or string — not an HTTP status code (use ApiError for that)
☐ variant chosen based on context:
  "inline"    inside a Card or small section — Alert style, compact
  "card"      default — full Card with Alert detail inside
  "full-page" when the error fills an entire page area (min-h-[400px] centered)
☐ onRetry provided when the data can be re-fetched
☐ title and description only overridden when the default is not specific enough
```

---

### ErrorBoundary

`@/components/blocks/error-boundary`

```
☐ Used as a React class error boundary — catches unexpected JS errors in component trees
☐ children is the subtree being protected
☐ fallback only provided when a custom error UI is needed (rare)
☐ onError used to log errors to an error tracking service (Sentry, etc.)
☐ Wraps individual risky components or sections — not entire pages
  (RouteErrorBoundary handles page-level crashes)
☐ The reset button ("Try Again") remounts the component tree
☐ In App.tsx: wraps RouterProvider — catches errors before routing begins
```

---

### RouteErrorBoundary

`@/components/blocks/route-error-boundary`

```
☐ Used ONLY as errorElement in React Router route config — never rendered in JSX
☐ Every router segment has errorElement: <RouteErrorBoundary />
☐ Handles both route errors (404, redirect failures) and JS errors during navigation
☐ No props — it reads the error from useRouteError() automatically
☐ The "Go Home" button navigates to "/" using useNavigate()
☐ The "Try Again" button reloads the page with window.location.reload()
```

---

## ACTIONS & DIALOGS

---

### ConfirmDialog

`@/components/blocks/confirm-dialog`

```
☐ trigger is always provided — the button or element that opens the dialog
☐ trigger uses asChild pattern inside the component — wrap Button directly
☐ title clearly states what is being confirmed ("Delete Patient" not "Confirm")
☐ description explains the consequence, especially for destructive actions
☐ variant="destructive" for irreversible actions (delete, remove, purge)
☐ variant="default" for important but reversible confirmations (submit, send)
☐ confirmLabel matches the action ("Delete" not "Yes" or "OK")
☐ onConfirm handles async operations — the component shows loading state automatically
☐ isLoading passed externally only when loading is controlled outside the component
☐ open and onOpenChange only used for controlled open state (rare)
☐ Every Button variant="destructive" in the app is wrapped in ConfirmDialog
```

---

### Sheet

`@/components/ui/sheet`

```
☐ side="right" for most cases (detail panels, edit forms)
☐ side="left" only for navigation drawers
☐ side="bottom" for mobile-friendly panel overlays
☐ SheetHeader always contains SheetTitle (accessibility requirement)
☐ SheetDescription provided when context helps — not required
☐ SheetFooter contains Cancel and primary action buttons
☐ SheetClose wraps the Cancel button to close on click
☐ Content inside Sheet is not too wide for the panel (max-w-sm default)
☐ Not used for confirmation dialogs — use ConfirmDialog instead
```

---

### Dialog

`@/components/ui/dialog`

```
☐ DialogTitle always provided inside DialogHeader (accessibility requirement)
☐ DialogDescription provided when the purpose isn't immediately obvious
☐ DialogFooter contains the action buttons
☐ Not used for simple yes/no confirmations — use ConfirmDialog instead
☐ Not used for slide-in panels — use Sheet instead
☐ Content fits within the modal without scrolling when possible
```

---

### Drawer

`@/components/ui/drawer`

```
☐ Used for bottom-sheet interactions (mobile-first)
☐ DrawerTitle provided inside DrawerHeader
☐ Not used for desktop slide-in panels — use Sheet instead
☐ Not used for confirmation dialogs — use ConfirmDialog instead
```

---

## FORMS

---

### Label + Input (basic pair)

```
☐ Every input has a paired <Label htmlFor="id"> with a matching id attribute
☐ Labels are visible — not just placeholders
☐ Placeholder text is example content ("m@example.com") — not the label itself
☐ Error messages displayed below the input using FieldError or a <p> with text-destructive
☐ aria-invalid={!!error} added to inputs with validation errors
☐ required attribute or aria-required="true" on required fields
```

---

### Field System (`@/components/ui/field`)

```
☐ Field wraps a single input + label + description + error unit
☐ FieldLabel wraps both the Label and the input element
☐ FieldDescription used when helpful context exists (not just restating the label)
☐ FieldError receives the error object from form validation
☐ FieldGroup wraps multiple Fields that belong to one logical section
☐ orientation="horizontal" used for toggle/switch settings (label left, control right)
☐ FieldSet + FieldLegend used for grouped radio buttons or checkboxes
```

---

### Stepper

`@/components/blocks/stepper`

```
☐ steps array has at least 2 steps
☐ Each step has a unique id
☐ currentStep is 0-indexed
☐ orientation="horizontal" for page-wide wizards (default)
☐ orientation="vertical" for sidebar-style flows
☐ StepperContent renders only the active step — all steps are declared in the JSX
☐ Navigation buttons (Back / Next / Submit) are separate from Stepper component
☐ Back button is disabled when currentStep === 0
☐ Submit only triggered when currentStep === steps.length - 1
☐ completedSteps only passed when step completion is controlled externally
```

---

## NAVIGATION

---

### BackButton

`@/components/blocks/back-button`

```
☐ href provided for explicit destination (recommended for predictable navigation)
☐ onClick provided for custom navigation logic
☐ Neither href nor onClick causes navigate(-1) to fire automatically
☐ label only provided when the button needs visible text alongside the arrow icon
☐ Used in PageHeader's leading slot — not placed elsewhere on the page
```

---

### GlobalHeader

`@/components/blocks/global-header`

```
☐ Never used directly in pages — it is rendered by AppShell automatically
☐ Breadcrumbs auto-generated from pathname — only pass breadcrumbs prop to AppShell
  when overriding is needed
☐ ThemeToggle, Bell, Settings, and user avatar dropdown are built in — do not duplicate
```

---

### GlobalSidebar

`@/components/blocks/global-sidebar`

```
☐ Never used directly in pages — rendered by AppShell automatically
☐ Navigation items configured exclusively in src/lib/sidebar-config.ts
☐ SidebarItem.roles used for role-based visibility — not hidden with CSS
☐ SidebarItem.badge used for notification counts or "New" labels
☐ SidebarItem.disabled used when an item exists but is not yet available
```

---

### GlobalFooter

`@/components/blocks/global-footer`

```
☐ Never used directly in pages — rendered by AppShell automatically
☐ Not customizable via props (static copyright footer)
```

---

## CALENDAR

---

### CALENDAR — CalendarLayout

`@/components/layouts/calendar-layout`

```
☐ All three slots (sidebar, calendar, details) are always provided
☐ Parent uses overflow-hidden
☐ sidebarWidth and detailsWidth only overridden when 280px/320px doesn't fit
```

---

### CalendarSidebar

`@/components/blocks/calendar-sidebar`

```
☐ selectedDate and onDateSelect paired for controlled date selection
☐ accounts array provided when multiple calendar accounts exist
☐ onAccountToggle provided to handle account enable/disable
```

---

### CalendarMonthView

`@/components/blocks/calendar-month-view`

```
☐ selectedDate and onDateSelect provided for controlled selection
☐ events array contains CalendarEvent objects with at least id, title, date
☐ event.color is one of: "red" | "green" | "blue" | "orange" | "purple" | "teal"
☐ onMonthChange used to fetch events for a new month when navigating
```

---

### CalendarWeekView

`@/components/blocks/calendar-week-view`

```
☐ selectedDate is required (not optional)
☐ events with startTime and endTime are positioned on the time grid
☐ allDay events appear in the all-day row at the top
☐ onWeekChange used to fetch events for a new week when navigating
```

---

### CalendarDayDetails

`@/components/blocks/calendar-day-details`

```
☐ selectedDate and events both provided
☐ onEventClick handles what happens when a specific event is clicked
☐ onCreateEvent handles the "+" new event button in the panel header
☐ Events filtered to the selected date automatically — no pre-filtering needed
```

---

## AUTH

---

### LoginForm

`@/components/blocks/login-form`

```
☐ onLogin receives (email: string, password: string) — actual auth logic lives outside
☐ onGoogleLogin provided when OAuth login is available
☐ showSignupLink and signupLink set when signup is accessible from the login screen
☐ showForgotPassword and forgotPasswordLink set when password reset exists
☐ title and description only overridden when the defaults ("Login", etc.) don't fit
☐ Placed inside a login page template — not directly in a router element
```

---

### PasswordResetForm

`@/components/blocks/password-reset-form`

```
☐ onReset receives (email: string) — actual reset logic lives outside
☐ showLoginLink and loginLink set when back-to-login navigation is desired
☐ isLoading passed to show button loading state during the async reset request
☐ title and description only overridden when the defaults don't fit
```

---

## FEEDBACK

---

### Toast (Sonner)

`sonner` package, Toaster from `@/components/ui/sonner`

```
☐ <Toaster /> mounted exactly once in App.tsx — never in pages or components
☐ toast.success() used for completed actions
☐ toast.error() used for failed actions — always includes a description
☐ toast.loading() / toast.dismiss() used for manual loading → resolve flows
☐ toast.promise() used for async actions (preferred over manual loading/dismiss)
☐ toast.warning() used for non-blocking cautions
☐ toast.info() used for neutral informational messages
☐ Toast messages are short and action-oriented ("Patient saved" not "The patient record was successfully saved to the database")
☐ import { toast } from "sonner" — not from the component file
```

---

## PRIMITIVES

---

### ButtonGroup

`@/components/ui/button-group`

```
☐ Used when 2+ buttons are visually grouped as a unit (e.g. Day / Week / Month toggle)
☐ orientation="horizontal" (default) for side-by-side buttons
☐ orientation="vertical" for stacked button groups
☐ ButtonGroupText used for a non-interactive label prefix inside the group
☐ ButtonGroupSeparator used for a visual divider between group segments
☐ All buttons inside use the same size
```

---

### InputGroup

`@/components/ui/input-group`

```
☐ Used when an Input needs a prefix icon, suffix button, or text addon
☐ InputGroupAddon contains the addon content (icon, text, button)
☐ align="inline-start" for left-side addons (most common — search icon, prefix text)
☐ align="inline-end" for right-side addons (copy button, unit label)
☐ align="block-start" for top addons (label-above-input pattern)
☐ align="block-end" for bottom addons (helper text below input)
☐ The Input inside InputGroup does not need its own border — InputGroup handles it
```

---

### Kbd / KbdGroup

`@/components/ui/kbd`

```
☐ Kbd wraps a single key label (⌘, K, Enter, Shift)
☐ KbdGroup wraps multiple Kbd elements for a key combination
☐ Used inside Tooltip content for keyboard shortcut hints
☐ Used in help text or empty states to teach users shortcuts
☐ Dark styling inside TooltipContent is applied automatically — no override needed
```

---

### ChartContainer

`@/components/ui/chart`

```
☐ config object defines all data keys with label and color
☐ color values in config use var(--chart-1) through var(--chart-5) — not hardcoded
☐ className includes an explicit height (h-64, h-80) — charts need a defined height
☐ ChartTooltip with ChartTooltipContent used for consistent tooltip styling
☐ ChartLegend with ChartLegendContent used for consistent legend styling
☐ All Recharts components are children of ChartContainer — not standalone
☐ CartesianGrid uses vertical={false} for a cleaner look (standard in this DS)
☐ XAxis and YAxis both have tickLine={false} axisLine={false} (standard)
```

---

### ThemeToggle

`@/components/theme-toggle`

```
☐ Already included in GlobalHeader — do not add a second ThemeToggle to the page
☐ Only added manually when building a custom header or public landing page
☐ No props — reads and sets theme from next-themes automatically
```

---

### PRIMITIVES — AvatarGroup

`@/components/blocks/avatar-group`

```
☐ avatars array has at least 1 item
☐ Each item has a unique id and a name string
☐ max set to prevent visual overflow (3–5 is typical)
☐ size consistent with surrounding context
☐ showTooltips left true unless the tooltip causes positioning issues
```

---

### PageSection / PageSectionGrid

`@/components/blocks/page-section`

```
PageSection:
☐ Used for every named content group — not bare divs with h2 tags
☐ title is a short noun phrase ("Patient Records", "Team Members")
☐ description is 1 sentence max — not a paragraph
☐ actions contains small Buttons (size="sm") — not full-size CTA buttons
☐ divider set when a horizontal rule below the header helps structure
☐ Never nests another PageSection inside it

PageSectionGrid:
☐ Always a direct child of PageSection
☐ cols value reflects the number of meaningful columns at desktop (not mobile)
☐ Does not receive custom responsive class overrides — built-in breakpoints handle it
```