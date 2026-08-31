# R2 CDN Architecture Guide

**Status:** ✅ Production Ready  
**Last Updated:** 2026-08-31  
**Maintainer:** Your Team

---

## 📊 Overview

Your landing page uses **Cloudflare R2** for all media assets (images, videos, etc.). This guide explains the architecture and how it works.

### Current Setup
- **15 assets** defined in `assets.config.json` (WebP images + WebM video)
- **Source:** Cloudflare R2 CDN bucket
- **Distribution:** Automatic via Cloudflare edge network
- **Development:** Assets downloaded locally during build
- **Production:** Served from R2 CDN (when configured)

### Size Impact
```
Total media: ~10 MB
├─ WebP images: 1.9 MB (optimized)
├─ WebM video: 6.3 MB (optimized)
└─ Metadata: ~20 KB
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE R2 BUCKET                          │
│  (https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/)           │
│                                                                     │
│  Contains 15 Assets:                                               │
│  ├─ brand/project-automate-mark.webp                              │
│  ├─ hero/estate-at-sunset.webp + estate-at-sunset.webm            │
│  ├─ certifications/ (4 files)                                      │
│  ├─ services/ (3 files)                                            │
│  ├─ features/ (3 files)                                            │
│  ├─ case-studies/ (2 files)                                        │
│  ├─ process/ (1 file)                                              │
│  └─ contact/ (1 file)                                              │
└────────────────┬──────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   DEVELOPMENT       PRODUCTION
   (Local Files)     (R2 CDN)
   
   npm run build     GitHub → Cloudflare Pages
        │                      │
        ▼                      ▼
   scripts/              GitHub Actions
   download-assets.mjs        │
        │                     ▼
   Fetch from R2         npm run build
   Save to public/            │
   framer-extracted-      Fetch from R2
   assets/               Save to public/
        │                Framer-extracted-
        ▼                assets/
   assetUrl()               │
   checks env var          ▼
        │            assetUrl() checks
   NO R2_URL?       PUBLIC_R2_ASSET_URL
        │                   │
        ▼                   ▼
   /framer-extracted-  https://pub...
   assets/...          r2.dev/...
        │                   │
        ▼                   ▼
   Browser loads       Browser loads
   from local          from R2 CDN
   (fast in dev)       (fast globally)
```

---

## 🔄 How It Works

### Development Flow

```
1. npm run build
   └─> Triggers: npm run assets:download
       └─> Executes: scripts/download-assets.mjs
           ├─> Reads: assets.config.json
           ├─> Fetches: 15 files from R2 CDN
           ├─> Saves: public/framer-extracted-assets/
           └─> Tracks: .assets-state.json (avoid re-downloading)

2. assetUrl() function resolves asset URLs
   ├─> Checks: import.meta.env.PUBLIC_R2_ASSET_URL
   ├─> If NOT set (development):
   │   └─> Returns: /framer-extracted-assets/brand/...
   │       (Browser loads from local static files)
   └─> If set (production):
       └─> Returns: https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/...
           (Browser loads from R2 CDN)

3. Build completes
   └─> HTML generated with asset URLs embedded
```

### Production Flow

```
1. Push to GitHub on lp-design-2-framer branch
   └─> Triggers: GitHub Actions (Cloudflare integration)

2. Cloudflare builds your site
   ├─> Runs: npm run build
   ├─> Which runs: npm run assets:download
   ├─> Downloads 15 files from R2 to public/
   └─> Builds HTML with asset URLs

3. assetUrl() function resolves URLs
   ├─> Checks: PUBLIC_R2_ASSET_URL environment variable
   ├─> If set in Cloudflare:
   │   └─> Returns: https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/...
   │       ✓ Browser loads from R2 CDN at edge
   └─> If NOT set:
       └─> Returns: /framer-extracted-assets/...
           ✗ Browser loads from deployed files (slower)

4. Cloudflare Pages deploys to CDN
   └─> HTML + CSS + JS cached at edge
```

---

## 🔧 Configuration

### Asset Manifest (`assets.config.json`)

