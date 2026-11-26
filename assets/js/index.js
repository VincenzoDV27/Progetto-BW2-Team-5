import { fetchJSON, API_BASE } from "./api.js";
import { Track } from "./models.js";
import { player, updatePlayer, addToHistory } from "./player.js";
import {
  myPreferit,
  renderCard,
  gridFavorites,
  renderAsideFavs,
} from "./cards.js";

const gridPop = document.querySelector("#grid-pop");
const gridRock = document.querySelector("#grid-rock");

const home = document.querySelector(".home");

const gridRecent = document.querySelector("#grid-recent");
const myHistory = JSON.parse(localStorage.getItem("myHistory")) ?? [];

let tracks = [];
renderAsideFavs();
renderCard(myPreferit, gridFavorites);

renderCard(myHistory, gridRecent);
console.log(myHistory);

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

//add event listener su tutta la griglia section class home
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
