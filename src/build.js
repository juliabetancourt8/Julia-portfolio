// Builds the static site into /dist. No dependencies.
//   node src/build.js
// Every link is relative and points at a real file (…/index.html), so the
// output works on any static host, opened from the file system, or as an Artifact.

import { readdir, rm, mkdir, writeFile, readFile, cp } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const stamp = `?v=${Date.now()}`;

const load = async (file) => (await import(pathToFileURL(file).href + stamp)).default;

// ---------- text helpers ----------

let draft = true;
const open = new Set();

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Escapes text and marks [[placeholders]].
function t(s) {
  return esc(s).replace(/\[\[(.+?)\]\]/g, (_, inner) => {
    open.add(inner);
    return draft ? `<span class="ph">${inner}</span>` : inner;
  });
}
// Plain text for attributes (placeholders dropped).
const plain = (s) => esc(String(s ?? '').replace(/\s*\[\[.+?\]\]/g, '').trim());

const pad = (n) => String(n).padStart(2, '0');

// ---------- components ----------

function nav(rel, current, page = '') {
  const link = (href, label, key) => `<a href="${href}"${page === key ? ' class="is-current" aria-current="page"' : ''}>${label}</a>`;
  return `<header class="nav">
  <nav class="nav__side" aria-label="Main">${link(`${rel}about/index.html`, 'About', 'about')}${link(`${rel}experience/index.html`, 'Experience', 'experience')}</nav>
  <a class="nav__mark" href="${rel}index.html" aria-label="Home">${esc(current.initials)}</a>
  <nav class="nav__side nav__side--end" aria-label="More">${link(`${rel}projects/index.html`, 'Projects', 'projects')}${link(`${rel}contact/index.html`, 'Contact', 'contact')}</nav>
</header>`;
}

function figure(img, rel, { caption, cls = '' } = {}) {
  const ratio = img.ratio || '4/3';
  const media = img.src
    ? `<img src="${rel}${esc(img.src)}" alt="${plain(img.alt)}" loading="lazy">`
    : `<div class="figure__ph">${draft ? `<span>${esc(img.note || 'Image')}</span>` : ''}</div>`;
  const sample = img.sample ? `<span class="figure__sample">Sample image</span>` : '';
  return `<figure class="figure ${cls}${img.cutout ? ' figure--cutout' : ''}"><div class="figure__frame" style="aspect-ratio:${ratio}">${media}${sample}</div>${
    caption ? `<figcaption>${t(caption)}</figcaption>` : ''
  }</figure>`;
}

const tags = (site, p) => p.categories.map((tag) => site.categories.find((c) => c.tag === tag).label).join(', ');

function footer(site, rel) {
  return `<footer class="foot">
  <div class="foot__meta"><span>© ${new Date().getFullYear()}</span></div>
</footer>`;
}

