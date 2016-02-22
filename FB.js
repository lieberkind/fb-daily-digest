var _ = require('ramda');
var moment = require('moment');
var Q = require('q');
var request = require('request');
var Helpers = require('./Helpers');

var FEED_URI = 'https://www.facebook.com/feeds/notifications.php';

var isEntryAfter = _.curry(function(since, entry) {
    return moment(entry.published).isAfter(since);
});

var notifications = _.curry(function(fbId, feedKey, since) {
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

    return Helpers.httpRequest(options)
        .get('entries')
        .then(function(entries) {
            return since ? _.filter(isEntryAfter(since), entries) : entries;
        });
});

module.exports = {
    notifications: notifications
};
