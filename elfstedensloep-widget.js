/* =========================================================================
   CHATWIDGET "Maayke van Elfstedensloep" — voor elfstedensloep.nl (Strato)
   =========================================================================
   Dit bestand bouwt de hele chat zelf op via JavaScript (stijl + HTML +
   gedrag zitten allemaal in dit ene bestand). Dat is expres: Strato's
   Trackingcode-veld werkt het meest betrouwbaar met precies ÉÉN kort
   scriptje dat naar een bestand verwijst — precies zoals Futy dat ook doet
   — in plaats van een lange lap losse HTML die je er direct in plakt.

   INSTALLATIE:
   1. Zet dit bestand online (zie de losse instructies die je ontving,
      bijvoorbeeld via GitHub Pages — gratis).
   2. Plak in Strato bij Instellingen → SEO-opties → "Traceer script" dit
      ene regeltje (met JOUW eigen bestands-URL):
        <script src="https://JOUW-LINK/elfstedensloep-widget.js" defer></script>
   3. Kies de optie "BODY", publiceren.

   VOOR GEBRUIK MOET JE INVULLEN, HIERONDER GEMARKEERD MET ⚠️:
     1) Je gratis Web3Forms access key (voor de e-mailfunctie)
     2) (optioneel) de kleuren, in de CSS hieronder bij :root-variabelen
   ========================================================================= */
