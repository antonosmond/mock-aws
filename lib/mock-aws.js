var sinon = require('sinon');
var AWS = require('aws-sdk');
var services = require('./services.json');

AWS.config.credentialProvider = null;
AWS.config.credentials = null;

var serviceConstructors = {};

services.forEach(function(service) {
  serviceConstructors[service] = AWS[service];
  sinon.stub(AWS, service, function (options) {
    options = options || {};
    var mockedService = new serviceConstructors[service](options);
    mockedService.mock = function(method, data) {
      sinon.stub(this, method, function(params, callback) {
        callback(null, data);
      });
    };
    return mockedService;
  });
});

module.exports = AWS;
