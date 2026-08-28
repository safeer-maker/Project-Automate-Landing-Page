# Framer Landing Page Deep Analysis

Source: <https://spectacular-booking-469898.framer.app/>  
Audited: 2026-08-28  
Saved source: [`old_designed/index.html`](../old_designed/index.html)  
Framer publication timestamp in source: 2026-08-24 14:27:48 UTC

## Executive summary

The target is a single-page architectural landscape-lighting landing page. It has a fixed translucent header, a full-viewport photographic hero, a dark credential band, three cream editorial sections, and a cream contact/form section. The visual language is warm, restrained, and residential: cream, charcoal/navy, bronze-gold, large Arial display type, small uppercase Inter labels, rounded photography, and frosted-white information cards.

The page has three distinct responsive compositions rather than one layout that simply shrinks:

- Desktop: `>= 1200px`
- Tablet: `810px–1199.98px`
- Mobile: `<= 809.98px`

At 1440×900 the rendered page is 4,108px tall. At 810×1080 it is 5,578px tall. At 390×844 it is 5,924px tall.

The source is visibly derived from a “Vantara Living” template and is not production-clean. Several links and contact details are placeholders, one tablet paragraph differs from the desktop/mobile copy, the mobile menu does not visibly open, and the form still asks for a “Preferred Villa.” These should be treated as source defects, not requirements to reproduce blindly.

## Page structure

| Order | Framer name / ID | Desktop position and height | Purpose |
|---|---|---:|---|
| 0 | Fixed header | Overlay, top of viewport | Brand, phone, consultation CTA; hamburger on mobile |
| 1 | `Home` / `#Home` | `y 0`, `900px` | Full-viewport hero and primary CTA |
| 2 | `CREDENTIALS / TRUST BAR` / `#About` | `y 900`, `154px` | Three credential cards |
| 3 | `DESIGNED FOR LIFE AFTER SUNSET` / `#about-1` | `y 1054`, `755px` | Benefit statement, image collage, three value cards |
| 4 | `OUR DESIGN + BUILD PROCESS` / `#why-vantara` | `y 1810`, `868px` | Case-study collage and four-step process |
| 5 | `COMPLETE OUTDOOR EXPERIENCE` / `#Amenities` | `y 2677`, `578px` | Three service cards |
| 6 | `CTA` / `#cta` | `y 3256`, `852px` | Contact details and lead form |

There is no conventional footer in the target. The page ends after the consultation form. The “Made in Framer” badge is platform chrome and should not be recreated.

## 0. Fixed header

The header is fixed (`z-index: 8`) and floats over the hero.

- Desktop outer width: about 1200px, centered, with a small top margin.
- Surface: `rgba(255,255,255,.40)`, `backdrop-filter: blur(8px)`.
- Shape: fully rounded/pill, with a subtle white lower border and `0 1px 2px rgba(0,0,0,.25)` shadow.
- Left: PROJECT:automate mark plus a two-line text lockup.
- Center/right: bronze phone icon and `(310) 402-4818` in bold 23px Inter.
- Far right: gold pill button, “Request a Consultation,” with northeast arrow.
- Header CTA is currently wrong: it opens the Framer Vantara template marketplace in a new tab.
- The displayed phone number is plain text, not a `tel:` link.

Responsive change:

- Tablet retains logo, phone, and CTA; the CTA is scaled to 80%.
- Mobile uses a rectangular full-width frosted bar rather than a pill. It keeps the logo and shows a circular hamburger button. The phone and visible CTA disappear.
- Clicking the mobile hamburger during the audit caused no visible state change and exposed no navigation items. Rebuild it either as a real menu or omit the control if there are no destinations.

## 1. Hero

Content:

- Eyebrow: “ARCHITECTURAL LANDSCAPE LIGHTING FOR LOS ANGELES ESTATES”
- H1: “Your estate shouldn’t disappear after sunset.”
- Primary CTA: “Request a Private Lighting Consultation” → `#cta`
- Supporting line: “Tell us about your property, project goals, timing, and investment range. Our design team reviews each project before scheduling the next step.”

