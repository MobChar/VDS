const db = require('../DB/NeDB');




service = {};
service.likeComment = function (commentId, googleId, callback) {
    db.comment.findOne({_id:commentId},function(err,docs){
        if (err) {
            return callback(err, null);
        }
        else if (docs===null) {
            return callback(new Error("Comment not found"), null);
        }
        else {
            let likes = docs.like;
            if(likes.includes(googleId)){
                return callback(new Error("Already liked"), null)
            }
            likes.push(googleId);
            db.comment.update({ _id: commentId }, { $set:{ like: likes} }, function (err2, numReplaced, upsert) {
                if (err2) return callback(err2, null);
                else return callback(null, numReplaced);
            });
        }
    })
}
service.likeVideo = function (videoId, googleId, callback) {
    db.playback.findOne({ _id: videoId }, function (err, docs) {
        //get all like in docs
        //check key if like exist
        if (err) {
            return callback(err, null);
        }
        else if (docs===null) {
            return callback(new Error("Video not found"), null);
        }
        else {
            let likes = docs.like;
            if(likes.includes(googleId)){
                return callback(new Error("Already liked"), null)
            }
            likes.push(googleId);
            db.playback.update({ _id: videoId }, { $set:{ like: likes} }, function (err2, numReplaced, upsert) {
                if (err2) return callback(err2, null);
                else return callback(null, numReplaced);
            });
        }
    });

}

module.exports=service;