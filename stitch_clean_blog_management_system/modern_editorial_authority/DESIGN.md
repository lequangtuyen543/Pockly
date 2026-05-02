---
name: Modern Editorial Authority
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#404753'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#707785'
  outline-variant: '#c0c7d6'
  surface-tint: '#005fae'
  primary: '#005daa'
  on-primary: '#ffffff'
  primary-container: '#0075d5'
  on-primary-container: '#fefcff'
  inverse-primary: '#a5c8ff'
  secondary: '#266d00'
  on-secondary: '#ffffff'
  secondary-container: '#85fa51'
  on-secondary-container: '#287100'
  tertiary: '#934600'
  on-tertiary: '#ffffff'
  tertiary-container: '#b95a00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a5c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004785'
  secondary-fixed: '#88fd54'
  secondary-fixed-dim: '#6de039'
  on-secondary-fixed: '#062100'
  on-secondary-fixed-variant: '#1a5200'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#ffb688'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#733600'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  h1:
    fontFamily: Inter
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 46px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  code:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1200px
  sidebar-width: 256px
  gutter: 24px
  margin-page: 32px
---

## Brand & Style

The design system is rooted in the principles of clarity, efficiency, and professional rigor. It targets content creators and site administrators who require a tool that feels both powerful and unobtrusive. The visual style is **Corporate / Modern**, heavily influenced by the structured logic of Ant Design. 

The emotional response should be one of "effortless organization." By utilizing generous whitespace and a restricted color palette, the system ensures that the content remains the focal point, while the management interface feels like a high-precision instrument rather than a cluttered dashboard.

## Colors

The palette is anchored by a functional **Deep Blue** (#1890ff), signifying trust and action. A supporting **Success Green** (#52c41a) is utilized for "Published" statuses and positive confirmations. 

The neutral scale is critical for the "Clean" aesthetic:
- **Backgrounds:** Use a very light cool-grey (#f0f2f5) to differentiate the canvas from the white (#ffffff) component surfaces.
- **Borders:** Use a consistent light stroke (#d9d9d9) for all UI boundaries to maintain the structured, table-centric feel of the admin interface.
- **Text:** Primary text utilizes a near-black (#262626) for high legibility, while secondary metadata uses a mid-grey (#8c8c8c).

## Typography

This design system exclusively uses **Inter** to achieve a systematic, utilitarian aesthetic. The hierarchy is strictly enforced through weight and color rather than excessive size variations. 

- **Headlines:** Use Semi-Bold (600) for all headings to provide a strong visual anchor.
- **Body Text:** Standard reading content uses Body-MD for clarity. Admin tables and dense interfaces should default to Body-SM.
- **Labels:** Small, uppercase labels are used for category tags and table headers to create a clear distinction between data and metadata.

## Layout & Spacing

The layout utilizes a **Fixed Grid** philosophy for public views and a **Hybrid Fluid** model for the admin dashboard.

- **Public View:** Content is centered within a 1200px container. This focuses the reader's eye and prevents line lengths from becoming unreadable on ultra-wide monitors.
- **Admin View:** Features a fixed-width sidebar (256px) with a fluid content area. This allows tables to expand to show more data columns as needed.
- **Rhythm:** An 8px base unit governs all spacing. Gaps between cards and table rows should consistently use 24px (3x base) to ensure a "breathable" but professional density.

## Elevation & Depth

To maintain the Ant Design-inspired clean look, this design system avoids heavy drop shadows. Depth is communicated primarily through **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** The base grey layer (#f0f2f5).
- **Level 1 (Cards/Surface):** White surfaces with a 1px solid border (#f0f0f0). No shadow.
- **Level 2 (Hover/Active):** When a card or element is interactive, it gains a subtle ambient shadow (0 2px 8px rgba(0,0,0,0.06)) and the border color shifts to the primary blue.
- **Level 3 (Modals/Popovers):** Elevated elements use a more defined shadow (0 9px 28px rgba(0,0,0,0.05)) to separate them from the interface.

## Shapes

The shape language is **Soft** and disciplined. A standard radius of 4px (0.25rem) is applied to buttons, input fields, and small UI components to provide a modern feel without appearing overly "bubbly" or consumer-grade. Large containers like cards and modal overlays use an 8px (0.5rem) radius. 

Buttons should never be pill-shaped; they must remain rectangular with the defined soft corners to maintain the professional, systematic tone.

## Components

### Cards
Post cards must be minimalist. No heavy shadows—only a light border. The image should be at the top, followed by a padded section (24px) containing the category label (Primary Blue text), the H3 title, and a short snippet in Body-SM.

### Admin Tables
Tables are the heart of the management system. 
- **Header:** Light grey background (#fafafa) with Semi-Bold text.
- **Rows:** 1px bottom border. Hover state should change the row background to a very faint blue (#e6f7ff).
- **Actions:** Icons should be used sparingly, with text labels (e.g., "Edit", "Delete") in Body-SM to ensure clarity.

### Forms & Inputs
- **Inputs:** 1px border (#d9d9d9). On focus, the border changes to Primary Blue and gains a subtle blue "glow" (2px spread shadow).
- **Buttons:** Primary buttons are solid Blue with White text. Secondary buttons are White with Blue text and a Blue border.

### Sidebar
The sidebar uses a dark theme (Neutral #001529) to contrast with the light content area, creating a clear mental model of "Navigation" vs. "Work Area." Navigation items use 16px of horizontal padding and clear, thin-line icons.