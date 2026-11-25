/*>>>>>>>> MANUEL <<<<<<<<<<< */
import { Track, Album, Artist } from './models.js';

const API_BASE = 'https://itunes.apple.com';

/* fetchJSON con try/catch */

export const fetchJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`errore http ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('fetchJSON:', error);
        return { results: [], resultCount: 0 }
    }
}

/* RECUPERO ALBUM E RELATIVE TRACCE */

// restituisce un oggetto album e un array di oggetti track
export const getAlbum = async (id) => {
    const data = await fetchJSON(
        `${API_BASE}/lookup?id=${id}&entity=song`
    );

    const albumData = data.results.find(
        (item) => item.wrapperType === 'collection'
    );

    const tracks = data.results
        .filter((item) => item.wrapperType === 'track')
        .map((item) => new Track(item));

    return {
        album: albumData ? new Album(albumData) : null,
        tracks
    };
};

/* RECUPERO ARTISTA E RELATIVE TRACCE */

// restituisce un oggetto artist e un array di oggetti track
export const getArtist = async (id) => {
    const data = await fetchJSON(
        `${API_BASE}/lookup?id=${id}&entity=song`
    );

    const artistData = data.results.find(
        (item) => item.wrapperType === 'artist'
    );

    const tracks = data.results
        .filter((item) => item.wrapperType === 'track')
        .map((item) => new Track(item));

    return {
        artist: artistData ? new Artist(artistData) : null,
        tracks
    };
};
