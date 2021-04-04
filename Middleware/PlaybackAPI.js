const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = require('../DiskStorage/UploadDiskStorage');
const util = require('util');
const validator = require('validator');
const services = require('../Services/v1Service');


//video/
//Video info
//Return video info, path to stream video

//Lay chi tiet video
router.get('/:videoId', function (req, res) {
    const errors = [];
    if (typeof req.params.videoId !== 'string' || !validator.isLength(req.params.videoId, { min: 5, max: 100 })) errors.push({ path: "videoID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }


    services.playback.getVideo(req.params.videoId, (err, docs) => {
        if (err) return res.status(500).end(err.message);
        if (docs.length > 0) {
            services.playback.increaseView(req.params.videoId, (err2, numReplaced)=>{
            });

            return res.status(200).end(JSON.stringify(docs));
        }
        else return res.status(404).end("Video not found");
    })
})


router.get('/', function (req, res) {
    if (req.session === undefined || req.session.passport === undefined || req.session.passport.user === undefined) return res.status(401).end('You must authorized to google modify this resource');

    if (req.query.channelId === undefined) {
        services.playback.suggestVideo(req.session.passport.user.id, function(err, docs) {
            if (err) return res.status(500).end(err.message);
            return res.status(200).end(JSON.stringify(docs));
        })
    }
    else {
        services.playback.allChannelVideo(req.query.channelId, function(err2, docs2) {
            if (err2) return res.status(500).end(err2.message);
            res.status(200).end(JSON.stringify(docs2));
        })

    }

})


//Upload video
var cpUpload = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]);
router.post('/', cpUpload, function (req, res) {
    const errors = [];
    if (typeof req.body.title !== 'string' || !validator.isLength(req.body.title, { min: 5, max: 100 })) errors.push({ path: "title", message: "string from 5-100" });
    if (typeof req.body.description !== 'string' || !validator.isLength(req.body.description, { min: 5, max: 100 })) errors.push({ path: "description", message: "string from 5-100" });
    if (req.files === undefined || req.files.image === undefined) errors.push({ path: "image", message: "file must not empty" });
    if (req.files === undefined || req.files.video === undefined) errors.push({ path: "video", message: "file must not empty" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }


    services.playback.uploadVideo(req.channel._id, req.body.title, req.body.description, req.files.image[0], req.files.video[0],
        (progress) => {
            res.write(progress.timemark + '\n');
        },
        (err, newDoc) => {
            if (err) return res.status(500).end(err.message);
            return res.end();
        })
})

module.exports = router;


