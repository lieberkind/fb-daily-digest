var Q = require('q');
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

            var html = generateEmailTemplate(newEntries);

            sendMail('t.lieberkind@gmail.com', 't.lieberkind@gmail.com', 'FB Daily Digest', html)
                .then(function() {
                    console.log('Daily digest sent.');
                });
        });
}());

function generateEmailTemplate(entries) {
    var from = moment().subtract(1, 'days').format('dddd DD/M');
    var to = moment().format('dddd DD/M');

    var html = '';
    html += '<div style="font-family: &quot;Monaco&quot;;font-size: 14px;line-height: 1.5em;margin: 0 auto;max-width: 600px;">';
    html += '<h1 style="font-size: 1.2em;font-weight: bold;margin-bottom: 3em;">Notifications from ' + from + ' to ' + to + '</h1>';
    html += entries.reduce(function(html, entry) {
        return html + entryToHtml(entry);
    }, '');
    html += '</div>';

    return html;
}

function entryToHtml(entry) {
    var published = moment(entry.published);

    var html = '';

    html += '<div class="entry" style="overflow: hidden;margin-bottom: 2em;">';

    html += '<div class="timestamp" style="box-sizing: border-box;float: left;width: 180px;">';
    html += '<a href="' + entry.alternate + '" style="color: #3a5795;">' + published.format('dddd') + ' at ' + published.format('H:mm') + '</a>';
    html += '</div>';

    html += '<div class="notification" style="box-sizing: border-box;float: left;width: 420px;">';
    html += entry.content;
    html += '</div>';

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
