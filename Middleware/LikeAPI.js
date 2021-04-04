const express = require('express');
const router = express.Router();
const validator = require('validator');
const services=require('../Services/v1Service');


router.post('/video/:videoId',function(req,res){
    const errors = [];
    if (typeof req.params.videoId!=='string'||!validator.isLength(req.params.videoId, { min: 5, max: 100 })) errors.push({ path: "videoID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    services.like.likeVideo(req.params.videoId,req.session.passport.user.id,(err,numReplaced)=>{
        if(err) return res.status(500).end(err.message);
        res.status(200).end(JSON.stringify(numReplaced));
    })
});


router.post('/comment/:commentId',function(req,res){
    const errors = [];
    if (typeof req.params.commentId!=='string'||!validator.isLength(req.params.commentId, { min: 5, max: 100 })) errors.push({ path: "commentID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    services.like.likeComment(req.params.commentId,req.session.passport.user.id,(err,numReplaced)=>{
        if(err) return res.status(500).end(err.message);
        res.status(200).end(JSON.stringify(numReplaced));
    })
});


module.exports = router;
