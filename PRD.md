# Planning Guide

A monthly marketing calendar application that allows teams to view, manage, and filter marketing events across four solution categories with an adjustable grid layout that accommodates multiple events per day.

**Experience Qualities**: 
1. **Organized** - Clear visual hierarchy with color-coded solutions and a clean calendar grid that makes it easy to scan events at a glance
2. **Flexible** - Dynamic cell heights that adjust to show all events for busy days without scrolling, with powerful filtering capabilities
3. **Professional** - Business-focused design with crisp typography, structured event details, and seamless hyperlink integration for registration pages

**Complexity Level**: Light Application (multiple features with basic state)
The app manages event data with CRUD operations, filtering, and modal interactions, but focuses on a single calendar view without complex routing or advanced state management.

## Essential Features

**Monthly Calendar View**
- Functionality: Displays a traditional month grid calendar starting on Sunday, showing all marketing events for the selected month
- Purpose: Provides teams with a comprehensive overview of all scheduled marketing activities
- Trigger: Auto-loads current month on app launch
- Progression: App loads → Current month displays → Events populate calendar cells → User can navigate months with prev/next controls
- Success criteria: All events for the month are visible, multiple events per day are shown without overflow, cells adjust height dynamically

**Solution-Based Filtering**
- Functionality: Filter events by one of four solutions: AI Business Solutions, Cloud and AI Platforms, Security, or All CSAs
- Purpose: Allows users to focus on specific solution areas without visual clutter
- Trigger: User clicks solution filter buttons in the top toolbar
- Progression: User clicks filter → Calendar updates → Only events matching selected solution(s) display → "All" option clears filters
- Success criteria: Filtering is instant, multiple filters can be active, visual feedback shows active filters

**Event Creation**
- Functionality: Add new marketing events with complete details including solution category, date/time, location, and external links
- Purpose: Enables team members to contribute and maintain the marketing calendar
- Trigger: User clicks "Add Event" button in top-right corner
- Progression: Click Add button → Modal opens with form → Fill event details (title, solution, date, time, location, Reg Page URL, Viva Engage URL) → Submit → Event appears on calendar
- Success criteria: Form validates required fields, event immediately appears on correct date, modal closes on success

**Event Detail View**
- Functionality: Display full event information in a modal when clicking any event card
- Purpose: Shows complete event details and provides access to registration/collaboration links
- Trigger: User clicks on an event card in the calendar
- Progression: Click event card → Modal opens → View all details → Click hyperlinks to open external pages → Close modal to return
- Success criteria: All event data is visible, URLs are clickable and open in new tabs, modal is easy to dismiss

**Dynamic Cell Sizing**
- Functionality: Calendar cells automatically expand vertically to fit all events scheduled for that day
- Purpose: Ensures all events remain visible within the calendar view without requiring scrolling within cells
- Trigger: Automatic based on number of events per day
- Progression: Events load → System calculates events per day → Cells adjust height → All events display within their date cell
- Success criteria: Days with multiple events show all event cards, single-event days remain compact, layout remains balanced

## Edge Case Handling

**Empty Calendar Days** - Show clean empty state with subtle background to maintain grid structure
**Month Boundaries** - Display previous/next month dates in muted style for context while maintaining Sunday-first alignment
**Long Event Titles** - Truncate with ellipsis in calendar cards, show full title in detail modal
**Invalid URLs** - Validate URL format in form, gracefully handle missing links in detail view
**No Events in Month** - Display friendly empty state message encouraging users to add events
**Multiple Solutions Selected** - Show events that match any selected solution (OR logic)

## Design Direction

The design should evoke efficiency, clarity, and professionalism - like a well-organized business dashboard. It should feel modern and data-driven while remaining approachable for daily use. The interface should emphasize visual scanning with strong color coding and clean typography that helps users quickly identify solution categories and event details.

## Color Selection

A vibrant, distinctive palette with strong solution differentiation and professional contrast.

- **Primary Color**: Deep teal (oklch(0.45 0.12 200)) - Represents trust and structure, used for primary actions and calendar frame
- **Secondary Colors**: 
  - AI Business Solutions: Electric purple (oklch(0.55 0.22 290))
  - Cloud and AI Platforms: Bright cyan (oklch(0.60 0.18 220))
  - Security: Bold crimson (oklch(0.52 0.20 20))
  - All CSAs: Vibrant amber (oklch(0.65 0.18 60))
