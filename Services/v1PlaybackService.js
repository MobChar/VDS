const db = require('../DB/NeDB');
const Constants = require('../Constants');
const videoConverter = require('../VideoConverter');
const { channel } = require('../DB/NeDB');

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
service.uploadVideo = function (channelId, title, image, video, progressCallBack, endCallBack) {
    videoConverter.standardEncodeAndSaveToM3U8(`${Constants.VIDEO_ASSET_DIR}/${video.filename}`, video.filename.split('.')[0],
        null, null, progressCallBack, function (encodeErr, videoPath) {

            if (encodeErr) return endCallBack(err, null);

            db.playback.insert({ channel: channelId, title: title, videoPath: `/videoAsset${videoPath}`, imagePath: `/imageAsset/${image.filename}` }, function (err, newDoc) {
                endCallBack(err, newDoc);
            });

        });

}


module.exports = service;