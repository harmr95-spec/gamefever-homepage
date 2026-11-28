# gamefever-homepage

Homepage von Game Fever: The Game Night Planner – www.gamefeverapp.de (GitHub Pages)
## Links in die App

- `abend/?id=<Event-ID>` – geteilter Spieleabend. Mit installierter App öffnen iPhone/Android direkt die App.
- `.well-known/apple-app-site-association` (iPhone) und `.well-known/assetlinks.json` (Android) erlauben das.
  **Platzhalter:** `TEAMID` (Apple-Team-ID aus developer.apple.com) und der SHA-256-Fingerabdruck des Android-
  Signierschlüssels (Play Console → App-Integrität bzw. `eas credentials`). Erst mit dem ersten Store-Build nötig.
- `.nojekyll`: GitHub Pages veröffentlicht die Seite unverändert, auch den Ordner `.well-known`.
