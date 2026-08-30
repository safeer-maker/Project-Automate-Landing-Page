# Cloudflare Pages + Meta Pixel Setup Guide

**TL;DR:** ✅ Meta pixel works perfectly on Cloudflare Pages. It's client-side JavaScript, so the CDN doesn't affect it.

---

## How Cloudflare Pages Works (Simplified)

```
┌─────────────────────────────────────────────────────────────┐
│ User types: lighting.projectautomate.com                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │   Cloudflare CDN (Edge)     │
         │                             │
         │ - Serves pre-built HTML/CSS │
         │ - Caches static assets      │
         │ - No server-side code runs  │
         │                             │
         │ JUST SERVES FILES           │
         └──────────────┬──────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │    User's Browser           │
         │                             │
         │ - Renders HTML              │
         │ - Executes JavaScript ✓     │
         │ - Runs Meta pixel script ✓  │
         │ - Handles form submissions  │
         │                             │
         │ RUNS CLIENT-SIDE CODE       │
         └─────────────────────────────┘
```

---

## Why Meta Pixel WILL Work

### ✅ What Works Fine
- **Page Views** - Meta pixel fires when page loads in browser
- **Custom Events** - Button clicks, scrolls, form interactions tracked
- **Form Conversions** - GHL form submission triggers pixel conversion
- **Retargeting** - Users who visit are added to audiences
- **Analytics** - Complete user journey visible in Meta Ads Manager

### ❌ Only Exception
Users with strict privacy settings or script blockers (uBlock, Privacy Badger, NoScript) won't be tracked. But this is a **general web issue, not Cloudflare-specific**. Even traditional server-hosted sites have this.

---

## How GHL Form + Meta Pixel Work Together

```
┌────────────────────────────────────────────────────────────┐
│                    Landing Page Flow                       │
└────────────────────────────────────────────────────────────┘

1. User visits page
   ↓
   └─→ Meta Pixel fires "PageView" event
   └─→ Sent to: Meta Ads Manager → Analytics

2. User scrolls, engages
   ↓
   └─→ Meta Pixel could fire custom events (with extra code)
   └─→ Sent to: Meta Ads Manager → Conversion audiences

3. User clicks "Begin Consultation" CTA
   ↓
   └─→ GHL Form Modal opens (in iframe)
   └─→ GHL Form already has Meta pixel configured ✓

4. User submits form
   ↓
   └─→ GHL pixel fires "Lead" conversion event
   └─→ Form data sent to GoHighLevel
   └─→ Sent to: Meta Ads Manager → Lead event recorded

5. (Alternative) User clicks "Book Consultation"
   ↓
   └─→ Calendar Modal opens (in iframe)
   └─→ GHL Calendar already has Meta pixel configured ✓

6. User books time slot
   ↓
   └─→ GHL pixel fires "Purchase" or custom conversion
   └─→ Calendar data sent to GoHighLevel + Calendar system
   └─→ Sent to: Meta Ads Manager → Booking event recorded
```

**Result:** Complete funnel in Meta Ads Manager showing:
- 1,000 page views
- 300 scrolled down
- 150 clicked CTA
- 45 submitted form
- 20 booked consultation
- Conversion rate: 2% (20/1000)

---

## Current State vs. Optimal State

### ❌ Current (Incomplete Tracking)
```
Page Views     Form Submits    Bookings
    ❓              ✓              ✓
 (not tracked)  (GHL pixel)    (GHL pixel)
```

You're only tracking the last 2 steps. Missing page view data!

### ✅ Optimal (Complete Tracking)
```
Page Views     Engagement     Form Submits    Bookings
    ✓             ✓              ✓             ✓
(Meta pixel) (Meta pixel)    (GHL pixel)   (GHL pixel)
```

---

## Implementation: Add Meta Pixel to Page

### Step 1: Create `.env.local` (Development)
```
PUBLIC_META_PIXEL_ID=YOUR_ACTUAL_PIXEL_ID
PUBLIC_GHL_FORM_ID=ZiepwgoZzuozaOg3NIkl
PUBLIC_GHL_BOOKING_ID=UF6HdyNtYwKpZHABOBtL
```

