const db = require('../DB/NeDB');
const videoService = require('./v1PlaybackService');
const commentService = require('./v1CommentService');
const { comment, user } = require('../DB/NeDB');



service = {};
service.getChannel = function (channelId, callback) {
    db.channel.findOne({ _id: channelId }, function (err, docs) {
        if(err) callback(err,null)
        else if(docs===null) callback(new Error("Khong tim thay channel"),null);
        else callback(err, docs);
    });
};
service.getAllChannel = function (callback) {
    db.channel.find({}, function (err, docs) {
        callback(err, docs);
    });
};
service.mostLikedUser = function (channelId, callback) {
    //Get all channel video
    videoService.allChannelVideo(channelId, function (err, docs) {
        if (err) return callback(err, null);

        //Get all comment
        let commentList = [];
        let topList = {};
        let userList={};
        let res=[];

        if(docs.allVideo.length==0) callback(null,{});

        docs.allVideo.forEach(doc => {
          
            commentService.getVideoComment(doc._id, function (err2, docs2) {
                for(i=0;i<docs2.length;i++) commentList.push(docs2[i]);
                if (doc._id===docs.allVideo[docs.allVideo.length - 1]._id) {
                    commentList.forEach(comment => {
                        console.log(comment);
                        if (topList[comment.user._id] === undefined) {
                            topList[comment.user._id] = comment.like.length;
                            userList[comment.user._id]=comment.user;
                        }
                        else {
                            topList[comment.user._id] += comment.like.length;
                        }
                    });
                    for (const [key, value] of Object.entries(topList)) {
                        userList[key].totalLike= topList[key];
                        res.push(userList[key]);
                    }
                    callback(null, res);
                }
            })
        });
    });
}


module.exports = service;