var _ = require('ramda');
var moment = require('moment');
var FB = require('./FB');
var TemplateBuilder = require('./TemplateBuilder');
var Mail = require('./Mail');
var Helpers = require('./Helpers');
var CONFIG = require('./config');

var subject = 'FB Daily Digest';
var since = moment().subtract(1, 'days');
var until = moment();

// format :: Moment -> String
var format = moment => moment.format('dddd DD/M');

FB.notifications(CONFIG.fbId, CONFIG.feedKey, since)
    .then(TemplateBuilder.email(format(since), format(until)))
    .then(Mail.send(CONFIG.recipient, CONFIG.sender, subject))
    .then(Helpers.print('DD sent'))
    .done();
