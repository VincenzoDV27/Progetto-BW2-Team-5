import { fetchJSON } from "./api.js";
import { Track, Album, Artist, Player } from "./models.js";
import { myPreferit, renderCard } from "./cards.js";
import { player, updatePlayer } from "./player.js";

const API_BASE = "https://itunes.apple.com";
const inputUser = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const gridTracks = document.querySelector("#grid-tracks");
const gridAlbums = document.querySelector("#grid-albums");
const gridArtists = document.querySelector("#grid-artists");

//array per i brani della ricerca
let tracksFound = [];

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

if (searchButton && inputUser) {
  searchButton.addEventListener("click", (e) => {
    e.preventDefault();

    const term = inputUser.value.trim();

    if (!term) return;

    searchAll(term);
  });

  inputUser.addEventListener("input", () => {
    clearTimeout(timerSearch);

    const query = inputUser.value.trim();

    if (!query) return;

    timerSearch = setTimeout(() => {
      searchAll(query);
    }, 400);
  });
}

export function debounce(fn, delay = 400) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

const searchAll = async (term) => {
  const [tracks, albums, artists] = await Promise.allSettled([
    searchTracks(term),
    searchAlbums(term),
    searchArtists(term),
  ]);

  const arrayTrack = tracks.status === "fulfilled" ? tracks.value : [];
  const arrayAlbum = albums.status === "fulfilled" ? albums.value : [];
  const arrayArtist = artists.status === "fulfilled" ? artists.value : [];

  //salvo i brani
  tracksFound = arrayTrack;

  gridTracks.hidden = arrayTrack.length === 0;
  gridAlbums.hidden = arrayAlbum.length === 0;
  gridArtists.hidden = arrayArtist.length === 0;

  gridTracks.closest("section").hidden = arrayTrack.length === 0;
  gridAlbums.closest("section").hidden = arrayAlbum.length === 0;
  gridArtists.closest("section").hidden = arrayArtist.length === 0;

  renderCard(arrayTrack, gridTracks);
  renderCard(arrayAlbum, gridAlbums);
  renderCard(arrayArtist, gridArtists);
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

  // SELEZIONO IL BRANO
  player.select(track);

  // AGGIORNO IL PLAYER
  updatePlayer(track);
});
