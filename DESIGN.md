---
name: Executive Slate & Vivid Accents
colors:
  surface: "#faf8ff"
  surface-dim: "#d2d9f4"
  surface-bright: "#faf8ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f2f3ff"
  surface-container: "#eaedff"
  surface-container-high: "#e2e7ff"
  surface-container-highest: "#dae2fd"
  on-surface: "#131b2e"
  on-surface-variant: "#3c4946"
  inverse-surface: "#283044"
  inverse-on-surface: "#eef0ff"
  outline: "#6c7a76"
  outline-variant: "#bbcac5"
  surface-tint: "#006b5f"
  primary: "#006b5f"
  on-primary: "#ffffff"
  primary-container: "#00a896"
  on-primary-container: "#00352e"
  inverse-primary: "#59dbc7"
  secondary: "#a43c13"
  on-secondary: "#ffffff"
  secondary-container: "#fe7e50"
  on-secondary-container: "#6c1f00"
  tertiary: "#7d5800"
  on-tertiary: "#ffffff"
  tertiary-container: "#c38b00"
  on-tertiary-container: "#3e2a00"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#79f7e3"
  primary-fixed-dim: "#59dbc7"
  on-primary-fixed: "#00201c"
  on-primary-fixed-variant: "#005047"
  secondary-fixed: "#ffdbcf"
  secondary-fixed-dim: "#ffb59c"
  on-secondary-fixed: "#390c00"
  on-secondary-fixed-variant: "#822700"
  tertiary-fixed: "#ffdea9"
  tertiary-fixed-dim: "#ffba27"
  on-tertiary-fixed: "#271900"
  on-tertiary-fixed-variant: "#5e4100"
  background: "#faf8ff"
  on-background: "#131b2e"
  surface-variant: "#dae2fd"
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: "800"
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: "700"
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: "700"
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: "600"
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: "700"
    lineHeight: 14px
    letterSpacing: 0.04em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  margin-desktop: 2rem
  gutter-desktop: 1.5rem
  nav-height-desktop: 4rem
  container-xl: 1120px
  container-2xl: 1280px
---

## Brand & Style

The design system establishes a high-performance, executive mobile atmosphere centered on functional clarity, visual composure, and focused energy. Built for dynamic light-mode workflows, the interface balances institutional stability with vibrant, decisive interactions.

The aesthetic is modern corporate minimalism enriched with controlled, vivid micro-accents. Crisp structural surfaces establish an unyielding foundation of trust and authority, while electric teal and warm mango/coral accents inject tactical clarity, guiding eyes directly to points of conversion, state changes, and critical status markers. The emotional cadence is calculated, responsive, and fatigue-free—tailored for prolonged usage on handheld displays under diverse ambient lighting conditions.

## Colors

The palette is engineered around high functional contrast and chromatic balance tailored for a clean, light-mode environment:

- **Primary Accent (`#00A896` - Crisp Teal):** The operational core. Used strictly for primary CTAs, positive state indicators, selected navigation nodes, and focused interaction rings. Communicates precision, security, and forward motion.
- **Secondary Accent (`#FF7F51` - Vivid Coral):** The primary kinetic signal. Reserved for secondary CTAs, urgency markers, critical notifications, and high-priority badge counts. It forms a sharp chromatic counterpoint against the teal.
- **Tertiary Accent (`#FFB703` - Radiant Mango):** The status layer. Deployed for achievements, warning indicators, ratings, and contextual filter badges.
- **Dark Structural Neutral (`#0F172A` - Slate 900):** Anchors all foundational structural text, heavy icons, and prominent headers to maintain optimal contrast ratios.
- **Supporting Text Neutrals:** Slate 600 (`#475569`) for subtitles and body copy; Slate 400 (`#94A3B8`) for placeholders, timestamps, and muted metadata.
- **Canvas & Surface Tiering:** The application baseline sits on a bright light canvas. Surfaces and interactive containers elevate cleanly via layered light containers, divided by subtle structural borders.

## Typography

The typographic hierarchy pairs the geometric, confident proportions of **Manrope** for structural displays with the ultra-legible, neutral engineering of **Inter** for reading density.

