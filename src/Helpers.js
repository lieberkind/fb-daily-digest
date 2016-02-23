var Q = require('q');
var request = require('request');

// httpRequest :: Object -> Promise
var httpRequest = function(options) {
    return promise = Q.promise(function(resolve, reject) {
        request(options, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                reject(response);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
};

// print :: String -> _ -> _
var print = function(text) {
    return function() {
        console.log(text);
    }
}

module.exports = {
    httpRequest: httpRequest,
    print: print
};
