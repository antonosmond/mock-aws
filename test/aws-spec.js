var should = require('should');
var AWS = require('../lib/mock-aws');

describe('mock-aws', function() {
  it('should nullify AWS credentials', function(done) {
    var glacier = new AWS.Glacier({ region: 'us-east-1' });
    glacier.listVaults({}, function(err, data) {
      (err ? true : false).should.eql(true);
      err.code.should.eql('CredentialsError');
      done();
    });
  });
  describe('.mock()', function() {
    it('should substitute a service method with a version that returns the given data', function(done) {
      var ec2 = new AWS.EC2();
      ec2.mock('describeInstances', { test: '123' });
      ec2.describeInstances({}, function(err, data) {
        (err ? true : false).should.eql(false);
        data.test.should.eql('123');
        done();
      });
    });
    it('should only substitute the given method', function(done) {
      var r53 = new AWS.Route53();
      r53.mock('listHostedZones', 'test');
      r53.listHostedZones({}, function(err, data) {
        (err ? true : false).should.eql(false);
        data.should.eql('test');
        r53.listHealthChecks({}, function(err, data) {
          (err ? true : false).should.eql(true);
          done();
        });
      });
    });
  });
});
