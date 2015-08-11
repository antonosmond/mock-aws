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