- **Headlines & Titles (Manrope):** Geometric construction with tight kerning (`-0.025em` to `-0.01em`). Designed to anchor glanceable data cards and top-level navigation bars without visual clutter.
- **Body & Labels (Inter):** High x-height, clear apertures, and open counter-forms deliver effortless reading at small mobile footprints (`13px`–`16px`).
- **Caps & Badges:** `label-sm` utilizes an uppercase tracking offset of `+0.04em` to ensure instantaneous recognition on high-density displays when paired with solid or tinted background fills.

## Layout & Spacing

The system is constructed around an uncompromising 4px/8px modular base scale, calibrated specifically for touch ergonomics and single-thumb sweep arcs.

- **Grid Strategy:** A fluid 4-column layout on mobile devices (`<640px`) transitioning to 8 columns on tablet viewports (`640px–1024px`), and 12 columns on desktop (`≥1024px`, see **Desktop Layout** at the end of this file).
- **Outer Canvas Margins:** Strict `16px` (`margin: 1rem`) screen edge margins ensure content avoids device edge distortion, extending to `24px` on tablet form factors.
- **Touch Targets:** All primary touch surfaces maintain an absolute minimum interactive footprint of `44px × 44px`, with visual elements utilizing `space-sm` (`8px`) or `space-xs` (`4px`) inner padding to maintain dense visual proportion without missing taps.
- **Reflow & Safe Areas:** Vertical rhythms adapt contextually; top navigation bars respect dynamic system insets, while fixed bottom action sheets implement `env(safe-area-inset-bottom) + space-md` to remain clear of home indicators.

## Elevation & Depth

Depth in this light-mode system relies on tonal surface container tiers and subtle ambient shadows to establish clear hierarchical separation without visual clutter.

- **Level 0 (Base Canvas):** Clean light canvas. Zero elevation.
- **Level 1 (Cards, Modules, Input Groups):** Elevated surface bounded by a crisp structural outline. Shadow is minimal and subtle.
- **Level 2 (Active Cards, Floating Controls, Dropdowns):** Elevated surface with an amplified ambient spread to indicate interactivity.
- **Level 3 (Modals, Bottom Sheets, Toast Banners):** High-level surface combined with an overarching ambient occlusion and a light dimmed backdrop blur filter.

## Shapes

The system relies on a controlled, tailored shape language defined by `roundedness: 2` (Rounded geometry, featuring increased corner radii for a friendly yet polished modern interface).

- **Base Components (Inputs, Buttons, Cards):** Standard corners use increased radii (`rounded-lg` to `rounded-xl`) for a softer, more approachable feel.
- **Cards & Floating Panels:** Employ generous corner radii for structured, neat containment.
- **Contextual Exception (Chips, Notification Pills, Badges):** Pure pill shapes (`9999px`) are reserved exclusively for status indicators, unread counters, and category tags to differentiate interactive metadata from structural content containers.

## Components

### Buttons

- **Primary Action (Teal):** Background `#00A896`, foreground `#FFFFFF`, border none, increased corner radius. Height `48px` on mobile. Pressed state transitions to `#008C7D`.
- **Secondary Action (Coral Tint / Outline):** Background tint, text `#FF7F51`, border `1px solid rgba(255, 127, 81, 0.3)`.
- **Ghost / Tertiary Action:** Background transparent, active hover state.

### Badges, Tags & Pills

- **Achievement & Status Pills:** Fully rounded (`rounded-full`), `22px` height, horizontal padding `8px`.
  - _Accent Warning / Priority:_ Warning background and text styling.
  - _Critical Notification:_ Background `#FF7F51`, text `#FFFFFF`, font `label-sm`.
  - _Teal Accent Tag:_ Background tint, text `#00A896`, font `label-md`.

### Cards & Containers

- Built on structured surfaces with a 1px structural border and proper elevation.
- Padding inside cards defaults to `16px` (`space-md`).
- Header cards feature a subtle top border accent in `#00A896` or `#FF7F51` when highlighting primary workflows.

### Input Fields

