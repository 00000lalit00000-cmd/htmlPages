/* =============================================================
   Shared prototype behaviour for ALL UX design variants.
   Loaded as:  <script src="../assets/site.js"></script>

   1) smooth image slider / gallery  (.ux-slider[data-slider])
   2) mobile menu toggle             (.burger -> .links.open)
   3) current-page nav highlight
   4) demo form submit (prototype, no backend)
   ============================================================= */

/* ---------- 1a. slider CSS (injected once) ---------- */
(function uxSliderCSS() {
  if (document.getElementById('ux-slider-css')) return;
  var css = [
    /* frame: aspect-ratio driven so photos are neither squashed nor cropped */
    '.ux-slider{position:relative;overflow:hidden;border-radius:var(--ux-r,18px);background:#0F1520;',
    'box-shadow:0 16px 40px rgba(16,24,32,.16);width:100%;max-width:var(--ux-max,860px);margin:0 auto;',
    'aspect-ratio:var(--ux-ar,16/10);touch-action:pan-y;user-select:none;-webkit-user-select:none}',
    '@supports not (aspect-ratio:16/10){.ux-slider{height:var(--ux-h,520px)}}',

    /* track + slides */
    '.ux-slider-track{display:flex;height:100%;width:100%;will-change:transform;',
    'transition:transform .6s cubic-bezier(.22,.61,.36,1)}',
    '.ux-slider-slide{position:relative;flex:0 0 100%;min-width:0;height:100%;background:#0F1520}',
    '.ux-slider-slide img{display:block;width:100%;height:100%;object-fit:cover;object-position:center 42%;opacity:0;',
    'transform:scale(1.02);transition:opacity .5s ease,transform .6s ease}',
    '.ux-slider-slide img.ux-in{opacity:1;transform:scale(1)}',

    /* caption is taken from the image alt text */
    '.ux-cap{position:absolute;left:0;right:0;bottom:0;z-index:2;pointer-events:none;color:#fff;',
    'padding:44px 150px 16px 20px;font-size:13.5px;font-weight:600;line-height:1.45;letter-spacing:.2px;',
    'background:linear-gradient(to top,rgba(8,12,18,.86),rgba(8,12,18,.35) 55%,rgba(8,12,18,0))}',

    /* arrows */
    '.ux-btn{position:absolute;top:50%;margin-top:-22px;width:44px;height:44px;border-radius:50%;z-index:4;',
    'display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;',
    'background:rgba(10,16,24,.5);border:1px solid rgba(255,255,255,.4);backdrop-filter:blur(3px);',
    'font:600 15px/1 system-ui,sans-serif;transition:background .2s,transform .15s}',
    '.ux-btn:hover{background:rgba(10,16,24,.85)}',
    '.ux-btn:active{transform:scale(.93)}',
    '.ux-btn.prev{left:16px}',
    '.ux-btn.next{right:16px}',

    /* dots + counter */
    '.ux-dots{position:absolute;right:18px;bottom:18px;display:flex;gap:7px;z-index:4}',
    '.ux-dot{width:9px;height:9px;padding:0;border-radius:50%;cursor:pointer;',
    'border:1.5px solid rgba(255,255,255,.75);background:rgba(255,255,255,.28);',
    'transition:background .2s,transform .2s}',
    '.ux-dot:hover{background:rgba(255,255,255,.7)}',
    '.ux-dot.on{background:#fff;transform:scale(1.28)}',
    '.ux-count{position:absolute;top:16px;right:16px;z-index:4;border-radius:999px;padding:6px 11px;',
    'background:rgba(10,16,24,.55);color:#fff;font:700 11.5px/1 system-ui,sans-serif;letter-spacing:.6px;',
    'backdrop-filter:blur(3px)}',

    /* photo thumbs used by the "Our Work" preview grids */
    '.slider-wrap{display:block;width:100%}',
    '.work .thumb-img,.thumb img{display:block;width:100%;height:150px;object-fit:cover;object-position:center 42%}',

    '@media (max-width:640px){.ux-btn{width:38px;height:38px;margin-top:-19px}',
    '.ux-btn.prev{left:10px}.ux-btn.next{right:10px}',
    '.ux-cap{padding:34px 96px 13px 16px;font-size:12.5px}',
    '.ux-dots{right:12px;bottom:12px;gap:6px}.ux-dot{width:8px;height:8px}}',
    '@media (prefers-reduced-motion:reduce){.ux-slider-track{transition:none}',
    '.ux-slider-slide img{transition:none;transform:none}}'
  ].join('');
  var s = document.createElement('style');
  s.id = 'ux-slider-css';
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();
/* ---------- 1b. slider engine ---------- */
function uxInitSlider(root) {
  if (!root || root.getAttribute('data-ux-ready') === '1') return;
  var track = root.querySelector('.ux-slider-track');
  if (!track) return;
  var slides = Array.prototype.slice.call(track.querySelectorAll('.ux-slider-slide'));
  var n = slides.length;
  if (!n) return;
  root.setAttribute('data-ux-ready', '1');

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // caption from alt text (photographic proof of the work)
  for (var c = 0; c < n; c++) {
    var im = slides[c].querySelector('img');
    if (im && im.getAttribute('alt') && !slides[c].querySelector('.ux-cap')) {
      var cap = document.createElement('div');
      cap.className = 'ux-cap';
      cap.textContent = im.getAttribute('alt');
      slides[c].appendChild(cap);
    }
  }

  function mkBtn(cls, label, glyph) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ux-btn ' + cls;
    b.setAttribute('aria-label', label);
    b.innerHTML = glyph;
    return b;
  }
  var prev = mkBtn('prev', 'Previous image', '&#10094;');
  var next = mkBtn('next', 'Next image', '&#10095;');
  var dotsWrap = document.createElement('div'); dotsWrap.className = 'ux-dots';
  var count = document.createElement('div'); count.className = 'ux-count';
  root.appendChild(prev); root.appendChild(next); root.appendChild(dotsWrap); root.appendChild(count);

  var dots = [];
  for (var d = 0; d < n; d++) {
    (function (i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'ux-dot';
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    })(d);
  }

  var idx = 0, timer = 0;
  function at(i) { return ((i % n) + n) % n; }

  function ensure(i) {                       // load the photo only when it is near
    var img = slides[at(i)].querySelector('img');
    if (!img) return;
    if (!img.getAttribute('src')) {
      var ds = img.getAttribute('data-src');
      if (ds) img.setAttribute('src', ds);
    }
    if (img.complete && img.naturalWidth) { img.classList.add('ux-in'); return; }
    if (!img.__uxBound) {
      img.__uxBound = 1;
      img.addEventListener('load', function () { img.classList.add('ux-in'); });
      img.addEventListener('error', function () { img.classList.add('ux-in'); });
    }
  }
  function pos() { track.style.transform = 'translateX(' + (-idx * 100) + '%)'; }
  function paint() {
    for (var k = 0; k < n; k++) dots[k].className = 'ux-dot' + (k === idx ? ' on' : '');
    count.textContent = (idx + 1) + ' / ' + n;
    root.setAttribute('data-ux-index', String(idx));
    var cur = slides[idx].querySelector('img');
    root.setAttribute('data-ux-caption', (cur && cur.getAttribute('alt')) || '');
  }
  function stop() { if (timer) { window.clearInterval(timer); timer = 0; } }
  function restart() { if (n < 2 || reduce || timer) return; timer = window.setInterval(nxt, 5200); }
  function go(to) {
    idx = at(to); pos(); paint();
    ensure(idx); ensure(idx + 1); ensure(idx - 1);   // current + neighbours only (no recursion)
    restart();
  }
  function nxt() { go(idx + 1); }
  function prv() { go(idx - 1); }
  next.addEventListener('click', nxt);
  prev.addEventListener('click', prv);

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', restart);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', restart);
  document.addEventListener('keydown', function (e) {
    if (!root.contains(document.activeElement)) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); nxt(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prv(); }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else restart();
  });

  // swipe / drag
  var x0 = null, dx = 0;
  root.addEventListener('touchstart', function (e) { stop(); x0 = e.touches[0].clientX; dx = 0; }, { passive: true });
  root.addEventListener('touchmove', function (e) {
    if (x0 === null) return;
    dx = e.touches[0].clientX - x0;
    track.style.transform = 'translateX(calc(' + (-idx * 100) + '% + ' + dx + 'px))';
  }, { passive: true });
  root.addEventListener('touchend', function () {
    if (dx <= -40) nxt(); else if (dx >= 40) prv(); else pos();
    x0 = null; dx = 0; restart();
  });

  pos(); paint(); ensure(0); ensure(1); ensure(n - 1);
  root.uxSlider = { next: nxt, prev: prv, go: go, index: function () { return idx; }, count: function () { return n; } };
  window.uxSliders = window.uxSliders || [];
  window.uxSliders.push(root);
}
/* ---------- 3. icons + floating contact actions ---------- */
/* Real vector glyphs (WhatsApp / phone / map pin / mail) - no image files, no library. */
var UX_ICONS = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.198.058-.372-.058-.52-.116-.149-.669-1.612-.916-2.207-.241-.579-.486-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  call: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  nav: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'
};
var UX_PHONE = '+919579009800';
var UX_WA = 'https://wa.me/919579009800';
var UX_MAPS_DIR = 'https://www.google.com/maps/dir/?api=1&destination=18.6155839,73.7710476';

