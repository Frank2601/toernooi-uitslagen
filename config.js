// ==============================================================
//  INSTELLINGEN VAN JOUW TOERNOOI – alleen dit bestand aanpassen
// ==============================================================
window.TOERNOOI = {
  // Naam van het toernooi (bovenaan elke pagina)
  NAAM: "Voorbeeldtoernooi",

  // Naam van de vereniging ("Een website van …")
  CLUB: "Tennisvereniging Voorbeeld",

  // Logo van de vereniging: zet het bestand in deze map en vul de bestandsnaam in.
  // Leeg ("") = geen logo.
  LOGO: "logo.svg",

  // Clubkleuren (als #rrggbb). KLEUR: kopbalk en knoppen. ACCENT: titels en lijnen op het tv-scherm.
  KLEUR: "#2850a0",
  ACCENT: "#e3b54d",

  // Gouden finalestijl op het tv-scherm (scherm.html): randen, titels en ondertitel in goud/ACCENT.
  //   "auto" = alleen op de laatste 2 dagen van het toernooi, "aan" = altijd, "uit" = nooit
  FINALE_STIJL: "auto",

  // Tv-scherm op de finaledag: per onderdeel de halve finales klein met de finale groot erachter.
  //   "auto" = alleen op de laatste toernooidag, "aan" = altijd, "uit" = nooit (dan de gewone schema's)
  FINALEDAG_SCHERM: "auto",

  // Laatste dag van het toernooi (dd-mm-jjjj), voor FINALE_STIJL en FINALEDAG_SCHERM "auto".
  // Leeg = de laatste dag die in het programma staat.
  LAATSTE_DAG: "",

  // Ondertitel op het tv-scherm tijdens de finaledagen (op andere dagen staat daar de clubnaam)
  SCHERM_TITEL: "🏆 Finaleweekend",

  // Aantal banen. Op het tv-scherm staat de eerste helft links, de tweede helft rechts.
  BANEN: 4,

  // Namen die op de site anders getoond worden: "naam in MijnKNLTB": "naam op de site"
  NAMEN: {
    // "Jan Jansen": "Kampioen Jan \u{1F389}",
  },

  // Leeg laten: de site gebruikt wedstrijden.csv, die uitslagen-sync automatisch bijhoudt.
  CSV_URL: "",
};
