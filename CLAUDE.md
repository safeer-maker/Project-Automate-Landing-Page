# PROJECT:automate landing pages

Astro static site for the Meta-ads landing pages. Two design variants live on separate branches and deploy to separate Cloudflare Workers, so the branch you work on decides where the change ships.

## Branches and deploys

| Variant | Work branch | PR into | Deploys to | Worker (`wrangler.jsonc` name) | GHL form ID |
|---|---|---|---|---|---|
| A, LP-2 (Framer design) | `lp-design-2-framer` | `main` | lp1.projectautomate.com | `project-automate-landing-page` | `ZiepwgoZzuozaOg3NIkl` |
| B, LP-design-3 (inline form) | `lp-design-3-inline-form` | `lp-webform-main` | landscape.projectautomate.com | `lp2-meta-ab-testing` | `oYUiMg4kenLeJuNDxiw0` |

- Production deploys come from Cloudflare's Git integration on merge into `main` / `lp-webform-main`. Don't add a `wrangler deploy` step to scripts or CI.
- Never PR `lp-design-3-inline-form` into `main`, and never merge one variant's branch into the other's. Check the base branch before opening any PR (`gh pr create --base lp-webform-main` for variant B).
- Never copy the GHL form ID, `wrangler.jsonc` name, or `.env.example` values between variants.
- `.github/workflows/deploy.yml` builds a GitHub Pages staging copy on pushes to `main`, on any branch whose commit message contains `@deploy`, and from the Actions tab. It isn't production.
- `lp-design-1` is the retired first design. Leave it alone.

## Commits and PRs

Plain one-line commit messages. No Claude/AI metadata anywhere: no `Co-Authored-By` trailer, no "Generated with Claude Code", no mention of AI in commits, PR titles, descriptions or comments.

## Development

- `npm run dev` starts Astro on http://localhost:4321. The user runs the dev server from VS Code, so stop any server you started before finishing a task.
- `npm run build` downloads the R2 assets listed in `assets.config.json`, then builds to `dist/`.
- `npm run format` (Prettier) before committing.
- `npm run images:optimize` writes the responsive `-<width>.webp` siblings listed in `src/config/responsive-images.json` next to the originals in `public/`. Commit them with `.responsive-images-state.json`; the originals stay untouched so they match R2.

## Things that are deliberate

- **Mobile first.** Most visitors arrive from Meta ads on phones, often in the Instagram/Facebook in-app browser (iOS WebKit). Check every change at 320, 375/393 and 430px wide and in iPhone landscape, not just desktop.
- **Hero video** comes from `media.projectautomate.com` (`MEDIA_BASE_URL` in `src/config/assets.ts`), the R2 bucket's custom domain, because Worker static assets ignore Range requests and iOS needs them to play video. Keep `muted`, `playsinline` and `autoplay`. The H.264 MP4 stays first: WebKit can report VP9 WebM support and then stall on the first frame, so iPhones need the MP4 ahead of the WebM. Every MP4 must be silent and faststart (`ffmpeg -an -movflags +faststart`), or Chrome/Android waits for nearly the whole file before showing a frame. Portrait phones get `hero/estate-at-sunset-portrait.*` (an 810x1080 crop at x=644, matching `object-position: 58%`) and everything else `hero/estate-at-sunset-1080.*`, chosen with `media=` on each `<source>`; all MP4s stay ahead of all WebMs, and the original MP4 is the last-resort fallback. Upload new video files to R2 under new keys rather than overwriting.
- **The GHL form is a cross-origin iframe** (`src/components/GhlInlineForm.astro`), sized by GHL's `form_embed.js`. Variant B loads the form ("ProjectAutomateLP-Form - adsToLandingPage") and `form_embed.js` from GHL's white-label domain `links.projectautomate.com`, not `api.leadconnectorhq.com` / `link.msgsndr.com`. Only its container can be styled. Lead conversions are fired by the Meta Pixel inside the GHL form, not by this site. There is no booking page here: scheduling lives on the main website.
- **GHL external tracking** is the `external-tracking.js` script in the `<head>` of `src/layouts/Layout.astro`, loaded from `links.projectautomate.com` with `data-tracking-id="tk_b81ba4b6c2404a5c85eef5b4a25e33fb"`. Both variants use this same script; the old `link.msgsndr.com` script (`tk_9d37ae1b…`) is retired.
- **Footer** (`src/components/SiteFooter.astro`, `src/config/site.ts`) mirrors the main website's footer (Project-Automate-Website repo, `src/components/layout/Footer.astro` and `src/data/site.ts`). Keep the two in step, and keep footer links absolute to `https://projectautomate.com`.
