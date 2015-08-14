var should = require('should');
var AWS = require('../lib/mock-aws');

beforeEach(function() {
  AWS.restore();
});

describe('When a method is mocked', function() {
  describe('before the service client has been constructed', function() {
    it('it should return the mock data when called', function(done) {
      AWS.mock('EC2', 'describeTags', 'test');
      var ec2 = new AWS.EC2();
      ec2.describeTags({}, function(err, data) {
        data.should.eql('test');
        done();
      });
    });
  });
  describe('after the service client has been constructed', function() {
    it('it should return the mock data when called', function(done) {
      var ec2 = new AWS.EC2();
      AWS.mock('EC2', 'describeTags', 'test');
      ec2.describeTags({}, function(err, data) {
        data.should.eql('test');
        done();
      });
    });
  });
  it('unmocked methods should work as normal', function(done) {
    AWS.mock('EC2', 'describeTags', 'test');
    var ec2 = new AWS.EC2({ region: 'us-east-1' });
    ec2.describeVpcs({}, function(err, data) {
      data.should.have.property('Vpcs');
      done();
    });
  });
});

describe.skip('When calling restore()', function() {
  describe('and providing a service and method', function() {
    it('the specified method is restored', function(done) {
      this.timeout(0);
      AWS.mock('EC2', 'describeTags', 'tags');
      AWS.mock('EC2', 'describeInstances', 'instances');
      AWS.mock('S3', 'listBuckets', 'buckets');
      var ec2 = new AWS.EC2({ region: 'us-east-1' });
      var s3 = new AWS.S3({ region: 'us-east-1' });
      ec2.describeTags({}, function(err, data) {
        data.should.eql('tags');
        ec2.describeInstances({}, function(err, data) {
          data.should.eql('instances');
          s3.listBuckets({}, function(err, data) {
            data.should.eql('buckets');
            AWS.restore('EC2', 'describeInstances');
            ec2.describeTags({}, function(err, data) {
              data.should.eql('tags');
              ec2.describeInstances({ MaxResults: 5 }, function(err, data) {
                data.should.have.property('Reservations');
                s3.listBuckets({}, function(err, data) {
                  data.should.eql('buckets');
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
  describe('and providing only a service', function() {
    it('all mocked methods for the service are restored', function(done) {
      this.timeout(0);
      AWS.mock('EC2', 'describeTags', 'tags');
      AWS.mock('EC2', 'describeInstances', 'instances');
      AWS.mock('S3', 'listBuckets', 'buckets');
      var ec2 = new AWS.EC2({ region: 'us-east-1' });
      var s3 = new AWS.S3({ region: 'us-east-1' });
      ec2.describeTags({}, function(err, data) {
        data.should.eql('tags');
        ec2.describeInstances({}, function(err, data) {
          data.should.eql('instances');
          s3.listBuckets({}, function(err, data) {
            data.should.eql('buckets');
            AWS.restore('EC2');
            ec2.describeTags({}, function(err, data) {
              data.should.have.property('Tags');
              ec2.describeInstances({ MaxResults: 5 }, function(err, data) {
                data.should.have.property('Reservations');
                s3.listBuckets({}, function(err, data) {
                  data.should.eql('buckets');
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
  describe('with no arguments', function() {
    it('all mocked services & methods are restored', function(done) {
      this.timeout(0);
      AWS.mock('EC2', 'describeTags', 'tags');
      AWS.mock('EC2', 'describeInstances', 'instances');
      AWS.mock('S3', 'listBuckets', 'buckets');
      var ec2 = new AWS.EC2({ region: 'us-east-1' });
      var s3 = new AWS.S3({ region: 'us-east-1' });
      ec2.describeTags({}, function(err, data) {
        data.should.eql('tags');
        ec2.describeInstances({}, function(err, data) {
          data.should.eql('instances');
          s3.listBuckets({}, function(err, data) {
            data.should.eql('buckets');
            AWS.restore();
            ec2.describeTags({ MaxResults: 5 }, function(err, data) {
              data.should.have.property('Tags');
              ec2.describeInstances({ MaxResults: 5 }, function(err, data) {
                data.should.have.property('Reservations');
                s3.listBuckets({}, function(err, data) {
                  data.should.have.property('Buckets');
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});
