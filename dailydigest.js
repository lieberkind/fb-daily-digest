var Q = require('Q');
var request = require('request');
var moment = require('moment');
var CONFIG = require('./config');
var FEED_URI = "https://www.facebook.com/feeds/notifications.php";
var MAILGUN_URI = "https://api.mailgun.net/v3";

(function main() {
    getFeed(CONFIG.fbId, CONFIG.feedKey)
        .then(function(feed) {
            var oneDayAgo = moment().subtract(1, 'days');

            var newEntries = feed.entries.filter(function(entry) {
                return moment(entry.published).isAfter(oneDayAgo);
            });

            var html = newEntries.reduce(function(html, entry) {
                return html + entryToHtml(entry);
            }, '');

            sendMail('t.lieberkind@gmail.com', 't.lieberkind@gmail.com', 'FB Daily Digest', html)
                .then(function() {
                    console.log('Daily digest sent.');
                });
        });
}());

function entryToHtml(entry) {
    var html = '';

    html += '<div>';
    html += '<h2>';
    html += '<a href="' + entry.alternate + '">' + entry.title + '</a>';
    html += '</h2>';
    html += '<div>';
    html += entry.content;
    html += '</div>';

    return html;
}

function sendMail(from, to, subject, message) {
    var options = {
        url: mailgunBaseUri() + '/messages',
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

    return Q.promise(function(resolve, reject) {
        request(options, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                reject(response);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

function mailgunBaseUri() {
    return MAILGUN_URI + '/' +  CONFIG.mailgun.domain;
}

function authorizationString (apiKey) {
    var plain = 'api:' + apiKey;
    var buffer = new Buffer(plain);
    var encoded = buffer.toString('base64');
    return 'Bearer ' + encoded;
}

function getFeed(fbId, feedKey) {
    var options = {
        url: FEED_URI,
        qs: {
            id: fbId,
            viewer: fbId,
            key: feedKey,
            format: 'json'
        },
        headers: {
            'User-Agent': 'node'
        }
    };

    return Q.promise(function(resolve, reject) {
        request(options, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                reject(response);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}
