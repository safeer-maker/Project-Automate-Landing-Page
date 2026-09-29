# Meta Pixel Configuration Guide

## Overview
The Meta (Facebook) Pixel runs in two places:

1. **GHL form and calendar** – the pixel is attached inside GoHighLevel. GHL fires `Lead` when someone submits the consultation form or books on the calendar.
2. **This website** – loads the same pixel, sends `PageView`, and tracks the link clicks GHL can't see.

Because GHL owns the conversions, the website must **not** fire `Lead`, `Schedule`, or any submission events. Doing so would count every conversion twice.

## Pixel ID
- **Current Pixel ID**: `1748478050610981`
- **Location**: `src/config/tracking.ts` (`META_PIXEL_ID`)
- Can be overridden at build time with the `PUBLIC_META_PIXEL_ID` environment variable (see `.env.example`). The ID is baked into the HTML at build time; no runtime config is fetched.

## Events Sent by the Website

| Event | Type | Trigger | Parameters |
|-------|------|---------|-----------|
| `PageView` | Standard | Every page load | – |
| `Contact` | Standard | Click on any `tel:` or `mailto:` link | `method`: `phone` \| `email` |
| `VisitMainWebsite` | Custom | Click on any link to `projectautomate.com` (header/footer logo, Privacy, Terms) | `destination`: page path, e.g. `/`, `/privacy-policy/` |
| `FindLocation` | Standard | Click on the Google Maps "Visit Us" link | – |

Events sent by GHL (from inside the form/calendar iframes): `Lead` on form submission and booking.

## Implementation
All website tracking lives in `src/layouts/Layout.astro`:
- Standard Meta base snippet, initialised with `META_PIXEL_ID`, followed by `fbq('track', 'PageView')`.
- One delegated `click` listener on `document` that inspects the clicked link's URL. New `tel:`/`mailto:`/main-website links are tracked automatically, with no component changes needed.
- A `<noscript>` image beacon for PageView when JavaScript is disabled.

The inline form component (`GhlInlineForm.astro`) and `schedule.astro` contain no pixel code.

### Adding an event
Extend the click listener in `Layout.astro`, or call `fbq('track', '<StandardEvent>')` / `fbq('trackCustom', '<Name>')` from a component script. Do not add events for form opens or submissions; GHL handles those.

## Using the Events in Meta
- **Ads optimisation**: optimise for `Lead` (from GHL).
- **Main-website clicks**: create a Custom Conversion on `VisitMainWebsite` with the rule `destination` equals `/` to count logo clicks while ignoring Privacy/Terms clicks.
- **Audiences**: `Contact`, `FindLocation`, and `VisitMainWebsite` are useful for retargeting audiences of engaged visitors.

## Testing
Use Meta Pixel Helper, Events Manager → **Test Events**, or DevTools → Network filtered to `facebook.com/tr`.

| Action | Expected |
|--------|----------|
| Load any page | One `PageView` |
| Scroll to the inline form | Nothing from the site |
| Click the phone number or email | One `Contact` |
| Click the header/footer logo | One `VisitMainWebsite`, `destination=/` |
| Click the "Visit Us" address | One `FindLocation` |
| Submit a test form / make a test booking | One `Lead`, sent from the GHL iframe (`leadconnectorhq.com`) |

Note: `npm run dev` also fires the live pixel. Use Test Events or filter out test traffic.

## Updates & Changes
- **v3** (2026-09-29): GHL owns Lead/booking conversions. Removed the site-side Lead/Contact events on form visibility and booking iframe load, plus the postMessage listeners that guessed submission payloads. Pixel now loads synchronously from `src/config/tracking.ts` instead of fetching `public/config.json` (deleted). Fixed the noscript fallback. Added `Contact`, `VisitMainWebsite`, and `FindLocation` click tracking.
- **v2** (2026-08-31): Initial site-side pixel with `config.json` loading.