- **Accent Color**: Coral pink (oklch(0.70 0.15 35)) - Used for Add button and active states to draw attention
- **Foreground/Background Pairings**: 
  - Background (Soft warm gray oklch(0.97 0.01 80)): Dark text (oklch(0.20 0.02 260)) - Ratio 13.2:1 ✓
  - AI Business Solutions (oklch(0.55 0.22 290)): White text (oklch(1 0 0)) - Ratio 6.1:1 ✓
  - Cloud and AI Platforms (oklch(0.60 0.18 220)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Security (oklch(0.52 0.20 20)): White text (oklch(1 0 0)) - Ratio 5.5:1 ✓
  - All CSAs (oklch(0.65 0.18 60)): Dark text (oklch(0.20 0.02 260)) - Ratio 7.2:1 ✓
  - Accent Coral (oklch(0.70 0.15 35)): Dark text (oklch(0.20 0.02 260)) - Ratio 8.5:1 ✓

## Font Selection

Typography should feel executive yet approachable - professional enough for business planning but friendly for daily team use.

- **Primary Font**: DM Sans - A geometric sans with clean structure perfect for data-dense interfaces
- **Accent Font**: Space Grotesk - For headings and calendar dates, bringing technical precision

- **Typographic Hierarchy**: 
  - H1 (Month/Year Header): Space Grotesk Bold / 32px / -0.02em letter spacing
  - H2 (Day Numbers): Space Grotesk Medium / 18px / normal spacing
  - Event Title (Card): DM Sans SemiBold / 13px / tight line height (1.2)
  - Body (Event Details): DM Sans Regular / 14px / comfortable line height (1.5)
  - Labels: DM Sans Medium / 12px / 0.01em letter spacing / uppercase
  - Button Text: DM Sans Medium / 14px / normal spacing

## Animations

Animations should feel snappy and professional, confirming actions without slowing workflow - subtle fades for modals opening/closing, gentle scale on event card hovers, smooth transitions when filtering solutions, and quick height adjustments when calendar cells resize.

## Component Selection

- **Components**: 
  - Button: Primary actions (Add Event) with coral accent, filter pills with solution colors
  - Dialog: Event detail modal and add event form with clean overlay
  - Card: Event cards in calendar cells with solution color left border accent
  - Input/Textarea: Form fields for event creation with clear labels
  - Select: Dropdown for solution category selection in event form
  - Badge: Solution category indicators with color coding
  - Calendar layout: Custom grid component (CSS Grid) for the month view
  
- **Customizations**: 
  - Custom calendar grid component with dynamic row heights based on max events per week
  - Event card component with truncated text and color-coded border
  - Filter button group with multi-select toggle behavior
  - Month navigation with chevron buttons
  
- **States**: 
  - Buttons: Default with subtle shadow, hover with scale(1.02) and brightness increase, active with scale(0.98), disabled with reduced opacity
  - Event cards: Idle with left border accent, hover with full background color and slight elevation, active/clicked with pressed effect
  - Filter buttons: Inactive with outline style, active with filled background in solution color
  - Form inputs: Default with border, focus with accent ring and border color change, error with red border
  
- **Icon Selection**: 
  - Plus (Add event button)
  - CaretLeft/CaretRight (Month navigation)
  - Calendar (Calendar header)
  - MapPin (Location indicator)
  - Link (External links)
  - Funnel (Filter icon)
  - X (Close modals)
  
- **Spacing**: 
  - Calendar grid gap: gap-1 (4px between cells)
  - Card padding: p-2 (8px internal)
  - Section spacing: mb-6 (24px between major sections)
  - Form field spacing: gap-4 (16px between fields)
  - Modal padding: p-6 (24px)
  
- **Mobile**: 
  - Calendar switches to 7-column grid that remains visible (smaller text/padding)
  - Filter buttons stack vertically or scroll horizontally
  - Event cards show minimal info (title + color indicator only)
  - Month navigation remains fixed at top
  - Modals become full-screen sheets on mobile
  - Add button becomes floating action button in bottom-right
