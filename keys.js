console.log('this is loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.bands = {
    id: process.env.BANDS_API_KEY
}

exports.movies = {
    id: process.env.OMDB_KEY
}