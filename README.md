# gamefever-homepage

Homepage von Game Fever: The Game Night Planner – www.gamefeverapp.de (GitHub Pages)
## Links in die App

- `abend/?id=<Event-ID>` – geteilter Spieleabend. Mit installierter App öffnen iPhone/Android direkt die App.
- `.well-known/apple-app-site-association` (iPhone) und `.well-known/assetlinks.json` (Android) erlauben das.
  Android: Fingerabdruck des EAS-Signierschlüssels ist eingetragen (28.11.); mit dem Play Store kommt der Fingerabdruck
  von Googles App-Signaturschlüssel dazu (Play Console → App-Integrität). iPhone: **Platzhalter** `TEAMID`
  (Apple-Team-ID aus developer.apple.com).
- `.well-known` wird über `_config.yml` (`include`) mit veröffentlicht.

## Gemeinsame Bausteine (Jekyll)

GitHub Pages baut die Seite mit Jekyll. Genutzt wird das nur für Teile, die auf mehreren Seiten gleich sind:
`_includes/fuss-links.html` (Links im Fuß) und `_includes/fuss-copy.html` (© -Zeile), eingebunden mit
`{% include fuss-links.html sprache="de|en|auto" %}`. Seiten mit Bausteinen beginnen mit einem leeren Kopf (`---` / `---`).
`auto` = Seite übersetzt sich per JavaScript (`sprache.js` tauscht `data-text-en`/`data-href-en`). Lokal prüfen:
`gem install jekyll -v '~> 3.10'`, dann `jekyll build` (Ergebnis in `_site/`) oder `jekyll serve`.
