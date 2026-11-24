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
      if (t.seitenTitel) document.title = t.seitenTitel;
      // Umschalter zur jeweils anderen Sprache
      document.querySelectorAll('[data-sprachwechsel]').forEach(function (el) {
        var andere = window.SPRACHE === 'de' ? 'en' : 'de';
        el.textContent = andere === 'de' ? 'Deutsch' : 'English';
        var p = new URLSearchParams(window.location.search);
        p.set('lang', andere);
        el.setAttribute('href', window.location.pathname + '?' + p.toString() + window.location.hash);
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fuellen);
    else fuellen();
    return L;
  };
})();
