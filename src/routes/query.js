const btoa = require('btoa');
const { response } = require('express');
const fetch = require('node-fetch');
const spotifyApi = require('../config/config');

//Function that gets and sets the acces and refresh token
const token = code => {
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(spotifyApi._credentials.clientId + ':' + spotifyApi._credentials.secretId)     
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${spotifyApi._credentials.redirectUri}`
    }).then(res => res.json())
    .then(data => {
        spotifyApi.setRefreshToken(data.refresh_token);
        spotifyApi.setAccessToken(data.access_token);
    })
    .catch(err => console.error(err));
}


//Function that gets results by album
const getAlbum = albumName => new Promise((resolve, reject) => {

  fetch(`https://api.spotify.com/v1/search?q=${albumName}&type=album&limit=10&offset=5`, {
     headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + spotifyApi._credentials.accessToken || spotifyApi._credentials.refreshToken
     }
    }).then(res => res.json())
    .then(data => {
        if (!data.albums.items){
            return reject('KO');
        }
        return resolve(data.albums.items);
    })
    .catch(err => console.error(err));

})

//Function that gets results by track
const getTrack = trackName => new Promise((resolve, reject) => {

    fetch(`https://api.spotify.com/v1/search?q=${trackName}&type=track&limit=10&offset=5`, {
       headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + spotifyApi._credentials.accessToken || spotifyApi._credentials.refreshToken
       }
      }).then(res => res.json())
      .then(data => {
          if (!data.tracks.items){
              return reject('KO');
          }
          return resolve(data.tracks.items);
      })
      .catch(err => console.error(err));
  })


  //Function that gets results by Artist
  const getArtist = artistName => new Promise((resolve, reject) => {

    fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=10&offset=5`, {
       headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + spotifyApi._credentials.accessToken || spotifyApi._credentials.refreshToken
       }
      }).then(res => res.json())
      .then(data => {       
          if (!data.artists.items){
             return reject('KO');
         }
          return resolve(data.artists.items);
      })
      .catch(err => console.error(err));
  })

  //Function that gets several Artists (Up to 5)
  const getArtistInfo = idArtist => new Promise((resolve, reject) => {
    let info = {
        spotify_url: '',
        name: '',
        followers: '',
        popularity: '',
        albums: [],
        related_artists: [],
        genres: []
      }

      fetch(`https://api.spotify.com/v1/artists?ids=${idArtist}`, {
     headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + spotifyApi._credentials.accessToken || spotifyApi._credentials.refreshToken
     }
    }).then(res => res.json())
    .then(data => {
       if (!data.artists[0]){
           return reject({ error: { status: 400, message: 'There is at least an invalid id' } });
       } 

       const results = data.artists[0]
       info.spotify_url = results.external_urls.spotify;
       info.name = results.name;
       info.followers = results.followers.total;
       info.popularity = results.popularity;
       const genres = results.genres.filter((item, i) => {
          return results.genres.indexOf(item)== i;
       })
       
       info.genres = genres  
     
        return resolve(info);
    })
    .catch(err => console.error(err));

})


//Fetch the related artists
const relatedArtist = idArtist => new Promise((resolve, reject) => {

  let artists = [];
  fetch(`https://api.spotify.com/v1/artists/${idArtist}/related-artists`, {
  headers : {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + spotifyApi._credentials.accessToken || spotifyApi._credentials.refreshToken
   }
}).then(res => res.json())
.then(data => {
  
    if(data.error) {
        return reject(data);
    }

  const results = data.artists;
  let long = 0;
  (results.length > 3)? long = 3: long = results.length;
  for (let i = 0; i < 3; i++) {
      let artist = {
          name: '',
          followers: '',
          popularity: '',
      }
      artist.name = results[i].name;
      artist.followers = results[i].followers.total;
      artist.popularity = results[i].popularity;
      artists.push(artist);
  }
  artists.sort((a, b) =>  parseFloat(b.popularity) - parseFloat(a.popularity));
  return resolve(artists);
    
})
.catch(err => console.error(err));
}) 

//Function that returns albums artis by id
const getAlbumById = (idArtist, market) => new Promise((resolve, reject) => {
 
  let albums = []
  fetch(`https://api.spotify.com/v1/artists/${idArtist}/albums?market=${market}`, {
      headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + spotifyApi._credentials.accessToken || spotifyApi._credentials.refreshToken
       }
  }).then(res => res.json())
  .then(data => {

    if(data.error) {
        return reject(data);

    }
      
      const results = data.items;
      let long = 0;
      (results.length > 3) ? long = 3: long = results.length;
      for (let i = 0; i < 3; i++) {
          let album = {
              name: '',
              release_date: '',
              type: '',
              is_available: '',
          }
          album.name = results[i].name;
          album.release_date = results[i].release_date;
          album.type = results[i].type;
          album.is_available = (data.items[i].artists[0].external_urls.spotify)? true : false;
          albums.push(album);
    
      }
      return resolve(albums);
    })

    .catch(err => console.error(err));
})


module.exports = { token, getAlbum, getTrack, getArtist, getArtistInfo, relatedArtist, getAlbumById }
