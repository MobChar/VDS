const multer = require('multer');
const path = require('path');
const Constants=require('../Constants');
const fs = require('fs');

//Set Storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(Constants.IMAGE_ASSET_DIR)){
            fs.mkdirSync(Constants.IMAGE_ASSET_DIR);
        }

        if (!fs.existsSync(Constants.VIDEO_ASSET_DIR)){
            fs.mkdirSync(Constants.VIDEO_ASSET_DIR);
        }
     
        let ext = path.extname(file.originalname);
        if (ext === '.jpg')
            cb(null, Constants.IMAGE_ASSET_DIR);
        else if (ext === '.mp4')
            cb(null, Constants.VIDEO_ASSET_DIR);
        // cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        if (ext === '.jpg' ){
            if (file.size<=1024)
             return cb(null, true);
            else return cb(new Error('Image size <= 1024 bytes'));
        }
        else if(ext === '.mp4'){
            if (file.size<=10240)
            return cb(null, true);
           else return cb(new Error('Video size <= 10240 bytes'));
        }
        else cb(new Error('File type not supported'));

        // // You can always pass an error if something goes wrong:
        // cb(new Error('File type not supported'))

    }
})

module.exports = upload;