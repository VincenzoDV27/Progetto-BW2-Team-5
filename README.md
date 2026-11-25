# EpiTunes

![Home di EpiTunes](docs/index.png)

🔗 **Demo online:** [EpiTunes su GitHub Pages](INSERISCI-QUI-IL-LINK)

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

---

## ✨ Funzionalità del progetto

- [x] Layout con sidebar, contenuto centrale e player inferiore.
- [x] Navigazione tra le pagine.
- [x] Riproduzione delle anteprime audio (30 secondi).
- [x] Play e pausa.
- [x] Barra di avanzamento audio.
- [x] Controllo volume.
- [x] Cronologia dei brani riprodotti.
- [x] Sistema dei preferiti.
- [x] Salvataggio dei preferiti in LocalStorage.
- [x] Salvataggio dell'ultima ricerca.
- [x] Utilizzo della iTunes Search API.
- [x] Classi OOP `Track`, `Album`, `Artist`, `Player`.

---

## 🚀 Come avviare il progetto in locale

Il progetto usa gli ES Modules (`<script type="module">`), quindi **non funziona aprendo direttamente il file HTML** con doppio clic: serve un server locale.

1. Clona la repository:

```bash
git clone <url-della-repo>
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

- **[style.css](assets/css/style.css)**: stile globale dell'applicazione.
  | Home | Cerca |
  |------|-------|
  | ![Schermata Home](docs/index.png) | ![Schermata Ricerca](docs/search.png) |

### I file JavaScript

La logica è organizzata in moduli ES, che esportano e importano le funzioni tra i vari file.

- **[index.js](assets/js/index.js)**: logica della Home (recenti, preferiti, suggerimenti per genere).
- **[api.js](assets/js/api.js)**: funzioni di chiamata alla iTunes Search API.
- **[models.js](assets/js/models.js)**: definizione delle classi `Track`, `Album`, `Artist`.
- **[album.js](assets/js/album.js)**: logica della pagina Album (dettagli e tracklist).
- **[artist.js](assets/js/artist.js)**: logica della pagina Artista (info e top track).
- **[player.js](assets/js/player.js)**: classe `Player` e gestione della riproduzione audio.
- **[cards.js](assets/js/cards.js)**: funzioni helper per creare e mostrare le card.
- **[search.js](assets/js/search.js)**: ricerca sull'API con debounce di 400 ms.