Composition:

- Minimum height is `100vh`; it exactly matched each audit viewport height.
- Background is the sunset estate/pool image, full bleed, `object-fit: cover`.
- A dark left-to-right/edge overlay preserves white text contrast.
- Desktop content begins around `x 120`, `y 158`; the H1 is 67px/67px Arial with a compact negative-tracking feel.
- The eyebrow is 14px uppercase Inter in bronze-gold.
- A short bronze horizontal accent rule separates the H1 and CTA.
- CTA is a gold pill with white text and arrow. The supporting copy is tiny (11px/13.2px).

Responsive change:

- Desktop and tablet keep a two-line H1 at 67px.
- Mobile keeps the same computed 67px H1 rather than scaling it down. It wraps to four lines and creates a very dominant, tightly clipped composition.
- The mobile eyebrow does not wrap safely and is clipped on the right.
- The mobile CTA becomes nearly full width.
- Background crop shifts heavily; desktop shows the whole pool/terrace while mobile emphasizes the architecture and foreground table.

Implementation note: the Framer target uses a static JPEG hero. The Astro repository currently uses a looping WebM video. Use the static image for strict visual fidelity; retain video only as an intentional enhancement.

## 2. Credentials / trust bar

The band is charcoal/navy (`#121820`) with three static frosted cards. It is not a marquee or carousel.

Cards:

1. `HTA Certified` — “Home Technology Association”
2. `CEDIA Membership` — “Member of the Smart Home Industry”
3. `17+ Years` — “Relevant experience in design, installation, and integration”

Styling:

- Frosted light-gray cards with a white translucent border, soft inset highlight, rounded corners, and restrained shadow.
- Each includes a credential image at left, large dark label, and very small supporting copy.
- Desktop: three cards in one row.
- Tablet: three cards remain in one row but become narrower/taller.
- Mobile: cards stack vertically inside a much taller dark band.

The current Astro `TrustSection` materially differs: it creates an animated five-item marquee with changed wording. That should be replaced for a faithful recreation.

## 3. Designed for life after sunset

Content:

- Eyebrow: “DESIGNED FOR LIFE AFTER SUNSET”
- H2: “Your home was designed to be experienced.”
- Desktop/mobile paragraph: “From subtle path lighting to dramatic architectural washes, we use light with precision and purpose—enhancing beauty, improving safety, and extending your lifestyle outdoors.”

Three glass value cards:

1. `REVEAL ARCHITECTURE` — “Accentuate the details that make your home unique.”
2. `HIGHLIGHT LANDSCAPING` — “Showcase mature trees, textures and natural beauty.”
3. `IMPROVE SAFETY` — “Create comfortable, well-lit pathways and entryways.”

Desktop composition:

- Cream background `#f7f4ed`.
- Max-width 1200px content with about 120px page gutters at 1440px.
- Left column contains heading/copy and two landscape images side by side near its lower edge.
- Right column is one tall architectural water-feature image.
- Three glass cards overlap the bottom image area in a horizontal row.

Tablet composition:

- Heading becomes 44px/46.2px.
- The two small images are hidden; the large water-feature image becomes a 750×420 banner.
- Three value cards overlay the banner in one row.
- The paragraph unexpectedly changes to generic template copy: “Timeless architecture that blends seamlessly with its surroundings. Open to natural light and crafted for privacy, comfort, and elevated everyday living.” This is almost certainly accidental and should not be carried into Astro.

Mobile composition:

- Heading becomes 38px/39.9px.
- The large water-feature image is hidden.
- Two 350×280 images stack vertically.
- The three benefit cards stack and overlap the imagery, producing a layered collage.

## 4. Design + build process

Content:

- Eyebrow: “OUR DESIGN + BUILD PROCESS”
- H2: “From First Conversation to Final Adjustment.”
- Glass case-study card:
  - `REAL PROJECT`
  - `Palos Verdes Estate`
  - “A dated lighting system was redesigned with layered architectural, landscape, and pathway lighting to reveal the property after dark.”

Four steps:

1. `Project Brief & Discovery` — project, goals, timeline, and investment range.
2. `Site & Design Evaluation` — architecture, landscaping, conditions, sightlines, and technical requirements.
3. `Design & Installation` — tailored design, proposal, approval, and precise installation.
4. `Commissioning & Support` — after-dark tuning of placement, brightness, scenes, controls, and ongoing support.

Desktop composition:

- Cream background; 98px vertical padding.
- Left half: asymmetric three-image collage with a frosted case-study card over the lower center.
- Right half: four stacked process rows.
- Step numerals use Cormorant Garamond at 64px in bronze; step titles are 28px Arial.
- Thin bronze dividers separate the rows.

Tablet composition:

- Heading and collage span the full width first.
- Process steps move below the collage.
- Step numerals reduce to 52px.

Mobile composition:

- Only the main case-study image remains; the two supporting collage images are hidden.
- The case-study glass card still overlaps the image.
- The entire numbered four-step list is hidden, so the section becomes much shorter (952px). This is a major content-loss behavior and should be reconsidered for the Astro build.

## 5. Complete outdoor experience

Content:

- Eyebrow: “COMPLETE OUTDOOR EXPERIENCE”
- H2: “Landscape Lighting. Outdoor Audio. Seamless Control.”
- Supporting copy: “Outdoor spaces designed to feel as connected as your home”

Cards:

1. `LANDSCAPE LIGHTING` — “Architectural, pathway and garden lighting designed with precision.”
2. `OUTDOOR AUDIO` — “Discreet, high-performance audio that elevates your outdoor lifestyle.”
3. `SMART CONTROL` — “Effortless control of lighting, audio and environments from anywhere.”

Styling and responsive behavior:

- Cream background with no color break from the surrounding editorial sections.
- Each card is a rounded photo with a 2px white border and a frosted white information panel anchored near the bottom.
- Desktop: three equal columns, approximately 387×350px each.
- Tablet: two columns in the first row; Smart Control sits alone at half width in a second row.
- Mobile: three full-width 350×320px cards stacked vertically with 20px gaps.

## 6. Contact / consultation CTA

Left-side content:

- Eyebrow: “GET IN TOUCH”
- H2: “REQUEST A PRIVATE LIGHTING CONSULTATION”
- Call Us: `(555) 123-4567`
- Email Us: visible `hello@P:a.com`; actual link target is `mailto:hello@vantara.com`
- Visit Us: “Serenity Villas, 123 Garden Lane Portland, OR 97201”
- Schedule a Visit: “Book a personalized tour of our villas at your convenience.”

Right-side form:

- Tall contact background image with a very light translucent wash.
- Frosted form panel.
- Cormorant title: “Send Us a Message”
- Copy: “Fill in your details and we'll get back to you shortly.”
- Required fields: Full Name, Phone Number, Email Address, Preferred Villa.
- Preferred Villa options: Villa A, Villa B, Villa C.
- Optional textarea: project details/message.
- Checkbox: “I agree to be contacted...”
- Dark rounded Submit button with arrow.

Responsive change:

- Desktop: two columns, contact information left and 677×720px image/form card right.
- Tablet: heading above a 2×2 contact-detail grid, then a full-width form card below.
- Mobile: contact details stack, then the form spans the width below.

Source defects and accessibility concerns:

- All displayed contact details are unrelated placeholders and conflict with the Los Angeles/PROJECT:automate positioning.
- The form is still villa-oriented template content.
- The light form panel has extremely low contrast against the washed-out background, especially in tablet/mobile captures.
- Inputs rely on placeholders rather than persistent visible labels.
- The source form has no HTML `action`; Framer JavaScript handles submission. Astro needs an explicit destination such as the repository’s GHL integration.

