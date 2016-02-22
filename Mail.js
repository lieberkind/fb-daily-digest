var Q = require('Q');
var request = require('request');
var _ = require('ramda');
var Helpers = require('./Helpers');

const CONFIG = require('./config');
const MAILGUN_URI = "https://api.mailgun.net/v3";
const MAILGUN_BASE_URI = MAILGUN_URI + '/' +  CONFIG.mailgun.domain;

var authorizationString = function(apiKey) {
    var plain = 'api:' + apiKey;
    var buffer = new Buffer(plain);
    var encoded = buffer.toString('base64');
    return 'Bearer ' + encoded;
}

var send = _.curry(function(from, to, subject, message) {
    var options = {
        url: MAILGUN_BASE_URI + '/messages',
        method: 'POST',
        headers: {
            'Authorization': authorizationString(CONFIG.mailgun.apiKey)
        },
        form: {
            to: from,
            from: to,
            subject: subject,
            html: message,
        }
    };

    return Helpers.httpRequest(options);
});

module.exports = {
    send: send
};
