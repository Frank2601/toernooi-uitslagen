# Toernooi-uitslagen

Een eenvoudige website met het programma en de uitslagen van een KNLTB-toernooi,
plus twee tv-schermen voor in de kantine. De uitslagen komen automatisch uit MijnKNLTB.

| Pagina | Voor wie |
|---|---|
| `index.html` | Bezoekers (telefoon/computer): programma en uitslagen per dag, zoeken op naam |
| `scherm.html` | Tv in de kantine: finaleschema's (kwart/halve/finale) en de poulewedstrijden van vandaag |
| `scherm-dag.html` | Tv in de kantine: alle wedstrijden van vandaag, met de banen die bezig/vrij zijn |

Handige opties voor de tv: `scherm.html?demo` (voorbeeld met verzonnen uitslagen),
`?sec=20` (seconden per pagina), `scherm-dag.html?rijen=6`.

## Zelf gebruiken voor jouw toernooi

1. **Eigen kopie maken.** Klik op GitHub op *Use this template* → *Create a new repository*.
   Kies een naam (bijv. `clubtoernooi-2027`) en maak hem **Public**.
2. **Website aanzetten.** In je nieuwe repository: *Settings → Pages → Branch: main / (root) → Save*.
   Na een minuut staat de site op `https://<jouw-account>.github.io/<repository>/`.
3. **Instellen.** Pas `config.js` aan (direct op GitHub kan: potloodje → *Commit changes*):
   toernooinaam, clubnaam, kleuren, aantal banen. Upload je clublogo en zet de bestandsnaam bij `LOGO`.
4. **Uitslagen-sync.** Download deze repository als zip (*Code → Download ZIP*) en zet de map
   `uitslagen-sync` op de laptop van de wedstrijdleiding. Volg `uitslagen-sync/LEESMIJ.txt`.
5. **Tv.** Open `https://<jouw-account>.github.io/<repository>/scherm.html` op de tv en klik één keer
   voor schermvullend.

De sync leest MijnKNLTB met de eigen inlog van de wedstrijdleider en schrijft `wedstrijden.csv`
in de repository. De site ververst elke minuut; tv-schermen herladen zichzelf elk uur.

Na een wijziging in `config.js` kan het tot 10 minuten duren voor bezoekers het zien (cache van GitHub Pages).