- Container height `48px`, styled for light mode with clear borders and readable text colors.
- Focus state: border color `#00A896` accompanied by a `2px` focus halo (`rgba(0, 168, 150, 0.15)`).

### Selection Controls (Checkboxes & Radios)

- Fixed at `20px × 20px`. Checked state transitions immediately to `#00A896` fill with an interior checkmark or radio dot.

### Navigation Elements

- **Bottom Tab Bar:** Fixed height `60px` + safe inset. Background containers with subtle top borders.
- **Tab Indicators:** Inactive items muted, active selected items `#00A896` paired with an active indicator dot.

---

# Desktop Layout (viewport ≥ 1024px)

This section extends the mobile and tablet rules above. Where it conflicts with them at `≥1024px`, this section wins. Below 1024px nothing here applies. The color, type family, shape and elevation rules above are unchanged, except for **Accessible color pairings** below, which applies at every breakpoint.

## Desktop principles

1. **Same product, wider room.** Desktop is not a stretched phone. Use the width for a main column plus a side rail, so a person can act and see context at once (for example: register for an event while seeing the price and spots).
2. **One memorable element.** The match breakdown on Discover (the two-part compatibility bar) is the signature moment. Everything else stays quiet: flat surfaces, one border style, few accents.
3. **Left-aligned.** Text, headings, forms and cards align left. Numbers in tables align right. Only empty states and the verify-email screen center their content.
4. **Readable on a projector.** The demo is shown on a laptop or a projector. Body text never drops below 14px, and the layout must survive browser zoom of 125% and 150%.
5. **No decoration without information.** Borders, dividers and badges show state or grouping. No gradients, no entrance animations, no decorative icons, no numbered steps unless the content is a sequence.

## Breakpoints and grid

| Name | Viewport | Columns | Gutter | Page margin | Content width |
|---|---|---|---|---|---|
| mobile | below 640px | 4 | 16px | 16px | fluid |
| tablet | 640px to 1023px | 8 | 16px | 24px | fluid |
| lg | 1024px to 1279px | 12 | 24px | 32px | fluid, about 960px at 1024px |
| xl | 1280px to 1535px | 12 | 24px | 32px | max 1120px, centered |
| 2xl | 1536px and up | 12 | 24px | 32px | max 1280px, centered |

Common devices this covers: 1366x768 laptops (xl), 1440x900 (xl), 1920x1080 at 125% display scaling (2xl, 1536px wide), 1920x1080 at 100% (2xl, wide empty margins are intended).

- Vertical rhythm: page top padding `32px`, gap between sections `32px` (`space-xl`), gap between cards `24px`.
- Main column plus rail: the content area is split `8 + 4` columns (main + side rail). Full-width pages (tables, grids) use all 12 columns.
- Side rails are sticky at `top: 88px` (navigation height 64px + 24px) and scroll with the page if taller than the viewport.
- Maximum line length for running text: `68ch`.

## Typography on desktop

Font families and weights are unchanged. Sizes step up from the mobile scale:

| Role | lg and xl | 2xl | Used for |
|---|---|---|---|
| display | 40px / 48px, Manrope 800 | 44px / 52px | Auth screen headline only |
| page title (headline-lg) | 32px / 40px, Manrope 700 | 34px / 42px | One per page |
| section title (headline-md) | 22px / 28px, Manrope 700 | 24px / 30px | Panels and sections |
| card title (headline-sm / title-md) | 18px / 24px, Manrope 600 | 20px / 26px | Cards, rows |
| body (body-lg) | 16px / 24px, Inter 400 | 18px / 28px | Default text |
| dense body (body-md) | 14px / 20px, Inter 400 | 16px / 24px | Tables, rails, metadata |
| small (body-sm) | 13px / 18px, Inter 400 | 14px / 20px | Hints, timestamps (never for essential content) |
| badge (label-sm) | 11px / 14px, Inter 700 | 12px / 16px | Pills only |

- Table and money figures use Inter with `font-variant-numeric: tabular-nums` so digits line up.
- Uppercase is used only for badge text (`label-sm`) as already specified. Do not add uppercase eyebrow labels above headings. Dates are written in sentence case ("Oct", not "OCT").
- Implement sizes in `rem` or CSS variables so one breakpoint rule can change them.

