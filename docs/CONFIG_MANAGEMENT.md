# Dynamic Configuration Management

**Status:** ✅ Implemented  
**Last Updated:** 2026-08-31  
**Feature:** Edit Meta Pixel ID and other settings without rebuilding

---

## 🎯 Overview

Your site uses a **dynamic `public/config.json`** file that controls:
- **Meta Pixel ID** - Change anytime without rebuilding
- **GHL Form ID** - Reference for forms
- **GHL Booking ID** - Reference for calendar
- **Environment** - Track which environment is active

This allows you to:
- ✅ Change Meta Pixel ID in seconds
- ✅ No rebuild needed
- ✅ No environment variables needed
- ✅ Edit directly via your hosting platform
- ✅ Easy to manage multiple environments

---

## 📁 File Structure

```
public/config.json          ← Edit this to change settings
  ├─ meta.pixelId          ← Your Meta Pixel ID (can be changed anytime)
  ├─ ghl.formId            ← GoHighLevel form ID
  ├─ ghl.bookingId         ← GoHighLevel booking ID
  └─ environment           ← Current environment (production/staging)
```

---

## 🔧 Current Configuration

```json
{
  "meta": {
    "pixelId": "YOUR_PIXEL_ID_HERE"
  },
  "ghl": {
    "formId": "ZiepwgoZzuozaOg3NIkl",
    "bookingId": "UF6HdyNtYwKpZHABOBtL"
  },
  "environment": "production",
  "lastUpdated": "2026-08-31"
}
```

---

## 📝 How to Update Settings

### Option 1: Edit via Cloudflare Dashboard (Recommended for Production)

1. **Go to:** Cloudflare Dashboard
2. **Navigate to:** Pages → Your Site → Deployments
3. **Open:** Recent deployment
4. **Find:** `public/config.json`
5. **Edit:** The file directly in the preview
6. **Save:** Changes take effect immediately

**Or via Git:**
1. Clone/Pull your repo
2. Edit `public/config.json`
3. Change only the values you need:
   ```json
   {
     "meta": {
       "pixelId": "YOUR_NEW_PIXEL_ID_HERE"
     },
     ...
   }
   ```
4. Commit: `git add public/config.json && git commit -m "config: update meta pixel id"`
5. Push: `git push origin lp-design-2-framer`
6. Cloudflare auto-deploys

---

## 🔑 Update Meta Pixel ID

### Step 1: Get Your Pixel ID

1. **Go to:** Meta Ads Manager
2. **Navigate to:** Events Manager
3. **Select:** Your pixel
4. **Find:** Pixel ID (8-16 digit number)
5. **Copy:** The ID

### Step 2: Update Config File

**Local (via text editor):**
```json
{
  "meta": {
    "pixelId": "123456789012345"
  },
  ...
}
```

**Cloudflare Dashboard:**
1. Go to Pages → Deployments
2. Find `public/config.json`
3. Edit the value in `meta.pixelId`
4. Save

### Step 3: Verify Changes

```bash
# Local test:
npm run preview
# Open DevTools → Console
# Should see: fbq('init', '123456789012345');

# Production:
# Visit your site
# Open DevTools → Network tab
# Look for request to: facebook.com/tr?id=123456789012345
```

---

## 🚀 How It Works

### Page Load Flow

```
1. Browser loads page from Cloudflare
   ↓
2. JavaScript runs in <head>
   ├─ Calls: fetch('/config.json')
   ├─ Waits for response
   └─ Continues
   ↓
3. Config loaded successfully
   ├─ Extracts: config.meta.pixelId
   ├─ Checks: Is it valid? (not "YOUR_PIXEL_ID_HERE")
   └─ Initializes Meta Pixel with that ID
   ↓
4. fbq('init', pixelId)
   ├─ Loads: Facebook pixel script
   ├─ Fires: PageView event
   └─ Starts tracking
```

### What Happens if Config is Missing

```
If fetch fails or config.json not found:
  └─> Logs warning to console
  └─> Pixel does NOT initialize
  └─> No errors, page works fine
  └─> Check browser console for details
```

### What Happens if Pixel ID is Invalid

```
If pixelId === "YOUR_PIXEL_ID_HERE":
  └─> Detected as placeholder
  └─> Logs: "Meta Pixel ID not configured"
  └─> Pixel does NOT initialize
  └─> Prevents tracking with wrong ID
```

---

## ✅ Verification Checklist

- [ ] `public/config.json` exists
- [ ] Meta Pixel ID is set (not placeholder)
- [ ] GHL IDs match your account
- [ ] Site builds successfully: `npm run build`
- [ ] Site works locally: `npm run preview`
- [ ] Open DevTools → Console
- [ ] No errors about config loading
- [ ] No errors about pixel initialization
- [ ] Check Meta Ads Manager → Events Manager → Test Events
- [ ] Visit site and trigger PageView event
- [ ] Event appears in Meta within 15 minutes

---

## 🔄 Environment-Specific Configs

You can have different configs for different environments:

```
public/
├─ config.json              ← Production (main branch)
├─ config.staging.json      ← Staging (for testing)
└─ config.development.json  ← Development (local)
```

### How to Use Multiple Configs

**In Layout.astro, change:**
```javascript
fetch('/config.json')
```

