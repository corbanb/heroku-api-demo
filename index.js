'use strict';
if(!process.env.NODE_ENV) {
  require('dotenv').config({ path: '.env' });
}

// console.log(options);
var restify = require('restify');

GLOBAL.app = {};
app.services = require('./server/services');
app.controllers = require('./server/controllers');

// TODO: throw errors if no usrname, password or api token for heroku

var server = restify.createServer({
  name: 'heroku-api-demo',
  version: '1.0.0',
});

// app.routes = require('./server/routes');

var port = process.env.PORT || 8080;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/ping', function (req, res, next) {
  res.send('pong');
  return next();
});

server.get('/heroku/deploys', app.controllers.heroku.deploys);

server.on('uncaughtException', function (req, res, route, err) {
    // logging here, maybe?
    console.log(err);
    if(err.stack) console.log(err.stack);
    res.send(err.code || 500, {
        code: err.code || 500,
        error_description: err.status || err.message || err.description || 'Internal Server Error',
        req_body: req.params
    });
});

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