function layout({ site, rel, title, description, body, page }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${plain(description)}">
<link rel="preload" href="${rel}fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${rel}assets/site.css">
</head>
<body${draft ? ' class="is-draft"' : ''}>
<div class="page">
${nav(rel, site, page)}
<main>
${body}
</main>
${footer(site, rel)}
</div>
${body.includes('data-slider') ? `<script>${SLIDER_JS}</script>` : ''}
${body.includes('data-tl') ? `<script>${LINE_JS}</script>` : ''}
${body.includes('data-show') ? `<script>${SHOW_JS}</script>` : ''}
${body.includes('data-preview') ? `<script>${PREVIEW_JS}</script>` : ''}
${body.includes('data-filters') ? `<script>${FILTER_JS}</script>` : ''}
<script>${VIEW_JS}</script>
<script>${TOP_JS}</script>
</body>
</html>
`;
}

// The "how I got here" line, drawn by hand as one winding stroke.
// Two drawings: a wide one for desktop (stops zigzag left and right) and a
// narrow one for phones (the line runs down the left). Both are built from the
// number of stops, so adding a stop to content/site.js redraws the line.
// x/y are drawing units; the page turns them into percentages.

function wideLine(path) {
  const count = path.length;
  const STEP = 300;
  const L = 330;
  const R = 700;
  const top = 330;
  const stops = Array.from({ length: count }, (_, i) => ({ at: [i % 2 ? R : L, top + i * STEP], side: i % 2 ? 'right' : 'left' }));
  // Opening flourish: a dot, a drop and a small loop, arriving at the first stop.
  let d = `M600,30 C585,100 560,150 548,190 C536,240 600,260 610,215 C620,170 560,155 540,200 C520,245 470,300 ${L},${top}`;
  // Between stops the line stays in the middle of the drawing, clear of the text
  // and pictures that hang under each stop.
  stops.slice(1).forEach(({ at: [x, y] }, i) => {
    const y0 = y - STEP;
    if (x === R) {
      d += ` C${L + 60},${y0 + 70} ${L + 40},${y0 + 170} ${L + 150},${y0 + 210} C${L + 260},${y0 + 250} ${R - 120},${y} ${R},${y}`;
    } else if (i % 4 === 1) {
      // With a small loop in the middle.
      d += ` C${R - 10},${y0 + 110} ${R - 60},${y0 + 200} ${R - 170},${y0 + 215} C${R - 260},${y0 + 228} ${R - 250},${y0 + 150} ${R - 200},${y0 + 165} C${R - 150},${y0 + 180} ${L + 120},${y - 10} ${L},${y}`;
    } else {
      d += ` C${R - 10},${y0 + 110} ${R - 100},${y0 + 190} ${R - 180},${y0 + 220} C${R - 260},${y0 + 250} ${L + 80},${y - 5} ${L},${y}`;
    }
  });
  const [lx, ly] = stops[count - 1].at;
  const end = lx === R ? [R - 240, ly + 170] : [L + 260, ly + 170];
  d += lx === R
    ? ` C${R - 10},${ly + 90} ${R - 110},${ly + 165} ${end[0]},${end[1]}`
    : ` C${L + 40},${ly + 90} ${L + 140},${ly + 165} ${end[0]},${end[1]}`;
  // Leave room for the text and picture hanging under the last stop.
  const bottom = Math.max(end[1] + 40, ly + 160 + mediaHeight(path[count - 1], 290) + listHeight(path[count - 1]));
  return { box: [1000, bottom], d, start: [600, 30], end, stops };
}

function narrowLine(path) {
  const X = 60;
  const top = 250;
  // A stop with a picture needs more room below it on phones.
  let y = top;
  const stops = path.map((s) => {
    const at = [X, y];
    y += 230 + (mediaHeight(s, 240) + listHeight(s)) / 0.875 + (s.tag ? 60 : 0) + (!s.projects && s.learned.length > 120 ? 30 : 0);
    return { at };
  });
  const count = stops.length;
  let d = `M60,15 C55,60 40,90 50,120 C60,150 100,142 95,120 C90,98 50,105 45,135 C40,180 70,210 ${X},${top}`;
  stops.slice(1).forEach(({ at: [, y] }, i) => {
    const y0 = stops[i].at[1];
    const k = (y - y0) / 300;
    d += i % 2
      ? ` C${X + 15},${y0 + 70 * k} ${X + 10},${y0 + 140 * k} ${X - 5},${y0 + 170 * k} C${X - 25},${y0 + 200 * k} ${X - 35},${y0 + 150 * k} ${X - 10},${y0 + 155 * k} C${X + 15},${y0 + 160 * k} ${X - 15},${y0 + 250 * k} ${X},${y}`
      : ` C${X - 10},${y0 + 80 * k} ${X - 40},${y0 + 140 * k} ${X - 10},${y0 + 200 * k} C${X + 10},${y0 + 240 * k} ${X - 20},${y0 + 270 * k} ${X},${y}`;
  });
  const ly = stops[count - 1].at[1];
  // The line ends below the last stop's text and picture.
  const end = [X + 10, ly + 170 + (mediaHeight(path[count - 1], 240) + listHeight(path[count - 1])) / 0.875];
  const span = end[1] - ly;
  d += ` C${X + 10},${ly + span * 0.4} ${X - 20},${ly + span * 0.75} ${end[0]},${end[1]}`;
  const bottom = end[1] + 40;
  return { box: [400, bottom], d, start: [60, 15], end, stops };
}

// Pictures under a stop. One picture floats on its own; several get arrows.
const SLIDER_HEIGHT = 180;
// Room taken by a stop's list of projects.
const listHeight = (s) => (s.projects ? 30 + s.projects.length * 24 : s.link ? 30 : 0);

function mediaHeight(s, width) {
  if (!s.images) return 0;
  if (s.images.length > 1) return SLIDER_HEIGHT + 60;
  const [img] = s.images;
  const w = img.kind === 'logo' ? width * 0.7 : width;
  return Math.min((w * img.height) / img.width, SLIDER_HEIGHT) + 40;
}

function stopMedia(s, rel) {
  if (!s.images) return '';
  const many = s.images.length > 1;
  const slides = s.images
    .map(
      (img, i) => `<figure class="tl__slide${i === 0 ? ' is-active' : ''}${img.kind === 'logo' ? ' tl__slide--logo' : ''}"${i ? ' aria-hidden="true"' : ''}>
              <img src="${rel}${esc(img.src)}" alt="${plain(img.alt)}" width="${img.width}" height="${img.height}" loading="lazy">
              ${img.caption ? `<figcaption class="small">${t(img.caption)}</figcaption>` : ''}
            </figure>`,
    )
    .join('\n            ');
  if (!many) return `<div class="tl__media">${slides}</div>`;
  return `<div class="tl__media tl__slider" data-slider>
            <div class="tl__slides">${slides}</div>
            <div class="tl__nav small">
              <button type="button" data-prev aria-label="Previous picture">←</button>
              <span data-count>1 / ${s.images.length}</span>
              <button type="button" data-next aria-label="Next picture">→</button>
            </div>
          </div>`;
}

const pct = ([x, y], [w, h]) => `${((x / w) * 100).toFixed(2)}%,${((y / h) * 100).toFixed(2)}%`;

function timeline(path, endNote, projects, rel, label = '') {
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const wide = wideLine(path);
  const narrow = narrowLine(path);
  const pos = (name, at, box) => {
    const [x, y] = pct(at, box).split(',');
    return `--${name}x:${x};--${name}y:${y};`;
  };
  const svg = (v, cls) =>
    `<svg class="tl__line ${cls}" viewBox="0 0 ${v.box.join(' ')}" aria-hidden="true" focusable="false"><path d="${v.d}"/></svg>`;
  const dot = (cls, a, b) => `<span class="tl__dot ${cls}" style="${pos('w', a, wide.box)}${pos('n', b, narrow.box)}" aria-hidden="true"></span>`;
  // A hand-written aside with a small drawn arrow pointing at the stop.
  const note = (text) =>
    `<p class="tl__note">${t(text)}<svg class="tl__arrow" viewBox="0 0 60 40" aria-hidden="true" focusable="false"><path d="M4,4 C20,6 40,14 50,32 M50,32 L41,28 M50,32 L51,22"/></svg></p>`;
  return `<div class="tl" id="path" data-tl style="--w-ratio:${wide.box.join(' / ')};--n-ratio:${narrow.box.join(' / ')}">
    ${label ? `<p class="small tl__label">${label}</p>` : ''}
    <div class="tl__canvas">
      ${svg(wide, 'tl__line--wide')}
      ${svg(narrow, 'tl__line--narrow')}
      ${dot('tl__dot--start', wide.start, narrow.start)}
      ${dot('tl__dot--end', wide.end, narrow.end)}
      ${endNote ? `<p class="tl__endnote" style="${pos('w', wide.end, wide.box)}${pos('n', narrow.end, narrow.box)}">${t(endNote)}</p>` : ''}
      <ol class="tl__stops">
        ${path
          .map((s, i) => {
            const w = wide.stops[i];
            const n = narrow.stops[i];
            const place = t(s.place);
            const work = (s.projects || []).map((slug) => bySlug[slug]);
            const media = stopMedia(s, rel);
            return `<li class="tl__stop tl__stop--${w.side}${s.images ? ' tl__stop--media' : ''}${/now$/.test(s.when) ? ' tl__stop--now' : ''}" style="${pos('w', w.at, wide.box)}${pos('n', n.at, narrow.box)}">
          <span class="tl__num small">${pad(i + 1)}</span>
          ${s.note ? note(s.note) : ''}
          <div class="tl__text">
            <p class="small tl__when">${t(s.when)}</p>
            <h3 class="tl__place">${place}</h3>
            <p class="small tl__meta">${t(s.role)}</p>
            ${work.length ? '' : `<p class="small tl__learned">${t(s.learned)}</p>`}
            ${s.tag ? `<span class="tl__tag">${t(s.tag)}</span>` : ''}
            ${work.length ? `<ul class="tl__projects">${work.map((p) => `<li><a href="${rel}work/${p.slug}/index.html">${esc(p.title)} <span aria-hidden="true">→</span></a></li>`).join('')}</ul>` : ''}
            ${media}
            ${s.link ? `<a class="small tl__more" href="${rel}${esc(s.link)}">View project <span aria-hidden="true">→</span></a>` : ''}
          </div>
        </li>`;
          })
          .join('\n        ')}
      </ol>
    </div>
  </div>`;
}

// "View" cursor: over a project link the pointer becomes a small vermilion
// circle with "View" written by hand. Mouse and trackpad only.
const VIEW_JS = `(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var targets = 'a.table__row, .tl__more, .tl__projects a, a.next, a.pcard';
  var dot = document.createElement('div');
  dot.className = 'view-cursor';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x = 0, y = 0, cx = 0, cy = 0, raf = 0;
  function loop() {
    cx += (x - cx) * (calm ? 1 : 0.25); cy += (y - cy) * (calm ? 1 : 0.25);
    dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
  }
  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    var on = !!(e.target.closest && e.target.closest(targets));
    if (on && !dot.classList.contains('is-on')) { cx = x; cy = y; }
    dot.classList.toggle('is-on', on);
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('mouseleave', function () { dot.classList.remove('is-on'); });
})();`;

// Arrows for stops with several pictures. Tiny, no library.
const SLIDER_JS = `document.querySelectorAll('[data-slider]').forEach(function (el) {
  var slides = el.querySelectorAll('.tl__slide'), count = el.querySelector('[data-count]'), i = 0;
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    count.textContent = (i + 1) + ' / ' + slides.length;
  }
  el.querySelector('[data-prev]').addEventListener('click', function () { show(i - 1); });
  el.querySelector('[data-next]').addEventListener('click', function () { show(i + 1); });
});`;

// Draws the timeline as the visitor scrolls: the line grows down the page and
// each dot fills in when the line reaches it. Without JavaScript, or with
// reduced motion, the whole line is simply shown.
const LINE_JS = `(function () {
  var tl = document.querySelector('[data-tl]');
  if (!tl) return;
  var marks = tl.querySelectorAll('.tl__stop, .tl__dot--end');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    marks.forEach(function (m) { m.classList.add('is-reached'); });
    return;
  }
  var canvas = tl.querySelector('.tl__canvas'), st = null, ticking = false;
  function setup() {
    tl.querySelectorAll('.tl__line path').forEach(function (p) { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
    var svg = Array.prototype.find.call(tl.querySelectorAll('.tl__line'), function (s) { return getComputedStyle(s).display !== 'none'; });
    if (!svg) return;
    var path = svg.querySelector('path'), total = path.getTotalLength(), vb = svg.viewBox.baseVal;
    // How far down the drawing the line has got after each step along it.
    var samples = [], low = 0;
    for (var i = 0; i <= 600; i++) {
      var l = (total * i) / 600;
      low = Math.max(low, path.getPointAtLength(l).y);
      samples.push([l, low]);
    }
    function lengthAt(y) {
      for (var k = 0; k < samples.length; k++) if (samples[k][1] >= y) return samples[k][0];
      return total;
    }
    var h = canvas.offsetHeight;
    var stops = Array.prototype.map.call(marks, function (m) { return [m, lengthAt((m.offsetTop / h) * vb.height - 2)]; });
    path.style.strokeDasharray = total + ' ' + total;
    st = { path: path, total: total, vb: vb, stops: stops, lengthAt: lengthAt };
    draw();
  }
  function draw() {
    ticking = false;
    if (!st) return;
    var r = canvas.getBoundingClientRect();
    var y = ((window.innerHeight * 0.7 - r.top) / r.height) * st.vb.height;
    var len = y <= 0 ? 0 : st.lengthAt(y);
    st.path.style.strokeDashoffset = st.total - len;
    st.stops.forEach(function (s) { s[0].classList.toggle('is-reached', len >= s[1]); });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(draw); } }, { passive: true });
  window.addEventListener('resize', setup);
  setup();
})();`;

// ---------- pages ----------

function home(site, projects) {
  const rel = '';
  const [l1, l2] = site.hero.lines;
  const { contact } = site;
  const contactLinks = contactButtons(contact, '');

  return `
