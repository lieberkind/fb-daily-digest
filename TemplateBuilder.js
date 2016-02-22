var _ = require('ramda');
var moment = require('moment');

var TemplateBuilder = {};

var entryToHtml = function(entry) {
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
};

var email = _.curry(function(from, to, entries) {
    var html = '';
    html += '<div style="font-family: &quot;Monaco&quot;;font-size: 14px;line-height: 1.5em;margin: 0 auto;max-width: 600px;">';
    html += '<h1 style="font-size: 1.2em;font-weight: bold;margin-bottom: 3em;">Notifications from ' + from + ' to ' + to + '</h1>';
    html += entries.reduce(function(html, entry) {
        return html + entryToHtml(entry);
    }, '');
    html += '</div>';

    return html;
});

module.exports = {
    email: email,
    entryToHtml: entryToHtml
};
