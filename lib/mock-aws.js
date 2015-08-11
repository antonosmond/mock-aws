var sinon = require('sinon');
var AWS = require('aws-sdk');

AWS.config.credentialProvider = null;
AWS.config.credentials = null;

var mocks = {};

AWS.mock = function(service, method, data) {
  if (!mocks[service]) {
    mocks[service] = new AWS[service]();
    sinon.stub(AWS, service, function(options) {
      return mocks[service];
    });
  }
  sinon.stub(mocks[service], method, function(params, callback) {
    callback(null, data);
  });
};

module.exports = AWS;
