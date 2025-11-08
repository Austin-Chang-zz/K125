# Design Guidelines: Kostolany Egg Trading Platform

## Design Approach

**Selected System:** Material Design + Financial UI Patterns (Data-Dense Application)

**Justification:** This is a professional trading analysis tool where information density, rapid data scanning, and functional efficiency are paramount. Material Design provides robust patterns for complex data tables and real-time updates, while financial UI patterns ensure optimal readability of numerical data.

**Key Principles:**
- Data hierarchy: Critical trading signals must be immediately scannable
- Information density: Maximize useful data per screen without overwhelming
- Consistency: Traders need predictable interfaces for fast decision-making
- Real-time clarity: Live updates must be visually distinct without being distracting

---

## Typography

**Font Families:**
- Primary: Inter (Google Fonts) - excellent for data tables and UI
- Monospace: JetBrains Mono - for stock codes, numerical data, timestamps

**Hierarchy:**
- Page Headers: text-2xl font-semibold
- Section Headers: text-lg font-medium
- Matrix Column Headers: text-sm font-medium uppercase tracking-wide
- Data Cells: text-sm font-normal (numbers in monospace)
- Stock Codes: text-sm font-mono font-medium
- Indicators/Badges: text-xs font-medium
- Chart Labels: text-xs

**Reading Optimization:**
- Tabular data: mono-spaced numbers right-aligned for easy comparison
- Stock symbols: Always UPPERCASE with mono font
- Percentage changes: Include +/- prefix for immediate recognition

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 or p-6
- Section gaps: gap-4 or gap-6
- Matrix cell padding: p-2
- Card spacing: space-y-6
- Grid gaps: gap-2 (tight data) or gap-4 (content sections)

**Container Structure:**
- Dashboard wrapper: Full viewport with fixed sidebar
- Matrix containers: max-w-full with horizontal scroll
- Content sections: px-6 py-4
- Modals/Dialogs: max-w-4xl for charts, max-w-md for alerts

---

## Component Library

### Core Layout Components

**Sidebar Navigation (Fixed Left, 240px)**
- Logo/Brand at top (h-16)
- Navigation sections with icons (Heroicons)
- Sections: Dashboard, Main Matrix, Previous Matrix, Target Lists (1-6), Charts, Messages, Alerts, Settings
- Active state: Border accent on left edge
- Collapsible with icon-only mode

**Top Bar (Fixed, h-16)**
- Current time display (HH:MM:SS with live update)
- Market status indicator ("Trading" / "Closed" / "Pre-Market")
- Quick filters and search
- User profile dropdown (right-aligned)
- Notification bell with badge count

### Matrix Display Components

**Main Matrix / Previous Matrix (Notion-like Grid)**
- Spreadsheet-style table with frozen header row
- Minimum column width: 100px, resizable
- Sticky first column (stock code/name)
- Row height: h-10 for data density
- Alternating row treatment for readability
- Hover state: Entire row highlighted
- Right-click context menu overlay
- Drag handles for reordering columns
- Cell content alignment: Left for text, right for numbers
- Phase indicators: Badge components (Y, A1-A3, X, B1-B3)

**Column Header Design:**
- Two-line headers: Label + Units/Timeframe
- Sort indicators (arrows)
- Filter dropdown icon
- Resizing handle on right edge
- Right-click for column actions menu

**Target List Cards**
- 6 cards in 2x3 or 3x2 grid layout
- Each card: Compact table view (max 20 rows visible, scrollable)
- Card header: Editable title + stock count + action menu
- Add button: Prominent at card top-right
- Drag-drop zones: Visual feedback with border treatment

### Chart Components

**K-Bar Chart Container**
- Modal overlay: Full-screen option or embedded panel
- Chart area: min-h-96 or adaptive to content
- TradingView widget integration (iframe embed)
- Timeframe selector: Tabs for Daily/Weekly
- MA overlay toggles: Checkboxes for MA2/10/26/50/132
- SAR indicator toggle
- Stock info panel: Fixed top-right with current price, change%, volume

**Chart Toolbar:**
- Horizontal button group at top
- Actions: Timeframe, Indicators, Compare, Fullscreen, Export
- Icon buttons with tooltips

