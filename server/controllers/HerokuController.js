var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var Heroku = require('heroku-client');

var organization = 'barbershop';
var repo = 'greenstone-web';

module.exports = {
    deploys: function(req, res, next) {

        var token = req.query.api;
        var customError = {
            'message': 'Welcome to heroku stats.',
            'error': 'Use /heroku/deploys?api=HEROKU_API_TOKEN to get your deploy stats for the past year.'
        };

        if(!token) return res.json(401, customError);

        var options = {
            token: token
        };
        var heroku = new Heroku(options);

        heroku.apps().list(function (err, apps) {
            if(err) return res.send(err);
            var appNames = _.pluck(apps, 'name');
            var buildPromises = {};
            _.each(appNames, function(name) {
                // TODO: place mechanic to cache stats on redis for app name
                buildPromises[name] = heroku.apps(name).builds().list()
            });

            Promise.props(buildPromises).then(function(appBuildLists) {
                var response = {};

                var totals = {};
                var total = 0;
                var successTotal = 0;
                var failedTotal = 0;


                // filter data
                _.each(appBuildLists, function(list, app){
                    var successful = _.pluck(_.filter(list, 'status', 'succeeded'), 'created_at');
                    var failed = _.pluck(_.filter(list, 'status', 'failed'), 'created_at');
                    totals[app] = {};
                    totals[app].app = app;
                    totals[app].total = list.length;
                    totals[app].successful = successful.length;
                    totals[app].failed = failed.length;

                    // update entire list totals
                    total += totals[app].total;
                    successTotal += totals[app].successful;
                    failedTotal += totals[app].failed;
                });

                // sort object
                totals = _.sortByOrder(totals, ['successful'], ['desc']);

                // create response
                response.total = total;
                response.successful = successTotal;
                response.failed = failedTotal;
                response.apps = totals;

                res.send(response);
            }).catch(function(err) {
                res.send(err);
            });
        });
    }
}
