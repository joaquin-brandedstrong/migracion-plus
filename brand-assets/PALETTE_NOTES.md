# Brand palette · Notes

## Status

Extraction was performed on 2026-05-05 from `brand-assets/source/logo-primary.png`
using a pure-numpy KMeans (`brand-assets/scripts/extract_palette.py`).

The extracted palette is in `brand-assets/extracted-palette.json`:

| Role            | Hex       | Notes                                              |
|-----------------|-----------|----------------------------------------------------|
| dominant        | `#61D0BE` | Teal/turquoise — the "plus" script in the wordmark |
| secondary       | `#6E6E6E` | Neutral gray — body text in the wordmark           |
| accent          | `#727272` | Same neutral gray family                           |
| neutral_dark    | `#6AD3C2` | Lighter shade of the brand teal                    |
| neutral_light   | `#7A7A7A` | Lighter shade of the body gray                     |

In short, the brand is **teal + neutral gray**. The fallback palette (USA-flag
blue + warm gold) was materially wrong.

## Diffs from fallback

The Tailwind preset's `brand` color scale was rewritten to anchor on the teal
family. The exact extracted teal `#61D0BE` is preserved as `brand-300` (used
where contrast against light backgrounds isn't critical, e.g., on dark
surfaces). For accessible body wordmark / button surfaces, the scale deepens
into Tailwind's standard `teal-700` (`#0F766E`) — `brand-700` is the primary
action color and gets ≥5:1 contrast against white.

| Token       | Before (blue)      | After (teal)        |
|-------------|--------------------|---------------------|
| `brand-50`  | `#EFF6FF`          | `#F0FDFA`           |
| `brand-100` | `#DBEAFE`          | `#CCFBF1`           |
| `brand-200` | `#BFDBFE`          | `#99F6E4`           |
| `brand-300` | `#93C5FD`          | `#61D0BE` ← exact   |
| `brand-400` | `#60A5FA`          | `#2DD4BF`           |
| `brand-500` | `#3B82F6`          | `#14B8A6`           |
| `brand-600` | `#2563EB`          | `#0D9488`           |
| `brand-700` | `#1D4ED8`          | `#0F766E` ← primary |
| `brand-800` | `#1E40AF`          | `#115E59`           |
| `brand-900` | `#1E3A8A`          | `#134E4A`           |
| `brand-950` | `#172554`          | `#042F2E`           |

The **`accent` (warm gold/amber) scale was kept unchanged** — teal + gold is
the classic editorial-luxury pairing requested by the design brief, and the
real logo doesn't define any other accent. Gold complements the teal and
provides a strong CTA color.

The **`ink` (neutral) scale was kept unchanged** — Tailwind's slate scale is
already a near-perfect match for the extracted `#6E6E6E` gray family.

### Other places updated

- `packages/config/tailwind-preset.ts` — `bg-gradient-mesh` and
  `bg-gradient-mesh-dark` hue rotations changed from blue (HSL 210/220) to
  teal (HSL 170/190) so the animated hero mesh actually feels brand-aligned.
- `packages/config/tailwind-preset.ts` — `boxShadow.glow` changed from blue
  rgba to teal rgba (`rgba(15, 118, 110, 0.35)`).
- `packages/config/tailwind-preset.ts` — typography prose links changed from
  blue to teal.
- `apps/web/src/app/globals.css` — `::selection` background changed from blue
  to teal `rgba(20, 184, 166, 0.28)`.
- `apps/web/public/brand/logo-{light,dark}.svg` — wordmark "Plus" updated to
  use the actual extracted teal `#61D0BE` (light variant, against dark
  backgrounds) and `teal-700 #0F766E` (dark variant, against light
  backgrounds). Also added the `.com` from the real logo.
- `apps/web/public/brand/og-image.png` — gradient regenerated with
  teal-to-deep-navy palette and teal subtitle accent.
- `apps/web/public/{favicon.ico, apple-touch-icon.png}` — backgrounds
  regenerated with the teal gradient and the `M` monogram in the extracted
  brand teal.

The semantic `info: '#3B82F6'` (blue) was kept on purpose — info banners are
conventionally blue across UX conventions, and changing it to teal would
collide visually with `brand`.

## Optimized derivatives

Replace these placeholders with real vector traces or higher-fidelity output
when the client provides finalized brand asset files:

- `apps/web/public/brand/logo-light.svg` — current is a wordmark SVG approximation
- `apps/web/public/brand/logo-dark.svg` — same
- `apps/web/public/favicon.ico` — programmatic, 16/32 multi-res
- `apps/web/public/apple-touch-icon.png` — programmatic, 180×180
- `apps/web/public/brand/og-image.png` — programmatic, 1200×630

The hand-traced SVG step from the original PRE-FLIGHT (using `potrace`) is
still pending — the source `logo-primary.png` is a raster wordmark, so SVG
conversion requires either a paid vectorization service or hand work in
Figma/Illustrator. The current SVG approximation is faithful in layout but
uses system serif fonts as a fallback for the script "plus" — replace with
the foundry's actual font once known.
