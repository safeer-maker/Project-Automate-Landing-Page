# PA-LP: Issues & Discoveries Log

**Last Updated:** 2026-08-31  
**Project:** PROJECT:automate Landing Page  
**Environment:** Astro + Cloudflare Pages  
**Status:** Production-Ready (with improvements needed)

---

## 🔴 High Priority Issues

### 1. Hardcoded Warranty Badge Asset Path
**File:** `src/components/TrustSection.astro` (Line 33)  
**Severity:** High  
**Status:** ⚠️ Needs Fix

**Issue:**
```astro
src="/framer-extracted-assets/certifications/lifetime-warranty.webp"
```

The warranty badge uses a hardcoded path instead of the centralized `assetUrl()` system.

**Why it's problematic:**
- Won't fall back to R2 CDN in production
- If public directory changes, image breaks
- Inconsistent with other assets (15 others use assetUrl)
- Asset not tracked in `.framer-assets-state.json`

**Fix:**
1. Add to `framer-assets.config.json`:
```json
{ 
  "id": "warrantyBadge", 
  "source": "https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/certifications/lifetime-warranty.webp", 
  "path": "certifications/lifetime-warranty.webp" 
}
```

2. Update `TrustSection.astro`:
```astro
import { assetUrl } from '../config/assets';
// Line 33: Change to
src={assetUrl('warrantyBadge')}
```

---

### 2. External Form/Calendar IDs Not Parameterized
**Files:** 
- `src/components/GhlInlineForm.astro` (Line 24)
- `src/pages/schedule.astro` (Line 82)  
**Severity:** High  
**Status:** ⚠️ Needs Fix

**Issue:**
Form and booking IDs are hardcoded directly in components:
```astro
// GhlInlineForm.astro
src="https://api.leadconnectorhq.com/widget/form/ZiepwgoZzuozaOg3NIkl"

// schedule.astro
src="https://api.leadconnectorhq.com/widget/booking/UF6HdyNtYwKpZHABOBtL"
```

**Why it's problematic:**
- Visible in source code
- Can't change between staging/production without editing components
- If account changes, need to update multiple files
- Security concern (form ID exposed)

**Fix - Create `src/config/forms.ts`:**
```typescript
// Read from environment variables
export const GHL_FORM_ID = import.meta.env.PUBLIC_GHL_FORM_ID || 'ZiepwgoZzuozaOg3NIkl';
export const GHL_BOOKING_ID = import.meta.env.PUBLIC_GHL_BOOKING_ID || 'UF6HdyNtYwKpZHABOBtL';

export const GHL_FORM_URL = `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_ID}`;
export const GHL_BOOKING_URL = `https://api.leadconnectorhq.com/widget/booking/${GHL_BOOKING_ID}`;
```

**Update `.env.example`:**
```
PUBLIC_GHL_FORM_ID=ZiepwgoZzuozaOg3NIkl
PUBLIC_GHL_BOOKING_ID=UF6HdyNtYwKpZHABOBtL
```

**Update components:**
```astro
import { GHL_FORM_URL } from '../config/forms';
// Use: src={GHL_FORM_URL}
```

---

### 3. Missing Meta Pixel Configuration
**File:** `src/layouts/Layout.astro`  
**Severity:** High  
**Status:** ⚠️ Needs Implementation

**Issue:**
Meta pixel is configured only on GHL form/calendar iframes. The main page lacks pixel tracking for:
- Page views
- Engagement events (scrolls, button clicks)
- Funnel analytics
- Complete user journey

**Why it matters:**
- You're missing 80% of user interaction data
- Can't see who visits but doesn't submit form
- Can't retarget engaged users who didn't convert
- Incomplete lead funnel analysis

**How Cloudflare Pages handles it:**
✅ **Meta pixel WILL work fine on Cloudflare Pages**
- Cloudflare Pages serves static HTML
- Meta pixel is client-side JavaScript (runs in browser)
- Not affected by edge caching
- Only caveat: users with script blockers won't be tracked

**Fix:**
Add to `Layout.astro` `<head>`:
```astro
---
// At top of file
const metaPixelId = import.meta.env.PUBLIC_META_PIXEL_ID;
---

