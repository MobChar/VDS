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
     
    if (req.query.channelId === undefined) {
        if (req.session === undefined || req.session.passport === undefined || req.session.passport.user === undefined) return res.status(401).end('You must authorized to google to get suggest video');

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

var responseOnUploadProgress={};

//Upload video
var cpUpload = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]);
router.post('/',function (req, res){
    cpUpload(req, res, err => {
        if(err)  return res.status(400).end(uploadErr.message); 

        const errors = [];
        if (typeof req.body.title !== 'string' || !validator.isLength(req.body.title, { min: 5, max: 100 })) errors.push({ path: "title", message: "string from 5-100" });
        if (typeof req.body.description !== 'string' || !validator.isLength(req.body.description, { min: 5, max: 100 })) errors.push({ path: "description", message: "string from 5-100" });
        if (req.files === undefined || req.files.image === undefined) errors.push({ path: "image", message: "file must not empty" });
        if (req.files === undefined || req.files.video === undefined) errors.push({ path: "video", message: "file must not empty" });
        if (errors.length > 0) {
            return res.status(400).json({ errors: errors });
        }

        

        services.playback.uploadVideo(req.channel._id, req.body.title, req.body.description, req.files.image[0], req.files.video[0],
            (progressInPercent) => {         
            //    console.log(responseOnUploadProgress);
                res.write(progressInPercent + '\n');
                if(responseOnUploadProgress.hasOwnProperty(req.channel._id+'')){
                    // console.log('asd');
                    responseOnUploadProgress[req.channel._id+''].write("data: "+progressInPercent+"\n\n" );
                }
            },
            (err, newDoc) => {
                if (err) {
                    if(responseOnUploadProgress.hasOwnProperty(req.channel._id+'')){
                    responseOnUploadProgress[req.channel._id+''].end();

                    delete responseOnUploadProgress[req.channel._id+''];
                    }
                    

                    return res.status(500).end(err.message);
                }
                else{
                    if(responseOnUploadProgress.hasOwnProperty(req.channel._id+'')){
                        responseOnUploadProgress[req.channel._id+''].end();
        
                        delete responseOnUploadProgress[req.channel._id+''];
                        }
                
                
                    return res.end();
                }
            })
    });
});
router.get('/upload/progress',function(req,res){
    const errors = [];
    if (typeof req.query.channelId !== 'string' || !validator.isLength(req.query.channelId, { min: 5, max: 100 })) errors.push({ path: "channelId", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }
    responseOnUploadProgress[req.query.channelId]=res;
    res.writeHeader(200, {"Content-Type": "text/event-stream"});  
});


router.put('/',cpUpload,function(req,res){
    const modifyAttributes={};
    if(req.body.videoId===undefined) return res.status(400).status("Modify videoId is missing");
    if (typeof req.body.title === 'string' && validator.isLength(req.body.title, { min: 5, max: 100 })) modifyAttributes.title=req.body.title;
    if (typeof req.body.description === 'string' && validator.isLength(req.body.description, { min: 5, max: 100 })) modifyAttributes.description=req.body.description;

    services.playback.modifyVideo(req.channel._id,req.body.videoId,modifyAttributes,req.files===undefined||req.files.image===undefined?null:req.files.image[0], function(err2, docs2) {
        if (err2) return res.status(500).end(err2.message);
        res.status(200).end(JSON.stringify(docs2));
    })

    
})

router.delete('/',function(req,res){
    services.playback.deleteVideo(req.channel._id,req.body.videoId, function(err2, docs2) {
        if (err2) return res.status(500).end(err2.message);
        res.status(200).end(JSON.stringify(docs2));
    })
})

module.exports = router;


