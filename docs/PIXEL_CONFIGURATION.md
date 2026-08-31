# Meta Pixel Configuration Guide

## Overview
This document outlines the Meta (Facebook) Pixel configuration for the PROJECT:automate website. The pixel ID is dynamically loaded from `public/config.json` to enable easy configuration management.

## Configuration Details

### Pixel ID
- **Current Pixel ID**: `1748478050610981`
- **Location**: `public/config.json`
- **Status**: ✅ Active and configured

```json
{
  "meta": {
    "pixelId": "1748478050610981"
  }
}
```

## Implementation

### 1. **Pixel Initialization** (Layout.astro)
- **Method**: Dynamic configuration loading from `config.json`
- **Script Type**: Inline, loads before page content
- **Initialization Events**: 
  - `fbq('init', pixelId)` - Initializes the pixel
  - `fbq('track', 'PageView')` - Tracks every page view automatically

### 2. **Conversion Events**

#### Lead Tracking
Triggered when users:
- **Open the consultation form modal** → `fbq('track', 'Lead')`
- **View the inline form** (when it becomes visible) → `fbq('track', 'Lead')`

#### Contact Tracking
Triggered when users:
- **Submit a consultation form** → `fbq('track', 'Contact')`
- **Complete a booking on the schedule page** → `fbq('track', 'Contact')`

### 3. **Noscript Fallback**
- **Location**: Layout.astro (lines 71-88)
- **Purpose**: Tracks page views for users with JavaScript disabled
- **Fixed in v2**: Now dynamically loads pixel ID from config instead of hardcoded placeholder
- **Method**: img beacon (minimal tracking for no-JS users)

## Tracked Interactions

| Event | Trigger | Components |
|-------|---------|-----------|
| **PageView** | Every page load | Global (Layout.astro) |
| **Lead** | Form/booking modal opened | GhlFormModal.astro, GhlInlineForm.astro, schedule.astro |
| **Lead** | Inline form becomes visible | GhlInlineForm.astro |
| **Contact** | Form submission | GhlFormModal.astro, GhlInlineForm.astro, schedule.astro |

## File Locations

### Core Implementation Files
- **Main Pixel Script**: `src/layouts/Layout.astro` (lines 50-69)
- **Noscript Fallback**: `src/layouts/Layout.astro` (lines 71-88)
- **Form Modal Tracking**: `src/components/GhlFormModal.astro` (lines 20-57)
- **Inline Form Tracking**: `src/components/GhlInlineForm.astro` (lines 35-60)
- **Schedule Page Tracking**: `src/pages/schedule.astro` (lines 102-126)

### Configuration
- **Config File**: `public/config.json`
- **Asset URLs**: Configured to load from Cloudflare R2 in production

## Verification Checklist

### ✅ Before Deployment
- [ ] Verify pixel ID in `public/config.json` is correct
- [ ] Test pixel fires on page load (check Meta Events Manager)
- [ ] Test Lead event fires when opening forms
- [ ] Test Contact event fires on form submission
- [ ] Verify noscript fallback works in testing

### ✅ In Production
- [ ] Monitor pixel events in Meta Ads Manager
- [ ] Check Events Manager for all event types
- [ ] Verify event counts match user interactions
- [ ] Set up conversion columns in Facebook Ads for Lead and Contact events

## Testing

### Using Meta Pixel Helper (Browser Extension)
1. Install Meta Pixel Helper extension
2. Visit the website
3. Open extension to see fired events:
   - ✅ Should see `PageView` on initial load
   - ✅ Should see `Lead` when opening consultation form
   - ✅ Should see `Contact` when submitting form

### Console Testing
```javascript
// Check if fbq is available
console.log(typeof fbq); // Should output: "function"

// Check pixel initialization
fbq('track', 'CustomEvent', {test: true});
```

### Network Tab Testing
1. Open DevTools → Network tab
2. Filter for `facebook.com/tr`
3. Look for requests with parameters:
   - `id=1748478050610981` (pixel ID)
   - `ev=PageView|Lead|Contact` (event type)

## Common Issues & Solutions

### Issue: Pixel Not Firing
- **Solution 1**: Verify `config.json` is being served and contains valid pixel ID
- **Solution 2**: Check browser console for fetch errors loading config
- **Solution 3**: Ensure JavaScript is enabled on the testing device

### Issue: Noscript Not Working
- **Solution**: The noscript fallback requires the `config.json` to be accessible from the origin

### Issue: Form Events Not Tracking
- **Problem**: GHL forms may be cross-origin and restrict message passing
- **Solution**: Events are tracked on form open (Lead) which is more reliable
- **Note**: Form submission tracking is a fallback that may not work due to cross-origin restrictions

## Environment Variables
- **PUBLIC_R2_ASSET_URL**: Set at build/deploy time for asset loading (optional)
- **No other environment variables required for pixel**

## Notes
- Pixel ID should never be committed to git; it's loaded from config.json at runtime
- The pixel tracks standard events (PageView, Lead, Contact)
- Custom events can be added by calling `fbq('track', 'EventName')` from any component
- For production, ensure the pixel ID is set correctly in the deployment config

## Updates & Changes
- **v2** (2026-08-31): Fixed noscript fallback to use dynamic pixel ID from config
- Added Lead tracking for form visibility
- Added Contact tracking for form submissions
- Added schedule page booking event tracking
