# mock-aws
Easily mock aws-sdk API methods to enable easier testing of applications which use the AWS SDK for JavaScript

**IMPORTANT: In order to prevent real AWS endpoints from being hit by mistake, the AWS credentials are nullified causing any non-mocked methods to fail.**

#### Usage
```js
var AWS = require('mock-aws');

var ec2 = new AWS.EC2({ region: 'us-east-1' });
ec2.mock('describeInstances', 'test data');

ec2.describeInstances({}, function(err, data) {
  // data should equal 'test data';
});

// The below example should fail with a CredentialsError because the method 'describeTags' has not been mocked
ec2.describeTags({}, function(err, data) {
  // err.code should equal 'CredentialsError';
});
```