## App shell and navigation

Below 1024px the bottom tab bar from the mobile spec is used. From 1024px it is replaced by a top navigation bar.

```
+------------------------------------------------------------------------------+
| Kawan Kampus   Discover  Communities  Events  My tickets     Revenue    (NP)  |  64px, sticky
+------------------------------------------------------------------------------+
|                                                                              |
|  Page title                                          Primary action (right)  |
|                                                                              |
|  12-column content, centered, max 1120px (1280px at 2xl)                     |
|                                                                              |
+------------------------------------------------------------------------------+
```

- **Bar:** height `64px`, background `surface-container-lowest` (`#ffffff`), `1px` bottom border `outline-variant`. No shadow until the page is scrolled; then Level 1.
- **Left:** wordmark in Manrope 800, 20px, color `#0F172A`. It links to Discover.
- **Center-left:** main destinations Discover, Communities, Events, My tickets in `label-lg` (14px / 600), with 24px between items. Active item: text `#006B5F` and a 4px teal dot (`#00A896`) centered 6px below the label. Hover: text `#0F172A` and background `surface-container-low` with `rounded-md`.
- **Right:** role links Revenue (roles `eo` and `admin`) and Admin events (`admin` only), then the avatar button (36px, circle).
- **Avatar menu:** a Level 2 dropdown, 220px wide, with Profile, My events (when event submission exists), and Log out. Opens on click, closes on Esc and outside click. It is fully keyboard-operable.
- **Narrow desktop:** below `1100px`, if role links exist, move them into the avatar menu so the bar never wraps to two lines.
- **Demo strip:** when `DEMO_MODE` is true, payment screens, My tickets and Revenue show a full-width strip directly under the bar: height `36px`, background `#FFDBCF` (`secondary-fixed`), text `#822700`, with a Critical Notification pill reading "DEMO". Text: "Demo mode. No real payment is made."

## Page layouts

All pages sit in the shell above. "Main" is 8 columns, "rail" is 4 columns.

### Sign up, log in, verify email

```
+----------------------------------+-------------------------------+
| Left panel, 7 of 12 columns      |  Right, 5 of 12 columns       |
| background: surface-container    |  form, max-width 400px,       |
| headline (display)               |  vertically centered          |
| static example match card        |                               |
| row of interest tags             |  Log in / Sign up form        |
+----------------------------------+-------------------------------+
```

- The left panel is the one place on desktop that carries the product pitch. Headline: "Meet students who like what you like." Under it, a static, non-interactive example match card (invented name, labeled "Example") followed by a row of interest tags. This shows what the user will get.
- The left panel is hidden below 1024px. The form is the same component on every breakpoint.
- Form fields use the 48px input spec. The primary button is full width of the form.
- **Verify email** uses a single centered panel, 480px wide, with the message, a "Resend email" secondary button (disabled with a 60-second countdown after sending) and an "I have verified" primary button.

### Onboarding

```
+--------------------+---------------------------------------------+
| Left, 4 columns    | Right, 8 columns                            |
| sticky             |                                             |
| "Set up your       | Panel: Basics (name, major, year, bio)      |
|  profile"          | Panel: Interests (tag grid)                 |
| Basics    done     | Panel: How you like to hang out (3 sliders) |
| Interests            |                                           |
| Style              | [ Save and continue ]                       |
+--------------------+---------------------------------------------+
```

- The left column lists the three sections with a check when complete. It is a progress summary, not numbered steps.
- Interests: a grid of selectable pills, 5 across at xl, 4 across at lg. Selected state: teal tint background, `#006B5F` text, 1px teal border and a leading check icon. Show "At least 1 interest" as helper text until satisfied.
- Style: three rows. Each row has the question as a card title, the two end labels on the left and right of a 5-stop slider (for example "Small group" and "Big crowd"), with the current value shown on the thumb. Questions: social style, schedule style, activity style as defined in `tech-spec.md`.
- The save button sits at the bottom of the right column and is disabled until required fields are valid.

### Discover (home)

