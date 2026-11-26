import { fetchJSON } from "./api.js";
import { Track, Album, Artist, Player } from "./models.js";
import { myPreferit, renderCard } from "./cards.js";
import { player, updatePlayer, addToHistory } from "./player.js";
import { renderAsideFavs } from "./cards.js";

const API_BASE = "https://itunes.apple.com";
const inputUser = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const gridTracks = document.querySelector("#grid-tracks");
const gridAlbums = document.querySelector("#grid-albums");
const gridArtists = document.querySelector("#grid-artists");
const searchSpinner = document.querySelectorAll(".search-spinner");
const mySections = document.querySelectorAll(".mysection");
const searchEmpty = document.querySelector("#search-empty");
const retryButton = document.querySelector("#retry-search");
const lastSearchBox = document.querySelector(".last-search");
const lastSearch = document.querySelector("#lastSearch");
const setLoading = (on) =>
  searchSpinner.forEach((s) => s.classList.toggle("d-none", !on));

//array per i brani della ricerca
let tracksFound = [];
renderAsideFavs();

/* ricerca generica, entity = canzone o album o artista */
const search = async (term, entity, limit) => {
  const url = `${API_BASE}/search?term=${encodeURIComponent(term)}&entity=${entity}&limit=${limit}`;
  const data = await fetchJSON(url);
  return data.results;
};

/* traccia */
export const searchTracks = async (term, limit = 12) => {
  const results = await search(term, "song", limit);
  return results
    .filter((data) => data.previewUrl)
    .map((data) => new Track(data));
};

/* album */
export const searchAlbums = async (term, limit = 12) => {
  const results = await search(term, "album", limit);
  return results.map((data) => new Album(data));
};

/* artisti */
export const searchArtists = async (term, limit = 12) => {
  const results = await search(term, "musicArtist", limit);
  return results.map((data) => new Artist(data));
};

/* GESTIONE EVENTI PAGINA SEARCH */
let timerSearch;

function gestisciRicerca(e) {
  if (e.type === "click" || e.key === "Enter") {
    e.preventDefault();

    const term = inputUser.value.trim();

    if (!term) return;

    searchAll(term);
    inputUser.blur(); // fa partire il salvataggio finché il testo c'è ancora
    clearInputUser();
  }
}

searchButton.addEventListener("click", gestisciRicerca);
inputUser.addEventListener("keydown", gestisciRicerca);

inputUser.addEventListener("input", () => {
  clearTimeout(timerSearch);

  const query = inputUser.value.trim();

  if (!query) {
    clearSearch();
    return;
  }
  timerSearch = setTimeout(() => {
    searchAll(query);
  }, 1000);
});

const CHIAVE_RICERCHE = "ricercheRecenti";

/* salva il termine in cima alla lista, togliendo un eventuale doppione */
function salvaRicerca(term) {
  const ricerche = JSON.parse(localStorage.getItem(CHIAVE_RICERCHE)) || [];

  const senzaDoppione = ricerche.filter(
    (r) => r.toLowerCase() !== term.toLowerCase(),
  );

  senzaDoppione.unshift(term); // la più recente va per prima

  localStorage.setItem(
    CHIAVE_RICERCHE,
    JSON.stringify(senzaDoppione.slice(0, 10)),
  );
  mostraUltimaRicerca();
}

function mostraUltimaRicerca() {
  const ricerche = JSON.parse(localStorage.getItem(CHIAVE_RICERCHE)) || [];

  if (ricerche.length === 0) {
    lastSearchBox.hidden = true;
    return;
  }

  lastSearch.textContent = ricerche[0];
  lastSearchBox.hidden = false;
}

lastSearch.addEventListener("click", () => {
  const term = lastSearch.textContent;

  if (!term) return;

  clearTimeout(timerSearch); // annullo una ricerca col timer eventualmente in attesa
  searchAll(term);
});

mostraUltimaRicerca(); // al caricamento della pagina

const searchAll = async (term) => {
  mySections.forEach((spinner) => (spinner.hidden = false));
  setLoading(true);
  try {
    const [tracks, albums, artists] = await Promise.allSettled([
      searchTracks(term),
      searchAlbums(term),
      searchArtists(term),
    ]);

    const arrayTrack = tracks.status === "fulfilled" ? tracks.value : [];
    const arrayAlbum = albums.status === "fulfilled" ? albums.value : [];
    const arrayArtist = artists.status === "fulfilled" ? artists.value : [];

    const noResults =
      arrayTrack.length === 0 &&
      arrayAlbum.length === 0 &&
      arrayArtist.length === 0;

    searchEmpty.hidden = !noResults;

    //salvo i brani
    tracksFound = arrayTrack;

    gridTracks.closest("section").hidden = arrayTrack.length === 0;
    gridAlbums.closest("section").hidden = arrayAlbum.length === 0;
    gridArtists.closest("section").hidden = arrayArtist.length === 0;

    renderCard(arrayTrack, gridTracks);
    renderCard(arrayAlbum, gridAlbums);
    renderCard(arrayArtist, gridArtists);
  } finally {
    setLoading(false);
  }
};

// EVENT DELEGATION sula griglia dei brani
gridTracks.addEventListener(`click`, (e) => {
  // ESCLUDO IL CLICK SUI PREFERITI
  if (e.target.closest(".btnPref, .btnPrefActive")) return;

  // INTERCETTO LA CARD
  const cardSelected = e.target.closest(".card-personal");

  if (!cardSelected) return;

  // RECUPERO L'ID DEL BRANO
  const cardSelectedId = Number(cardSelected.dataset.id);

  // CERCO IL BRANO NEI DATI DISPONIBILI
  const track = tracksFound.find((item) => item.trackId === cardSelectedId);

  if (!track) return;
  addToHistory(track);
  // SELEZIONO IL BRANO
  player.select(track);

  // AGGIORNO IL PLAYER
  updatePlayer(track);
});

function clearSearch() {
  clearTimeout(timerSearch); // annulla una ricerca che stava per partire
  setLoading(false);

  // svuoto le griglie
  gridTracks.textContent = "";
  gridAlbums.textContent = "";
  gridArtists.textContent = "";

  // nascondo le sezioni
  gridTracks.closest("section").hidden = true;
  gridAlbums.closest("section").hidden = true;
  gridArtists.closest("section").hidden = true;

  // NASCONDO IL MESSAGGIO DI NESSUN RISULTATO
  searchEmpty.hidden = true;

  // AZZERO I BRANI TROVATI
  tracksFound = [];
}

function clearInputUser() {
  inputUser.value = "";
}

retryButton.addEventListener("click", () => {
  inputUser.value = "";
  clearSearch();
  inputUser.focus();
});
