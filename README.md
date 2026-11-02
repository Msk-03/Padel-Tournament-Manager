# 🎾 Padel Tournament Center

A free, installable web app for running padel tournaments: Americano, Mexicano, Team formats and Beat the Box. It runs entirely in the browser, with no backend, no account and no build step. Your tournaments are saved on your own device.

> **Repository description (for the GitHub "About" box):**
> Padel tournament manager PWA — Americano, Mexicano, Team and Beat the Box formats with live scoring, leaderboards and an offline-ready archive. Pure HTML/CSS/JS.

**Suggested topics:** `padel` `tournament-manager` `americano` `mexicano` `pwa` `vanilla-js` `sports` `offline-first` `github-pages`

## Features

- **Six formats**
  - Super Mexicano (individual, round 3 ×1.1, round 4+ ×1.2 multipliers on top courts)
  - Standard Mexicano (individual, seeded by rank)
  - Standard Americano (individual, social mix)
  - Team Mexicano (fixed duos, seeded by rank)
  - Team Americano (fixed duos, social mix)
  - Beat the Box (king of the court, Box 1 to 8 ladder)
- **1–8 courts**, match targets of 8 / 16 / 20 / 24 / 32 points
- **Live scoring** with automatic re-ranking after each round and byes handled for you
- **Leaderboard** with points won/lost, difference, played, W/T/L and byes
- **Match history** and, for Americano formats, a full upcoming-rounds schedule
- **Archive:** every tournament auto-saves; resume, review or delete it later
- **Champion celebration** with confetti when a tournament is finished
- **Responsive UI:** sidebar on desktop, icon rail on tablet, hamburger drawer on phones
- **PWA:** installable, works offline after the first visit

## Quick start

No installation is needed. Because it is a PWA, serve the folder over `http://localhost` or `https` (opening `index.html` directly from disk works for the app itself, but not for install/offline):

```bash
# any static server works, for example:
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy to GitHub Pages

1. Push this folder to a new GitHub repository.
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) publishes the site on every push to `main`.
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

Prefer no Actions? Choose **Deploy from a branch → main → / (root)** instead. The `.nojekyll` file is already included.

## Project structure

```
index.html              App shell (sidebar, screens, forms)
style.css               Layout, theme and responsive rules
app.js                  Tournament engine: scheduling, scoring, ranking, archive
ui.js                   Shell: navigation, mobile drawer, summary tiles, PWA install
sw.js                   Service worker (offline support)
manifest.json           PWA manifest
padel_app_icon.png      192×192 app icon
padel_app_icon_512.png  512×512 app icon
```

## How it works

- **Storage:** tournaments are kept in the browser's `localStorage` under the key `padel_saved_tournaments_v5`. Clearing site data deletes them, and they are not synced between devices.
- **Engine and UI are separate:** `app.js` holds all tournament logic and does not know about the layout. `ui.js` only watches which screen is visible and updates the sidebar, titles and summary tiles.
- **Offline:** `sw.js` caches the app files and serves them when the network is unavailable.

## Customising

- **Icons:** replace `padel_app_icon.png` (192×192) and `padel_app_icon_512.png` (512×512) with your own artwork.
- **Colours:** edit the CSS variables at the top of `style.css`.
- **Cache updates:** after changing files, bump `CACHE` in `sw.js` (e.g. `padel-center-v3`) so installed copies refresh.
- **Analytics:** `index.html` includes a Google Analytics tag. Remove the `gtag` block in `<head>` or replace the ID with your own.

## Browser support

Any current version of Chrome, Edge, Safari or Firefox. Installing as an app is available in Chromium browsers and on iOS via **Share → Add to Home Screen**.

## Contributing

Issues and pull requests are welcome. Keep changes dependency-free, and when you touch the engine, test each format with a full tournament from start to finish.

## License

Released under the [MIT License](LICENSE).
