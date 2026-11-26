/*>>>>>>>> MANUEL <<<<<<<<<<< */
import { Track, Album, Artist } from "./models.js";

export const API_BASE = "https://itunes.apple.com";

/* fetchJSON con try/catch */

const showApiError = () => {
  let errorMessage = document.querySelector("#api-error");

  if (!errorMessage) {
    errorMessage = document.createElement("div");
    errorMessage.id = "api-error";
    errorMessage.className = "alert alert-danger text-center m-3";
    errorMessage.setAttribute("role", "alert");

    errorMessage.textContent =
      "⚠️ Impossibile comunicare con l'API ITunes. Controlla la connessione e riprova.";

    document.querySelector("header").after(errorMessage);
  }
};

export const fetchJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`errore http ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("fetchJSON:", error);
    showApiError();
    return { results: [], resultCount: 0 };
  }
};

/* RECUPERO ALBUM E RELATIVE TRACCE */

// restituisce un oggetto album e un array di oggetti track
export const getAlbum = async (id) => {
  const data = await fetchJSON(`${API_BASE}/lookup?id=${id}&entity=song`);

  const albumData = data.results.find(
    (item) => item.wrapperType === "collection",
  );

  const tracks = data.results
    .filter((item) => item.wrapperType === "track")
    .map((item) => new Track(item));

  return {
    album: albumData ? new Album(albumData) : null,
    tracks,
  };
};

/* RECUPERO ARTISTA E RELATIVE TRACCE */

// restituisce un oggetto artist e un array di oggetti track
export const getArtist = async (id) => {
  const data = await fetchJSON(`${API_BASE}/lookup?id=${id}&entity=song`);

  const artistData = data.results.find((item) => item.wrapperType === "artist");

  const tracks = data.results
    .filter((item) => item.wrapperType === "track")
    .map((item) => new Track(item));

  return {
    artist: artistData ? new Artist(artistData) : null,
    tracks,
  };
};