<section class="hero" aria-label="Intro">
  <div class="row hero__row">
    <p class="small hero__note">${t(site.role)}</p>
    <h1 class="hero__line hero__line--1">${esc(l1)}</h1>
    <p class="small hero__note hero__note--end"><svg class="pin" viewBox="0 0 24 30" aria-hidden="true" focusable="false"><path d="M12.4 27.6c-1.2-2.3-7.9-9.1-8.5-14.6C3.3 7.4 7.2 3 12.1 2.6c5.1-.4 8.6 3.6 8.3 8.7-.4 5.8-6.6 12.4-8 16.3z"/><path d="M12.6 7.9c-2.1-.3-3.6 1.5-3.4 3.3.2 1.9 2 3 3.7 2.6 1.6-.4 2.5-2 2.2-3.5-.3-1.4-1.3-2.3-2.5-2.4z"/></svg>${t(site.location)}</p>
  </div>
  <div class="row hero__row">
    <p class="hero__line hero__line--2" aria-hidden="true">${esc(l2)}</p>
  </div>
  <div class="row hero__foot" aria-hidden="true"></div>
</section>

<section class="section about" id="about">
  <div class="row about__top">
    <div class="about__head">
      ${site.about.photo ? `<img class="about__photo" src="${esc(site.about.photo.src)}" alt="${plain(site.about.photo.alt)}" width="800" height="800">` : ''}
      <h2 class="about__title">About me</h2>
    </div>
    <div class="about__intro">
      <p class="about__hello">${t(site.about.hello)}</p>
      <p class="about__tagline">${t(site.about.tagline)}</p>
      <div class="about__more">
        ${site.about.paragraphs.slice(0, -1).map((p) => `<p>${t(p)}</p>`).join('\n        ')}
      </div>
      <p class="about__aside">${t(site.about.paragraphs.at(-1))}<svg class="about__arrow" viewBox="0 0 40 60" aria-hidden="true" focusable="false"><path d="M8,4 C24,14 30,32 22,54 M22,54 L15,46 M22,54 L30,48"/></svg></p>
    </div>
  </div>
  ${timeline(site.path, site.pathEnd, projects, '', 'How I got here')}
