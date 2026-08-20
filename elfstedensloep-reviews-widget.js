/* =========================================================================
   GOOGLE REVIEWS CAROUSEL — voor elfstedensloep.nl (Strato)
   Zelfde stijl/aanpak als de chatwidget van Maayke: 1 los .js bestand,
   geen Google Cloud/API, dus gegarandeerd €0 kosten.

   BIJWERKEN VAN REVIEWS:
   Voeg hieronder bij CONFIG.reviews een nieuw object toe (kopieer een
   bestaand review-blokje) met naam, initiaal, sterren, tekst en datum.
   Verwijder oude reviews die je niet meer wilt tonen. Sla op, commit op
   GitHub — jsDelivr ververst vanzelf (eventueel geforceerd via
   https://purge.jsdelivr.net/gh/Elfstedensloep/elfstedensloepwidget/elfstedensloep-reviews-widget.js).

   WEERGAVE: breedte volgt de contentkolom van de pagina (tot max 1100px).
   Toont 3 reviews naast elkaar op desktop, 2 op tablet, 1 op mobiel.
   ========================================================================= */
(function () {
  'use strict';
  if (document.getElementById('els-reviews-widget')) return;

  // Bewaar direct een verwijzing naar het huidige <script> tag element,
  // zodat de carousel precies op deze plek in de pagina verschijnt
  // (en niet onderaan de site, zoals bij de chatbubbel).
  var hostScript = document.currentScript;

  var CONFIG = {
    avgRating: '5,0',
    reviewsUrl: 'https://share.google/WCzfdRmAq8eUjdqQx',
    autoplayMs: 7000,
    reviews: [
      {
        name: 'Florien',
        initial: 'F',
        color: '#c9603f',
        rating: 5,
        date: '6 dagen geleden',
        text: 'Wij hebben ontzettend genoten van onze 8-daagse Elfstedentocht met deze prachtige sloep. Het contact met Maayke was vanaf het eerste moment prettig en persoonlijk. Voor iedereen die Friesland vanaf het water wil ontdekken: een absolute aanrader!'
      },
      {
        name: 'Kees Snijders',
        initial: 'K',
        color: '#6b6f73',
        rating: 5,
        date: '3 weken geleden',
        text: 'We werden heel vriendelijk ontvangen door Maayke, na een duidelijke uitleg en een vaarboek met routes zijn we op pad gegaan. We hebben met volle teugen genoten van de sloep en het mooie Friesland, kortom een dag vol leuke herinneringen en zeker voor herhaling vatbaar.'
      },
      {
        name: 'Jasper van der Kamp',
        initial: 'J',
        color: '#a97552',
        rating: 5,
        date: '3 weken geleden',
        text: 'Bij vertrek kregen we een mooie uitgestippelde route mee van Maayke, inclusief een heldere uitleg van de boot. Daardoor zijn we echt op de mooiste plekjes terechtgekomen; van hele knusse, smalle slootjes tot het open water op het meer.'
      },
      {
        name: 'André Gebauer',
        initial: 'A',
        color: '#54585c',
        rating: 5,
        date: 'een jaar geleden',
        text: 'We hebben een fantastische dag gehad. De boot was geweldig en in uitstekende staat. De tourtips en de uitleg waren ook uitstekend. Het contact was erg vriendelijk. We zouden zeker weer boeken!'
      },
      {
        name: 'Sabrina Pflaum',
        initial: 'S',
        color: '#c9603f',
        rating: 5,
        date: 'een jaar geleden',
        text: 'Een fantastisch evenement voor het hele gezin! De grachten zijn gewoonweg prachtig! Het huren van de bootjes verliep vlekkeloos en de instructies waren uitstekend. Absoluut een aanrader als je op vakantie bent in Friesland.'
      },
      {
        name: 'Marlien Schalij',
        initial: 'M',
        color: '#6b6f73',
        rating: 5,
        date: '2 dagen geleden',
        text: 'Toen we Elfstedensloep belden met de vraag of ze konden helpen bij het organiseren van een familiedag, was Maayke meteen enthousiast en kwam ze direct met allerlei leuke ideeën. Maayke en Evert, mega bedankt voor jullie enthousiasme, flexibiliteit en fantastische organisatie!'
      },
      {
        name: 'Michèle Bemsel',
        initial: 'M',
        color: '#a97552',
        rating: 5,
        date: 'een week geleden',
        text: 'Een supermakkelijk te besturen, praktische en prachtige boot. De transactie verliep vlot en zeer prettig, dank u wel!'
      },
      {
        name: 'Michael Kogeler',
        initial: 'M',
        color: '#54585c',
        rating: 5,
        date: '2 jaar geleden',
        text: 'Een fantastische ervaring - een super behulpzame gastheer, zeer ondersteunend tijdens de boeking en bij aankomst, een boot van hoge kwaliteit en een algehele geweldige ervaring. Ik heb al eerder boten gehuurd, maar de Elfstedentocht legt de lat hoog.'
      }
    ]
  };

  var CSS = ''
    + '#els-reviews-widget{--els-primary:#6b6f73;--els-primary-dark:#54585c;--els-accent:#c9603f;--els-bg:#ffffff;--els-bg-soft:#f5f5f6;--els-text:#33363a;--els-text-soft:#8b8e90;--els-border:#dcdddd;--els-radius:16px;--els-per-view:3;box-sizing:border-box;width:100%;max-width:1100px;margin:40px auto;padding:32px 28px;background:var(--els-bg-soft);border-radius:var(--els-radius);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:var(--els-text);text-align:center;}'
    + '#els-reviews-widget *{box-sizing:border-box;}'
    + '#els-reviews-widget .els-rev-header{margin-bottom:24px;}'
    + '#els-reviews-widget .els-rev-score{font-size:28px;font-weight:700;color:var(--els-text);}'
    + '#els-reviews-widget .els-rev-score .stars{color:#f2a93b;font-size:22px;letter-spacing:1px;margin-left:6px;}'
    + '#els-reviews-widget .els-rev-sub{font-size:13px;color:var(--els-text-soft);margin-top:2px;}'
    + '#els-reviews-widget .els-rev-track-wrap{position:relative;display:flex;align-items:stretch;gap:10px;}'
    + '#els-reviews-widget .els-rev-viewport{overflow:hidden;flex:1;min-width:0;}'
    + '#els-reviews-widget .els-rev-track{display:flex;transition:transform .45s ease;align-items:stretch;}'
    + '#els-reviews-widget .els-rev-page{flex:0 0 100%;display:grid;grid-template-columns:repeat(var(--els-per-view),1fr);gap:18px;align-items:stretch;}'
    + '#els-reviews-widget .els-rev-card{background:var(--els-bg);border:1px solid var(--els-border);border-radius:var(--els-radius);padding:22px;min-height:230px;display:flex;flex-direction:column;align-items:center;text-align:center;}'
    + '#els-reviews-widget .els-rev-avatar{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:15px;margin-bottom:10px;flex-shrink:0;}'
    + '#els-reviews-widget .els-rev-name{font-weight:600;font-size:14px;color:var(--els-text);}'
    + '#els-reviews-widget .els-rev-stars{color:#f2a93b;font-size:13px;margin:4px 0 12px;letter-spacing:1px;}'
    + '#els-reviews-widget .els-rev-text{font-size:13.5px;line-height:1.55;color:var(--els-text);flex:1;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden;}'
    + '#els-reviews-widget .els-rev-date{font-size:11.5px;color:var(--els-text-soft);margin-top:14px;}'
    + '#els-reviews-widget .els-rev-arrow{flex:0 0 auto;width:36px;height:36px;align-self:center;border-radius:50%;border:1px solid var(--els-border);background:var(--els-bg);color:var(--els-primary-dark);font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s ease;}'
    + '#els-reviews-widget .els-rev-arrow:hover{background:#ffffff;}'
    + '#els-reviews-widget .els-rev-dots{display:flex;justify-content:center;gap:6px;margin-top:20px;}'
    + '#els-reviews-widget .els-rev-dot{width:7px;height:7px;border-radius:50%;background:var(--els-border);cursor:pointer;padding:0;border:none;}'
    + '#els-reviews-widget .els-rev-dot.active{background:var(--els-accent);}'
    + '#els-reviews-widget .els-rev-cta{display:inline-block;margin-top:24px;padding:11px 22px;background:var(--els-accent);color:#ffffff !important;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;transition:opacity .15s ease;}'
    + '#els-reviews-widget .els-rev-cta:hover{opacity:.9;}'
    + '@media (max-width:900px){#els-reviews-widget .els-rev-card{min-height:210px;}}'
    + '@media (max-width:480px){#els-reviews-widget{padding:24px 14px;margin:24px auto;}#els-reviews-widget .els-rev-card{padding:18px;min-height:250px;}#els-reviews-widget .els-rev-arrow{width:30px;height:30px;font-size:16px;}}';

  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  function starString(n) {
    var full = '★★★★★'.slice(0, n);
    var empty = '☆☆☆☆☆'.slice(0, 5 - n);
    return full + empty;
  }

  function cardHtml(r) {
    return '<div class="els-rev-card">'
      + '<div class="els-rev-avatar" style="background:' + r.color + '">' + r.initial + '</div>'
      + '<div class="els-rev-name">' + r.name + '</div>'
      + '<div class="els-rev-stars">' + starString(r.rating) + '</div>'
      + '<div class="els-rev-text">&ldquo;' + r.text + '&rdquo;</div>'
      + '<div class="els-rev-date">' + r.date + '</div>'
      + '</div>';
  }

  var wrapper = document.createElement('div');
  wrapper.id = 'els-reviews-widget';
  wrapper.innerHTML =
    '<div class="els-rev-header">'
    + '<div class="els-rev-score">' + CONFIG.avgRating + ' <span class="stars">★★★★★</span></div>'
    + '<div class="els-rev-sub">Beoordeeld op Google</div>'
    + '</div>'
    + '<div class="els-rev-track-wrap">'
    + '<button class="els-rev-arrow els-rev-prev" aria-label="Vorige reviews">‹</button>'
    + '<div class="els-rev-viewport"><div class="els-rev-track"></div></div>'
    + '<button class="els-rev-arrow els-rev-next" aria-label="Volgende reviews">›</button>'
    + '</div>'
    + '<div class="els-rev-dots"></div>'
    + '<a class="els-rev-cta" href="' + CONFIG.reviewsUrl + '" target="_blank" rel="noopener">Bekijk alle reviews op Google</a>';

  // Plaats de widget exact op de plek van het script-blok in de pagina,
  // zodat 'ie in de content staat en niet onderaan de site belandt.
  if (hostScript && hostScript.parentNode) {
    hostScript.parentNode.insertBefore(wrapper, hostScript.nextSibling);
  } else {
    document.body.appendChild(wrapper);
  }

  var track = wrapper.querySelector('.els-rev-track');
  var dotsWrap = wrapper.querySelector('.els-rev-dots');
  var prevBtn = wrapper.querySelector('.els-rev-prev');
  var nextBtn = wrapper.querySelector('.els-rev-next');

  var current = 0;
  var pageCount = 1;
  var perView = 3;
  var timer = null;

  function getPerView() {
    var w = window.innerWidth;
    if (w >= 900) return 3;
    if (w >= 620) return 2;
    return 1;
  }

  function chunk(arr, size) {
    var out = [];
    for (var i = 0; i < arr.length; i += size) {
      out.push(arr.slice(i, i + size));
    }
    return out;
  }

  function build() {
    perView = getPerView();
    wrapper.style.setProperty('--els-per-view', perView);
    var pages = chunk(CONFIG.reviews, perView);
    pageCount = pages.length;
    track.innerHTML = pages.map(function (group) {
      return '<div class="els-rev-page">' + group.map(cardHtml).join('') + '</div>';
    }).join('');
    dotsWrap.innerHTML = pages.map(function (_, i) {
      return '<button class="els-rev-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" aria-label="Pagina ' + (i + 1) + '"></button>';
    }).join('');
    current = Math.min(current, pageCount - 1);
    goTo(current, true);
  }

  function goTo(index, skipClamp) {
    current = skipClamp ? index : (index + pageCount) % pageCount;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    var dots = dotsWrap.querySelectorAll('.els-rev-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    if (pageCount > 1) timer = setInterval(next, CONFIG.autoplayMs);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
  nextBtn.addEventListener('click', function () { next(); startAutoplay(); });
  dotsWrap.addEventListener('click', function (e) {
    var btn = e.target.closest('.els-rev-dot');
    if (!btn) return;
    goTo(parseInt(btn.getAttribute('data-index'), 10), true);
    startAutoplay();
  });

  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);

  // Swipe-ondersteuning op mobiel
  var touchStartX = null;
  wrapper.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  wrapper.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 40) prev();
    else if (dx < -40) next();
    touchStartX = null;
    startAutoplay();
  }, { passive: true });

  // Herbouw de kaartenindeling (3 / 2 / 1 per view) als het scherm van formaat verandert
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (getPerView() !== perView) build();
    }, 200);
  });

  build();
  startAutoplay();
})();