### Messaging System

**Chat Interface (Right Sidebar or Dedicated Page)**
- Channel list (left panel, w-60): Group channels + DMs
- Message area (flex-1): Chat messages with timestamps
- Input box (fixed bottom): Multi-line text area + send button
- Message bubbles: Different alignment for self/others
- Stock tag preview: Inline mini-chart on hover over @stock2330
- User avatars: 32px circles
- Timestamp: text-xs, positioned top-right of bubble

**Message Actions:**
- Reply thread indicator
- React with emoji
- Pin important messages
- Search messages box at channel top

### Alert System

**Alert Builder Modal**
- Form layout: Two-column for condition selection
- Condition dropdowns: Stock, Indicator, Operator, Value
- AND/OR logic builder with visual connectors
- Preview section: Shows which stocks currently match
- Action buttons: Save Alert, Test Alert, Cancel

**Alert Notification (Toast/Pop-up)**
- Position: top-right corner, stacked
- Auto-dismiss: 8 seconds
- Content: Stock code + Alert condition + Current value
- Actions: View Chart, Dismiss, Snooze
- Max width: max-w-sm
- Sound indicator icon

### Data Display Patterns

**Indicator Badges:**
- Rounded rectangles: px-2 py-1 rounded text-xs
- MA Cross signals: "XO" / "XU" badges
- Slope indicators: "↑" / "↓" symbols
- SAR count: Number in circle badge

**Numerical Data Cells:**
- Percentage changes: Show +/- prefix, mono font
- Volume: Abbreviated (K, M, B) with full value on hover
- Price: 2 decimal precision, right-aligned
- Conditional formatting indicators: Small bars or directional triangles

**Status Indicators:**
- Market status: Pill badge in top bar
- Data sync status: Spinner icon or timestamp "Last updated: HH:MM"
- Connection status: Dot indicator (WebSocket connected/disconnected)

### Form Components

**Input Fields:**
- Standard height: h-10
- Labels: text-sm font-medium mb-2
- Helper text: text-xs text-muted
- Error states: Red border + error message below

**Buttons:**
- Primary: px-4 py-2 rounded font-medium
- Secondary: Outlined variant
- Icon buttons: 32px square for toolbars
- Loading states: Spinner inside button

**Dropdowns/Selects:**
- Trigger height: h-10
- Menu positioning: Below trigger with max-h-60 overflow-scroll
- Search within long lists
- Multi-select with chips

---

## Specific Feature Implementations

**Daily Flow Visual Feedback:**
- 8:40 AM clear: Loading overlay "Moving to Previous Matrix..."
- 9:03 AM: Toast notification "VV100 initialized"
- 30-min updates: Subtle progress indicator in top bar
- 2:30 PM sync: Status badge changes to "Syncing Data..."

**Phase Visualization:**
- Egg phase column: Badge with phase label (Y, A1, A2, A3, X, B1, B2, B3)
- Phase transition logs: Timeline view in dedicated panel
- Visual flow diagram: Circular egg diagram showing current phase positions

**Notion-like Interactions:**
- Right-click menu: Overlay with white background, shadow-lg, rounded-lg
- Drag preview: Semi-transparent ghost element following cursor
- Drop zones: Dashed border treatment on hover
- Field type selector: Icon grid for quick selection

**Real-time Updates:**
- Flashing effect: Brief pulse on cell value change (subtle)
- New data badge: Small "NEW" label for recently updated rows
- Live timestamp: Animated clock icon when data streaming

---

## Accessibility & Performance

- Keyboard navigation: Full support for matrix navigation (arrow keys, tab)
- Focus indicators: Visible outline on all interactive elements
- Screen reader: ARIA labels for all data cells
- High contrast: Ensure 4.5:1 minimum contrast ratios
- Virtualized scrolling: For matrices with 100+ rows
- Lazy loading: Charts load on-demand, not all at page load

---

## Images

**No large hero images required.** This is a data-centric application where screen real estate is precious for information display.

**Icon Usage:**
- Heroicons library for all UI icons
- Inline SVG for custom financial indicators (arrows, trend lines)
- Stock logos: Optional 24px favicons next to stock codes if available