</section>

<section class="section" id="services">
  <div class="row services__head">
    <h2 class="display">Product <span class="mute">and</span> packaging, <span class="mute">paper and</span> print</h2>
  </div>
  <ol class="row services">
    ${site.services
      .map(
        (s, i) => `<li class="service">
      <span class="service__num">${pad(i + 1)}</span>
      <h3 class="service__title">${t(s.title)}</h3>
      <p class="small service__text">${t(s.text)}</p>
    </li>`,
      )
      .join('\n    ')}
  </ol>
</section>

<section class="section" id="work">
  <div class="row section__head">
    <p class="small section__label">Selected work</p>
    <h2 class="display">Things to see, <span class="mute">hold and choose</span></h2>
  </div>
  ${workList(site, projects, '')}
</section>

<section class="section contact" id="contact">
  <div class="row">
    <h2 class="display contact__title">${t(contact.title).replace(/\.$/, '<span class="accent">.</span>')}</h2>
    <div class="contact__side">
      <ul class="contact__links">${contactLinks.map((l) => `<li>${l}</li>`).join('')}</ul>
    </div>
  </div>
</section>`;
}

function story(item, rel) {
  if (item.scatter) return `<div class="row scatter">
    ${item.scatter.map((pc, i) => `<img class="scatter__piece" src="${rel}${esc(pc.src)}" alt="${plain(pc.alt)}" loading="lazy" style="--x:${pc.x}%;--y:${pc.y}%;--w:${pc.w}%;--r:${pc.r}deg;--d:${i * -2.3}s">`).join('\n    ')}
    ${item.caption ? `<p class="small mute scatter__caption">${t(item.caption)}</p>` : ''}
  </div>`;
  if (item.text) return `<div class="row story__text"><p>${t(item.text)}</p></div>`;
  if (item.pair) return `<div class="row story__pair">${item.pair.map((img) => figure(img, rel, { caption: img.caption })).join('')}</div>`;
  return `<div class="row story__img story__img--${item.size || 'wide'}">${figure(item.image, rel, { caption: item.caption })}</div>`;
}

// A product line-up: every variant in a row over a big pale word, specs underneath.
// Arrows scroll the row when it does not fit (phones).
function showcase(sc, rel) {
  return `<section class="row show" aria-label="Colourways" data-show>
    <p class="show__word" aria-hidden="true">${esc(sc.word)}</p>
    <div class="show__stage">
    <button class="show__arrow show__arrow--prev" type="button" aria-label="Previous">←</button>
    <ul class="show__items">
      ${sc.items.map((it) => `<li class="show__item"><img src="${rel}${esc(it.src)}" alt="${plain(`${it.name} ${sc.sub.toLowerCase()}`)}" loading="lazy"><p class="show__name">${esc(it.name)}</p></li>`).join('\n      ')}
    </ul>
    <button class="show__arrow show__arrow--next" type="button" aria-label="Next">→</button>
    </div>
    <dl class="show__specs">
      ${sc.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${t(v)}</dd></div>`).join('')}
    </dl>
  </section>`;
}

