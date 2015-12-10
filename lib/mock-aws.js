var sinon = require('sinon');
var AWS = require('aws-sdk');

var core = {};
var mocks = {};

for (var service in AWS) {
  if (AWS[service].hasOwnProperty('serviceIdentifier')) {
    core[service] = {};
    core[service].clients = [];
    core[service].awsConstructor = AWS[service];
    createStub(service);
  }
}

function createStub(service) {
  sinon.stub(AWS, service, function(options) {
    var client = new core[service].awsConstructor(options);
    client.sandbox = sinon.sandbox.create();
    core[service].clients.push(client);
    updateClients(service);
    return client;
  });
}

function updateClients(service) {
  var services = [];
  if (service) {
    services.push(service);
  } else {
    for (var svc in core) {
      services.push(svc);
    }
  }
  services.forEach(function(service) {
    core[service].clients.forEach(function(client) {
      client.sandbox.restore();
      applyMocks(client, service);
    });
  });
}

function applyMocks(client, service) {
  if (!mocks[service]) { return; }
  mocks[service].forEach(function(mock) {
    client.sandbox.stub(client, mock.name, function(params, callback) {
      // check if it is a function or data
      if (typeof(mock.data) === 'function') {
        return mock.data(params,callback);
      } else {
        return callback(null, mock.data);
      }
    });
  });
}

AWS.mock = function(service, method, data) {
  if (!mocks[service]) {
    mocks[service] = [];
  }
  var i = mocks[service].map(function(e) { return e.name; }).indexOf(method);
  if (i !== -1) {
    mocks[service][i].data = data;
  } else {
    mocks[service].push({
      name: method,
      data: data
    });
  }
  updateClients(service);
};

AWS.restore = function(service, method) {
  if (!service) {
   mocks = {};
   updateClients();
   return;
  }
  if (!method) {
   delete mocks[service];
  } else {
   var i = mocks[service].map(function(e) { return e.name; }).indexOf(method);
   if (i !== -1) {
     mocks[service].splice(i, 1);
   }
  }
  updateClients(service);
};

module.exports = AWS;
