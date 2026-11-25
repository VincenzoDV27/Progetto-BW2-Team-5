import { fetchJSON, API_BASE } from "./api.js";
import { Track } from "./models.js";
import { player, updatePlayer } from "./player.js";
import { myPreferit, renderCard, gridFavorites } from "./cards.js";

const gridPop = document.querySelector("#grid-pop");
const gridRock = document.querySelector("#grid-rock");

const home = document.querySelector(".home");

let tracks = [];

const loadPref = JSON.parse(localStorage.getItem("myPreferit")) ?? []; // se non c'e niente, array vuoto
const loadPrefSearch =
  JSON.parse(localStorage.getItem("myPreferitSearch")) ?? []; // se non c'e niente, array vuoto
myPreferit.push(...loadPref, ...loadPrefSearch);
renderCard(myPreferit, gridFavorites);

const BASE_URL = `${API_BASE}` + "/search?entity=song&limit=8&term=";

const loadSuggestions = async () => {
  try {
    const [pop, rock] = await Promise.allSettled([
      fetchJSON(BASE_URL + "pop"),
      fetchJSON(BASE_URL + "rock"),
    ]);

    if (pop.status === "fulfilled") {
      renderCard(pop.value.results, gridPop);
    }

    if (rock.status === "fulfilled") {
      tracks.push(...pop.value.results, ...rock.value.results);
      renderCard(rock.value.results, gridRock);
    }
  } catch {
    //se non funziona
    const errore = await fetchJSON(
      "https://itunes.apple.com/pagina-che-non-esiste",
    );
    console.log("risposta con errore:", errore);
  }
};
loadSuggestions();

export function create(tag, classes, texts) {
  const element = document.createElement(tag);
  if (classes) element.className = classes;
  if (texts !== undefined) element.textContent = texts;
  return element;
}

export function savePreferit() {
  localStorage.setItem("myPreferit", JSON.stringify(myPreferit));
}

export function imgClean(url, size = 600) {
  if (!url) return "";
  return url.replace(/\d+x\d+bb/, `${size}x${size}bb`);
}

//1.add event listener su tutta la griglia section class home
home.addEventListener("click", (e) => {
  // ESCLUDO IL CLICK SUI PREFERITI
  if (e.target.closest(".btnPref, .btnPrefActive")) return;

  // INTERCETTO LA CARD
  const cardSelected = e.target.closest(".card-personal");

  if (!cardSelected) return;

  // RECUPERO L'ID DEL BRANO
  const cardSelectedId = Number(cardSelected.dataset.id);

  // CERCO IL BRANO NEI DATI DISPONIBILI
  const trackData =
    tracks.find((item) => item.trackId === cardSelectedId) ??
    myPreferit.find((item) => item.trackId === cardSelectedId);

  if (!trackData) return;

  // CREO L'OGGETTO TRACK
  const track = new Track(trackData);

  // SELEZIONO IL BRANO
  player.select(track);

  // AGGIORNO IL PLAYER
  updatePlayer(track);

  // SE CLICCO IL BOTTONE PLAY FACCIO PARTIRE
  if (e.target.closest(`.btnPlay`)) {
    player.play();
  }
});