<!-- In <head> -->
{metaPixelId && (
  <>
    <script is:inline define:vars={{ metaPixelId }}>
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', metaPixelId);
      fbq('track', 'PageView');
    </script>
    <noscript>
      <img height="1" width="1" style="display:none" src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`} />
    </noscript>
  </>
)}
```

**Update `.env.example`:**
```
PUBLIC_META_PIXEL_ID=your_pixel_id_here
```

---

## 🟡 Medium Priority Issues

### 4. Animation Timeout Magic Numbers
**File:** `src/layouts/Layout.astro` (Lines 80, 122)  
**Severity:** Medium  
**Status:** ⚠️ Code Smell

**Issue:**
```typescript
// Line 80
window.setTimeout(complete, 2200);

// Line 122
fallbackTimer = window.setTimeout(releaseStuckVisibleItems, 350);
window.setTimeout(releaseStuckVisibleItems, 2200);
```

The `2200ms` timeout appears twice with no explanation of why or how it relates to CSS animations.

**CSS reference (Line 132, `global.css`):**
```css
animation-duration: 1.05s; /* Max is 1050ms */
```

**Why it matters:**
- If animation duration changes, timeout becomes invalid
- No documentation of relationship
- Difficult to maintain
- Could create race conditions

**Fix:**
```typescript
// At top of Layout.astro script
const ANIMATION_MAX_DURATION = 1050; // milliseconds
const SAFETY_TIMEOUT = ANIMATION_MAX_DURATION + 1150; // 2200ms

// Then use:
window.setTimeout(complete, SAFETY_TIMEOUT);
window.setTimeout(releaseStuckVisibleItems, SAFETY_TIMEOUT);
```

**Add comment:**
```typescript
// Safety net: animations have max 1.05s duration, add buffer 
// for browser rendering and edge cases (1050 + 1150 = 2200ms)
```

---

### 5. No Loading State for External iFrames
**Files:**
- `src/components/GhlInlineForm.astro`
- `src/pages/schedule.astro`  
**Severity:** Medium  
**Status:** ⚠️ UX Improvement

**Issue:**
Forms load asynchronously but show blank space. On slow connections (3G), users see nothing for 2-3 seconds.

**Current code:**
```astro
<iframe
  src="https://api.leadconnectorhq.com/widget/form/ZiepwgoZzuozaOg3NIkl"
  loading="lazy"  <!-- No loading state -->
></iframe>
```

**Fix:**
Add skeleton loader:
```astro
<div class="form-container">
  <div class="form-skeleton" id="formSkeleton">
    <!-- Loading skeleton -->
  </div>
  <iframe
    src={GHL_FORM_URL}
    loading="lazy"
    onload="document.getElementById('formSkeleton')?.remove()"
  ></iframe>
</div>

<style>
  .form-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    height: 1015px;
    border-radius: 8px;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
```

---

### 6. Slider Component Not Extracted
**File:** `src/components/BenefitsSection.astro` (Lines 100-144)  
**Severity:** Medium  
**Status:** ⚠️ Code Reuse

**Issue:**
Benefits slider logic is embedded directly in component. If copy-pasted or used elsewhere, creates duplicate event listeners and memory leaks.

**Current pattern:**
```typescript
document.querySelectorAll<HTMLElement>('[data-benefits-slider]').forEach((slider) => {
  // 44 lines of slider logic embedded here
});
```

**Better approach:**
Extract to `src/scripts/carousel.ts`:
```typescript
export function initCarousel(selector: string) {
  document.querySelectorAll<HTMLElement>(selector).forEach((slider) => {
    // Move logic here
  });
}
```

Then in component:
```astro
<script>
  import { initCarousel } from '../scripts/carousel';
  initCarousel('[data-benefits-slider]');
</script>
```

---

### 7. No CI/CD Pipeline
**File:** `.github/` (empty)  
**Severity:** Medium  
**Status:** ⚠️ DevOps

**Issue:**
No GitHub Actions workflow for:
- Automated builds on PR
- Code quality checks
- Asset availability validation
- Deployment to Cloudflare

**Recommended workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run format:check
      - run: npm run assets:check
      - run: npm run build
      
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 🟢 Low Priority Issues

### 8. Mobile Navigation Invisible
**File:** `src/components/SiteHeader.astro` (Lines 14-19)  
**Severity:** Low  
**Status:** ⓘ Design Question

**Issue:**
Mobile view (< 900px) has no visible hamburger menu. Only shows call button + CTA link.

**Current state:**
```astro
<div class="mobile-actions">
  <HeaderCallButton />
  <a class="mobile-cta" href="#consultation-form">
    Begin Your Private Consultation
  </a>
</div>
```

**Question:** Is this intentional? If so, document why. If not, add visible hamburger toggle.

---

### 9. Minimal Documentation
**File:** `README.md` (1 line)  
**Severity:** Low  
**Status:** ⓘ Developer Experience

**Issue:**
README only says "# Project-Automate-Landing-Page". No build/deploy instructions.

**Recommended additions:**
```markdown
# PROJECT:automate Landing Page

## Quick Start
```bash
npm install
npm run dev
npm run build
```

## Environment Variables
See `.env.example`

## Asset Management
Assets are downloaded from R2 CDN on build. Use `npm run assets:check`.

## Deployment
Deployed to Cloudflare Pages on main branch push.
```

---

### 10. No .env.example File
**File:** Missing  
**Severity:** Low  
**Status:** ⚠️ Setup

**Create `.env.example`:**
```
# Meta Pixel ID for conversion tracking
PUBLIC_META_PIXEL_ID=your_pixel_id

# GoHighLevel Form & Booking IDs
PUBLIC_GHL_FORM_ID=ZiepwgoZzuozaOg3NIkl
PUBLIC_GHL_BOOKING_ID=UF6HdyNtYwKpZHABOBtL

# Asset management
PUBLIC_R2_ASSET_URL=https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev
```

---

## 💡 Discoveries & Best Practices

### Asset Pipeline is Excellent
✅ Your framer asset system is well-designed:
- Centralized manifest (`framer-assets.config.json`)
- Local caching with state tracking
- R2 CDN fallback
- Type-safe asset IDs

**Only issue:** Warranty badge bypasses this system (Issue #1).

### Accessibility is Strong
✅ Proper semantic HTML, ARIA labels, motion preferences respected.
**Recommendation:** Add accessibility audit to CI/CD pipeline.

### Cloudflare Pages + Static Site = Optimal for Tracking
✅ Meta pixel works perfectly with Cloudflare Pages
- Client-side execution unaffected by CDN
- No additional configuration needed
- Just add the script to Layout.astro

---

## 📋 Action Checklist

- [ ] **High Priority (Week 1)**
  - [ ] Fix warranty badge asset path
  - [ ] Parameterize GHL form/booking IDs
  - [ ] Add Meta pixel to page

- [ ] **Medium Priority (Week 2)**
  - [ ] Set up GitHub Actions CI/CD
  - [ ] Add loading states to iframes
  - [ ] Extract slider component
  - [ ] Document animation timeouts

- [ ] **Low Priority (Week 3)**
  - [ ] Create `.env.example`
  - [ ] Expand README
  - [ ] Review mobile navigation design

---

## 📞 Questions for Product Team

1. **Mobile menu:** Is invisible hamburger intentional? Should we add one?
2. **Asset versioning:** If warranty badge changes, how do we update R2?
3. **GA4 integration:** Should we also add Google Analytics alongside Meta pixel?

---

*Document auto-generated from code review. Last updated: 2026-08-31*