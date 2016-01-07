var Heroku = require('heroku-client');
var options = {
    token: process.env.HEROKU_API_TOKEN
};
var heroku = new Heroku(options);

module.exports = heroku;