function uxIconFor(href) {
  if (!href) return '';
  if (href.indexOf('wa.me') >= 0 || href.indexOf('whatsapp') >= 0) return 'wa';
  if (href.indexOf('tel:') === 0) return 'call';
  if (href.indexOf('mailto:') === 0) return 'mail';
  if (href.indexOf('google.com/maps') >= 0 || href.indexOf('maps.google') >= 0) return 'pin';
  return '';
}
function uxIconSpan(name) {
  var s = document.createElement('span');
  s.className = 'ic ic-' + name;
  s.innerHTML = UX_ICONS[name] || '';
  return s;
}
/* ---------- 3b. icon CSS (injected once) ---------- */
(function uxIconCSS() {
  if (document.getElementById('ux-icon-css')) return;
  var css = [
    '.ic{display:inline-flex;align-items:center;justify-content:center;width:1em;height:1em;',
    'flex:0 0 auto;margin-right:.42em;vertical-align:-.14em;line-height:0}',
    '.ic svg{display:block;width:100%;height:100%;fill:currentColor}',
    '.ic:only-child{margin-right:0}',
    '.ic-wa{color:#25D366}',
    '.ic-pin{color:#E1443B}',
    '.ico .ic{width:1em;height:1em;margin-right:0}',
    'h3 .ic,h4 .ic{width:.92em;height:.92em;margin-right:.45em}',
    /* clickable chips for phone / WhatsApp / directions */
    '.ic-chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}',
    '.ic-chip{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line,#E2E8EE);',
    'border-radius:999px;padding:9px 16px;font-size:13.5px;font-weight:600;background:#fff;',
    'text-decoration:none;color:inherit;transition:.18s}',
    '.ic-chip:hover{border-color:currentColor;transform:translateY(-1px)}',
    '.ic-chip .ic{margin-right:0;font-size:16px}',
    /* live google map */
    '.map-live{display:block;padding:0;height:320px;overflow:hidden;border-radius:16px;',
    'background:#E7EDF3;border:1px solid var(--line,#E2E8EE)}',
    '.map-live iframe{display:block;width:100%;height:100%;border:0}',
    /* floating contact buttons (WhatsApp + Call) */
    '.ux-fab{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;flex-direction:column;gap:12px}',
    '.ux-fab a{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;',
    'color:#fff;box-shadow:0 8px 22px rgba(9,20,32,.28);transition:transform .18s,box-shadow .18s}',
    '.ux-fab a:hover{transform:scale(1.07);box-shadow:0 12px 28px rgba(9,20,32,.34)}',
    '.ux-fab svg{width:27px;height:27px;fill:#fff}',
    '.ux-fab-wa{background:#25D366}',
    '.ux-fab-call{background:linear-gradient(135deg,#204060,#C02080)}',
    '@media (max-width:640px){.ux-fab{right:12px;bottom:12px;gap:10px}',
    '.ux-fab a{width:48px;height:48px}.ux-fab svg{width:23px;height:23px}',
    '.map-live{height:260px}}'
  ].join('');
  var s = document.createElement('style');
  s.id = 'ux-icon-css';
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();

/* ---------- 3c. decorate links + floating buttons ---------- */
function uxDecorate() {
  // [data-ic="wa"] placeholders written by hand in the page markup
  document.querySelectorAll('[data-ic]').forEach(function (el) {
    var name = el.getAttribute('data-ic');
    if (!UX_ICONS[name] || el.querySelector('.ic')) return;
    var span = uxIconSpan(name);
    if (el.tagName === 'A' || el.tagName === 'BUTTON') el.insertBefore(span, el.firstChild);
    else { el.innerHTML = ''; el.appendChild(span); }
  });

  // any tel: / wa.me / mailto: / maps link in a header bar, footer or action row
  var auto = '.top a, .strip a, .foot-contact a, .socials a, .actions a, .ic-chips a, .site-foot a, .map-live + p a';
  document.querySelectorAll(auto).forEach(function (a) {
    if (a.querySelector('.ic')) return;
    var name = uxIconFor(a.getAttribute('href'));
    if (!name) return;
    a.insertBefore(uxIconSpan(name), a.firstChild);
  });

  // floating call + WhatsApp buttons on every page
  if (!document.querySelector('.ux-fab')) {
    var fab = document.createElement('div');
    fab.className = 'ux-fab';
    var wa = document.createElement('a');
    wa.className = 'ux-fab-wa'; wa.href = UX_WA;
    wa.target = '_blank'; wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat with us on WhatsApp');
    wa.title = 'Chat on WhatsApp';
    wa.innerHTML = UX_ICONS.wa;
    var call = document.createElement('a');
    call.className = 'ux-fab-call'; call.href = 'tel:' + UX_PHONE;
    call.setAttribute('aria-label', 'Call Smaran Advertising');
    call.title = 'Call +91 95790 09800';
    call.innerHTML = UX_ICONS.call;
    fab.appendChild(wa); fab.appendChild(call);
    (document.body || document.documentElement).appendChild(fab);
  }
}
/*MARK_WIRE*/
(function () {
  function boot() {
    // mobile menu
    var burger = document.querySelector('.burger');
    var links = document.querySelector('.links');
    if (burger && links) {
      burger.addEventListener('click', function () { links.classList.toggle('open'); });
      links.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') links.classList.remove('open');
      });
    }

    // current-page highlight
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.links a, .site-foot a, .crumbs a').forEach(function (a) {
      var target = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
      if (target && target === here) a.classList.add('on');
    });

    // demo forms (prototype has no backend)
    document.querySelectorAll('form[data-demo]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = form.querySelector('.form-ok');
        if (ok) ok.style.display = 'block';
        form.reset();
      });
    });

    // image sliders
    var nodes = document.querySelectorAll('[data-slider]');
    for (var i = 0; i < nodes.length; i++) uxInitSlider(nodes[i]);

    // realistic contact icons + floating WhatsApp / Call buttons
    uxDecorate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();