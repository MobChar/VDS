const db = require('../DB/NeDB');



service = {};
service.getVideoComment = function (videoId, callback) {
    db.comment.find({ videoId: videoId }, function (err, docs) {
        callback(err, docs);
    });
}

service.addVideoComment = function (userId, videoId, content, callback) {
    //Check video id
    db.playback.findOne({_id:videoId},function(err,doc){
        if(err){
            callback(err,null);
        }
        else if(doc===null){
            callback(new Error('Cannot find videoId'),null);
        }
        else{
            db.comment.insert({ googleId: userId, videoId: videoId, content: content }, function (err, newDoc) {
                callback(err, newDoc);
            });
        }
    })
    
}

module.exports=service;