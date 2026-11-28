/**
 * Captcha (Cloudflare Turnstile) für Anmeldung, Registrierung und „Passwort vergessen“. Das Ergebnis (Token) prüft
 * Supabase, sobald dort „Captcha protection“ an ist – vorher wird es einfach ignoriert.
 * Genutzt von: captcha/ (eingebettet in die App), konto-loeschen/, admin/.
 *
 *   const captcha = gfCaptcha(element, { sprache: 'de' });
 *   const captchaToken = await captcha.token();   // wartet, bis die Prüfung durch ist
 *   … supabase.auth.signInWithPassword({ email, password, options: { captchaToken } }) …
 *   captcha.neu();                                 // jedes Token gilt nur einmal
 */
(function () {
  // öffentlicher Site Key (Cloudflare → Turnstile → Widget „Game Fever“); der Secret Key liegt nur in Supabase
  var SITE_KEY = '0x4AAAAAAGW5GvKQvKl9J-U8';
  var WARTEZEIT = 30000;
  var geladen = null;

  function laden() {
    if (!geladen) {
      geladen = new Promise(function (ok, nein) {
        var s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.onload = ok;
        s.onerror = nein;
        document.head.appendChild(s);
      });
    }
    return geladen;
  }

  window.gfCaptcha = function (element, optionen) {
    var o = optionen || {};
    var token = null;
    var id = null;
    var wartende = [];

    laden().then(
      function () {
        id = window.turnstile.render(element, {
          sitekey: SITE_KEY,
          language: o.sprache || 'auto',
          theme: o.thema || 'auto',
          size: 'flexible',
          callback: function (t) {
            token = t;
            wartende.splice(0).forEach(function (f) { f(t); });
            if (o.onToken) o.onToken(t);
          },
          'expired-callback': function () {
            token = null;
            if (o.onAbgelaufen) o.onAbgelaufen();
          },
          'error-callback': function () {
            token = null;
            if (o.onFehler) o.onFehler();
          },
        });
      },
      function () { if (o.onFehler) o.onFehler(); }
    );

    return {
      /** Token der Prüfung; wartet bis zu 30 s, danach Fehler */
      token: function () {
        if (token) return Promise.resolve(token);
        return new Promise(function (ok, nein) {
          wartende.push(ok);
          setTimeout(function () { nein(new Error('captcha')); }, WARTEZEIT);
        });
      },
      /** nach jedem Versuch: neues Token anfordern */
      neu: function () {
        token = null;
        if (id !== null) window.turnstile.reset(id);
      },
    };
  };
})();
