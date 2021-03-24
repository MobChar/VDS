const db = require('../DB/NeDB');
const Constants = require('../Constants');
const videoConverter = require('../VideoConverter');

service = {};
service.getVideo = function (videoId, callback) {
    db.playback.find({ _id: videoId }, function (err, docs) {
        callback(err, docs);
    });
}
service.suggestVideo = function (callback) {
    db.playback.find({}, function (err, docs) {
        callback(err, docs);
    });
}
service.uploadVideo = function (channelId, title, image, video, callback) {
    videoConverter.standardEncodeAndSaveToM3U8(`${Constants.VIDEO_ASSET_DIR}/${video.filename}`, video.filename.split('.')[0],
        null, null, null, function (encodeErr, videoPath) {

            if(encodeErr) return callback(err,null);
            
            db.playback.insert({ title: title, videoPath: `/videoAsset${videoPath}`, imagePath: `/imageAsset/${image.filename}` },function(err,newDoc){
                callback(err,newDoc);
            });
            
        });
   
}


module.exports = service;