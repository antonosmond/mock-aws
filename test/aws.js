var should = require('should');
var AWS = require('../mocks/aws');

describe('mock', function() {
  it('should substitute an EC2 method with a version that returns the given data', function(done) {
    var ec2 = new AWS.EC2();
    ec2.mock('describeInstances', 'test');
    ec2.describeInstances({}, function(err, data) {
      (err ? true : false).should.eql(false);
      data.should.eql('test');
      done();
    });
  });
  it('should only substitute the given method', function(done) {
    var glacier = new AWS.Glacier();
    glacier.mock('listJobs', 'test');
    glacier.describeVault({}, function(err, data) {
      (err ? true : false).should.eql(true);
      done();
    });
  });
});
describe('unmock', function() {
  it('should restore an EC2 method to its original version', function(done) {
    var r53 = new AWS.Route53();
    r53.mock('getHealthCheck', true);
    r53.getHealthCheck({}, function(err, data) {
      (typeof err === 'object').should.eql(true);
      data.should.eql(true);
      r53.unmock('getHealthCheck');
      r53.getHealthCheck({}, function(err, data) {
        (err ? true : false).should.eql(true);
        done();
      });
    });
  });
});
