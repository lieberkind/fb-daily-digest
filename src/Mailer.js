var _ = require('ramda');
var Helpers = require('./Helpers');
const CONFIG = require('../config');
const MAILGUN_BASE_URI = "https://api.mailgun.net/v3/" +  CONFIG.mailgun.domain;

// authorizationString :: String -> String
var authorizationString = function(apiKey) {
    var buffer = new Buffer('api:' + apiKey);
    return 'Bearer ' + buffer.toString('base64');
};

// send :: String -> String -> String -> String -> Promise _
var send = _.curry(function(from, to, subject, html) {
    var options = {
        url: MAILGUN_BASE_URI + '/messages',
        method: 'POST',
        headers: {
            'Authorization': authorizationString(CONFIG.mailgun.apiKey)
        },
        form: {
            to: to,
            from: from,
            subject: subject,
            html: html,
        }
    };

    return Helpers.httpRequest(options);
});

module.exports = {
    authorizationString: authorizationString,
    send: send
};
