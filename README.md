# UX Design Variants — Smaran Advertising & Printing LLP

All 4 variants derive their palettes **from the brand logo** (`Requirement_source/Source/logo.png`). Dominant logo colors: **magenta `#802060` / vivid pink `#C02080`**, **navy `#204060`**, **gold `#F0C020`**, **cyan `#00B0E0`**. Each variant re-arranges these into a different look **and a genuinely different design language for every component** — navbar, hero, services, stats/testimonials, portfolio tiles, form and footer are all designed differently in each variant. Open that variant's `components.html` to see them all on one page.

## Open the gallery

Open **`ux/pages/index.html`** in a browser (or `python -m http.server` from `ux/pages`) to preview all four variants side by side and click into each one.

## The 4 variants

| # | Folder | Palette emphasis | Look |
|---|--------|------------------|------|
| 1 | `variant_01_modern/` | Navy + gold (magenta accent) | Modern · Corporate · Split hero, pill nav, tile cards, floating-label form |
| 2 | `variant_02_classic/` | Magenta + gold on cream | Classic · Heritage · Serif, centred masthead, double gold rules, tombstone cards |
| 3 | `variant_03_minimal/` | Neutral ink + sparse magenta/gold | Minimal · Editorial · Oversized type, indexed hairline lists, no cards |
| 4 | `variant_04_vibrant/` | Pink + cyan + gold (polychrome) | Vibrant · Playful · Diagonal gradient hero, bento tiles, rotated stat chips |

## Every variant contains the same 8 linked pages

`index.html` (Home) · `about.html` · `services.html` · `portfolio.html` · `why-choose-us.html` ·
`request-quote.html` · `contact.html` · `components.html` (component sheet)

Plus `theme.css` (the variant's design system) and this folder's `README.md`.

**Navigation works in every variant:** menus, footer links, breadcrumbs, cards and every button are
real `href` links to the matching page in the *same* variant folder. `../assets/site.js` adds the
mobile menu toggle, current-page highlighting and a demo form submit (the prototype has no backend).

**How to approve:** tell me the variant number (1–4). I will set `ux.approved_variant: "ux/pages/variant_XX_*"` in `aidlc_ir.yaml`, update the React theme tokens/component styles to that variant's palette & design language, and align the React page set (Home, About, Services, Portfolio, Why Choose Us, Contact, Request Quote) with it.