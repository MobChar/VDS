const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = require('../DiskStorage/UploadDiskStorage');
const util = require('util');
const validator = require('validator');
const services = require('../Services/v1Service');


//Video info
//Return video info, path to stream video
router.get('/:videoId', function (req, res) {
    const errors = [];
    if (typeof req.params.videoId!=='string'||!validator.isLength(req.params.videoId, { min: 5, max: 100 })) errors.push({ path: "videoID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }


    services.playback.getVideo(req.params.videoId, (err, docs) => {
        if(err) return res.status(500).end(err.message);
        if (docs.length > 0)
            res.status(200).end(JSON.stringify(docs));
        else res.status(404).end("Video not found");
    })
})

router.get('/', function (req, res) {
    services.playback.suggestVideo((err,docs)=>{
        if(err) return res.status(500).end(err.message);
        res.status(200).end(JSON.stringify(docs));
    })
})

var cpUpload = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]);
router.post('/', cpUpload, function (req, res) {
    const errors = [];
    if (typeof req.body.title!=='string'||!validator.isLength(req.body.title, { min: 5, max: 100 })) errors.push({ path: "title", message: "string from 5-100" });
    if (req.files===undefined||req.files.image === undefined) errors.push({ path: "image", message: "file must not empty" });
    if (req.files===undefined||req.files.video === undefined) errors.push({ path: "video", message: "file must not empty" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }
    

    services.playback.uploadVideo(req.channel._id,req.body.title,req.files.image[0],req.files.video[0],(err,newDoc)=>{
        if(err) return res.status(500).end(err.message);
        res.status(200).json(newDoc);
    })
})

module.exports = router;


