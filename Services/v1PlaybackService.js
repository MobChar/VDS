const db = require('../DB/NeDB');
const Constants = require('../Constants');
const videoConverter = require('../VideoConverter');
const { channel } = require('../DB/NeDB');
const { json } = require('express');





service = {};
service.getVideo = function (videoId, callback) {
    db.playback.find({ _id: videoId }, function (err, docs) {
        callback(err, docs);
    });
}

let allChannelVideo = function (channelId, callback) {
    db.playback.find({ channelId: channelId }, function (err2, docs) {
        if (err2) {
            return callback(err2, null);
        }
        else {

            //Most viewed
            let trendy = {};
            let tmp = -99999;
            for (i = 0; i < docs.length; i++) {
                if (docs[i].view > tmp) {
                    tmp = docs[i].view;
                    trendy = docs[i];
                }
            }
            res={
                allVideo:docs,
                trendy:trendy
            }
           
            return callback(null, res);
        }
    })

}
service.allChannelVideo = allChannelVideo;

service.suggestVideo = function (googleId, callback) {//All video from subscribed channels
    db.subscribe.find({ googleId: googleId }, function (err, docs) {//Get all channelId
        if (err) {
            return callback(err, null);
        }
        else {
            let videoList = [];
            let count = 0;
            if(docs.length===0) callback(null,[]);
            for (i = 0; i < docs.length; i++) {
                allChannelVideo(docs[i].channelId,  (err, docs2) => {
                    if (err) {

                    }
                    else {
                        videoList = videoList.concat(docs2);
                        ++count;
                        if (count == docs.length) {
                            return callback(null, videoList);
                        }
                    }
                });
            }

        }
    })
}

service.increaseView = function (videoId, callback) {
    db.playback.findOne({ _id: videoId }, function (err, doc) {
        if (err) return callback(err, null);
        else if (doc === null) return callback(new Error("Video not found"), null);
        else {
            db.playback.update({ _id: videoId }, { $set: { view: parseInt(doc.view) + 1 } }, function (err2, numReplaced, upsert) {
                if (err2) return callback(err2, null);
                else return callback(null, numReplaced);
            });
        }
    })

};

service.uploadVideo = function (channelId, title, description, image, video, progressCallBack, endCallBack) {
    videoConverter.standardEncodeAndSaveToM3U8(`${Constants.VIDEO_ASSET_DIR}/${video.filename}`, video.filename.split('.')[0],
        null, null, progressCallBack, function (encodeErr, videoPath) {

            if (encodeErr) return endCallBack(err, null);

            db.playback.insert({ channelId: channelId, title: title, description: description, view: 0, videoPath: [`/videoAsset${videoPath[0]}`, `/videoAsset${videoPath[1]}`], like: [], imagePath: `/imageAsset/${image.filename}` }, function (err, newDoc) {
                endCallBack(err, newDoc);
            });

        });

}

service.modifyVideo=function(channelId, videoId,attribute,image, callback){
        if(image!==null)
        attribute.imagePath=`/imageAsset/${image.filename}`;
        console.log(attribute);
        db.playback.update({ channelId:channelId, _id: videoId }, { $set: attribute }, function (err2, numReplaced, upsert) {
            if (err2) return callback(err2, null);
            else {
                if(numReplaced===0) return callback(new Error("Modify video failed. You don't have permission to modify this resource"));
                return callback(null, numReplaced);
            }
        });
}

service.deleteVideo=function(channelId,videoId,callback){
    console.log(channelId);
    console.log(videoId);
    db.playback.remove({channelId:channelId,_id:videoId},function(err,numRemoved){
        if(err) return callback(err,null);
        else if(numRemoved===0) return callback(new Error("Delete video failed. You don't have permission to modify this resource"));
        else return callback(null,numRemoved);
    })
}

module.exports = service;