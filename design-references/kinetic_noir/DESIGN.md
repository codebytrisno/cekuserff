---
name: Kinetic Noir
colors:
  surface: '#1d100c'
  surface-dim: '#1d100c'
  surface-bright: '#463630'
  surface-container-lowest: '#170b08'
  surface-container-low: '#261814'
  surface-container: '#2a1c18'
  surface-container-high: '#352722'
  surface-container-highest: '#41312c'
  on-surface: '#f7ddd5'
  on-surface-variant: '#e1bfb5'
  inverse-surface: '#f7ddd5'
  inverse-on-surface: '#3c2d28'
  outline: '#a98a80'
  outline-variant: '#594139'
  surface-tint: '#ffb59d'
  primary: '#ffb59d'
  on-primary: '#5d1900'
  primary-container: '#ff6b35'
  on-primary-container: '#5f1900'
  inverse-primary: '#ab3500'
  secondary: '#ffb2ba'
  on-secondary: '#670020'
  secondary-container: '#d4004b'
  on-secondary-container: '#ffe6e8'
  tertiary: '#59d5fb'
  on-tertiary: '#003543'
  tertiary-container: '#00a7cb'
  on-tertiary-container: '#003744'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#ffd9dc'
  secondary-fixed-dim: '#ffb2ba'
  on-secondary-fixed: '#400011'
  on-secondary-fixed-variant: '#910030'
  tertiary-fixed: '#b5ebff'
  tertiary-fixed-dim: '#59d5fb'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e60'
  background: '#1d100c'
  on-background: '#f7ddd5'
  surface-variant: '#41312c'
typography:
  display-stats:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-h3:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  headline-h1-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1200px
  gutter: 16px
---

## Brand & Style

The design system is engineered for a high-performance gaming utility environment. It prioritizes speed of information retrieval and visual clarity through a **Clean Gaming** aesthetic—moving away from the cluttered tropes of "gamer" UI toward a sophisticated, professional interface. 

The system utilizes a high-contrast dark mode foundation with focused accent points to guide the eye toward critical gameplay statistics and status indicators. It blends **Minimalism** with subtle **Glassmorphism** to create a sense of depth and technical precision. The emotional response is one of authority, reliability, and competitive edge.

## Colors

The palette is anchored in a deep "Obsidian" background to minimize eye strain during long sessions. 
- **Primary (Orange):** Reserved for primary actions, CTA buttons, and active state highlights.
- **Secondary (Crimson):** Used for secondary accents or branding elements to provide a dynamic visual contrast.
- **Surface & Border:** Layers are built using `#1A1A2E` surfaces against the darker `#0F0F1A` base, defined by `#2A2A3E` borders to maintain structural integrity without excessive contrast.
- **Status Colors:** Success and Error tokens are high-chroma to ensure critical alerts (like player online status) are immediately legible.

## Typography

This design system uses **Inter** exclusively to maintain a systematic, utilitarian feel. 
- **Display Stats:** Large, bold sizing is used for primary metrics (K/D ratios, win rates) to ensure they are the first thing a user sees.
- **Hierarchy:** H1 and H2 levels use tight letter spacing to feel more "compact" and aggressive. 
- **Readability:** Body text uses the secondary text color (`#B0B0C0`) to reduce visual noise, while headings remain pure white (`#FFFFFF`) for maximum impact.

## Layout & Spacing

The system follows a **Fluid Grid** model optimized for high-density data visualization.
- **Mobile-First:** A single-column layout with 16px side margins is the baseline. 
- **Desktop:** Transitions to a 12-column grid. Components like "Player Stats Cards" should span 3 or 4 columns depending on the data complexity.
- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm. Use 16px (`md`) for internal card padding and 24px (`lg`) for section spacing.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and subtle **Outer Glows**.
- **Surface Elevation:** Cards sit on the `#1A1A2E` surface. For interactive states, use a subtle border highlight or a 1px solid stroke of the primary color.
- **Shadows:** Avoid heavy black shadows. Use a soft, 15% opacity primary color glow (`#FF6B3526`) for active buttons and featured "Top Tier" player cards.
- **Overlays:** Modals and tooltips should use a backdrop blur (12px) to maintain context while isolating the foreground interaction.

## Shapes

The shape language is controlled and precise.
- **Small (6px):** Used for input fields, checkboxes, and small utility buttons.
- **Medium (12px):** The standard radius for content cards, avatars, and primary action buttons.
- **Large (20px):** Reserved for major layout containers or "Hero" sections to soften the overall technical aesthetic.

## Components

- **Buttons:** Primary buttons use a solid `#FF6B35` fill with white text. Secondary buttons should use a ghost style with the `#2A2A3E` border and a hover state that fills with a subtle tint of primary.
- **Cards:** Stats cards must feature a 1px border. Use the `Display Stats` typography for the hero number and `Label-sm` for the descriptor.
- **Input Fields:** Search bars should be dark (`#0F0F1A`), using the `#2A2A3E` border. On focus, the border transitions to Primary Orange with a 2px outer glow.
- **Status Indicators:** Online/Offline status is shown as a 8px circular dot. "Online" status uses `#00D68F` with a soft matching glow.
- **Chips/Badges:** Use for "Rank" or "Level." These should have a slight background tint (e.g., 10% opacity of the accent color) to differentiate them from static labels.