const spotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new spotifyWebApi({
    clientId : 'fd53efb7d8004782a6224148f71ac030',
    secretId: 'f31dedea09884f148f4f3f740e990d02',
    redirectUri: 'http://localhost:3000/token'
})

module.exports = spotifyApi;