# EpiTunes

![Home di EpiTunes](docs/index.png)

🔗 **Demo online:** [EpiTunes su GitHub Pages](https://vincenzodv27.github.io/Progetto-BW2-Team-5/)

Progetto della **Build Week 2 di EPICODE**, realizzato dal **Team 5** (23–27 novembre 2026).

---

## 📖 Descrizione del progetto

Progetto didattico che riproduce l'esperienza di una piattaforma di streaming musicale in stile Spotify, utilizzando i dati della [iTunes Search API](https://performance-partners.apple.com/search-api).

> ℹ️ L'API di iTunes fornisce solo **anteprime audio di 30 secondi**: i brani riprodotti nell'app sono quindi delle preview, non le tracce complete.

---

## 🛠️ Tecnologie utilizzate

- HTML5
- CSS3
- JavaScript Vanilla (ES Modules)
- Bootstrap
- iTunes Search API
- LocalStorage

### Scelte tecniche

- Chiamate all'API centralizzate in una funzione `fetchJSON` con `try/catch` e richieste parallele con `Promise.all`.
- Card create con `createElement` (niente `innerHTML`).
- Event delegation sulle griglie dei risultati (niente `onclick` inline).
- Ricerca con debounce di 400 ms per non chiamare l'API a ogni tasto.

---

## ✨ Funzionalità del progetto

### Funzionalità principali

- [x] Layout con sidebar, contenuto centrale e player inferiore nelle 4 pagine.
- [x] Navigazione tra le pagine.
- [x] Classi OOP `Track`, `Album`, `Artist`, `Player`.
- [x] Utilizzo della iTunes Search API.
- [x] Riproduzione delle anteprime audio (30 secondi).
- [x] Play e pausa.
- [x] Barra di avanzamento audio.
- [x] Controllo volume.
- [x] Ricerca con debounce e risultati divisi in brani, album e artisti.
- [x] Salvataggio dell'ultima ricerca.
- [x] Pagina Album: copertina, info, tracklist e link all'artista.
- [x] Pagina Artista: info e top track.
- [x] Sistema dei preferiti salvato in LocalStorage.
- [x] Cronologia dei brani riprodotti.
- [x] Home: riprodotti di recente, preferiti e suggerimenti per genere.
- [x] Gestione errori: input vuoto, nessun risultato trovato, pulsante "riprova".
- [x] Gestione errori: messaggio di errore in caso di mancata risposta dell'API.
- [x] Test dei limiti della ricerca sull'API.
- [x] Layout responsive e pubblicazione su GitHub Pages.

### Extra realizzati

- [x] Filtri artista / album / brano nella ricerca.
- [x] Modale a tutto schermo al click della card.
- [x] Pulsante play direttamente sulle card.
- [x] "I brani che ti piacciono" raccolti in un unico array.
- [x] Sezione "Album che ti piacciono".

---

## 🚀 Come avviare il progetto in locale

Il progetto usa gli ES Modules (`<script type="module">`), quindi **non funziona aprendo direttamente il file HTML** con doppio clic: serve un server locale.

1. Clona la repository:

```bash
git clone https://github.com/VincenzoDV27/Progetto-BW2-Team-5.git
```

2. Apri la cartella con VS Code.
3. Avvia `index.html` con l'estensione **Live Server**.

---

## 📁 Struttura del progetto

### Le 4 pagine HTML

#### Layout comune

Tutte le pagine condividono lo stesso contenitore `app`:

```html
<body>
  <div class="app">
    <aside class="sidebar"></aside>
    <main class="main">
      <header class="topbar">
        <div class="topbar-nav">
          <button class="nav-btn">‹</button>
          <button class="nav-btn">›</button>
          <a class="nav-btn mobile-only" href="index.html">🏠 🔍</a>
        </div>
        <div class="user-pill">Studente Epicode</div>
      </header>
      <!-- contenuto della pagina -->
    </main>
    <footer class="player"></footer>
  </div>
  <audio id="audio-element"></audio>
  <script type="module" src="..."></script>
</body>
```

#### 🏠 [Home](index.html)

```html
<section class="home"></section>
```

- Riprodotti di recente.
- I tuoi preferiti.
- Suggerimenti musicali per genere.

#### 🔍 [Cerca](search.html)

```html
<section class="search">
  <div class="search-box">
    <input
      id="search-input"
      placeholder="Cerca un brano, un album, un artista..."
    />
    <p id="last-search">Ultima ricerca:</p>
  </div>
  <div class="search-results">
    <section class="row" id="row-tracks" hidden>
      <h2>Brani</h2>
      <div class="grid" id="grid-tracks"></div>
    </section>
    <section class="row" id="row-albums" hidden>
      <h2>Album</h2>
      <div class="grid" id="grid-albums"></div>
    </section>
    <section class="row" id="row-artists" hidden>
      <h2>Artisti</h2>
      <div class="grid" id="grid-artists"></div>
    </section>
    <p id="search-empty">Nessun risultato</p>
  </div>
</section>
```

- Input di ricerca con debounce di 400 ms.
- Risultati divisi in brani, album e artisti.

#### 💿 [Album](album.html)

```html
<section class="album-page">
  <div class="album-hero" id="album-hero"></div>
  <div class="hero-actions" id="album-actions"></div>
  <div class="tracklist" id="tracklist"></div>
</section>
```

- Copertina e informazioni dell'album.
- Tracklist dei brani.
- Collegamento alla pagina dell'artista.

#### 🎤 [Artista](artist.html)

```html
<section class="artist-page">
  <div class="artist-hero" id="artist-hero"></div>
  <div class="hero-actions" id="artist-actions"></div>
  <div class="top-tracks" id="top-tracks"></div>
</section>
```

- Informazioni sull'artista.
- Top track.

### I file CSS

- **[style.css](assets/css/style.css)**: stile globale dell'applicazione (colori, card, player).
  | Home | Cerca |
  |------|-------|
  | ![Schermata Home](docs/index.png) | ![Schermata Ricerca](docs/search.png) |

### I file JavaScript

La logica è organizzata in moduli ES, che esportano e importano le funzioni tra i vari file.

- **[index.js](assets/js/index.js)**: logica della Home (recenti, preferiti, suggerimenti per genere).
- **[api.js](assets/js/api.js)**: funzione `fetchJSON` con `try/catch` e chiamate alla iTunes Search API.
- **[models.js](assets/js/models.js)**: definizione delle classi `Track`, `Album`, `Artist`.
- **[album.js](assets/js/album.js)**: logica della pagina Album (dettagli e tracklist).
- **[artist.js](assets/js/artist.js)**: logica della pagina Artista (info e top track).
- **[player.js](assets/js/player.js)**: classe `Player` (play/pausa, barra di avanzamento, volume).
- **[cards.js](assets/js/cards.js)**: funzioni helper per creare le card con `createElement`.
- **[search.js](assets/js/search.js)**: ricerca sull'API con debounce di 400 ms ed event delegation sulle griglie.

---

## 🏷️ Versioni

### v2.1

- `api.js` con `fetchJSON` (`try/catch`), `searchTracks`, `searchAlbums`, `searchArtists`, `getAlbum` e `getArtist`.
- Classi `Track`, `Album`, `Artist` e `Player` base in `models.js`.
- `renderCard` con `createElement` per le card della Home.
- Bottone preferiti con salvataggio in LocalStorage.

### v3.1

- Pagina Cerca con input, debounce di 400 ms e risultati divisi in brani, album e artisti.
- Card generate con `createElement` e click gestiti con event delegation sulle griglie.
- Pagina Album con copertina, info, tracklist e link all'artista.
- `Player` con barra di avanzamento e volume.
- Home con riprodotti di recente, preferiti e suggerimenti per genere.
- Layout responsive e sito online su GitHub Pages.

### v3.2

- Risoluzione dei problemi con GitHub.

### v3.3

- Correzione di bug e sistemazione delle funzionalità.

### v4.1

- Pagina Artista con informazioni e top 15 brani.
- Riproduzione di album e artisti tramite coda musicale.
- Controlli per brano precedente e successivo, con passaggio automatico alla traccia seguente.
- Cronologia dei brani salvata in LocalStorage e mostrata nella Home.
- Aggiornamento della gestione del player e delle card musicali.

---

## 📅 Diario di sviluppo

### Giorno 0 · Lunedì 23 — Briefing

- Definiti il funzionamento dell'app e il flusso utente.
- Divisione dei compiti tra i 5 membri del team.
- Individuate le classi `Track`, `Album`, `Artist`, `Player` e i dati necessari.
- Creati la repo pubblica, le cartelle, i file vuoti e i branch.

### Giorno 1 · Martedì 24 — Layout, classi e API

- HTML statico con Bootstrap e layout sidebar / centro / player nelle 4 pagine.
- `style.css` con colori, card e player.
- Classi `Track`, `Album`, `Artist` in `models.js`.
- `fetchJSON` con `try/catch` e `Promise.all`; primi dati dell'API stampati in console.
- Classe `Player` con play e pausa.

### Giorno 2 · Mercoledì 25 — Ricerca, card e dettagli

- Ricerca con debounce di 400 ms.
- Card di brani, album e artisti con `createElement` ed event delegation.
- Pagine Album e Artista complete.
- Player con barra di avanzamento e volume.

### Giorno 3 · Giovedì 26 — LocalStorage, Home e chiusura lavori

- Preferiti salvati in LocalStorage e raccolti nell'array "I brani che ti piacciono".
- Sezione "Album che ti piacciono".
- Cronologia dei brani riprodotti e salvataggio dell'ultima ricerca.
- Home con riprodotti di recente, preferiti e generi.
- Gestione degli errori: input vuoto, nessun risultato, pulsante "riprova", API che non risponde.
- Extra: filtri nella ricerca, modale a tutto schermo e pulsante play sulle card.
- Test dei limiti della ricerca sull'API.
- Controllo del codice: niente `var`, `innerHTML` e `onclick`; console pulita.
- Layout responsive e pubblicazione su GitHub Pages.

### Giorno 4 · Venerdì 27 — Revisione e consegna

- Revisione finale del codice e consegna della repo.
- Esposizione del progetto.
