require('dotenv').config();

const fs = require('fs');
const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
const keys = require('./keys');
const inquirer = require('inquirer');

const spotify = new Spotify(keys.spotify);

const options = ['concert-this', 'spotify-this-song', 'movie-this'];

const getData = (userChoice = 'do-what-it-says', search = '') => {
    switch (userChoice) {
        case options[0]:
        if (!search) {
            search = 'Dua Lipa';
        }
            axios.get(`https://rest.bandsintown.com/artists/${search}/events?app_id=${keys.bands.id}`)
            .then(res => {
                if (res.data[0]) {
                    let output = '\n\n\t' + search + ' has a concert at ' + res.data[0].venue.name + ' in ' + res.data[0].venue.city + ', ' + res.data[0].venue.region + ' on ' + moment(res.data[0].datetime).format('MMMM Do, YYYY');
                    console.log(output);
                    fs.appendFile('log.txt', output, err => {
                        if (err) {
                            console.log(err);
                        }
                    })
                } else {
                    console.log(`${search} has no upcoming concerts.`);
                }
            }).catch(err => {
                console.log(err);
            })
            break;

        case options[1]:
            if (!search) {
                search = 'The Sign Ace of Base';
            }
            spotify.search({type: 'track', query: search, limit: 1}).then(res => {
                let output = '\n\n\tArtist(s):';
                for (let i = 0; res.tracks.items[0].artists[i]; i++) {
                    if (i === 0) {
                        output += ' ' + res.tracks.items[0].artists[i].name;
                    } else {
                        output += ', ' + res.tracks.items[0].artists[i].name;
                    }
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

        case options[2]:
            if (!search) {
                search = 'Mr. Nobody';
            }
            axios.get(`http://www.omdbapi.com/?apikey=${keys.movies.id}&t=${search}`)
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
        console.log('Reading file "random.txt"')
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

if (!process.argv[3]) {
    inquirer.prompt([{
            type: 'confirm',
            message: 'Would you like me to walk you through the process?',
            name: 'confirm'
        }]).then(res => {
            if (res.confirm) {
                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'Which action would you like me to perform?',
                        choices: options,
                        name: 'action'
                    },
                    {
                        type: 'text',
                        message: 'For what would you like to search?',
                        name: 'query'
                    }
                ]).then(data => {
                    getData(data.action, data.query);
                }).catch(err => {
                    console.log(err);
                })
            } else if (process.argv[2]) {
                getData(process.argv[2])
            } else {
                getData();
            }
        }).catch( err => {
            console.log(err);
        });
} else {
    let query = process.argv[3];
    for (let i = 4; process.argv[i]; i++) {
        query += '+' + process.argv[i];
    }
    getData(process.argv[2], query);
}