### Step 2: Create `.env.example` (Commit to git)
```
# Meta Pixel Configuration
# Get this from: Meta Ads Manager → Events Manager → Pixels
PUBLIC_META_PIXEL_ID=your_pixel_id_here

# GoHighLevel Integration
# Get these from: GoHighLevel → Integrations → Form/Booking widgets
PUBLIC_GHL_FORM_ID=ZiepwgoZzuozaOg3NIkl
PUBLIC_GHL_BOOKING_ID=UF6HdyNtYwKpZHABOBtL
```

### Step 3: Update `src/layouts/Layout.astro`

Add this to the `<head>` section:

```astro
---
import { assetUrl, framerAssets } from '../config/assets';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  preloadVideo?: string;
}

const {
  title = 'Outdoor Lighting & Audio - PROJECT:automate',
  description = 'Your Home Shouldn\'t End at the Back Door...',
  ogImage = 'https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/hero/estate-at-sunset.webp',
  preloadVideo,
} = Astro.props;

// Get Meta Pixel ID from environment
const metaPixelId = import.meta.env.PUBLIC_META_PIXEL_ID;
---

<!doctype html>
<html lang="en" data-framer-assets={framerAssets.publicDirectory}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index, follow" />
    
    <!-- ... other existing meta tags ... -->

    {/* Meta Pixel - Only load if configured */}
    {metaPixelId && (
      <>
        <script is:inline define:vars={{ metaPixelId }}>
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', metaPixelId);
          fbq('track', 'PageView');
        </script>
        <noscript>
          <img height="1" width="1" style="display:none" src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`} alt="" />
        </noscript>
      </>
    )}

    {/* Rest of head content */}
  </head>
  
  <!-- ... rest of HTML ... -->
</html>
```

### Step 4: Parameterize GHL Form/Booking IDs

Create `src/config/forms.ts`:
```typescript
export const GHL_FORM_ID = import.meta.env.PUBLIC_GHL_FORM_ID || 'ZiepwgoZzuozaOg3NIkl';
export const GHL_BOOKING_ID = import.meta.env.PUBLIC_GHL_BOOKING_ID || 'UF6HdyNtYwKpZHABOBtL';

export const GHL_FORM_URL = `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_ID}`;
export const GHL_BOOKING_URL = `https://api.leadconnectorhq.com/widget/booking/${GHL_BOOKING_ID}`;
```

Update `src/components/GhlInlineForm.astro`:
```astro
---
import { GHL_FORM_URL } from '../config/forms';

interface Props {
  title?: string;
  eyebrow?: string;
  description?: string;
  variant?: 'light' | 'glass';
}

const {
  title = 'Tell Us About Your Outdoor Project',
  eyebrow = 'Private consultation',
  description = 'Share a few details and our design team will review your project before reaching out.',
  variant = 'light',
} = Astro.props;
---

<section class:list={['ghl-inline', `ghl-inline--${variant}`]}>
  <div class="ghl-inline__heading">
    <p>{eyebrow}</p>
    <h2>{title}</h2>
    <span>{description}</span>
  </div>
  <iframe
    src={GHL_FORM_URL}  <!-- Changed from hardcoded URL -->
    id="inline-form"
    data-layout="{'id':'INLINE'}"
    data-height="1015"
    title="PROJECT:automate consultation form"
    loading="lazy"
  >
  </iframe>
</section>
```

Update `src/pages/schedule.astro`:
```astro
---
import { GHL_BOOKING_URL } from '../config/forms';
// ... other imports ...
---

<!-- In the calendar section (around line 82): -->
<div class="calendar-frame">
  <iframe
    src={GHL_BOOKING_URL}  <!-- Changed from hardcoded URL -->
    allow="payment"
    scrolling="no"
    title="Schedule a private PROJECT:automate consultation"
  >
  </iframe>
