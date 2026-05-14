# André Cavalcante — Official App

Progressive Web App for fingerstyle guitarist André Cavalcante. No build step, pure HTML/CSS/JS, designed for `app.andrelrcavalcante.com`.

## Stack

- Single-page HTML with hash-based tab navigation
- Vanilla JS (no framework, no bundler)
- Web Audio API + YIN-style autocorrelation for the integrated tuner
- Service Worker (stale-while-revalidate) for offline support
- Web App Manifest for installability on Android / iOS

## Folder structure

```
/
├── index.html
├── manifest.json
├── service-worker.js
├── netlify.toml
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── tuner.js
├── data/
│   ├── songs.json
│   └── shows.json
└── icons/
    ├── icon-192.svg
    └── icon-512.svg
```

## Local development

The service worker and `getUserMedia` need a secure origin. Localhost counts as secure, so any static server works:

```bash
# any of these
npx serve .
python3 -m http.server 8080
php -S localhost:8080
```

Then open `http://localhost:8080`.

## Deploy to Netlify

### Option 1 — Drag and drop

1. Zip the entire project folder (or just drag the folder).
2. Go to <https://app.netlify.com/drop> and drop it.
3. Netlify will give you a `*.netlify.app` URL.

### Option 2 — Git-based (recommended)

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from Git → pick the repo**.
3. **Build command:** leave empty. **Publish directory:** `.` (root).
4. Deploy.

### Custom domain

1. In Netlify, go to **Domain management → Add custom domain**.
2. Add `app.andrelrcavalcante.com`.
3. In your DNS provider, add a CNAME record pointing `app` to `<your-site>.netlify.app`.
4. Netlify will auto-provision HTTPS via Let's Encrypt.

## PWA install

- **Android (Chrome):** the app shows the native install prompt automatically after the user engages with the page.
- **iOS (Safari):** Apple does not expose `beforeinstallprompt`, so the app shows a modal explaining the Share → "Add to Home Screen" flow. The modal is dismissed via localStorage so it doesn't reappear.

## Icons

The repo ships with placeholder SVG icons. For production:

1. Export PNGs at `192×192` and `512×512` (maskable padding ~10%).
2. Replace `icons/icon-192.svg` and `icons/icon-512.svg` (or use PNGs and update `manifest.json` `type` to `image/png`).

## Tuner notes

- Uses `getUserMedia({ audio: true })` — requires HTTPS (or localhost).
- Detection works from E2 (~82 Hz) up to E4 (~330 Hz), covering all common guitar tunings.
- Algorithm: cumulative-mean-normalized difference function (YIN) with parabolic interpolation for sub-sample precision.

## Updating content

- **Songs:** edit `data/songs.json`. Each entry:
  - `title`, `meta`, `cover`, `bpm`, `capo` (integer fret, `0` = none)
  - `tuningLabel` — the human label shown in the UI, e.g. `"C G C F G D"`
  - `strings` — array of 6 note tokens, low to high (6th → 1st string), e.g. `["C2","G2","C3","F3","G3","D4"]`. The tuner derives each target frequency from these. Sharps use `#` (e.g. `"F#2"`).
  - `tuningNote` — optional free text shown under the tuner (partial capos, multi-guitar arrangements, etc.). Leave `""` to hide.
  - `spotifyUrl`, `youtubeUrl`, `masterTabUrl`, `tablatureUrl`
- **Shows:** edit `data/shows.json`. Each entry: `date` (ISO), `city`, `country`, `venue`, `ticketUrl`.

### Shipping changes — bump the version

When you change CSS or JS, bump the version in **two** places so returning visitors get fresh files:

1. `CACHE_VERSION` in `service-worker.js` (e.g. `v3` → `v4`)
2. The `?v=3` query string on the `<link>`/`<script>` tags in `index.html`

JSON data (`songs.json`, `shows.json`) is fetched fresh on every load, so editing those only needs the `CACHE_VERSION` bump.
