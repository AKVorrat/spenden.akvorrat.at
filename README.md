# About
Dieses Repository beinhaltet den Code, der auf unserer [Spendenseite](https://spenden.epicenter.works/) zum Einsatz kommt.

# Lokale Entwicklung
Die lokale Umgebung läuft mit [DDEV](https://ddev.com/):

```sh
cp .env.example .env   # ROOT_URL auf https://spenden-epicenter.ddev.site setzen, mPay24-Zugangsdaten eintragen
ddev start             # führt "composer install" aus und startet Hugo im Watch-Modus
ddev launch            # öffnet https://spenden-epicenter.ddev.site
```

Die Seiten werden mit [Hugo](https://gohugo.io/) als statisches HTML nach `public/` gebaut. `public/` wird nicht eingecheckt: In DDEV baut Hugo bei jeder Änderung automatisch neu, beim Deployment baut die GitHub Action.

| Was | Wo |
|---|---|
| Texte der Seiten (Einleitung, Danke, Fehler) | `content/*.de.md` |
| Beschriftungen, Buttons, Links pro Sprache | `i18n/de.toml` |
| HTML-Gerüst und Zahlungsauswahl | `layouts/` |
| Krypto-Adressen | `data/crypto.yaml` |
| CSS, JS, Bilder, `checkout.php`, `donations.json` | `static/` (wird unverändert nach `public/` kopiert) |

Die Hugo-Version ist in `.ddev/web-build/Dockerfile.hugo` und `.github/workflows/default.yaml` festgelegt und muss in beiden Dateien gleich sein.

# License
spenden.epicenter.works
Copyright (C) 2015-2018 epicenter.works

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

# Includes
- jQuery Core (C) jQuery Foundation, Inc. [MIT]
- Normalize.css (C) Nicolas Gallagher, Jonathan Neal [MIT]
- OpenSans (C) Steve Matteson [Apache]
- Raleway (C) Matt McInerney, Pablo Impallari, Rodrigo Fuenzalida [OFL]
- Slick (C) Ken Wheeler [MIT]
