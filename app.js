var AWS = require('mock-aws');

// Mock some EC2 methods to return specified test data
AWS.mock('EC2', 'describeTags', [ 'one', 'two', 'three' ]);
AWS.mock('EC2', 'describeVpcs', 'vpcs');
var ec2 = new AWS.EC2();

// Mock some S3 methods to return specified test data
AWS.mock('S3', 'listBuckets', { buckets: [] });
var s3 = new AWS.S3();

// EC2 methods should return specified test data
ec2.describeTags({}, function(err, data) {
  console.log(data); // data should equal [ 'one', 'two', 'three' ];
});
ec2.describeVpcs({}, function(err, data) {
  console.log(data); // data should equal 'vpcs';
});

// S3 methods should return specified test data
s3.listBuckets({}, function(err, data) {
  console.log(data); // data should equal { buckets: [] };
});
