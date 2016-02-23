var _ = require('ramda');
var moment = require('moment');

// entryToHtml :: Entry -> String
var entryToHtml = function(entry) {
    var published = moment(entry.published);

    return _.join('', [
        '<div class="entry" style="overflow: hidden;margin-bottom: 2em;">',
            '<div class="timestamp" style="box-sizing: border-box;float: left;width: 180px;">',
                '<a href="' + entry.alternate + '" style="color: #3a5795;">' + published.format('dddd') + ' at ' + published.format('H:mm') + '</a>',
            '</div>',

            '<div class="notification" style="box-sizing: border-box;float: left;width: 420px;">',
                entry.content,
            '</div>',
        '</div>'
    ]);
};

// buildEmail :: String -> String -> [Entry]
var buildEmail = _.curry(function(from, to, entries) {
    return _.join('', [
        '<div style="font-family: &quot;Monaco&quot;;font-size: 14px;line-height: 1.5em;margin: 0 auto;max-width: 600px;">',
            '<h1 style="font-size: 1.2em;font-weight: bold;margin-bottom: 3em;">Notifications from ' + from + ' to ' + to + '</h1>',
            _.join('', _.map(entryToHtml, entries)),
        '</div>'
    ]);
});

module.exports = {
    buildEmail: buildEmail,
    entryToHtml: entryToHtml
};
