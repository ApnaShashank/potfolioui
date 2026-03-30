# Design System Strategy: The Curated Layer

## 1. Overview & Creative North Star: "The Digital Curator"
This design system is built on the philosophy of **The Digital Curator**. It rejects the "template" aesthetic of standard portfolios in favor of an editorial, high-end agency experience. We achieve this by moving away from rigid, boxed-in layouts and embracing **Intentional Asymmetry** and **Tonal Depth**. 

The goal is to create a UI that feels like a physical gallery: breathable, quiet, and premium. We break the grid by allowing elements to overlap slightly, using massive typography scales to ground the layout, and replacing traditional borders with sophisticated surface layering. It is "High-end SaaS" in its precision, but "Creative Agency" in its soul.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Warm Industrial" spectrum, using a foundation of `#F9F9F9` (Surface) and `#000000` (Primary/Tertiary). 

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections or cards. In this system, boundaries are created through **Background Color Shifts**. 
*   Example: A `surface-container-low` section sits directly on a `surface` background. The shift in tone is the divider.
*   The only exception is the **Ghost Border**: Use `outline-variant` at 10-15% opacity for accessibility in high-glare environments.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of fine paper. Use the Material tokens to create natural depth:
*   **Base Layer:** `surface` (#F9F9F9) - Use for the main page background.
*   **Secondary Content:** `surface-container-low` (#F3F3F3) - Use for large section blocks.
*   **Interactive Cards:** `surface-container-lowest` (#FFFFFF) - Use for elements that need to "pop" off the page.
*   **High-Contrast Accents:** `tertiary_fixed` (#9FFB06 / Soft Green) - Use sparingly for high-value calls to action or status indicators.

### The Glass & Gradient Rule
To achieve "Awwwards-level" quality, floating navigation bars and modal overlays must utilize **Glassmorphism**.
*   **Token:** Use `surface` at 80% opacity with a `20px` backdrop-blur.
*   **Signature Texture:** For Hero backgrounds or primary CTAs, apply a subtle linear gradient from `primary` (#000000) to `primary_container` (#1C1B1B). This prevents the "flat black" look and adds a velvet-like depth.

---

## 3. Typography: Editorial Authority
We use a dual-font approach to balance personality with utility.

*   **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) for hero statements. These should be tight-tracked (-2%) to create a "block" of text that feels like a graphic element.
*   **Body & Labels (Inter):** Use `body-lg` (1rem) for readability.
*   **The Hierarchy Identity:**
    *   **Hero:** `display-lg` / Bold / Primary (#000000).
    *   **Section Headers:** `headline-sm` / Semi-Bold / Secondary (#5D5F5F) to create a clear "read-next" path.
    *   **Micro-copy:** `label-md` / Medium / Tertiary (#000000) with 1px letter spacing for a technical, high-end feel.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "standard." We use **Ambient Shadows** and **Tonal Stacking**.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-lowest` (#FFFFFF) card on a `surface-container` (#EEEEEE) background. The 4-unit delta in lightness provides a cleaner, more modern "lift."
*   **Ambient Shadows:** When an element must float (e.g., a hover state on a project card), use:
    *   `Y: 20px, Blur: 40px, Color: on-surface @ 4%`.
    *   This mimics natural light dispersion rather than a harsh digital shadow.
*   **Glassmorphism Depth:** For floating "Floating Action Buttons" or Menus, use the `surface-container-lowest` token with 70% opacity and a `1.5rem` (xl) corner radius.

---

## 5. Components

### Buttons: The Kinetic Point
*   **Primary:** `primary` background, `on-primary` text. **Radius: 1.5rem (xl)**. Padding: `1rem` (top/bottom) / `2rem` (left/right).
*   **Secondary (Glass):** `surface-container-highest` at 50% opacity, backdrop-blur 10px.
*   **Tertiary (The Accent):** `tertiary_fixed` (#9FFB06). Only use this for the "Work With Me" or "Hire" CTA.

### Cards: The Borderless Container
*   **Style:** No borders. Use `surface-container-low` for the background.
*   **Corner Radius:** Always `1.5rem` (xl). 
*   **Spacing:** Use `spacing-8` (2.75rem) for internal padding to ensure the content feels "expensive" through generous white space.

### Input Fields: Minimalist Utility
*   **Background:** `surface-container-high`.
*   **Active State:** Change background to `surface-container-lowest` and add a 1px "Ghost Border" using `tertiary_fixed` at 30% opacity.
*   **Error State:** `error` (#BA1A1A) text with an `error_container` background tint.

### Project Tags (Chips)
*   Small, `label-sm` text. Use `surface-container-highest` background. No shadows. **Radius: full**.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace the Asymmetric Grid:** Align your text to the left 4 columns, and let your hero image span the right 8 columns, overlapping the section break below.
*   **Use Massive Negative Space:** If you think there is enough white space, add 20% more. High-end design is defined by what you *don't* show.
*   **Color Transitions:** Use `surface-container-low` to distinguish the footer from the main body, rather than a line.

### Don’t:
*   **No 100% Black Shadows:** Never use `#000000` for shadows. Use a tinted `on-surface` color at very low opacity.
*   **No Standard Grids:** Avoid the "3-card row" look. Try a "2 + 1" layout where one project card is twice the size of the others to create visual interest.
*   **No High-Contrast Dividers:** If you need to separate content within a card, use a `1.4rem` (spacing-4) vertical gap instead of a line.

---

## 7. Portfolio-Specific Components
*   **The Signature Scroll-Indicator:** A thin vertical line using `tertiary_fixed` that grows as the user scrolls.
*   **The Case Study Header:** A mix of `display-lg` typography overlapping a high-res image with a `backdrop-blur` overlay containing the project metadata (Year, Role, Tech).
*   **Magnetic Cursor:** Use a custom cursor that turns into a `tertiary_fixed` circle when hovering over interactive project cards.