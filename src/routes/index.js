const express = require('express');
const router = express.Router();
const { getToken, login, specialSearch, artistInfo } = require('./get')

//Routes

router.get('/token', getToken);
router.get('/', login);
//Endpoints
router.get('/v1/special-search', specialSearch);
router.post('/v1/artistsInfo', artistInfo)


module.exports = router
