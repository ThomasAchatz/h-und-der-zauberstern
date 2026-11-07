# Hannah und der Zauberstern

Ein kleines Browser-Spiel für Hannah (8): Mit der Fee Mina und ihrem Pferd Cheyenne
sucht sie die fünf Sternstücke des zerbrochenen Zauberstern. Läuft auf dem Handy im
Browser, ohne Installation und ohne Anmeldung. Der Spielstand bleibt lokal im Gerät.

## Stand

- Titelbild, Einleitung mit Mina, Weltkarte mit fünf Etappen
- Level 1 (Bauernhof): Suchbild, Stall ausmisten, Cheyenne nachzeichnen und ausmalen (15 Bereiche, 16 Farben)
- Level 2 (Europapark): Mama und Michael im Gewimmel nach Hinweisen finden, zwei Achterbahnen nachzeichnen und mitfahren, 5 Unterschiede am Karussell
- Level 3 (Zauber-Schule, 2. Klasse Volksschule Österreich): 8 Zaubertränke mit Plus und Minus bis 100 (mit und ohne Zehnerübergang, Ergänzen), 6 Zauberkugeln als erste Malrechnungen mit Bildern, Zauberladen mit Euro und Cent. Aufgaben werden bei jedem Spiel neu gewürfelt.
- Level 4 (Backwelt): Teig nach Rezept (Zutaten zählen, Gurke und Zwiebel gehören nicht hinein) und im Kreis rühren, Ofenuhr mit vollen und halben Stunden und einer Zeitspanne, Torte mit Obst-Mustern und frei verzieren
- Level 5 (Fee-Schloss): zwei zufällige Heckenlabyrinthe, Memory mit Motiven der Reise, Zauberstern-Puzzle aus den fünf Sternstücken, Finale mit Feuerwerk und Urkunde für Hannah
- Auf dem Startbildschirm setzt „Neu beginnen“ (mit Rückfrage) den Spielstand zurück
- Zum Testen schaltet `?alle` am Ende der Adresse alle fertigen Level frei

## Lokal testen

```
python3 -m http.server 8000
```

Dann `http://localhost:8000` am Handy-Format im Browser öffnen.

## Aufbau

- `index.html`: Einstieg
- `css/style.css`: Gestaltung
- `js/art.js`: alle Grafiken als SVG (Hannah, Mina, Cheyenne, Szenen)
- `js/app.js`: Navigation, Speicherstand, Titel, Einleitung, Karte, Sieg
- `js/level1.js` bis `js/level5.js`: die Aufgaben der Level