```json
{
  "$schema": "./assets.schema.json",
  "publicDirectory": "framer-extracted-assets",
  "r2Prefix": "",
  "assets": [
    {
      "id": "brandMark",
      "source": "https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/brand/project-automate-mark.webp",
      "path": "brand/project-automate-mark.webp"
    },
    // ... 14 more assets
  ]
}
```

**Key Fields:**
- `id`: Unique identifier for code references (e.g., `assetUrl('brandMark')`)
- `source`: R2 CDN URL to download from
- `path`: Local path to save to (within `publicDirectory`)
- `publicDirectory`: Base folder for assets (used locally and in R2 prefix)

### Environment Variables

#### Required for Production
```
PUBLIC_R2_ASSET_URL = https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev
```

**Set in:** Cloudflare Dashboard → Your Site → Settings → Environment Variables

**Set for:** All environments (Production + Preview)

#### Optional for Development
Not needed - development defaults to local files.

---

## ✅ Setup Checklist

- [ ] **Verify R2 bucket exists** and is publicly accessible
- [ ] **Check all 15 assets exist** in R2 bucket
- [ ] **Set PUBLIC_R2_ASSET_URL** in Cloudflare Dashboard
  ```
  Name: PUBLIC_R2_ASSET_URL
  Value: https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev
  Environment: All
  ```
- [ ] **Push to GitHub** to trigger Cloudflare deploy
- [ ] **Verify production** - inspect images in DevTools
  - Should see R2 URLs in Network tab
  - Not local `/framer-extracted-assets/` paths
- [ ] **Monitor R2** - check Cloudflare R2 dashboard for usage

---

## 🚀 NPM Commands

### Download & Manage Assets

```bash
# Download all assets from R2 (run automatically with npm run build)
npm run assets:download

# Force re-download all (ignore cache)
npm run assets:download:force

# Dry-run: show what would be downloaded without downloading
npm run assets:check

# Validate: ensure assets.config.json is correct
npm run assets:validate
```

### Build & Deploy

```bash
# Build locally (downloads assets, builds HTML)
npm run build

# Preview locally
npm run preview

# Deploy (push to GitHub)
git push origin lp-design-2-framer
```

---

## 🔍 Verification

### 1. Verify Assets Exist in R2

```bash
# Test a few URLs manually:
curl -I https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/brand/project-automate-mark.webp
curl -I https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/hero/estate-at-sunset.webm

# Should return 200 OK, not 404
```

### 2. Verify Development Loads Locally

```bash
npm run build
npm run preview

# Open http://localhost:3000
# Open DevTools → Network tab
# Images should load with local paths:
# /framer-extracted-assets/brand/project-automate-mark.webp
```

### 3. Verify Production Loads from R2

```bash
# After pushing to GitHub and Cloudflare deploys:
# Visit: https://lighting.projectautomate.com

# Open DevTools → Network tab
# Inspect any image
# Should see R2 URL:
# https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/brand/...
```

### 4. Monitor R2 Usage

**Cloudflare Dashboard → R2:**
- Storage used: Should be ~10 MB
- Bandwidth: Track how much data served
- Request logs: See what's accessed

---

## 🐛 Troubleshooting

### Images Broken in Production

**Symptoms:** 404 errors, images don't load

**Checklist:**
1. ✅ Is R2 bucket public? (Check bucket settings)
2. ✅ Is PUBLIC_R2_ASSET_URL set in Cloudflare?
3. ✅ Did Cloudflare deployment complete successfully?
4. ✅ Do assets actually exist in R2 bucket?
5. ✅ Are file paths in assets.config.json correct?

**Quick Test:**
```bash
# Can you manually access an asset?
curl https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/brand/project-automate-mark.webp

# If 403 or 404, bucket isn't public or files don't exist
# If image data returns, bucket is working
```

### Images Load Slow

**Symptoms:** Images take 3+ seconds to load

**Solutions:**
1. Verify PUBLIC_R2_ASSET_URL is set (should serve from edge)
2. Check R2 bucket region matches Cloudflare
3. Monitor R2 bandwidth usage in dashboard
4. Verify WebP/WebM are being used (not PNG/JPEG/MP4)

### Build Fails with Asset Download Error