```
+-----------------------------------------------+------------------------+
| Best matches                                  | Your profile           |
| 12 students share at least one interest       | avatar, name, major    |
| with you.                                     | interest tags          |
|                                               | [ Edit profile ]       |
| +-------------------------------------------+ |------------------------|
| | Top match (featured, spans 8 columns)     | | Upcoming events        |
| +-------------------------------------------+ | 3 compact rows         |
| +-------------------+ +---------------------+ | [ See all events ]     |
| | Match card        | | Match card          | |                        |
| +-------------------+ +---------------------+ |                        |
+-----------------------------------------------+------------------------+
```

- **Match card** (signature element). Width fills half of the main column (about 300 to 357px).
  - Top row: avatar 56px, name (card title), major and year on a second line in dense body, color `#475569`.
  - Match percentage: Manrope 800, 28px, color `#006B5F`, with the word "match" in dense body next to it.
  - Breakdown: two labeled bars, "Interests" and "Style", each 6px high, `rounded-full`, track `surface-container-high`, fill `#00A896`, value in dense body at the right end. This makes the score explainable.
  - Shared interests: teal accent tags (pill, 22px), at most 3 shown, then "+N".
  - Footer: reserved empty space for a future Connect action (Phase 1). In the demo, no button is shown. Do not add a disabled button.
- **Top match:** the first card spans the full main column, gets a `2px` top border in `#00A896` (as in the Cards spec), and uses the same content in a horizontal arrangement: person on the left, breakdown in the middle, shared tags on the right.
- **Right rail:** "Your profile" panel and "Upcoming events" panel, each a Level 1 card. Rail panels have no top accent borders.
- **Empty state:** centered in the main column, 420px max width: "No matches yet" with one sentence "Add more interests to see students you share something with." and a primary "Edit profile" button.

### Communities

- **List:** page title on the left, primary "Create community" button on the right. Cards in a grid: 3 across at xl and 2xl, 2 across at lg. Card content: name, description clamped to 2 lines, member count, and a Join button (secondary style). A joined community shows a "Joined" teal tag instead.
- **Detail:** main column has the title, description (max 68ch) and a member grid (avatar 40px + name, 3 across). The rail has a sticky Level 1 card with the member count and the Join or Leave button. Leave is a ghost button.
- **Create:** a centered form panel, 560px max width, with a Cancel ghost button and a "Create community" primary button.
- **Empty state:** centered, "No communities yet" with a "Create community" button.

### Events

```
+-----------------------------------------------+------------------------+
| Events                                        | Your next ticket       |
|                                               | title, date, status    |
| +-------------------------------------------+ | [ View ticket ]        |
| | 24  | Campus music night       Rp 50.000  | |                        |
| | Oct | Main hall      18 of 40 spots [View]| |                        |
| +-------------------------------------------+ |                        |
| (rows continue, soonest first)                |                        |
+-----------------------------------------------+------------------------+
```

- **Event row:** a Level 1 container with a date block on the left (day number in Manrope 800, 24px; month in dense body, sentence case), title (card title), location (dense body), a price pill ("Free" in teal tag style, or "Rp 50.000" in neutral outline style), spots text ("18 of 40 spots", or "Full" in the warning pill style) and a ghost "View" button. The whole row is clickable.
- **Event detail:** main column has the title, date and location, organizer name and the description (max 68ch). The rail has a sticky registration card: price in headline-lg, spots left, a full-width primary "Register" button and the helper line "You confirm payment on your ticket page." If the user is already registered, the button is replaced by "View your ticket". If the event is full, the button is disabled and reads "Event is full".
- **Create event (P1):** centered form panel, 640px max width, fields for title, description, location, date and time, price, capacity. Below the primary button, a note that events from regular users are reviewed before they appear.

### My tickets

- Main column: a list of ticket cards. Each shows the event title, date, location, the status pill, and the actions that fit the status.
- Status pills: `reserved` neutral outline "Reserved", `paid_demo` teal tag "Paid (demo)", `cancelled` neutral muted "Cancelled".
- **Payment (demo) panel:** for a reserved paid event, a rail card with the amount, the sentence "No real payment is made.", a Critical Notification pill "DEMO", and the primary button "I have transferred (demo)". On press, the status pill changes to "Paid (demo)" with a 200ms background color transition (the only animation in the product).
- Cancel is a ghost button that opens a confirmation modal (see Components).

