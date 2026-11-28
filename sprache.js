// Sprache der Website: ?lang=de|en (wird gemerkt) → gemerkte Wahl → Browsersprache (Deutsch, sonst Englisch).
// Die Seiten mit Funktion (confirm, reset-password, konto-loeschen) bleiben unter derselben Adresse, weil E-Mails und
// der Play Store darauf verlinken – sie übersetzen sich mit `texteFuer` selbst. Startseite und Rechtliches gibt es
// zusätzlich als eigene Seiten unter /en/.
(function () {
  var erlaubt = ['de', 'en'];
  var param = new URLSearchParams(window.location.search).get('lang');
  var gemerkt = null;
  try {
    if (erlaubt.indexOf(param) >= 0) localStorage.setItem('sprache', param);
    gemerkt = localStorage.getItem('sprache');
  } catch (e) {}
  var browser = ((navigator.languages && navigator.languages[0]) || navigator.language || 'de').toLowerCase();
  window.SPRACHE = erlaubt.indexOf(param) >= 0 ? param : erlaubt.indexOf(gemerkt) >= 0 ? gemerkt : browser.indexOf('de') === 0 ? 'de' : 'en';
  document.documentElement.lang = window.SPRACHE;

  /** Wahl merken (Umschalter) */
  window.spracheMerken = function (sprache) {
    try {
      localStorage.setItem('sprache', sprache);
    } catch (e) {}
  };

  /**
   * Sprachauswahl als Liste: <span data-sprachwahl data-de="…" data-en="…" data-aktuell="de"></span>
   * (ohne data-aktuell gilt die erkannte Sprache). Beim Wechsel wird die Wahl gemerkt und die Seite der Sprache geöffnet.
   */
  var NAMEN = { de: 'Deutsch', en: 'English' };
  var stil = document.createElement('style');
  stil.textContent =
    '.sprachwahl{display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:700;color:inherit}' +
    '.sprachwahl select{font:inherit;color:inherit;background:transparent;border:1.5px solid currentColor;border-radius:100px;' +
    'padding:5px 28px 5px 12px;cursor:pointer;appearance:none;-webkit-appearance:none;opacity:.85;' +
    'background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);' +
    'background-position:calc(100% - 15px) 55%,calc(100% - 10px) 55%;background-size:5px 5px;background-repeat:no-repeat}' +
    '.sprachwahl select:hover,.sprachwahl select:focus{opacity:1}.sprachwahl option{color:#111;background:#fff}';
  document.head.appendChild(stil);
  function sprachwahlBauen() {
    document.querySelectorAll('[data-sprachwahl]').forEach(function (el) {
      var aktuell = el.getAttribute('data-aktuell') || window.SPRACHE;
      var html = '<span aria-hidden="true">🌐</span><select aria-label="Sprache / Language">';
      erlaubt.forEach(function (sp) {
        html += '<option value="' + sp + '"' + (sp === aktuell ? ' selected' : '') + ' lang="' + sp + '">' + NAMEN[sp] + '</option>';
      });
      el.className = 'sprachwahl';
      el.innerHTML = html + '</select>';
      el.querySelector('select').addEventListener('change', function (e) {
        var sp = e.target.value;
        window.spracheMerken(sp);
        window.location.href = el.getAttribute('data-' + sp) + window.location.hash;
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sprachwahlBauen);
  else sprachwahlBauen();
  // Zurück-Taste des Browsers: Liste wieder auf die Sprache dieser Seite stellen
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('[data-sprachwahl] select').forEach(function (s) {
      s.value = s.parentNode.getAttribute('data-aktuell') || window.SPRACHE;
    });
  });

  /**
   * Übersetzungsfunktion für eine Seite: texte = { de: {...}, en: {...} }.
   * L('schluessel', { name: 'x' }) ersetzt {name}. Elemente mit data-t="schluessel" werden beim Laden gefüllt.
   */
  window.texteFuer = function (texte) {
    var t = texte[window.SPRACHE] || texte.de;
    var L = function (k, werte) {
      var s = t[k] != null ? t[k] : texte.de[k];
      if (s == null) return k;
      return s.replace(/\{(\w+)\}/g, function (_, n) {
        return werte && werte[n] != null ? werte[n] : '';
      });
    };
    var fuellen = function () {
      document.querySelectorAll('[data-t]').forEach(function (el) {
        el.innerHTML = L(el.getAttribute('data-t'));
      });
      document.querySelectorAll('[data-t-href]').forEach(function (el) {
        el.setAttribute('href', L(el.getAttribute('data-t-href')));
      });
      // Bausteine aus _includes/ (z. B. Fuß) tragen ihre englische Fassung selbst mit
      if (window.SPRACHE === 'en') {
        document.querySelectorAll('[data-text-en]').forEach(function (el) {
          el.textContent = el.getAttribute('data-text-en');
        });
        document.querySelectorAll('[data-href-en]').forEach(function (el) {
          el.setAttribute('href', el.getAttribute('data-href-en'));
        });
      }
      if (t.seitenTitel) document.title = t.seitenTitel;
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fuellen);
    else fuellen();
    return L;
  };
})();
