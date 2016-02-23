var moment = require('moment');
var FB = require('./FB');
var HTMLBuilder = require('./HTMLBuilder');
var Mailer = require('./Mailer');
var Helpers = require('./Helpers');
var CONFIG = require('../config');

// format :: Moment -> String
var format = moment => moment.format('dddd DD/M');

var subject = 'FB Daily Digest';
var since = moment().subtract(1, 'days');
var until = moment();

FB.getNotifications(CONFIG.fbId, CONFIG.feedKey, since)
    .then(HTMLBuilder.buildEmail(format(since), format(until)))
    .then(Mailer.send(CONFIG.recipient, CONFIG.sender, subject))
    .then(Helpers.print('DD sent'))
    .done();
