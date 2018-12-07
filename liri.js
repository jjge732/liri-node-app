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
            let bandsKey = keys.bands.id;
            axios.get(`https://rest.bandsintown.com/artists/${search}/events?app_id=${bandsKey}`)
            .then(res => {
                if (res.data[0]) {
                    let output = '\n\n\t' + res.data[0].venue.name + '\n\t' + res.data[0].venue.city + ', ' + res.data[0].venue.region + '\n\t' + moment(res.data[0].datetime).format('MMMM Do, YYYY');
                    console.log(output);
                    fs.appendFile('log.txt', output, err => {
                        if (err) {
                            console.log(err);
                        }
                    })
                } else {
                    console.log('No upcoming concerts');
                }
            }).catch(err => {
                console.log(err);
            })
            break;

        case 'spotify-this-song':   //fix default
            if (!search) {
                search = 'the sign';
            }
            spotify.search({type: 'track', query: search}).then(res => {
                let output = '\n\n\tArtist(s):';
                for (let i = 0; res.tracks.items[0].artists[i]; i++) {
                    output += '\n\t\t' + res.tracks.items[0].artists[i].name;
                }
                output += '\n\tSong: ' + res.tracks.items[0].name;
                output += '\n\tLink: ' + res.tracks.items[0].external_urls.spotify;
                output += '\n\tAlbum: ' + res.tracks.items[0].album.name;
                console.log(output);
                fs.appendFile('log.txt', output, err => {
                    if (err) {
                        console.log(err);
                    }
                })
            }).catch(err => {
                console.log(err);
            })
            break;

        case 'movie-this':
            if (!search) {
                search = 'Mr. Nobody';
            }
            let movieKey = keys.movies.id;
            axios.get(`http://www.omdbapi.com/?apikey=${movieKey}&t=${search}`)
            .then(res =>{
                let output = '\n\n\tTitle: ' + res.data.Title;
                output+= '\n\tYear of Release: ' + res.data.Year;
                output+= '\n\tIMDB Rating: ' + res.data.imdbRating;
                output+= '\n\tRotten Tomatoes Rating: ' + res.data.Ratings[1].Value;
                output+= '\n\tCountry of Production: ' + res.data.Country;
                output+= '\n\tLanguage(s): ' + res.data.Language;
                output+= '\n\tPlot: ' + res.data.Plot;
                output+= '\n\tActors: ' + res.data.Actors;
                console.log(output);
                fs.appendFile('log.txt', output, err => {
                    if (err) {
                        console.log(err);
                    }
                })
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

let query = process.argv[3];
for (let i = 4; process.argv[i]; i++) {
    query += '+' + process.argv[i];
}

getData(process.argv[2], query);