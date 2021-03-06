const express = require('express');
const router = express.Router();
const validator = require('validator');
const services=require('../Services/v1Service');


//channel/
//All channel
router.get('',function(req,res){
    //Neu co session tra ve xem da subscribe kenh chua
    services.channel.getAllChannel(req.session===undefined||req.session.passport===undefined?null:req.session.passport.user.id, (err, docs) => {
        if(err) return res.status(500).end(err.message);
        return res.status(200).end(JSON.stringify(docs));
    })
   
});


router.get('/:channelId',function(req,res){
    const errors = [];
    if (typeof req.params.channelId!=='string'||!validator.isLength(req.params.channelId, { min: 5, max: 100 })) errors.push({ path: "channelID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    services.channel.getChannel(req.params.channelId, (err, docs) => {
        if(err) return res.status(500).end(err.message);
        return res.status(200).end(JSON.stringify(docs));
    })
   
});




//Trendy user
router.get('/:channelId/top',function(req,res){
    const errors = [];
    if (typeof req.params.channelId!=='string'||!validator.isLength(req.params.channelId, { min: 5, max: 100 })) errors.push({ path: "channelID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }
    services.channel.mostLikedUser(req.params.channelId,(err, docs) => {
        if(err) return res.status(500).end(err.message);
            return res.status(200).end(JSON.stringify(docs));
    })
})


// var cpUpload = upload.fields([{ name: 'channelImage', maxCount: 1 }])
// router.post('/',cpUpload,function(req,res){
//     // console.log(req);
//     // connectDB((err, client) => {
//     //     if (err) {
//     //         console.log(err);
//     //     }
//     //     else {
//     //         try {
//     //             let db = client.db('projectDB');
//     //             let collection = db.collection('channel');
//     //             collection.insertOne({ name: req.body.name, imagePath:`/image/${req.files.channelImage[0].filename}`});
//     //             res.end("OK");


//     //         } catch (dbconnectErr) {
//     //             console.log(dbconnectErr);
//     //         }
//     //         finally {
//     //             client.close();
//     //         }
//     //     }
//     // })
// })


module.exports=router;