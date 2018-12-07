require('dotenv').config();

const fs = require('fs');
const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
const keys = require('./keys');

let spotify = new Spotify(keys.spotify);

const getData = (userChoice, search) => {
    switch (userChoice) {
        case 'concert-this':
            let bandsKey = process.env.BANDS_API_KEY;
            axios.get(`https://rest.bandsintown.com/artists/${search}/events?app_id=${bandsKey}`)
            .then(res => {
                console.log(res.data[0].venue.name);
                console.log(res.data[0].venue.city + ', ' + res.data[0].venue.region);
                console.log(res.data[0].datetime);
            }).catch(err => {
                console.log(err);
            })
            break;

        case 'spotify-this-song':   //fix default
            if (!search) {
                search = 'the sign';
            }
            spotify.search({type: 'track', query: search}).then(res => {
                console.log('Artist(s):')
                for (let i = 0; res.tracks.items[0].artists[i]; i++) {
                    console.log('\t' + res.tracks.items[0].artists[i].name)
                }
                console.log('Song: ' + res.tracks.items[0].name);
                console.log('Link: ' + res.tracks.items[0].external_urls.spotify)
                console.log('Album: ' + res.tracks.items[0].album.name)
            }).catch(err => {
                console.log(err);
            })
            break;

        case 'movie-this':
            if (!search) {
                search = 'Mr. Nobody';
            }
            let movieKey = process.env.OMDB_KEY;
            axios.get(`http://www.omdbapi.com/?apikey=${movieKey}&t=${search}`)
            .then(res =>{
                console.log('\tTitle: ' + res.data.Title);
                console.log('\tYear of Release: ' + res.data.Year);
                console.log('\tIMDB Rating: ' + res.data.imdbRating);
                console.log('\tRotten Tomatoes Rating: ' + res.data.Ratings[1].Value);
                console.log('\tCountry of Production: ' + res.data.Country);
                console.log('\tLanguage(s): ' + res.data.Language);
                console.log('\tPlot: ' + res.data.Plot);
                console.log('\tActors: ' + res.data.Actors);
            }).catch(err => {
                console.log(err);
            })
            break;

        case 'do-what-it-says':
            fs.readFile('random.txt', 'utf8', (err, res) => {
                if (err) {
                    console.log(err);
                }
                getData(res.split(',')[0], res.split(',')[1]);
            });
            break;
        default:
            console.log('Liri does not recognise this command. Goodbye.');
            break;
    }
}

getData(process.argv[2], process.argv[3]);