// The same cup cycling through every colourway, next to the project title. CSS only.
function cycle(sc, rel) {
  return `<div class="cycle" style="--n:${sc.items.length}" role="img" aria-label="${plain(`The cup in ${sc.items.length} colourways`)}">
      ${sc.items.map((it, i) => `<figure class="cycle__item" style="--i:${i}" aria-hidden="true"><img src="${rel}${esc(it.src)}" alt=""></figure>`).join('')}
    </div>`;
}

// A new page always opens at the top, unless the link points at a section (#...).
const TOP_JS = `(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) { scrollTo(0, 0); addEventListener('load', function () { scrollTo(0, 0); }); }
})();`;

// Project list: hovering a row floats that project's picture next to the pointer.
const PREVIEW_JS = `(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var img = document.querySelector('.work-preview');
  var list = document.querySelector('.work-list');
  if (!img || !list) return;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x = 0, y = 0, cx = 0, cy = 0, raf = 0;
  function loop() {
    cx += (x - cx) * (calm ? 1 : 0.14); cy += (y - cy) * (calm ? 1 : 0.14);
    img.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(60px,-50%)';
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
  }
  list.addEventListener('pointermove', function (e) {
    x = e.clientX; y = e.clientY;
    var row = e.target.closest('a.table__row');
    var src = row && row.getAttribute('data-preview');
    if (src) {
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
      if (!img.classList.contains('is-on')) { cx = x; cy = y; }
    }
    img.classList.toggle('is-on', !!src);
    if (!raf) raf = requestAnimationFrame(loop);
  });
  list.addEventListener('pointerleave', function () { img.classList.remove('is-on'); });
})();`;

