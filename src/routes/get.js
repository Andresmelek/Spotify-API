const spotifyApi = require('../config/config')
const { token, getAlbum, getTrack, getArtist, getArtistInfo, relatedArtist, getAlbumById, hola } = require('./query');


//Function that gets the access token
const getToken = (req, res, next) => {

    const code = req.query.code
    token(code);
    res.send('Ready for query')
      
  }

//Function that logs the user 
  const login = (req, res, next) => {
    const scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + spotifyApi._credentials.clientId +
    '&redirect_uri=' + encodeURIComponent(spotifyApi._credentials.redirectUri));

}
   
//Function that searchs by artist, album and track
const specialSearch = (req, res, next) => {
    const param = req.query.q;
   Promise.all([getAlbum(param), getTrack(param), getArtist(param)])
   .then(data => res.send(data))
   .catch(err => console.error(err));
  
    
}

//Function that gets artist's Info
const artistInfo = (req, res, next) => {

const request = req.body;
let code = '';
(!code || code !== 'C0') ? code = 'US' : code = request.valid_for[0];
let order = '';
(!order || order !== 'popularity') ?order = 'followers' : order = request.order_by;
const ids = request.ids;
let result = {artists: ''}
const promises = [];

if(ids.length > 5) {
  return res.send({'Error':"Ids' list should no be greater than 5"})
}

ids.forEach(val => {
  const promiseFunctionArtist = new Promise(resolve => {

    getArtistInfo(val).then(data => {
      resolve(data);
    }).catch(err => {
      console.error(err);
      res.send(err);
    });
  });
  promises.push(promiseFunctionArtist);
})

ids.forEach(val => {
  const promiseFunctionRelated = new Promise(resolve => {
    
    relatedArtist(val).then(data => {
      resolve(data);
    }).catch(err => console.error(err));
  });
  promises.push(promiseFunctionRelated);
})


ids.forEach(val => {
  const promiseFunctionAlbum = new Promise(resolve => {
    
    getAlbumById(val, code).then(data => {
      resolve(data);
    }).catch(err =>console.error(err));
  });
  promises.push(promiseFunctionAlbum);
})

Promise.all(promises).then(value => { 

let objects = []
const long = ids.length
for (let i = 0; i < long; i++ ) {
  let entry = {}
  entry = value[i];
  entry.albums = value[i + (long * 2)]
  entry.related_artists = value[i + long]
  objects.push(entry)
}

const objectsOrder = sortBy(objects, order)

result.artists = objectsOrder
res.send(result)

}).catch(err => console.error(err));


}



const sortBy = (objects, order) => {
  if (order === 'popularity'){
    return objects.sort((a, b) =>  parseFloat(b.popularity) - parseFloat(a.popularity));
   }
  else {
    return objects.sort((a, b) =>  parseFloat(b.followers) - parseFloat(a.followers))
  } 
  
  }

module.exports = { getToken, login, specialSearch, artistInfo}