**To:**
```javascript
// Automatically select based on environment
const configFile = import.meta.env.PROD ? '/config.json' : '/config.development.json';
fetch(configFile)
```

---

## 🔐 Security Considerations

### What's Safe to Put in config.json?

✅ **Safe - Public IDs:**
- Meta Pixel ID (public, used by pixel tracking)
- GHL Form ID (public, used in HTML)
- GHL Booking ID (public, used in HTML)
- Environment name (informational)

❌ **NOT Safe - Credentials:**
- API keys
- Access tokens
- Secrets
- Authentication tokens
- Passwords

**Why?** The file is served to browsers, so anything in it is visible in the network tab.

---

## 📊 Example Configurations

### Production (Main Site)

```json
{
  "meta": {
    "pixelId": "123456789012345"
  },
  "ghl": {
    "formId": "ZiepwgoZzuozaOg3NIkl",
    "bookingId": "UF6HdyNtYwKpZHABOBtL"
  },
  "environment": "production",
  "lastUpdated": "2026-08-31"
}
```

### Staging (Testing New IDs)

```json
{
  "meta": {
    "pixelId": "987654321098765"
  },
  "ghl": {
    "formId": "TestFormIdForStaging",
    "bookingId": "TestBookingIdForStaging"
  },
  "environment": "staging",
  "lastUpdated": "2026-08-31"
}
```

### Development (Local Testing)

```json
{
  "meta": {
    "pixelId": "111111111111111"
  },
  "ghl": {
    "formId": "LocalTestFormId",
    "bookingId": "LocalTestBookingId"
  },
  "environment": "development",
  "lastUpdated": "2026-08-31"
}
```

---

## 🚨 Troubleshooting

### Problem: Config not loading

**Check:**
```bash
# Does config.json exist?
ls -la public/config.json

# Is it valid JSON?
cat public/config.json | jq .

# Can you fetch it?
curl http://localhost:3000/config.json
```

### Problem: Meta Pixel not initializing

**Check:**
1. Is pixelId a placeholder? (`YOUR_PIXEL_ID_HERE`)
2. Is pixelId a valid number?
3. Open DevTools → Console, look for error messages
4. Check Network tab for `/config.json` request
5. Verify response contains pixelId

### Problem: Old Pixel ID still used after update

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Clear browser cache
3. Open DevTools → Network tab
4. Check `/config.json` response
5. Verify new pixelId is in response

### Problem: "Meta Pixel ID not configured" warning

**Solution:**
1. Edit `public/config.json`
2. Set actual pixel ID (not placeholder)
3. Save file
4. Redeploy (git push or Cloudflare edit)
5. Hard refresh browser

---

## 📋 Complete Setup Instructions

### First Time Setup

```bash
# 1. Build project (includes config.json)
npm run build

# 2. Edit config.json with your Pixel ID
# Change "YOUR_PIXEL_ID_HERE" to your actual ID

# 3. Test locally
npm run preview
# Visit http://localhost:3000
# Open DevTools → Console
# Should see no warnings

# 4. Commit
git add public/config.json
git commit -m "config: set meta pixel id"

# 5. Deploy
git push origin lp-design-2-framer
# Cloudflare auto-deploys
```

### Later: Update Pixel ID

**Option A - Via Cloudflare Dashboard (Fastest):**
1. Cloudflare Dashboard → Pages → Deployments
2. Find recent deployment
3. Click `public/config.json`
4. Edit the pixelId value
5. Save
6. Changes live immediately ✓

**Option B - Via Git (Trackable):**
1. Edit `public/config.json` locally
2. `git add public/config.json`
3. `git commit -m "config: update meta pixel"`
4. `git push origin lp-design-2-framer`
5. Cloudflare deploys automatically ✓

---

## 🔍 How to Verify It's Working

### Development (Local)

```bash
npm run preview

# Open browser to http://localhost:3000
# Open DevTools → Console

# Should see:
# - No error messages
# - config.json fetched successfully
# - fbq pixel initialized
# - PageView event tracked
```

### Production (Cloudflare)

```bash
# Visit: https://lighting.projectautomate.com
# Open DevTools → Console

# Check:
# ✓ /config.json loaded
# ✓ pixelId value matches your ID
# ✓ fbq initialized with your ID
# ✓ No errors

# Check Meta Ads Manager → Events Manager:
# ✓ Test Events tab
# ✓ Visit your site
# ✓ Should see PageView event fire within 15 seconds
```

---

## 📚 Related Documentation

- `docs/CLOUDFLARE_AND_META_PIXEL.md` - Meta Pixel setup guide
- `docs/R2_ARCHITECTURE.md` - Asset management
- `docs/ISSUES_AND_DISCOVERIES.md` - Known issues

---

## 🎯 Summary

✅ **Easy to use:**
- Edit `public/config.json`
- No rebuild needed
- Changes live immediately

✅ **Flexible:**
- Multiple configs for different environments
- Easy to test different IDs
- Non-technical users can update it

✅ **Safe:**
- Only for public data (IDs, not secrets)
- Warns if configuration is missing
- Falls back gracefully if config fails

✅ **Trackable:**
- Commit config changes to git
- See history of ID changes
- Know when and who updated

---

*Last Updated: 2026-08-31*
