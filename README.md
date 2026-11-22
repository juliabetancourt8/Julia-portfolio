# Júlia Betancourt · Portfolio v2 (minimal)

A white editorial grid: thin column lines, Archivo for text and Gochi Hand for the hand-written "About me", a large name, small text blocks, numbered services and a work table. No JavaScript, no background media. The previous version stays untouched in `../portfolio/`.

## Build

```
npm run build      # or: node src/build.js
```

Writes the site to `dist/`. Open `dist/index.html` directly or upload `dist/` to any static host. The build lists every placeholder still open.

## Where things are

| To change | Edit |
|---|---|
| Name, headline, statement, about, services, path, contact | `content/site.js` |
| A project | `content/projects/<project>.js` (copy `_template.js` to add one) |
| The About me photo | `public/images/about/julia.jpg` (square), set in `content/site.js` → `about.photo` |
| Pictures under each timeline stop | `images` in each stop of `content/site.js` → `path` (cut-out PNG/WebP in `public/images/path/`; several pictures get arrows) |
| The hand-drawn timeline line | `LINE` near the top of `src/build.js` (one drawing for desktop, one for phones) |
| Images | `public/images/<project-slug>/`, then set `src` in the project file |
| Look and layout | `src/styles.css` (colours and grid at the top) |
| Page structure | `src/build.js` |

Text in `[[double brackets]]` is a placeholder; it shows grey and dashed while `draft: true`. Approval reminders from each project show as a yellow "Draft note" only in draft mode. Before publishing set `draft: false` and clear the placeholders.
