# PROJECT:automate Landing Page

Modern, high-performance landing page for PROJECT:automate outdoor lighting and audio design services. Built with Astro, optimized for conversion tracking and seamless Cloudflare deployment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Asset Management

Assets are downloaded from Cloudflare R2 CDN on build:

```bash
# Check asset availability
npm run assets:check

# Force re-download all assets
npm run assets:download:force

# Validate asset configuration
npm run assets:validate
```

### Code Quality

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Meta Pixel ID for conversion tracking
PUBLIC_META_PIXEL_ID=your_pixel_id

# GoHighLevel Form & Booking IDs
PUBLIC_GHL_FORM_ID=your_form_id
PUBLIC_GHL_BOOKING_ID=your_booking_id

# Cloudflare R2 Asset CDN URL
PUBLIC_R2_ASSET_URL=https://your-r2-url.com
```

## 📊 Key Features

### ✅ Conversion Tracking
- **Meta Pixel** - PageView, Lead, Contact events
- **Dynamic Configuration** - Load pixel ID from config.json at runtime
- **Noscript Support** - Fallback tracking for users without JavaScript
- **Form Integration** - Automatic event tracking on form submissions

### ✅ Asset Management
- **Cloudflare R2 CDN** - All media hosted on R2 with local fallback
- **Dynamic Asset URLs** - `assetUrl()` helper for automatic CDN switching
- **Asset Manifest** - Centralized configuration in `assets.config.json`
- **Local Development** - Assets cached locally for fast dev builds

### ✅ Form Integration
- **GoHighLevel Forms** - Embedded consultation forms
- **Calendar Booking** - Integrated scheduling with GHL calendar
- **Modal & Inline** - Multiple form layout options
- **Parameterized IDs** - Environment-based form configuration

### ✅ Performance
- **Astro SSG** - Static site generation for speed
- **WebP Images** - Optimized image formats
- **Lazy Loading** - Images and iframes load on demand
- **Cloudflare Pages** - Edge-cached deployment

### ✅ Accessibility
- **Semantic HTML** - Proper heading hierarchy and structure
- **ARIA Labels** - Screen reader support
- **Motion Preferences** - Respects `prefers-reduced-motion`
- **Keyboard Navigation** - Full keyboard support

## 📁 Project Structure

```
src/
├── pages/              # Page routes
│   ├── index.astro     # Homepage
│   └── schedule.astro  # Booking page
├── components/         # Reusable UI components
│   ├── header/         # Navigation & header
│   ├── sections/       # Page sections
│   └── forms/          # Form components
├── layouts/            # Page layouts
│   └── Layout.astro    # Main layout with pixel tracking
├── config/             # Configuration files
│   ├── assets.ts       # Asset URL helper
│   └── forms.ts        # Form ID configuration
└── styles/             # Global styles

public/
├── framer-extracted-assets/  # Local asset cache
└── config.json               # Runtime configuration

docs/                   # Project documentation
├── PIXEL_CONFIGURATION.md
├── ISSUES_AND_DISCOVERIES.md
└── ...
```

## 🎯 Pixel Tracking

### Events Tracked

| Event | Trigger | Purpose |
|-------|---------|---------|
| PageView | Page load | Measure traffic |
| Lead | Form open | Measure engagement |
| Contact | Form submit | Measure conversions |

### Monitoring

1. **Events Manager** - [Meta Ads Manager](https://business.facebook.com) → Events Manager
2. **Real-time Testing** - Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) browser extension
3. **Network Tab** - DevTools (F12) → Network → Filter for `facebook.com/tr`

### Configuration

Pixel ID is loaded dynamically from `/public/config.json`:

```json
{
  "meta": {
    "pixelId": "1748478050610981"
  },
  "ghl": {
    "formId": "ZiepwgoZzuozaOg3NIkl",
    "bookingId": "UF6HdyNtYwKpZHABOBtL"
  },
  "environment": "production"
}
```

## 🚢 Deployment

### Cloudflare Pages

Automatic deployment on push to main:

1. Push changes to `main` branch
2. GitHub Actions builds and tests
3. Cloudflare Pages deploys automatically
4. Site live at `project-automate-lp.pages.dev`

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Pixel ID configured in `public/config.json`
- [ ] Form IDs configured in environment or `src/config/forms.ts`
- [ ] Assets validated with `npm run assets:check`
- [ ] Build successful: `npm run build`

### Environment Setup

Ensure these secrets are configured in GitHub:
- `CLOUDFLARE_API_TOKEN` - For Cloudflare Pages deployment

## 📝 Documentation

Detailed documentation available in `/docs/`:

- **PIXEL_CONFIGURATION.md** - Meta pixel setup and testing
- **ISSUES_AND_DISCOVERIES.md** - Known issues and improvements
- **CONFIG_MANAGEMENT.md** - Configuration management
- **R2_ARCHITECTURE.md** - Asset hosting architecture

## 🔍 Known Issues & Improvements

See [ISSUES_AND_DISCOVERIES.md](./docs/ISSUES_AND_DISCOVERIES.md) for:
- High priority issues to address
- Medium priority improvements
- Low priority enhancements

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) 7.2.7
- **Styling**: CSS3 with CSS Variables
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **CDN**: [Cloudflare R2](https://www.cloudflare.com/products/r2/)
- **Forms**: [GoHighLevel](https://gohighlevel.com/)
- **Tracking**: [Meta Pixel](https://developers.facebook.com/docs/facebook-pixel/)
- **CI/CD**: GitHub Actions

## 📞 Support

### Common Tasks

**Add a new page:**
1. Create `.astro` file in `src/pages/`
2. Import Layout from `src/layouts/Layout.astro`
3. Deploy automatically on push to main

**Add a new image:**
1. Upload to Cloudflare R2 at `pub-b2239f74b04346b88dc3b07d2bd0bad8.r2.dev/`
2. Add entry to `assets.config.json`
3. Use `assetUrl('assetId')` in components

**Change pixel ID:**
1. Update `public/config.json` → `meta.pixelId`
2. Verify in Meta Events Manager
3. Deploy

**Change form IDs:**
1. Update `.env.local` or `PUBLIC_GHL_FORM_ID`/`PUBLIC_GHL_BOOKING_ID`
2. Or update `src/config/forms.ts`
3. Deploy

## 🚀 Performance

- **Lighthouse Score**: 95+
- **Time to Interactive**: < 2s
- **CLS**: < 0.1
- **Page Load**: < 1s (cached)

## 📄 License

© 2026 PROJECT:automate. All rights reserved.

---

**Last Updated**: August 31, 2026  
**Status**: Production Ready ✅  
**Deployment**: Cloudflare Pages  
**Environment**: Astro + TypeScript