### Revenue (roles `eo` and `admin`)

```
+------------------------------------------------------------------------+
| Revenue                                                                |
| [demo strip]                                                           |
| +--------------------------+---------------------+-------------------+ |
| | Gross revenue            | Commission (10%)    | EO net            | |
| | Rp 1.250.000             | Rp 125.000          | Rp 1.125.000      | |
| +--------------------------+---------------------+-------------------+ |
| Event          Price     Paid tickets    Gross     Commission    Net   |
| Music night    50.000    12              600.000   60.000      540.000 |
| ...                                                                    |
| Total                    ...             ...       ...         ...     |
+------------------------------------------------------------------------+
```

- **Summary band:** one Level 1 panel split into three segments by 1px vertical dividers (not three separate cards). Each segment: label in dense body, value in headline-lg Manrope. The commission segment shows the rate and the tag "Placeholder rate" in the warning pill style.
- **Table:** full 12 columns, header row in `label-lg` on `surface-container-low`, 56px row height, 1px row dividers, hover row background `surface-container-low`. Text columns left-aligned, numeric columns right-aligned with tabular numerals. The totals row is `600` weight with a 2px top border in `#0F172A`.
- **Footnote** under the table in dense body: "Demo figures. Gateway fees not included."
- **Empty state:** "No paid tickets yet" and one sentence explaining that tickets appear here after an attendee marks a payment.

### Admin events (role `admin`, P1)

- A full-width table of pending events: title, organizer, date, price, and actions at the right.
- Row actions: "Approve" (primary, compact `36px` high) and "Reject" (ghost button with `#A43C13` text). Reject expands an inline row with an optional reason field and a "Confirm reject" button.
- Empty state: "No events waiting for review."

## Desktop components

| Component | Spec |
|---|---|
| Primary button | Height `44px` (pointer devices), min width `120px`, `rounded-lg`. Fill `#00A896`, label `#00352E` (see Accessible color pairings). Hover `#009785`, pressed `#008C7D`. Table and row actions use a compact `36px` size. |
| Secondary button | Coral tint background, text `#A43C13`, 1px border `rgba(255, 127, 81, 0.3)`. Hover: tint darkens one step. |
| Ghost button | Transparent. Hover background `surface-container-low`. Text `#0F172A` or `#006B5F` for navigational actions. |
| Inputs | Height `44px` on desktop forms (`48px` on the auth screens). Focus: border `#00A896` plus the 2px halo from the Input Fields spec. |
| Cards | Level 1 on `surface-container-lowest` with a 1px `outline-variant` border, padding `24px` on desktop (16px on mobile), radius `rounded-xl`. Hover (only on clickable cards): Level 2 and border `outline`. |
| Table | See Revenue. Sticky header when the table is taller than the viewport. |
| Tags and pills | Unchanged from the mobile spec (22px height, pill shape). Pills are only for status and categories. |
| Modal | Level 3, `480px` wide, centered, `rounded-xl`, padding `24px`. Backdrop dims the page and blurs lightly. Focus is trapped inside; Esc closes; the first focus lands on the safest action (Cancel). Used for "Cancel registration" with the buttons "Keep ticket" (ghost) and "Cancel registration" (primary in coral tint style). |
| Toast | Level 3, bottom left, 360px max, auto-dismiss after 5 seconds, readable by screen readers (`role="status"`). |
| Avatar | Circle. Photo if present, otherwise initials in Manrope 700 on `surface-container-high`. Sizes 36, 40, 56px. |
| Slider | 5 stops, track 6px, thumb 24px with value label, fill `#00A896`. Operable by keyboard arrow keys. |
| Skeleton | While loading lists, show gray blocks with the same size as the final card. No spinner-only screens. |

## Interaction states (desktop)