const SHOW_JS = `(function () {
  document.querySelectorAll('[data-show]').forEach(function (el) {
    var list = el.querySelector('.show__items');
    function step(dir) { list.scrollBy({ left: dir * list.clientWidth * 0.8, behavior: 'smooth' }); }
    el.querySelector('.show__arrow--prev').addEventListener('click', function () { step(-1); });
    el.querySelector('.show__arrow--next').addEventListener('click', function () { step(1); });
    function sync() { el.classList.toggle('is-scrollable', list.scrollWidth > list.clientWidth + 4); }
    addEventListener('resize', sync); sync();
  });
})();`;

function project(site, p, index, next) {
  const rel = '../../';
  const facts = [
    ['Context', p.context],
    ['Type', p.kind],
    ['Year', p.year],
    ['Area', tags(site, p)],
    ...p.facts,
  ];
  return `
<article class="project">
  <div class="row project__head">
    <p class="small mute project__num">${pad(index + 1)}</p>
    <h1 class="display project__title">${esc(p.title)}</h1>
    ${p.showcase ? `<div class="project__side">${cycle(p.showcase, rel)}<p class="small project__what">${t(p.what)}</p></div>` : `<p class="small project__what">${t(p.what)}</p>`}
  </div>
  <div class="row project__intro">
    <p class="project__line">${t(p.line)}</p>
    <dl class="facts small">
      ${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${t(v)}</dd></div>`).join('')}
    </dl>
  </div>
  ${p.notice ? `<p class="row small notice">${t(p.notice)}</p>` : ''}
  ${draft && p.approval ? `<p class="row small draft-note">Draft note · ${esc(p.approval)}</p>` : ''}
  ${p.showcase ? showcase(p.showcase, rel) : `<div class="row story__img story__img--full">${figure(p.cover, rel)}</div>`}
  ${p.story.map((item) => story(item, rel)).join('\n  ')}
  <a class="row next" href="${rel}work/${next.slug}/index.html">
    <span class="small mute">Next project</span>
    <span class="display next__title">${esc(next.title)}</span>
  </a>
</article>`;
}

// The CV page: white cards on a soft background, section titles in the accent colour.
function cvPage(site) {
  const { cv, contact } = site;
  const job = (e) => `<li class="card cv__job">
        <div class="cv__top"><h3 class="cv__place">${t(e.place)}</h3><span class="cv__when">${t(e.when)}</span></div>
        <p class="cv__role">${t(e.role)}</p>
        ${e.points ? `<ul class="cv__lines">${e.points.map((x) => `<li>${t(x)}</li>`).join('')}</ul>` : ''}
      </li>`;
  const section = (title, inner, cls = '') => `<section class="cv__section">
    <h2 class="cv__heading">${title}</h2>
    ${inner}
  </section>`;
  return `
<article class="cv">
  <div class="cv__head">
    <h1 class="cv__title">About me</h1>
  </div>
  ${section('Experience', `<ol class="cv__grid cv__grid--2">${cv.experience.map(job).join('')}</ol>`)}
  ${section('Education', `<ol class="cv__grid cv__grid--3">${cv.education.map(job).join('')}</ol>`)}
  ${section('Tools', `<ul class="cv__grid cv__grid--4">${cv.skills
    .map((g) => `<li class="card cv__tool"><h3 class="cv__tool-title">${t(g.title)}</h3><p class="cv__tool-text">${t(g.text)}</p></li>`)
    .join('')}</ul>`)}
  <div class="cv__grid cv__grid--2 cv__pair">
    ${section('Languages', `<ul class="card cv__lines cv__lines--pairs">${cv.languages.map(([k, v]) => `<li><span>${t(k)}</span><span class="cv__muted">${t(v)}</span></li>`).join('')}</ul>`)}
    ${section('Contact', `<ul class="card cv__lines cv__lines--pairs">
      ${contact.email ? `<li><span>Email</span><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>` : ''}
      ${contact.linkedin ? `<li><span>LinkedIn</span><a href="${esc(contact.linkedin)}">julia-betancourt8</a></li>` : ''}
    </ul>`)}
  </div>
