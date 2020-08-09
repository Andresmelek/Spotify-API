# Spotify API
---
The goal for this exercise is to be able to return some specific information from the [spotify API](https://developer.spotify.com/documentation/web-api/reference), this will help us to avoid multiple calls by creating “wrapper” endpoints. 
---
>to run the app clone the repo, run npm install packageName --save and run npm run dev
---
To login and get and acces token go into http://localhost:3000/ in order to do the querys


Endpoint-Routes


GET - http://localhost:3000/v1/special-search'

Usage: http://localhost:3000/v1/special-search?q={album/artist/track}

Post - http://localhost:3000/v1/artistsInfo

Usage: 
{

ids: [‘spotify_id1’, ‘spotify_id12’…], -> (Up to 5 artists' id per query)

valid_for: [‘CO’], -> (optional , default value will be   "US")

order_by: “followers|popularity” ->  (optional, default value will be "followers")

}
  


---
Build by 
[Camilo Isaza]()
