
const bodyParser = require('body-parser');
const express = require('express');
const routes = require('./routes/index');
const app = express();



//creation of the Express server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);


//Connection to the server port 3000
app.listen(3000,()=>{
        console.log('Conected ...');
});

module.exports = app