(function () {
  'use strict';

  // Voorkom dubbele initialisatie als dit script per ongeluk twee keer
  // wordt geladen op dezelfde pagina.
  if (document.getElementById('els-chat-widget')) return;

  /* ======================= ⚠️ CONFIGURATIE ======================= */
  var CONFIG = {
    whatsappNumber: '31659119193',   // 06-59119193 in internationaal formaat, geen 00 of + ervoor
    web3formsKey: 'dc7116d5-b319-45cb-867c-e8239f9ec85f', // Web3Forms access key
    priceUrl: 'https://elfstedensloep.nl/Prijzen/',
    availabilityUrl: 'https://elfstedensloep.nl/Boek-je-sloep/',
    popupDelayMs: 5000,
    agentName: 'Maayke van Elfstedensloep'
  };
  /* ================================================================= */

  /* ---------------------- CSS (opmaak) ---------------------- */
  var CSS = ''
    + '#els-chat-widget, #els-chat-widget * { box-sizing: border-box; }'
    + '#els-chat-widget {'
    /* ⚠️ Huisstijlkleuren — pas eventueel aan. Nu: wit + licht-/middengrijs
       met terracotta als klein accent (avatar en de twee link-knopjes). */
    + '  --els-primary: #6b6f73;'
    + '  --els-primary-dark: #54585c;'
    + '  --els-accent: #c9603f;'
    + '  --els-bg: #ffffff;'
    + '  --els-bg-soft: #f5f5f6;'
    + '  --els-text: #33363a;'
    + '  --els-text-soft: #8b8e90;'
    + '  --els-border: #dcdddd;'
    + '  --els-radius: 16px;'
    + '  --els-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;'
    + '  position: fixed; z-index: 2147483000; right: 20px; bottom: 20px; font-family: var(--els-font);'
    + '}'
    + '#els-chat-bubble {'
    + '  width: 62px; height: 62px; border-radius: 50%;'
    + '  background: linear-gradient(160deg, var(--els-primary), var(--els-primary-dark));'
    + '  box-shadow: 0 6px 20px rgba(84,88,92,0.35);'
    + '  display: flex; align-items: center; justify-content: center;'
    + '  cursor: pointer; border: none; position: relative; transition: transform .15s ease;'
    + '}'
    + '#els-chat-bubble:hover { transform: scale(1.06); }'
    + '#els-chat-bubble svg { width: 28px; height: 28px; }'
    + '#els-chat-bubble .els-dot {'
    + '  position: absolute; top: -2px; right: -2px; width: 14px; height: 14px;'
    + '  background: #38b06a; border: 2px solid #fff; border-radius: 50%;'
    + '}'
    + '#els-chat-panel {'
    + '  position: absolute; right: 0; bottom: 78px; width: 360px; max-width: calc(100vw - 32px);'
    + '  height: 500px; max-height: 70vh; background: var(--els-bg); border-radius: var(--els-radius);'
    + '  box-shadow: 0 12px 40px rgba(0,0,0,0.22); display: flex; flex-direction: column; overflow: hidden;'
    + '  opacity: 0; transform: translateY(16px) scale(.98); pointer-events: none;'
    + '  transition: opacity .25s ease, transform .25s ease;'
    + '}'
    + '#els-chat-widget.els-open #els-chat-panel { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }'
    + '#els-chat-widget.els-open #els-chat-bubble { display: none; }'
    + '#els-chat-header {'
    + '  background: linear-gradient(160deg, var(--els-primary), var(--els-primary-dark)); color: #fff;'
    + '  padding: 14px 14px 14px 16px; display: flex; align-items: center; gap: 10px; flex-shrink: 0;'
    + '}'
    + '#els-chat-header .els-avatar {'
    + '  width: 38px; height: 38px; border-radius: 50%; background: var(--els-accent);'
    + '  display: flex; align-items: center; justify-content: center; font-weight: 700; color: #ffffff; flex-shrink: 0;'
    + '}'
    + '#els-chat-header .els-title { flex: 1; min-width: 0; }'
    + '#els-chat-header .els-name { font-weight: 600; font-size: 14.5px; line-height: 1.2; }'
    + '#els-chat-header .els-status { font-size: 12px; opacity: .85; display:flex; align-items:center; gap:5px; }'
    + '#els-chat-header .els-status .els-dot-online { width: 7px; height: 7px; background:#38b06a; border-radius:50%; display:inline-block; }'
    + '#els-chat-header button {'
    + '  background: rgba(255,255,255,0.12); border: none; color: #fff; width: 30px; height: 30px; border-radius: 8px;'
    + '  cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;'
    + '}'
    + '#els-chat-header button:hover { background: rgba(255,255,255,0.22); }'
    + '#els-chat-body { flex: 1; overflow-y: auto; padding: 16px 14px; background: var(--els-bg-soft); display: flex; flex-direction: column; gap: 10px; }'
    + '.els-msg { max-width: 84%; padding: 10px 13px; border-radius: 14px; font-size: 13.5px; line-height: 1.45; white-space: pre-wrap; word-wrap: break-word; }'
    + '.els-msg-bot { align-self: flex-start; background: #fff; color: var(--els-text); border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }'
    + '.els-msg-user { align-self: flex-end; background: var(--els-primary); color: #fff; border-bottom-right-radius: 4px; }'
    + '.els-chip-row { display: flex; flex-wrap: wrap; gap: 8px; align-self: flex-start; max-width: 100%; }'
    + '.els-chip { background: #fff; border: 1.5px solid var(--els-border); color: var(--els-primary-dark); font-size: 12.5px; font-weight: 600; padding: 8px 12px; border-radius: 20px; cursor: pointer; }'
    + '.els-chip:hover { background: var(--els-primary); color: #fff; }'
    + '.els-link-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; background: var(--els-accent); color: #ffffff; font-weight: 700; font-size: 12.5px; padding: 8px 12px; border-radius: 10px; text-decoration: none; }'
    + '.els-action-row { display: flex; gap: 8px; align-self: flex-start; }'
    + '.els-action-btn { display: flex; align-items: center; gap: 6px; border: none; padding: 9px 12px; border-radius: 10px; font-size: 12.5px; font-weight: 600; cursor: pointer; }'
    + '.els-action-wa { background: #25D366; color: #fff; }'
    + '.els-action-mail { background: var(--els-primary); color: #fff; }'
    + '.els-typing { align-self: flex-start; display:flex; gap:4px; padding: 10px 13px; background:#fff; border-radius:14px; border-bottom-left-radius:4px; }'
    + '.els-typing span { width:6px; height:6px; background: var(--els-text-soft); border-radius:50%; animation: els-bounce 1.2s infinite ease-in-out; }'
    + '.els-typing span:nth-child(2){ animation-delay:.15s; }'
    + '.els-typing span:nth-child(3){ animation-delay:.3s; }'
    + '@keyframes els-bounce { 0%,60%,100%{ transform: translateY(0);} 30%{ transform: translateY(-4px);} }'
    + '#els-mail-form { align-self: stretch; background: #fff; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }'
    + '#els-mail-form input { border: 1px solid var(--els-border); border-radius: 8px; padding: 8px 10px; font-size: 13px; font-family: var(--els-font); }'
    + '#els-mail-form button { background: var(--els-primary); color: #fff; border: none; border-radius: 8px; padding: 9px; font-weight: 600; font-size: 13px; cursor: pointer; }'
    + '#els-chat-footer { flex-shrink: 0; display: flex; gap: 8px; padding: 10px; border-top: 1px solid #e7ecef; background: #fff; }'
    + '#els-chat-input { flex: 1; border: 1px solid var(--els-border); border-radius: 22px; padding: 10px 14px; font-size: 13.5px; font-family: var(--els-font); outline: none; }'
    + '#els-chat-input:focus { border-color: var(--els-primary); }'
    + '#els-chat-send { width: 40px; height: 40px; border-radius: 50%; border: none; background: var(--els-primary); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }'
    + '#els-chat-send:hover { background: var(--els-primary-dark); }'
    + '@media (max-width: 480px) { #els-chat-widget { right: 10px; bottom: 10px; } #els-chat-panel { width: calc(100vw - 20px); height: 72vh; bottom: 74px; } }';

  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ---------------------- HTML (structuur) ---------------------- */
  var wrapper = document.createElement('div');
  wrapper.id = 'els-chat-widget';
  wrapper.innerHTML =
    '<div id="els-chat-panel">' +
      '<div id="els-chat-header">' +
        '<div class="els-avatar">M</div>' +
        '<div class="els-title">' +
          '<div class="els-name">' + CONFIG.agentName + '</div>' +
          '<div class="els-status"><span class="els-dot-online"></span> Meestal snel online</div>' +
        '</div>' +
        '<button id="els-minimize-btn" title="Minimaliseren" aria-label="Minimaliseren">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</div>' +
      '<div id="els-chat-body"></div>' +
      '<div id="els-chat-footer">' +
        '<input id="els-chat-input" type="text" placeholder="Typ je bericht..." autocomplete="off" />' +
        '<button id="els-chat-send" title="Verstuur" aria-label="Verstuur">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 20l18-8L3 4l0 7 12 1-12 1z" fill="currentColor"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>' +
    '<button id="els-chat-bubble" title="Chat met ' + CONFIG.agentName + '" aria-label="Open chat">' +
      '<span class="els-dot"></span>' +
      '<svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16v12H7l-3 3V4z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>' +
    '</button>';
  document.body.appendChild(wrapper);

  /* ---------------------- Gedrag (JS) ---------------------- */
  var widget = wrapper;
  var bubble = document.getElementById('els-chat-bubble');
  var body = document.getElementById('els-chat-body');
  var input = document.getElementById('els-chat-input');
  var sendBtn = document.getElementById('els-chat-send');
  var minimizeBtn = document.getElementById('els-minimize-btn');

  var greeted = false;

  function greetingWord() {
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Goedemorgen';
    if (h >= 12 && h < 18) return 'Goedemiddag';
    return 'Goedenavond';
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function addBotMessage(html) {
    var el = document.createElement('div');
    el.className = 'els-msg els-msg-bot';
    el.innerHTML = html;
    body.appendChild(el);
    scrollToBottom();
    return el;
  }

  function addUserMessage(text) {
    var el = document.createElement('div');
    el.className = 'els-msg els-msg-user';
    el.textContent = text;
    body.appendChild(el);
    scrollToBottom();
  }

  function showTyping(callback, delay) {
    var el = document.createElement('div');
    el.className = 'els-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(el);
    scrollToBottom();
    setTimeout(function () {
      el.remove();
      callback();
    }, delay || 650);
  }

  function addChips(chips) {
    var row = document.createElement('div');
    row.className = 'els-chip-row';
    chips.forEach(function (c) {
      var btn = document.createElement('button');
      btn.className = 'els-chip';
      btn.type = 'button';
      btn.textContent = c.label;
      btn.addEventListener('click', c.onClick);
      row.appendChild(btn);
    });
    body.appendChild(row);
    scrollToBottom();
    return row;
  }

  function openWidget() {
    widget.classList.add('els-open');
    sessionStorage.setItem('elsChatAutoShown', '1');
    if (!greeted) {
      greeted = true;
      showTyping(function () {
        addBotMessage(greetingWord() + ' 👋, ik sta je graag te woord. Kan ik je ergens mee helpen?');
        addChips([
          { label: '💶 Wat kost een sloep huren?', onClick: showPriceInfo },
          { label: '📅 Is er een sloep beschikbaar?', onClick: showAvailabilityInfo }
        ]);
      }, 500);
    }
    input.focus();
  }

  function closeWidget() {
    widget.classList.remove('els-open');
  }

  function showPriceInfo() {
    addUserMessage('Wat kost een sloep huren?');
    showTyping(function () {
      addBotMessage('Onze actuele prijzen en pakketten vind je hier: <a class="els-link-btn" target="_blank" rel="noopener" href="' + CONFIG.priceUrl + '">Bekijk prijzen →</a>');
    });
  }

  function showAvailabilityInfo() {
    addUserMessage('Is er een sloep beschikbaar?');
    showTyping(function () {
      addBotMessage('Check hier direct onze actuele beschikbaarheid en boek je sloep: <a class="els-link-btn" target="_blank" rel="noopener" href="' + CONFIG.availabilityUrl + '">Bekijk beschikbaarheid →</a>');
    });
  }

  function detectKeywordReply(text) {
    var t = text.toLowerCase();
    var priceWords = ['prijs', 'prijzen', 'kost', 'kosten', 'tarief', 'tarieven', 'euro', '€'];
    var availWords = ['beschikbaar', 'beschikbaarheid', 'vrij', 'agenda', 'boeken', 'reserveren', 'datum', 'wanneer'];
    if (priceWords.some(function (w) { return t.indexOf(w) !== -1; })) {
      return 'Tip: onze actuele prijzen vind je hier: <a class="els-link-btn" target="_blank" rel="noopener" href="' + CONFIG.priceUrl + '">Bekijk prijzen →</a>';
    }
    if (availWords.some(function (w) { return t.indexOf(w) !== -1; })) {
      return 'Tip: check de actuele beschikbaarheid direct hier: <a class="els-link-btn" target="_blank" rel="noopener" href="' + CONFIG.availabilityUrl + '">Bekijk beschikbaarheid →</a>';
    }
    return null;
  }

  function buildWaLink(message) {
    var text = 'Bericht via website chat (' + CONFIG.agentName + '):\n' + message;
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text);
  }

  function offerContactChoice(userMessage) {
    var row = document.createElement('div');
    row.className = 'els-action-row';

    var waBtn = document.createElement('a');
    waBtn.className = 'els-action-btn els-action-wa';
    waBtn.href = buildWaLink(userMessage);
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.innerHTML = '📱 Via WhatsApp';

    var mailBtn = document.createElement('button');
    mailBtn.className = 'els-action-btn els-action-mail';
    mailBtn.type = 'button';
    mailBtn.innerHTML = '✉️ Via e-mail';
    mailBtn.addEventListener('click', function () {
      row.remove();
      showMailForm(userMessage);
    });

    row.appendChild(waBtn);
    row.appendChild(mailBtn);
    body.appendChild(row);
    scrollToBottom();
  }

  function showMailForm(userMessage) {
    var wrap = document.createElement('div');
    wrap.id = 'els-mail-form';
    wrap.innerHTML =
      '<input type="email" id="els-mail-input" placeholder="Jouw e-mailadres, voor een reactie" required />' +
      '<button type="button" id="els-mail-submit">Verstuur naar info@elfstedensloep.nl</button>';
    body.appendChild(wrap);
    scrollToBottom();

    document.getElementById('els-mail-submit').addEventListener('click', function () {
      var emailInput = document.getElementById('els-mail-input');
      var email = emailInput.value.trim();
      if (!email || email.indexOf('@') === -1) {
        emailInput.style.borderColor = '#e0554f';
        emailInput.focus();
        return;
      }
      sendViaWeb3Forms(email, userMessage, wrap);
    });
  }

  function sendViaWeb3Forms(fromEmail, message, formEl) {
    var submitBtn = document.getElementById('els-mail-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen...';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: CONFIG.web3formsKey,
        subject: 'Nieuw bericht via chatwidget - Elfstedensloep',
        from_name: 'Website chat (' + CONFIG.agentName + ')',
        email: fromEmail,
        message: message
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        formEl.remove();
        if (data.success) {
          addBotMessage('Bedankt! Je bericht is verstuurd naar info@elfstedensloep.nl. We reageren zo snel mogelijk.');
        } else {
          addBotMessage('Het versturen lukte helaas niet automatisch. Mail ons rechtstreeks: <a class="els-link-btn" href="mailto:info@elfstedensloep.nl">info@elfstedensloep.nl</a>');
        }
      })
      .catch(function () {
        formEl.remove();
        addBotMessage('Het versturen lukte helaas niet automatisch. Mail ons rechtstreeks: <a class="els-link-btn" href="mailto:info@elfstedensloep.nl">info@elfstedensloep.nl</a>');
      });
  }

  function handleUserSend() {
    var text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';

    var tip = detectKeywordReply(text);

    showTyping(function () {
      if (tip) addBotMessage(tip);
      addBotMessage('Bedankt voor je bericht! Hoe wil je dat we contact opnemen?');
      offerContactChoice(text);
    }, 550);
  }

  /* ---------------- events ---------------- */
  bubble.addEventListener('click', openWidget);
  minimizeBtn.addEventListener('click', closeWidget);
  sendBtn.addEventListener('click', handleUserSend);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleUserSend();
  });

  /* ---------------- automatische pop-up na 5 sec ---------------- */
  setTimeout(function () {
    if (!sessionStorage.getItem('elsChatAutoShown')) {
      openWidget();
    }
  }, CONFIG.popupDelayMs);
})();
