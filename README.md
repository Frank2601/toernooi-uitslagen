# Toernooi-uitslagen

Een eigen website voor je tennistoernooi, met het programma en de uitslagen. Er horen ook tv-schermen bij voor in de kantine. De uitslagen komen vanzelf uit MijnKNLTB. Je hoeft niets over te typen.

**Wat je krijgt**

| Pagina | Waarvoor |
|---|---|
| `index.html` | Voor bezoekers op telefoon en computer. Ze zien het programma en de uitslagen per dag en kunnen zoeken op naam. |
| `scherm.html` | Voor de tv in de kantine. Toont de poulewedstrijden van vandaag en de finaleschema's (kwartfinale, halve finale en finale), met welke banen bezet en vrij zijn. Op de laatste 2 dagen krijgt het scherm een gouden finalestijl. |
| `scherm-dag.html` | Voor de tv in de kantine. Toont alle wedstrijden van vandaag in één lijst, met welke banen bezet en vrij zijn. |

Het voorbeeld in deze repository gebruikt verzonnen namen.

**Wat je nodig hebt**

- Een gratis account op [github.com](https://github.com).
- De wedstrijdleider moet in MijnKNLTB bij het toernooi kunnen.
- Een Windows-laptop met internet. Die laptop staat tijdens het toernooi aan bij de wedstrijdleiding.

Hiervoor hoef je niet te kunnen programmeren. Je doet alles via de website van GitHub en met Kladblok.

---

## Stap 1: Je eigen kopie maken (5 minuten)

1. Log in op GitHub.
2. Klik bovenaan deze pagina op de groene knop **Use this template** en kies **Create a new repository**.
3. Bij *Repository name* vul je een korte naam in zonder spaties, bijvoorbeeld `clubtoernooi`.
4. Kies **Public** en klik op **Create repository**.

## Stap 2: De website aanzetten

1. Klik in je nieuwe repository op **Settings** (tandwiel, bovenaan).
2. Kies links **Pages**.
3. Bij *Branch* kies je **main** en daarnaast **/ (root)**. Klik op **Save**.
4. Wacht een of twee minuten en ververs de pagina. Bovenaan staat dan het adres van je site, bijvoorbeeld `https://jouwnaam.github.io/clubtoernooi/`.

Je ziet nu de voorbeeldsite met verzonnen wedstrijden.

## Stap 3: Je eigen naam, logo en kleuren

1. Klik in je repository op het bestand **config.js** en daarna op het **potloodje** (rechtsboven).
2. Pas de regels tussen de aanhalingstekens aan:

| Instelling | Wat het doet | Voorbeeld |
|---|---|---|
| `NAAM` | Naam van het toernooi | `"Clubkampioenschappen 2027"` |
| `CLUB` | Naam van je vereniging. Onderaan staat dan "Een website van …". | `"TV De Kaatsbal"` |
| `LOGO` | Bestandsnaam van je logo (zie hieronder) | `"logo.png"` |
| `KLEUR` | Hoofdkleur van je club (kopbalk, knoppen) | `"#c0392b"` |
| `ACCENT` | Kleur voor de finaledagen op het tv-scherm | `"#e3b54d"` (goud) |
| `FINALE_STIJL` | Wanneer het tv-scherm de finalestijl krijgt: `"auto"` op de laatste 2 dagen, `"aan"` altijd, `"uit"` nooit | `"auto"` |
| `LAATSTE_DAG` | Laatste dag van het toernooi. Vul dit in voor de juiste finaledagen. | `"15-11-2027"` |
| `SCHERM_TITEL` | Ondertitel op de tv tijdens de finaledagen | `"🏆 Finaleweekend"` |
| `BANEN` | Aantal banen van je club | `6` |
| `NAMEN` | Een naam anders tonen dan in MijnKNLTB, voor de grap of voor privacy | `"Jan Jansen": "Kampioen Jan"` |

3. Klik op **Commit changes**.

**Logo toevoegen:** klik in je repository op **Add file → Upload files** en sleep je logo erin. Een `.png`- of `.svg`-bestand werkt het best. Klik op **Commit changes** en vul de bestandsnaam in bij `LOGO`.

Kleurcodes vind je bijvoorbeeld door in Google op "color picker" te zoeken.

Het kan tot 10 minuten duren voordat iedereen een wijziging ziet. Wil je het meteen zien, ververs de pagina dan met Ctrl+F5.

## Stap 4: De uitslagen automatisch laten bijwerken

Een klein programma, de **uitslagen-sync**, leest elke 6 minuten de wedstrijden uit MijnKNLTB en zet ze op je website. Het draait op de laptop van de wedstrijdleiding.

1. Klik in je repository op de groene knop **Code → Download ZIP** en pak het zip-bestand uit.
2. Zet de map `uitslagen-sync` op de laptop van de wedstrijdleiding.
3. Volg daarna de stappen in [`uitslagen-sync/LEESMIJ.txt`](uitslagen-sync/LEESMIJ.txt):
   - Dubbelklik op **INSTALLEER.bat**. Dit hoeft maar één keer.
   - Maak een GitHub-sleutel aan. De stappen staan in de LEESMIJ.
   - Vul in Kladblok het bestand **instellingen.json** in: de link naar je toernooi in MijnKNLTB, je repository en de sleutel.
   - Dubbelklik op **START.bat**. Log de eerste keer in op MijnKNLTB in het Edge-venster dat opengaat.

De eerste keer haalt de sync alle wedstrijden op. Daarmee verdwijnen de verzonnen voorbeeldwedstrijden vanzelf.

**Eerst proberen zonder GitHub-sleutel?** Laat `repo` en `token` in instellingen.json leeg. De sync draait dan in teststand en zet de wedstrijden alleen in `wedstrijden.csv` op de laptop.

## Stap 5: De tv in de kantine

Open op de tv (of de computer die eraan hangt) het adres van je site met `scherm.html` erachter:

```
https://jouwnaam.github.io/clubtoernooi/scherm.html
```

Klik één keer op het scherm voor schermvullend. Het scherm wisselt vanzelf van pagina en haalt elke minuut nieuwe uitslagen op. Elk uur herlaadt het zichzelf, zodat het altijd de nieuwste versie toont.

Handige toevoegingen aan het adres:

| Toevoeging | Wat het doet |
|---|---|
| `?sec=30` | Elke pagina 30 seconden tonen (standaard 20) |
| `?finale=aan` of `?finale=uit` | De finalestijl even aan- of uitzetten, om te bekijken hoe het eruitziet |
| `?demo` | Een voorbeeld met verzonnen uitslagen, om te zien hoe het finaleweekend eruitziet |
| `scherm-dag.html?rijen=8` | Aantal wedstrijden per pagina op het dagoverzicht |

Wil je meerdere opties tegelijk, zet dan `&` ertussen, bijvoorbeeld `scherm.html?sec=30&finale=aan`.

---

## Goed om te weten

- **Privacy:** de site toont de namen en uitslagen zoals ze in MijnKNLTB staan. Wil iemand er niet op? Geef die persoon via `NAMEN` in config.js een andere naam.
- **Bewaar de GitHub-sleutel goed.** Wie de sleutel heeft, kan je website aanpassen. Zet `instellingen.json` nooit op GitHub en deel hem niet. Laat de sleutel kort na het toernooi verlopen.
- **Laat de sync maar op één laptop tegelijk draaien.**
- **De sync stopt?** Sluit beide vensters en dubbelklik opnieuw op START.bat.
- **Na het toernooi** blijft de site gewoon staan met alle uitslagen. Voor een volgend toernooi maak je een nieuwe kopie (stap 1), of je past `NAAM` aan en laat de sync een nieuw toernooi ophalen.