## Design system

### Color tokens

Primary tokens found in the source:

| Role | Value |
|---|---|
| Warm page background | `#f7f4ed` |
| White | `#ffffff` |
| Primary charcoal/navy | `#121820` |
| Bronze accent | `#b68a5e` |
| Warm light border | `#ede6da` |
| Muted border | `#dcd4c8` |
| Muted body | `#5f6670` |
| Secondary muted text | `#8a8f94` |
| Dark green | `#344832` |
| Glass header | `rgba(255,255,255,.40)` |
| Glass card border | about `rgba(255,255,255,.72–.80)` |

The source declares additional green/navy template tokens, but the visible page is primarily cream, charcoal, white, and bronze.

### Typography

| Usage | Family | Desktop | Tablet | Mobile |
|---|---|---:|---:|---:|
| Hero H1 | Arial | 67/67 | 67/67 | 67/67 |
| Section H2 | Arial | 48/50.4 | 44/46.2 | 38/39.9 |
| Eyebrows | Inter | 14/14 | 14/14 | 14/14 |
| Body | Inter | 16/25.6 | 15/24 | 14/22.4 |
| Process numerals | Cormorant Garamond | 64/67.2 | 52/54.6 | hidden |
| Form title | Cormorant Garamond | 32/36.8 | 32/36.8 | 32/36.8 |

This is important: most prominent display headings are Arial, not Cormorant Garamond. The serif is reserved mainly for process numerals and the form title.

### Layout and surfaces

- Main desktop content: `max-width: 1200px`.
- Gutters: about 40px per side on desktop until max-width is reached, 30px tablet, 20px mobile.
- Image/card radius: usually 20px.
- Glass inner panels: usually 10–12px radius.
- Glass recipe: white at roughly 72% opacity, `blur(18px)`, 1px translucent white border, soft drop shadow and inset highlight.
- Header glass: blur 8px; CTA/button glass uses blur 9px.
- Section spacing is generous and editorial rather than grid-dense.

## Motion and interactions

Observed/inferred from the hydrated page and initial inline motion state:

- Hero headline words reveal on load from `opacity: .001`, `blur(10px)`, and `translateY(10px)`.
- Hero CTA slides in from `translateX(-12px)`.
- Section cards and image groups enter on scroll from `opacity: 0` with `translateY(20px–30px)`.
- Thin accent lines/dividers reveal separately.
- Repeated cards appear to be staggered rather than animated together.
- The primary hero CTA smooth-scrolls to `#cta`.
- There are no visible carousels, sliders, accordions, or tabbed components in the target.
- Header remains fixed while scrolling.
- The mobile hamburger did not produce a visible open state during the audit.

For Astro, these effects can be reproduced with a small IntersectionObserver utility and CSS classes. Respect `prefers-reduced-motion` and show content without transforms when motion is reduced or JavaScript is unavailable.

## Asset inventory

All visible content assets have already been extracted into `public/framer-extracted-assets/` in PNG/JPEG and WebP where applicable. The asset manifest and downloader also exist.

| Visual | Local asset |
|---|---|
| Brand mark/favicon | `brand/project-automate-mark.webp` |
| Hero estate | `hero/estate-at-sunset.webp` |
| Optional hero video enhancement | `hero/estate-at-sunset.webm`, `.mp4` |
| HTA badge | `certifications/hta-certified.webp` |
| CEDIA badge | `certifications/cedia-membership.webp` |
| Third industry/experience badge | `certifications/smart-home-industry-member.webp` / `lifetime-warranty.webp` |
| Benefit image 1 | `features/reveal-architecture.webp` |
| Benefit image 2 | `features/highlight-landscaping.webp` |
| Large water-feature image | `features/improve-safety.webp` |
| Process/case-study images | `process/design-build-process.webp`, `case-studies/lighting-redesign.webp`, `case-studies/lighting-redesign-detail.webp` |
| Service cards | `services/landscape-lighting.webp`, `outdoor-audio.webp`, `smart-control.webp` |
| Contact background | `contact/private-consultation.webp` |

