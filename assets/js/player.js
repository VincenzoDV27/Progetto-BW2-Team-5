import { Player } from "./models.js";
import { imgClean, renderCard } from "./cards.js";

/* CREAZIONE DEL PLAYER */
export const player = new Player();

/* RECUPERO ELEMENTI HTML */
const playerCover = document.querySelector(".player-cover img");
const playerTitle = document.querySelector(".player-title");
const playerArtist = document.querySelector(".player-artist");
const btnPlay = document.querySelector(".btn-play");
const playIcon = btnPlay.querySelector(".material-symbols-rounded");
const btnPrevious = document.querySelector(
  ".player-controls .btn-ctrl:nth-of-type(2)",
);
const btnNext = document.querySelector(
  ".player-controls .btn-ctrl:nth-of-type(4)",
);
const currentTime = document.querySelector(".current-time");
const duration = document.querySelector(".duration");
const progressFill = document.querySelector(".progress-fill");

const volumeControl = document.querySelector(".volume-control");
const iconVolume = document.querySelector(
  ".player-right .material-symbols-rounded",
);

/* AGGIORNAMENTO INFORMAZIONI PLAYER */
export function updatePlayer(track) {
  playerCover.src = imgClean(track.artworkUrl100, 600);
  playerTitle.textContent = track.trackName;
  playerArtist.textContent = track.artistName;

  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  progressFill.style.width = "0%";

  playIcon.textContent = "play_arrow";
}

/* AGGIORNAMENTO ICONA PLAY/PAUSA */
function updatePlayIcon() {
  playIcon.textContent = player.audio.paused ? "play_arrow" : "pause";
}

/* PLAY E PAUSA */
btnPlay.addEventListener("click", () => {
  if (!player.currentTrack) return;

  if (player.isPlaying) {
    player.pause();
  } else {
    player.play();
  }

  updatePlayIcon();
});

/* BRANO PRECEDENTE */
btnPrevious.addEventListener("click", () => {
  player.previous();

  if (player.currentTrack) {
    updatePlayer(player.currentTrack);
  }
});

/* BRANO SUCCESSIVO */
btnNext.addEventListener("click", () => {
  player.next();

  if (player.currentTrack) {
    updatePlayer(player.currentTrack);
  }
});

/* AGGIORNAMENTO DURATA E BARRA DI AVANZAMENTO */
player.audio.addEventListener("timeupdate", () => {
  const current = player.audio.currentTime;
  const total = player.audio.duration;

  if (!total) return;

  const percentage = (current / total) * 100;

  progressFill.style.width = `${percentage}%`;
  currentTime.textContent = formatTime(current);
  duration.textContent = formatTime(total);
});

/* RECUPERO DURATA BRANO */
player.audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(player.audio.duration);
});

/* AGGIORNAMENTO ICONE AUDIO */
player.audio.addEventListener("play", () => {
  updatePlayIcon();

  if (player.currentTrack) {
    addToHistory(player.currentTrack);
  }
});
player.audio.addEventListener("pause", updatePlayIcon);
player.audio.addEventListener("ended", updatePlayIcon);

/* FORMATTAZIONE TEMPO */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

/* AGGIORNAMENTO ICONA VOLUME */
function updateIconVolume() {
  if (player.volume === 0) {
    iconVolume.textContent = "volume_off";
  } else if (player.volume < 0.5) {
    iconVolume.textContent = "volume_down";
  } else {
    iconVolume.textContent = "volume_up";
  }
}

/* IMPOSTAZIONE VOLUME INIZIALE */
player.manageVolume(Number(volumeControl.value) / 100);
updateIconVolume();

/* MODIFICA VOLUME */
volumeControl.addEventListener("input", () => {
  player.manageVolume(Number(volumeControl.value) / 100);
  updateIconVolume();
});

export const myHistory = JSON.parse(localStorage.getItem("myHistory")) ?? [];

export function addToHistory(track) {
  // niente doppioni: se c'è già, lo rimuovo e lo rimetto in testa
  const index = myHistory.findIndex((t) => t.trackId === track.trackId);
  if (index !== -1) myHistory.splice(index, 1);

  myHistory.unshift(track);
  if (myHistory.length > 5) myHistory.pop(); // massimo 8

  localStorage.setItem("myHistory", JSON.stringify(myHistory));
  renderRecent();
}

export function renderRecent() {
  const gridRecent = document.querySelector("#grid-recent");
  if (!gridRecent) return; // altre pagine
  renderCard(myHistory, gridRecent);
}

export function syncPlayBtn() {
  // id del brano caricato nel player
  const currentId = String(player.currentTrack?.trackId ?? ``);
  //se non è in pausa è in play
  const playing = !player.audio.paused;

  // prendo tutte le card
  document.querySelectorAll(`.card-personal`).forEach((card) => {
    const btnPlayer = card.querySelector(`.btnPlay .material-symbols-rounded`);

    //controllo se la card è quella in riproduzione
    const truePlay = playing && card.dataset.id === currentId;

    //se brano in play, icona pausa
    btnPlayer.textContent = truePlay ? `pause` : `play_arrow`;
    //etichetta screen reader
    btnPlayer.parentElement.setAttribute(
      `aria-label`,
      truePlay ? "Metti in pausa" : "Riproduci",
    );
    //classe css
    card.classList.toggle(`is-plating`, truePlay);
  });
}
//ad ogni cambio stato dell'audio
player.audio.addEventListener(`play`, syncPlayBtn); //play
player.audio.addEventListener(`pause`, syncPlayBtn); //pausa
player.audio.addEventListener(`ended`, syncPlayBtn); //end

export function playCard(track) {
  //il brano è caricato?
  // confronta l'id del brano cliccato con quello caricato.
  const curretnPlay = player.currentTrack?.trackId === track.trackId;

  if (curretnPlay) {
    if (player.audio.paused) {
      player.play();
    } else {
      player.audio.pause();
    }
    return;
  }

  player.select(track);
  updatePlayer(track);
  player.play();
}
