# mock-aws [![Build Status](https://travis-ci.org/antonosmond/mock-aws.svg?branch=master)](https://travis-ci.org/antonosmond/mock-aws)
Easily mock aws-sdk API methods to enable easier testing of applications which use the [AWS SDK for JavaScript](http://www.npmjs.com/package/aws-sdk).

Under the covers, this stubs aws-sdk methods using [sinon.js](http://sinonjs.org/).

**IMPORTANT: In order to prevent real AWS endpoints from being hit by mistake, the AWS credentials are nullified causing any non-mocked methods to fail.**

#### Usage
```js
var AWS = require('mock-aws');

// Call AWS.mock(service, method, testData) to mock an aws-sdk method to return the data you specify
AWS.mock('EC2', 'describeTags', [ 'one', 'two', 'three' ]);

var ec2 = new AWS.EC2({ region: 'us-east-1' }); // this returns the mock EC2 client

ec2.describeTags({}, function(err, data) {
  console.log(data) // data should equal [ 'one', 'two', 'three' ];
});
```

#### Example
I want to build and test a tag validator that returns the id's of any EBS volumes which don't have a tag called 'name'.
My production code for my tag-validator may look something like the following:
```js
var AWS = require('aws-sdk');

function getNamelessVolumes(region, callback) {

  var ec2 = new AWS.EC2({ region: region });

  ec2.describeVolumes({}, function(err, data) {
    if (err) callback(err, null);
    var namelessVolumes = [];
    data.Volumes.forEach(function(volume) {
      var named = false;
      for (var i = 0; i < volume.Tags.length; i++) {
        if (volume.Tags[i].Key.toLowerCase() === 'name') {
          named = true;
          break;
        }
      }
      if (!named) {
        namelessVolumes.push(volume.VolumeId);
      }
    });
    callback(null, namelessVolumes);
  });

}

module.exports = {
  getNamelessVolumes: getNamelessVolumes
};
```
In order to test my validator, I don't want to actually call AWS, nor do I want to have to change my production code.
The mock-aws module solves this problem - I can easily mock the describeVolumes method in my test then call the tag validator as normal.
This way I can use varying test data to fully test the getNamelessVolumes function, without relying on AWS services.
First I setup my test data:
```json
{
  "Volumes": [
    {
      "VolumeId": "v-111",
      "Tags": [
        {
          "Key": "name",
          "Value": "volume 1"
        },
        {
          "Key": "role",
          "Value": "test"
        }
      ]
    },
    {
      "VolumeId": "v-222",
      "Tags": [
        {
          "Key": "role",
          "Value": "test"
        }
      ]
    }
  ]
}
```
Now I can write my test, mocking getNamelessVolumes() to return my test data
```js
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
```
The point here is that I can test the functionality of my tag-validator without making real calls to AWS and I never had to modify my production code in order to make it testable. mock-aws handled it for me.

I built this for myself but feel free to use, share, submit bugs / pull requests, suggest changes or features etc.
