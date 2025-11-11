# Cafe POS App - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Toast POS / Square POS) + Material Design System
**Justification:** This is a utility-focused, touch-optimized productivity tool requiring efficiency and clarity. Drawing from successful POS systems ensures familiar interaction patterns while Material Design provides robust component guidelines for data-dense interfaces.

**Core Principles:**
- Speed-first interactions - every tap should feel instant
- Touch-optimized targets (minimum 44x44px)
- Clear visual hierarchy prioritizing the running total
- Scannable menu item organization

## Typography

**Font Family:** Inter or Roboto via Google Fonts
- Display (Running Total): 48px, Bold (700)
- Menu Item Prices: 24px, Semibold (600)
- Menu Item Names: 18px, Medium (500)
- Button Text: 16px, Medium (500)
- Secondary Info: 14px, Regular (400)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 3, 4, 6, 8
- Component padding: p-4 or p-6
- Item spacing: gap-3 or gap-4
- Section margins: m-6 or m-8
- Touch targets: Minimum h-12 (48px)

**Grid Structure:**
- Single-column mobile layout (full-width)
- Two-column desktop: Menu items (60%) | Order summary (40%)
- Max container width: max-w-6xl

## Component Library

### Primary Components

**Order Summary Panel** (Sticky/Fixed Position)
- Running total display (large, prominent)
- Itemized list with quantities, names, individual prices
- Item removal buttons (small "×" touch targets)
- Clear All button (destructive action, secondary style)
- Checkout/Complete Order button (primary, full-width)

**Menu Grid**
- Card-based layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Each card: Item name, price in £, quick-add button
- Cards have subtle borders, rounded corners (rounded-lg)
- Touch-friendly sizing: min-h-24

**Category Tabs** (Optional Quick Filters)
- Horizontal scrollable tabs: Coffee, Tea, Food, Pastries, Drinks
- Active state clearly distinguished
- Sticky below header on scroll

**Action Buttons**
- Primary CTA: Solid, bold, high contrast
- Destructive actions: Outlined, warning treatment
- Quick-add: Compact, repeatable interaction

### Navigation
- Simple top bar with cafe branding/name
- Clear All / New Order actions prominently accessible
- No complex navigation needed

### Forms & Inputs
- Quantity adjusters: +/- buttons flanking number display
- Custom item entry: Modal with name + price fields
- Large, touch-friendly number pad for price entry

## Data Display Patterns

**Price Formatting:**
- Always prefix with £ symbol
- Two decimal places (£3.50, not £3.5)
- Running total uses larger, bolder typography

**Item List Display:**
- Quantity × Item Name ... £Price format
- Right-aligned prices for easy scanning
- Clear visual separation between items (border or spacing)

**Empty States:**
- Center-aligned message when no items added
- Helpful prompt: "Tap items to add to order"

## Interaction Patterns

**Adding Items:**
- Single tap on menu card adds item
- Visual feedback: Brief scale/highlight animation
- Sound optional (configurable)

**Removing Items:**
- Tap "×" button next to item in summary
- No confirmation for single item removal
- Confirmation modal for "Clear All"

**Touch Targets:**
- All interactive elements minimum 44×44px
- Adequate spacing between adjacent buttons (gap-3)
- Avoid cramped layouts

## Animations

**Minimal, Purposeful Only:**
- Item addition: Brief fade-in to order list (150ms)
- Total update: Smooth number transition (200ms)
- No scroll-triggered effects
- No decorative animations

## Accessibility

- High contrast ratios for all text
- Large, readable typography
- Clear focus states for keyboard navigation
- Screen reader labels for all interactive elements
- Consistent touch target sizing throughout

## Images

**No hero image required** - This is a utility-focused POS application where function trumps decoration. Interface should be clean and distraction-free.

## Performance Considerations

- Instant item addition (no loading states)
- Local calculation (no server delays for totals)
- Minimal bundle size for fast loading in cafe wifi conditions