</div>
```

---

## Testing the Setup

### 1. **Local Testing**
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and check:
- Open DevTools → Network tab
- Look for requests to `connect.facebook.net`
- Should see `fbq` in console

### 2. **Test Meta Pixel**
```javascript
// Open browser console and type:
fbq('track', 'Contact');
```
Check Meta Ads Manager → Events Manager → Test Events. Should see event within 15 minutes.

### 3. **Test GHL Forms**
- Submit test form → should appear in GoHighLevel
- Check GHL → Marketing → Leads

### 4. **Test Calendar**
- Book test appointment → should appear in calendar
- Check GoHighLevel and your actual calendar

---

## Deployment to Cloudflare

### Step 1: Set Environment Variables in Cloudflare

1. Go to Cloudflare Dashboard
2. Select your site
3. Navigate to **Settings → Environment Variables** (or **Pages → Settings → Environment Variables**)
4. Add:
   ```
   PUBLIC_META_PIXEL_ID = your_actual_pixel_id
   PUBLIC_GHL_FORM_ID = ZiepwgoZzuozaOg3NIkl
   PUBLIC_GHL_BOOKING_ID = UF6HdyNtYwKpZHABOBtL
   ```

### Step 2: Deploy
```bash
npm run build
# Cloudflare auto-deploys on git push to main
```

---

## Troubleshooting

### Meta Pixel Not Firing?

**Check 1: Is pixel ID in environment?**
```bash
# In your build logs or locally:
echo $PUBLIC_META_PIXEL_ID
```

**Check 2: Is JavaScript enabled?**
Open DevTools Console, check for errors

**Check 3: Browser privacy settings**
Try incognito/private mode. Privacy blockers suppress pixel.

**Check 4: Verify in Meta Ads Manager**
- Go to Ads Manager → Events Manager → Pixels
- Click your pixel
- Click "Test Events"
- Visit your site, should see events appear

### Form Not Submitting?

**Check:** Is `PUBLIC_GHL_FORM_ID` correct?
```bash
# In form iframe source, should show:
https://api.leadconnectorhq.com/widget/form/YOUR_ID
```

---

## Key Differences: Traditional Server vs. Cloudflare Pages

| Aspect | Traditional Server | Cloudflare Pages |
|--------|-------------------|------------------|
| **Where CSS/JS runs** | Both server + client | Client only |
| **Meta Pixel** | ✅ Works (client-side) | ✅ Works (client-side) |
| **Form submissions** | ✅ Works | ✅ Works (via iframe) |
| **Server-side rendering** | ✅ Can do | ❌ Not needed (static) |
| **Build time** | Slower | ✅ Fast (Astro pre-builds) |
| **Caching** | Per-request | ✅ Permanent (CDN edge) |

**Conclusion:** Cloudflare Pages is actually BETTER for Meta tracking because:
1. ✅ No server overhead
2. ✅ Faster page load → pixel fires faster
3. ✅ Better caching → consistent behavior
4. ✅ Built for static sites (your use case)

---

## FAQ

**Q: Will Cloudflare block the Meta pixel request?**  
A: No. Cloudflare doesn't block outbound requests from client-side scripts.

**Q: Do I need Cloudflare Workers?**  
A: No. You're using Cloudflare Pages (static hosting), not Workers (serverless). Keep it simple.

**Q: Can I track events other than PageView?**  
A: Yes, but requires extra code. Basic setup (PageView + GHL conversions) is sufficient. Custom events can be added later.

**Q: What if someone visits both main site and landing page?**  
A: Both sites can use the same Meta pixel. Pixel will see complete user journey across domains (if properly configured in Meta Ads Manager).

**Q: Should we use Google Analytics too?**  
A: Optional. Meta pixel is sufficient for lead tracking. GA is good for page behavior analytics if you want more detail.

---

## Summary

✅ **Your setup is optimal:**
- Cloudflare Pages ← Perfect for static landing pages
- GHL Forms + Calendar ← Handles conversions
- Meta Pixel ← Tracks complete funnel

✅ **To enable full tracking:**
1. Add Meta pixel script to Layout.astro
2. Parameterize GHL form/booking IDs
3. Deploy with environment variables
4. Verify in Meta Ads Manager

**Expected result:** Complete lead funnel visibility in Meta Ads Manager.

---

*Last updated: 2026-08-31*