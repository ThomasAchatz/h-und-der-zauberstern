# Hanna und der Zauberstern

Ein kleines Browser-Spiel für Hanna (8): Mit der Fee Mina und ihrem Pferd Cheyenne
sucht sie die fünf Sternstücke des zerbrochenen Zauberstern. Läuft auf dem Handy im
Browser, ohne Installation und ohne Anmeldung. Der Spielstand bleibt lokal im Gerät.

## Stand

- Titelbild, Einleitung mit Mina, Weltkarte mit fünf Etappen
- Level 1 (Bauernhof): Suchbild, Stall ausmisten, Cheyenne nachzeichnen und ausmalen
- Level 2 bis 5 (Europapark, Zauber-Schule mit Rechenaufgaben, Backwelt, Fee-Schloss) folgen

## Lokal testen

```
python3 -m http.server 8000
```

Dann `http://localhost:8000` am Handy-Format im Browser öffnen.

## Aufbau

- `index.html`: Einstieg
- `css/style.css`: Gestaltung
- `js/art.js`: alle Grafiken als SVG (Hanna, Mina, Cheyenne, Szenen)
- `js/app.js`: Navigation, Speicherstand, Titel, Einleitung, Karte, Sieg
- `js/level1.js`: die drei Aufgaben von Level 1
