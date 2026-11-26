# Wayling

A puzzle game about guiding a stream of small walkers to the exit. Give them skills, dig, build, and get enough of them home.

- 16 original levels in four ratings: Fun, Tricky, Taxing, Mayhem
- Hebrew (RTL) by default, English available in Settings
- Installable web app (PWA), works offline
- All art, levels and sound are original and generated in code

## Play

Tap a skill, then tap a walker. Drag the field to pan, or tap the minimap.
Hold the burst button for two seconds to end the level early.

Keyboard: `1`–`8` pick a skill, `Space` or `Esc` pause, `F` fast forward, `+`/`-` release rate, arrows or `A`/`D` pan, hold `N` to end the level.

## Develop

```
npm install
npm run dev
npm test
npm run build
```

The simulation in `src/engine` is deterministic and has no browser dependencies. `tests/levels.test.js` plays a scripted solution for every level, so a level change that breaks solvability fails CI.

The app is served from `/wayling/` (see `base` in `vite.config.js`). Pushing to `main` builds and deploys to GitHub Pages.

## Install

Open the site in Chrome, then ⋮ → Install app.

## License

MIT