The small line icons are inline SVGs in the Framer HTML. Recreate them as clean local SVG components rather than copying Framer’s hashed `<symbol>/<use>` machinery.

One implementation caveat: `src/config/assets.ts` currently returns the R2 `source` URL when no environment override is set, even though local copies exist. If the goal is self-contained local delivery, its default should resolve to `/framer-extracted-assets/${asset.path}`.

## Current Astro implementation versus target

The current Astro page is a reinterpretation, not a close recreation.

| Area | Current Astro | Framer target |
|---|---|---|
| Page sequence | Hero, animated trust, carousel benefits, dark process, services, footer, modal | Hero, static trust, collage benefits, cream process, services, inline contact form; no footer |
| Hero media | Looping video | Static JPEG |
| Hero text/CTA | Changed wording and gradient text | Plain white display copy and original CTA |
| Trust | Five-item marquee | Three static cards |
| Benefits | Carousel | Responsive image collage with overlay cards |
| Process | Dark, reordered, extra split sections | Cream, one collage plus four-step list |
| Services | Changed headline/copy and proportions | Original three frosted photo cards |
| Contact | `ConsultationSection.astro` exists but is not used on `index.astro`; modal is used | Inline contact/form section |
| Footer | Present | Absent |
| Breakpoints | Mostly 900px/680px | 1200px/810px |

There are also mojibake strings in the Astro source (`shouldnâ€™t`, `purposeâ€”`, broken arrow glyphs). These need UTF-8 correction before visual matching.

## Recommended Astro component map

1. `SiteHeader.astro` — fixed desktop/tablet bar and real mobile state.
2. `HeroSection.astro` — static picture, overlays, word reveal, CTA.
3. `CredentialsSection.astro` — exactly three static cards.
4. `ExperienceSection.astro` — responsive collage and three glass benefit cards.
5. `ProcessSection.astro` — case-study collage plus four steps; preserve steps on mobile unless exact defect parity is required.
6. `OutdoorExperienceSection.astro` — three responsive service cards.
7. `ConsultationSection.astro` — real PROJECT:automate contact details and GHL-backed form.
8. `RevealOnScroll` utility — one IntersectionObserver, stagger delays via CSS custom property.

Use semantic HTML and data arrays for repeated cards/steps. Keep component-local styles or a small token layer, but use the target breakpoints exactly. The page does not need React or another client framework.

## Fidelity decisions to settle before implementation

These are the only significant product choices; everything else can be matched directly:

1. Static target hero image versus the repository’s video enhancement.
2. Whether mobile should hide the four process steps like Framer or retain the content.
3. Whether to reproduce the nonfunctional hamburger or build a useful mobile menu.
4. Whether to reproduce template placeholder content or replace it with PROJECT:automate contact information and the existing GHL fields.
5. Whether the tablet-only placeholder paragraph should be corrected to the lighting-specific copy.

Recommended approach: reproduce the visual composition, spacing, cards, typography, and motion; correct the broken destinations, placeholder contact/form copy, tablet inconsistency, mobile content loss, contrast, labels, and accessibility semantics.

## Captured audit artifacts

- `old_designed/framer-desktop-1440.png` and `.json`
- `old_designed/framer-tablet-810.png` and `.json`
- `old_designed/framer-mobile-390.png` and `.json`
- `old_designed/framer-mobile-menu-open.png` and `.json`
- `scripts/capture-framer-audit.mjs` for repeatable re-capture

The JSON files contain computed positions, dimensions, typography, visible text, and image URLs for each viewport. They are intended as implementation references, not production assets.
