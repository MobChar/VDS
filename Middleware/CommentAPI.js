const express = require('express');
const router = express.Router();
const validator = require('validator');
const services = require('../Services/v1Service');

//Get all comment about video 
router.get('/:videoId', function (req, res) {
    const errors = [];
    if (typeof req.params.videoId!=='string'||!validator.isLength(req.params.videoId, { min: 5, max: 100 })) errors.push({ path: "videoID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    services.comment.getVideoComment(req.params.videoId,(err, docs) => {
        if(err) return res.status(500).end(err.message);
        res.status(200).end(JSON.stringify(docs));
    });
})
router.post('/', function (req, res) {
    const errors = [];
    let content=req.body.content;
    let videoId=req.body.videoId;
    if (typeof content!=='string'||!validator.isLength(content, { min: 5, max: 100 })) errors.push({ path: "content", message: "string from 5-100" });
    if (typeof videoId!=='string'||!validator.isLength(videoId, { min: 5, max: 100 })) errors.push({ path: "videoId", message: "id of video. string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }


    services.comment.addVideoComment( req.session.passport.user.id, req.body.videoId, req.body.content ,
        (err, newDoc) => {
            if(err) return res.status(500).end(err.message);
            res.status(200).end("OK");
        });
})
module.exports = router;