</article>`;
}

// The experience page: the hand-drawn line, each stop leading to its projects.
// The project list: big titles, a picture follows the pointer on hover.
function workList(site, projects, rel) {
  return `  <div class="table work-list" role="list">
    ${projects
      .map((p, i) => {
        const img = p.preview || (p.cover && p.cover.src && !p.cover.sample ? p.cover.src : '');
        return `<a class="table__row" role="listitem" href="${rel}work/${p.slug}/index.html"${img ? ` data-preview="${rel}${esc(img)}"` : ''}>
      <span class="small mute">${pad(i + 1)}</span>
      <span class="table__title">${esc(p.title)}</span>
      <span class="small mute">${esc(tags(site, p))}</span>
    </a>`;
      })
      .join('\n    ')}
  </div>
  <img class="work-preview" alt="" aria-hidden="true">
`;
}

// The Projects page: area filters over an editorial grid of picture cards
// (wide, narrow, narrow, wide, ...). Cards without a picture show a cream block.
const CARD_SIZES = ['wide', 'narrow', 'narrow', 'wide'];
// Email, LinkedIn and CV as vermilion buttons (home contact section and Contact page).
function contactButtons(contact, rel) {
  return [
    contact.email && `<a class="pill" href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>`,
    contact.linkedin && `<a class="pill" href="${esc(contact.linkedin)}" target="_blank" rel="noopener">Visit my LinkedIn <span aria-hidden="true">↗</span></a>`,
    contact.cv && `<a class="pill" href="${rel}${esc(contact.cv)}" download>Download CV <span aria-hidden="true">↓</span></a>`,
  ].filter(Boolean);
}

// The Contact page: the portrait in colour next to "Let's talk." and the buttons.
function contactPage(site) {
  const { contact } = site;
  const photo = site.about.photo;
  return `
<section class="row cpage">
  <div class="cpage__body">
    <p class="cpage__label">${photo ? `<img class="cpage__photo" src="../${esc(photo.src)}" alt="${plain(photo.alt)}" width="80" height="80">` : ''}Contact</p>
    <h1 class="cpage__title">${t(contact.title).replace(/\.$/, '<span class="accent">.</span>')}</h1>
    <a class="cpage__mail" href="mailto:${esc(contact.email)}"><span>${esc(contact.email)}</span><span class="cpage__arrow" aria-hidden="true">→</span></a>
    <div class="cpage__links">
      ${contact.linkedin ? `<a class="cbtn" href="${esc(contact.linkedin)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V21h-4z"/></svg>LinkedIn</a>` : ''}
      ${contact.cv ? `<a class="cbtn cbtn--pen" href="../${esc(contact.cv)}" download><span aria-hidden="true">↓</span>Download CV</a>` : ''}
    </div>
    <p class="small mute cpage__where"><svg class="pin" viewBox="0 0 24 30" aria-hidden="true" focusable="false"><path d="M12.4 27.6c-1.2-2.3-7.9-9.1-8.5-14.6C3.3 7.4 7.2 3 12.1 2.6c5.1-.4 8.6 3.6 8.3 8.7-.4 5.8-6.6 12.4-8 16.3z"/><path d="M12.6 7.9c-2.1-.3-3.6 1.5-3.4 3.3.2 1.9 2 3 3.7 2.6 1.6-.4 2.5-2 2.2-3.5-.3-1.4-1.3-2.3-2.5-2.4z"/></svg>${t(site.location)}</p>
  </div>
