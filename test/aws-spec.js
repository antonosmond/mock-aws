var should = require('should');
var AWS = require('../lib/mock-aws');

describe('mock-aws', function() {
  it('should nullify AWS credentials', function(done) {
    var glacier = new AWS.Glacier({ region: 'us-east-1' });
    glacier.listVaults({}, function(err, data) {
      err.code.should.eql('CredentialsError');
      done();
    });
  });
  describe('.mock()', function() {
    it('should create a single instance of a service, returning the same instance on subsequent calls', function() {
      AWS.mock('Route53', 'listHostedZones', 'test');
      var r53_one = new AWS.Route53();
      var r53_two = new AWS.Route53();
      r53_one.should.equal(r53_two);
    });
    it('should allow multiple methods to mocked', function(done) {
      AWS.mock('EC2', 'describeTags', 'test');
      var ec2 = new AWS.EC2({ region: 'us-east-1' });
      ec2.describeTags({}, function(err, data) {
        (err === null).should.eql(true);
        data.should.eql('test');
        AWS.mock('S3', 'listBuckets', [ 'bucket 1', 'bucket 2' ]);
        var s3 = new AWS.S3();
        s3.listBuckets({}, function(err, data) {
          (err === null).should.eql(true);
          data.length.should.eql(2);
          data[0].should.eql('bucket 1');
          data[1].should.eql('bucket 2');
          ec2.describeVpcs({}, function(err, data) {
            (err === null).should.eql(false);
          });
          done();
        });
      });
    });
  });
});
