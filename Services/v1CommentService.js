const db = require('../DB/NeDB');



service = {};
service.getVideoComment = function (videoId, callback) {
    db.comment.find({ videoId: videoId },function (err, docs) {
        let arr=[];
        let count=0;

        // console.log("VideoId: "+videoId);
        // console.log(docs);
    
        if(docs.length===0)  callback(null,[]);
        for(i=0;i<docs.length;i++){   
            arr.push(docs[i]);
            let tmp=i;
         
            db.user.findOne({_id: docs[tmp].googleId},function(err2, doc){
                if(err2) return callback(err2,null);
                else if(doc===null) return callback(new Error("User not exits"),null);
                else {
                    arr[tmp].user=doc;
                    ++count;
                    if(count==docs.length){
                      
                        callback(null,arr);
                    }
                }
            })
        }
        
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
            db.comment.insert({ googleId: userId, videoId: videoId, content: content , like:[]}, function (err, newDoc) {
                callback(err, newDoc);
            });
        }
    })
    
}

service.deleteVideoComment=function(commentId,userId,callback){
    db.comment.remove({googleId: userId, _id:commentId},function(err,deleteNum){
        if(err){
            callback(err,null);
        }
        else if(deleteNum > 0){
            callback(err,deleteNum);
        }
        else{
            callback(new Error("You don't have permission to delete this comment"),null);
        }
    })
}

module.exports=service;