</section>`;
}

function projectsPage(site, projects) {
  const used = site.categories.filter((c) => projects.some((p) => p.categories.includes(c.tag)));
  const card = (p, i) => {
    const pic = p.card || (p.cover && p.cover.src && !p.cover.sample ? { src: p.cover.src } : null);
    const year = /\[\[/.test(p.year || '') ? '' : p.year;
    return `<a class="pcard pcard--${CARD_SIZES[i % 4]}" href="../work/${p.slug}/index.html" data-tags="${p.categories.join(' ')}">
      <span class="pcard__media${pic && pic.cutout ? ' pcard__media--cutout' : ''}">${
        pic ? `<img src="../${esc(pic.src)}" alt="" loading="lazy">` : `<span class="pcard__empty">${pad(i + 1)}</span>`
      }</span>
      <span class="pcard__meta"><span class="pcard__title">${esc(p.title)}</span><span class="small mute">${esc(tags(site, p))}${year ? ` · ${esc(year)}` : ''}</span></span>
    </a>`;
  };
  return `
<section class="xp">
  <div class="row xp__head">
    <h1 class="page__title">Projects</h1>
    <p class="xp__intro small mute">Things to see, hold and choose.</p>
  </div>
  <div class="row filters" role="group" aria-label="Filter by area" data-filters>
    <button type="button" class="filter is-on" data-filter="all">All</button>
    ${used.map((c) => `<button type="button" class="filter" data-filter="${c.tag}">${esc(c.label)}</button>`).join('')}
  </div>
  <div class="pgrid">
    ${projects.map(card).join('\n    ')}
  </div>
</section>`;
}

const FILTER_JS = `(function () {
  var bar = document.querySelector('[data-filters]');
  var cards = [].slice.call(document.querySelectorAll('.pcard'));
  var sizes = ${JSON.stringify(CARD_SIZES)};
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('.filter'); if (!b) return;
    var f = b.getAttribute('data-filter');
    bar.querySelectorAll('.filter').forEach(function (x) { x.classList.toggle('is-on', x === b); });
    var n = 0;
    cards.forEach(function (c) {
      var show = f === 'all' || c.getAttribute('data-tags').split(' ').indexOf(f) > -1;
      c.hidden = !show;
      if (show) { c.classList.remove('pcard--wide', 'pcard--narrow'); c.classList.add('pcard--' + sizes[n++ % 4]); }
    });
  });
})();`;

function experiencePage(site, projects) {
  return `
<section class="xp">
  <div class="row xp__head">
    <h1 class="page__title">Experience</h1>
    <p class="xp__intro small mute">How I got here, and the projects I made along the way.</p>
  </div>
  ${timeline(site.path, site.pathEnd, projects, '../')}
</section>`;
}

// ---------- build ----------

async function build() {
  const site = await load(join(root, 'content/site.js'));
  draft = site.draft;
  const dir = join(root, 'content/projects');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.js') && !f.startsWith('_'));
  const projects = (await Promise.all(files.map((f) => load(join(dir, f))))).sort((a, b) => a.order - b.order);
  for (const p of projects)
    for (const tag of p.categories)
      if (!site.categories.some((c) => c.tag === tag)) throw new Error(`Project "${p.slug}" uses unknown category "${tag}"`);

  await rm(out, { recursive: true, force: true });
  await mkdir(join(out, 'assets'), { recursive: true });
  await cp(join(root, 'public'), out, { recursive: true, filter: (src) => !src.endsWith('README.md') });
  await cp(join(root, 'src/styles.css'), join(out, 'assets/site.css'));

  const write = async (path, html) => {
    await mkdir(dirname(join(out, path)), { recursive: true });
    await writeFile(join(out, path), html);
  };

  await write('index.html', layout({ site, rel: '', title: `${site.name} · ${site.role}`, description: site.hero.statement, body: home(site, projects) }));
  await write('projects/index.html', layout({ site, rel: '../', title: `Projects · ${site.name}`, description: 'Selected product, packaging and print projects.', page: 'projects', body: projectsPage(site, projects) }));
  await write('contact/index.html', layout({ site, rel: '../', title: `Contact · ${site.name}`, description: "Let's talk.", page: 'contact', body: contactPage(site) }));
  await write('experience/index.html', layout({ site, rel: '../', title: `Experience · ${site.name}`, description: 'How I got here, and the projects I made along the way.', page: 'experience', body: experiencePage(site, projects) }));
  await write('about/index.html', layout({ site, rel: '../', title: `About · ${site.name}`, description: site.about.tagline, page: 'about', body: cvPage(site) }));
  for (const [i, p] of projects.entries()) {
    const next = projects[(i + 1) % projects.length];
    await write(
      `work/${p.slug}/index.html`,
      layout({ site, rel: '../../', title: `${p.title} · ${site.name}`, description: p.line, page: 'projects', body: project(site, p, i, next) }),
    );
  }

  console.log(`Built ${projects.length + 3} pages into dist/`);
  if (open.size) console.log(`\n${open.size} placeholders left to fill:\n  - ${[...open].join('\n  - ')}`);
}

build().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
