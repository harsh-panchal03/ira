# IRA Designs — Creative Direction

## What the studio is (from @ira_.designs)
Interior design and 3D visualization. Photoreal renders that let a client
"experience their future space before a single brick is laid."
Studio line: **"Turning ideas into visuals, and visuals into reality."**

## Concept: *Line to Light*
The site tells the studio's own process — **render to reality** — as one
continuous scroll: a room is drawn (line), blocked in (form), dressed
(material), lit (light), and finally opens into the real render (reality).
Every later section reuses that idea: the lens in the work rail shows the
drawing inside the render; the project page has a drawing ↔ render slider;
the site ends by tracing the monogram.

## Colour — sampled, not invented
| Token | Hex | Source |
|---|---|---|
| paper | `#F1ECE3` | lightened linen — page ground |
| linen | `#E3DCCF` | wall highlight, living-room render |
| travertine | `#D7CEBF` | stone wall mid-tone |
| stone | `#C0B4A3` | shadowed plaster |
| sand | `#AB9B88` | linen upholstery |
| clay | `#846D56` | rattan / dried grass |
| umber | `#745239` | **logo brown — primary** |
| walnut | `#482F1F` | coffee table, deep shadow |
| ink | `#2A1C13` | deepened walnut, body text |

The page ground shifts paper → linen → travertine → walnut → paper as sections take the stage (`ToneController`).

## Type
- **Display:** Instrument Serif (regular + italic). Italic is reserved for the one emphasised word per line (*reality*, *before*).
- **Body / labels:** Jost Light, wide-tracked uppercase eyebrows — echoes the spaced "DESIGNS" in the logo.

## Spacing & layout
12-column grid, fluid gutter `clamp(1rem, 4vw, 3.5rem)`. Asymmetric placement, generous vertical rhythm (`py-32` → `py-48`). No cards, no rounded UI; the only curves are architectural (arches).

## Image treatment
Full bleed or framed by clip-path — never boxed with shadows. Images arrive via a lifting "blind" (clip-path) with a slow scale settle. Film grain over everything at 6%.

## Motion language
- Ease: `expo.out` for arrivals, `expo.inOut` for curtains, linear for scroll scrub.
- Scroll drives story (scrub), time drives reveals (one-shot).
- Pointer adds depth only: camera parallax, type drift, lens reveal.
- `prefers-reduced-motion`: no scrub, no smooth scroll, no grain animation; story collapses to readable stacked content.

## Interaction principles
- Custom cursor (dot + ring) opens into a labelled disc: *View, Drag, Chat, Call, Next*.
- Every interactive effect has a non-pointer equivalent (focus states, slider arrow keys, plain links).
- Mobile (<900px or touch): no WebGL; hero becomes a line-drawing → render cross-fade in an arch.
