var should = require('should');
var AWS = require('mock-aws'); // include mock-aws instead of aws-sdk
var tagValidator = require('../lib/tag-validator');

describe('tag-validator', function() {
  describe('getNamelessVolumes()', function() {
    it('should return the ids of volumes which do NOT contain a "name" tag', function(done) {

      // Test data for the AWS method to return
      var testData = require('./test-data.json');

      // Mock the aws-sdk method 'describeVolumes' to return the test data
      AWS.mock('EC2', 'describeVolumes', testData);

      // Call the function I'm trying to test
      tagValidator.getNamelessVolumes('us-east-1', function(err, data) {
        // Assert that getNamelessVolumes() returned the correct results
        data.length.should.eql(1);
        data[0].should.eql('v-222');
        done();
      });

    });
  });
});