- **Hover:** every clickable element has a visible change within 120ms. Do not use movement (no lifting or scaling).
- **Keyboard focus:** every interactive element shows `:focus-visible` as a solid `2px` ring in `#006B5F` with a `2px` offset. The soft halo on inputs stays, but the solid ring is what marks keyboard focus.
- **Disabled:** 45% opacity, `not-allowed` cursor, plus a visible text reason where the action matters (for example "Event is full").
- **Loading:** buttons show a label change ("Saving") and are disabled; the layout does not shift.
- **Motion:** the only animation is the 200ms status color change after "I have transferred (demo)" and the standard dropdown and modal opening (150ms fade). Respect `prefers-reduced-motion` by removing all of them.

## Accessible color pairings (applies at every breakpoint)

By my hand calculation, white text on `#00A896` is about 3:1 and white text on `#FF7F51` is about 2.5:1. Both are below the 4.5:1 WCAG AA target for normal-size text. The YAML tokens already hold accessible pairings, so use these instead of white labels. **These rules override the "foreground `#FFFFFF`" values in Components above.**

| Use | Fill | Text | Approx. contrast |
|---|---|---|---|
| Primary button | `#00A896` | `#00352E` | 4.5:1 |
| Teal text or link on a light surface | none | `#006B5F` | 6.4:1 on white |
| Teal accent tag | teal tint, `rgba(0, 168, 150, 0.12)` | `#006B5F` | about 5.5:1 |
| Critical Notification pill | `#FF7F51` | `#6C1F00` | 4.6:1 |
| Secondary button and coral text | coral tint | `#A43C13` | about 6:1 on white |
| Warning pill | `#FFB703` | `#271900` | about 9:1 |
| Body text | none | `#0F172A` or `#475569` | above 7:1 |
| Placeholders and timestamps (`#94A3B8`) | none | decorative only | about 2.6:1, never for required information |

If you prefer white labels on the primary button, use `#006B5F` as the fill instead (white on it is about 6.4:1). All values are my own calculations: verify them with a contrast checker before finalizing.

## Copy rules for desktop screens

- Sentence case everywhere. Buttons name the action: "Create community", "Join", "Register", "Approve", "I have transferred (demo)".
- The same verb carries through the flow: after "Register" the toast says "Registered"; after "Join" it says "Joined".
- Errors say what happened and what to do, without apologizing: "That email is already registered. Log in instead."
- Empty states explain the situation and offer one action.
- Money is written "Rp 25.000" (dot as thousands separator). Dates use the user's locale; the default is English month names.
- Do not write meta strings joined with middle dots, and do not append arrows to buttons or links.

## Demo-day checks

Run each main journey (sign up, Discover, join a community, register and mark paid, Revenue) at these sizes. Nothing may overflow horizontally, wrap the navigation bar, or clip text.

| Size | Why |
|---|---|
| 390px wide | Phone sanity check |
| 1024px | Smallest desktop layout |
| 1366x768 | Common laptop |
| 1536px wide (1920x1080 at 125% scaling) | 2xl step |
| 1920x1080 at 100%, browser zoom 125% and 150% | Projector scenario |

## Implementation notes

```css
:root {
  --page-margin: 16px;
  --gutter: 16px;
  --nav-height: 64px;
  --container: 100%;
}
@media (min-width: 640px)  { :root { --page-margin: 24px; } }
@media (min-width: 1024px) { :root { --page-margin: 32px; --gutter: 24px; } }
@media (min-width: 1280px) { :root { --container: 1120px; } }
@media (min-width: 1536px) { :root { --container: 1280px; } }

.page { max-width: var(--container); margin-inline: auto; padding-inline: var(--page-margin); }
.layout-split { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--gutter); }
.layout-split > .main { grid-column: span 8; }
.layout-split > .rail { grid-column: span 4; position: sticky; top: 88px; align-self: start; }
```

- Show the top navigation from `1024px` and the bottom tab bar below it, using the same route list so the two never diverge.
- Keep color, type and spacing values as CSS variables built from the YAML tokens at the top of this file. Components never use raw hex values.
- Self-host Manrope and Inter (for example with `@fontsource` packages) so the demo does not depend on venue wifi.
