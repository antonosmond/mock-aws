var sinon = require('sinon');
var AWS = require('aws-sdk');
var config = require('../config/main.json');

AWS.config.apiVersion = config.apiVersion;

var services = {};

config.services.forEach(function(service) {
  services[service] = AWS[service];
  sinon.stub(AWS, service, function (options) {
    options = options || {};
    options.region = undefined;
    var mockedService = new services[service](options);
    mockedService.mock = function(method, data) {
      sinon.stub(this, method, function(params, callback) {
        callback(null, data);
      });
    };
    mockedService.unmock = function(method) {
      this[method].restore();
    };
    return mockedService;
  });
});

module.exports = AWS;
