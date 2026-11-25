import { fetchJSON } from "./api.js";
import { Track } from './models.js';
import { player, updatePlayer } from './player.js';
 import {myPreferit, renderCard, gridFavorites } from './cards.js';
const gridPop = document.querySelector('#grid-pop');


const home = document.querySelector('.home');

let tracks = [];

const loadPref = JSON.parse(localStorage.getItem('myPreferit')) ?? [] // se non c'e niente, array vuoto
myPreferit.push(...loadPref)
renderCard(myPreferit, gridFavorites)

const testFetch = async () => {
    // se funziona
    try {
        const ok = await fetchJSON('https://itunes.apple.com/search?term=pop&entity=song&limit=8');
         tracks = ok.results;
        renderCard(tracks, gridPop);
      
    }
    //se non funziona
    catch {
        const errore = await fetchJSON('https://itunes.apple.com/pagina-che-non-esiste');
        // console.log('risposta con errore:', errore);
    }
};
testFetch();

 export function create(tag, classes, texts) {
    const element = document.createElement(tag);
    if (classes) element.className = classes;
    if (texts !== undefined) element.textContent = texts;
    return element
}

export function savePreferit() {
    localStorage.setItem('myPreferit', JSON.stringify(myPreferit))
}

export function imgClean(url, size = 600) {
    if (!url) return '';
    return url.replace(/\d+x\d+bb/, `${size}x${size}bb`);
}

//1.add event listener su tutta la griglia section class home
home.addEventListener('click', (e) => {

    // ESCLUDO IL CLICK SUI PREFERITI
    if (e.target.closest('.btnPref, .btnPrefActive')) return;

    // INTERCETTO LA CARD
    const cardSelected = e.target.closest('.card-personal');

    if (!cardSelected) return;

    // RECUPERO L'ID DEL BRANO
    const cardSelectedId = Number(cardSelected.dataset.id);
    

    // CERCO IL BRANO NEI DATI DISPONIBILI
    const trackData = tracks.find((item) => item.trackId === cardSelectedId);

    if (!trackData) return;

    // CREO L'OGGETTO TRACK
    const track = new Track(trackData);

    // SELEZIONO IL BRANO
    player.select(track);

    // AGGIORNO IL PLAYER
    updatePlayer(track);

});