---
name: Pockly Editorial Finance
colors:
  surface: '#fff8f6'
  surface-dim: '#e9d6d1'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ed'
  surface-container: '#fdeae4'
  surface-container-high: '#f7e4df'
  surface-container-highest: '#f1dfd9'
  on-surface: '#231916'
  on-surface-variant: '#56423c'
  inverse-surface: '#392e2b'
  inverse-on-surface: '#ffede8'
  outline: '#89726b'
  outline-variant: '#dcc1b8'
  surface-tint: '#9d4324'
  primary: '#9a4021'
  on-primary: '#ffffff'
  primary-container: '#b95837'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59d'
  secondary: '#5f5e5a'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfda'
  on-secondary-container: '#64635e'
  tertiary: '#006768'
  on-tertiary: '#ffffff'
  tertiary-container: '#008283'
  on-tertiary-container: '#f3fffe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390b00'
  on-primary-fixed-variant: '#7e2c0e'
  secondary-fixed: '#e5e2dd'
  secondary-fixed-dim: '#c9c6c1'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#89f4f4'
  tertiary-fixed-dim: '#6cd7d8'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#004f50'
  background: '#fff8f6'
  on-background: '#231916'
  surface-variant: '#f1dfd9'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  title-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  margin-mobile: 20px
  gutter: 12px
---

## Brand & Style

This design system is built on an **Editorial Minimalism** philosophy. It moves away from the cold, sterile nature of traditional fintech, instead embracing a warm, humanistic aesthetic inspired by literary journals and high-end stationery. The brand personality is knowledgeable, calm, and deliberate.

The interface prioritizes negative space and clear typographic hierarchies to reduce financial anxiety. By combining a warm "Parchment" palette with "Terracotta" accents, the system evokes a sense of longevity and tactile quality, making digital wealth management feel as grounded as physical bookkeeping.

## Colors

The color palette is intentionally restricted to maintain an analog, printed feel. 

- **Background (Parchment):** The foundation of the app, providing a warm, low-fatigue canvas.
- **Surface (Ivory):** Used for interactive cards and containers to create subtle contrast against the background.
- **Brand Accent (Terracotta):** Reserved for primary actions, success states, and critical brand moments. It should be used sparingly to maintain its impact.
- **Ink (Text):** Primary text uses a near-black for high legibility, while secondary text uses a muted stone-grey for metadata and captions.
- **Rule Lines (Border):** A soft, medium-contrast beige used for structural dividers and element outlines.

## Typography

The typography system relies on the interplay between **Newsreader** (Serif) and **Inter** (Sans-serif). 

1.  **Serif (Newsreader):** Used for storytelling elements—account balances, section headers, and "editorial" insights. It conveys authority and heritage.
2.  **Sans-serif (Inter):** Used for functional UI elements—labels, data tables, button text, and form inputs. It ensures clarity and speed of reading at small sizes.

Maintain generous line heights to preserve the "airy" editorial feel. Use the `label-caps` style for small headers or category tags to create a rhythmic distinction between data and labels.

## Layout & Spacing

This design system utilizes a **Fluid-Margin Grid** model. On mobile, a standard 20px outer margin is maintained, while internal content is organized into a 2-column or 4-column logical structure.

Spacing is based on a 4px baseline grid. To reinforce the editorial style:
- Use **xl (40px)** spacing between major sections to allow the layout to breathe.
- Use **md (16px)** for internal card padding.
- Horizontal rules should be used to separate list items rather than background shifts.

## Elevation & Depth

To maintain a flat, printed aesthetic, this system avoids traditional drop shadows. Instead, it uses **Ring Shadows** and **Tonal Layering**:

- **Layer 0 (Background):** Parchment (#f5f4ed).
- **Layer 1 (Cards):** Ivory (#faf9f5) with a 1px solid border in Border Medium (#e8e6dc).
- **Floating Elements:** Instead of a shadow, use a 2px "ring" (an outer stroke) using a slightly darker version of the border color or a very subtle 0%–5% opacity black tint to suggest a slight lift without mimicking a light source.

Depth is communicated through the physical stacking of elements and the contrast between the Parchment and Ivory surfaces.

## Shapes

The shape language is sophisticated and controlled. A uniform **12px radius** is applied to all primary containers and cards, creating a "soft-square" look that feels modern yet sturdy.

Small UI components like buttons and tags use a slightly tighter **8px radius** to distinguish them from structural containers. Circular shapes are reserved exclusively for avatars and status indicators.

## Components

### Buttons
- **Primary:** Filled Terracotta (#c96442) with white or Ivory text. No shadow; 8px radius.
- **Secondary:** Ivory surface with a 1px Border Medium (#e8e6dc) outline. Primary Text.
- **Ghost:** No background or border. Primary Text with underlined Serif for "Learn More" links.

### Cards
Cards are the primary organizational unit. They must use the Ivory surface (#faf9f5) and the 12px border radius. Padding is strictly 16px or 24px. For grouped data, use internal dividers (#e8e6dc) rather than nesting cards.

### Input Fields
Inputs should feel like a physical form. Use a 1px border (#e8e6dc) on all sides. On focus, the border color shifts to Terracotta. Use Inter (Sans-serif) for input text and Newsreader (Serif) for field labels to emphasize the editorial feel.

### Lists & Dividers
List items are separated by a 1px horizontal rule in Border Medium. Do not use chevrons for navigation unless the list is deeply nested; use typographic emphasis (Weight/Color) to indicate interactivity.

### Finance-Specific Components
- **Trend Indicators:** Instead of bright green/red, use Terracotta for positive trends and Secondary Text for neutral/downward trends to maintain the palette's warmth.
- **Progress Bars:** Use a thick (8px) Terracotta bar on a Border Medium track.