**Symptoms:** Build fails at `npm run assets:download` step

**Checklist:**
1. ✅ R2 bucket is accessible from build environment
2. ✅ Asset URLs in assets.config.json are correct
3. ✅ Network isn't blocking Cloudflare R2 CDN

**Debug:**
```bash
# Run dry-run to see what would download
npm run assets:check

# Validate configuration
npm run assets:validate

# Check your internet connection
curl https://pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/
```

---

## 🚀 Future Optimization (Phase 2)

### Current State
- ✅ Assets defined in R2
- ✅ Downloaded during build
- ⚠️ Local copies tracked in git (~10 MB in repo)

### Phase 2 Goal
- Delete local media from git
- Repo becomes ~500 KB (code only)
- Production works exactly the same
- Build downloads on-demand from R2

### How to Implement Phase 2

```bash
# 1. Delete local media
rm -rf public/framer-extracted-assets/*

# 2. Update .gitignore
# Add: public/framer-extracted-assets/*

# 3. Verify build still works
npm run build
npm run preview

# 4. Commit
git add -A
git commit -m "phase-2: remove local media from git, use R2 only"
git push
```

### Benefits
- 🎯 Repo size: 11 MB → 500 KB
- ⚡ Git clone: Fast (no media)
- 📦 Build size: Smaller deployments
- 🌐 Production: Unchanged (still uses R2)

---

## 📋 Asset Inventory

### Brand
- `brandMark.webp` (7.5 KB)

### Hero Section
- `heroEstateAtSunset.webp` (1.1 MB)
- `heroEstateAtSunset.webm` (6.3 MB video)

### Certifications (4)
- `htaCertification.webp` (27 KB)
- `cediaMembership.webp` (18 KB)
- `industryMembership.webp` (18 KB)
- *(warranty badge not yet in R2 config)*

### Services (3)
- `landscapeLightingService.webp` (852 KB)
- `outdoorAudioService.webp` (145 KB)
- `smartControlService.webp` (18 KB)

### Features (3)
- `revealArchitecture.webp` (257 KB)
- `highlightLandscaping.webp` (284 KB)
- `improveSafety.webp` (868 KB)

### Case Studies (2)
- `projectCaseStudy.webp` (282 KB)
- `projectCaseStudyDetail.webp` (35 KB)

### Process
- `designBuildProcess.webp` (242 KB)

### Contact
- `consultationContact.webp` (212 KB)

---

## 🔐 Security

### R2 Bucket Access

**Current Setup:**
- Bucket is publicly readable (images must be public for users to see)
- No authentication needed for asset downloads
- All URLs are HTTPS

**Best Practices:**
- ✅ Don't store sensitive data in R2
- ✅ Only public images should be in this bucket
- ✅ Monitor access logs regularly
- ✅ Use signed URLs if sensitive content needed (future)

---

## 📞 Support & Questions

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Images broken in production | `PUBLIC_R2_ASSET_URL` not set | Set in Cloudflare dashboard |
| Slow image loads | Local files instead of R2 | Verify env var is set |
| Build fails | R2 bucket not accessible | Check bucket is public |
| Asset not found | File doesn't exist in R2 | Upload to R2 or update config |

### Getting Help

1. Check Cloudflare R2 dashboard for bucket status
2. Verify asset URLs are correct in `assets.config.json`
3. Check deployment logs in Cloudflare
4. Review browser DevTools Network tab
5. Test with `curl` to verify R2 bucket access

---

## 🎯 Summary

Your R2 architecture is:
- ✅ **Centralized**: All assets defined in one config file
- ✅ **Flexible**: Can switch between local (dev) and R2 (prod) seamlessly
- ✅ **Scalable**: Easy to add new assets
- ✅ **Fast**: Served from Cloudflare edge network
- ✅ **Clean**: Repo doesn't bloat with media files

**Next Step:** Set `PUBLIC_R2_ASSET_URL` in Cloudflare Dashboard and push to deploy!

---

*Last Updated: 2026-08-31*  
*For questions, see docs/ISSUES_AND_DISCOVERIES.md or docs/CLOUDFLARE_AND_META_PIXEL.md*