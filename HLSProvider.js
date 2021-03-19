const fs = require('fs');
const projConst = require('./Constants');

module.exports = {
    exists: (req, cb) => {
        const ext = req.url.split('.').pop();
        // const path=req.url.split('/')[1];
        // const filePath=req.url.replace('/^(www\.)/','');

        // console.log(path);
        // console.log(filePath);

        if (ext !== 'm3u8' && ext !== 'ts') {
            return cb(null, true);
        }

        fs.access(`${projConst.VIDEO_ASSET_DIR}/` + req.url, fs.constants.F_OK, function (err) {
            if (err) {
                console.log(`${projConst.VIDEO_ASSET_DIR}/` + req.url);
                console.log('HLS Provider file not exist');
                return cb(null, false);
            }
            cb(null, true);
        });
    },
    getManifestStream: (req, cb) => {
        const stream = fs.createReadStream(`${projConst.VIDEO_ASSET_DIR}/` + req.url);
        cb(null, stream);
    },
    getSegmentStream: (req, cb) => {
        const stream = fs.createReadStream(`${projConst.VIDEO_ASSET_DIR}/` + req.url);
        cb(null, stream);
    }
}
