const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const projConst = require('./Constants');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

function standardEncodeAndSaveToM3U8(filePath, encodedFileDirName, funcOnStart, funcOnError, funcOnProgress, funcOnEnd) {
    var infs = new ffmpeg;

    if (!fs.existsSync(`${projConst.VIDEO_ASSET_DIR}/${encodedFileDirName}/720p`)){
        fs.mkdirSync(`${projConst.VIDEO_ASSET_DIR}/${encodedFileDirName}/720p`,{ recursive: true });
    }
    if (!fs.existsSync(`${projConst.VIDEO_ASSET_DIR}/${encodedFileDirName}/360p`)){
        fs.mkdirSync(`${projConst.VIDEO_ASSET_DIR}/${encodedFileDirName}/360p`,{ recursive: true });
    }


    infs.addInput(filePath)
        .withSize('1280x720').autopad('black')
        .output(`${projConst.VIDEO_ASSET_DIR}/${encodedFileDirName}/720p/prog.m3u8`)
        .outputOptions('-hls_list_size 0')
        .on('start', function (commandLine) {
            if (funcOnStart !== null) {
                funcOnStart(commandLine);
            }
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', function (err, stdout, stderr) {
            if (funcOnError !== null) {
                funcOnError(err, stdout, stderr);
            }
            console.log('An error occurred: ' + err.message, err, stderr);
        })
        .on('progress', function (progress) {
            if (funcOnProgress !== null) {
                funcOnProgress(progress);
            }
            console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', function (err, stdout, stderr) {
            if (funcOnEnd !== null) {
                console.log('Call func on end')
                funcOnEnd(err, [`/${encodedFileDirName}/720p/prog.m3u8`,`/${encodedFileDirName}/360p/prog.m3u8`]);
            }
            console.log('Finished processing!' /*, err, stdout, stderr*/);
        })
        .withSize('640x360').autopad('black')
        .output(`${projConst.VIDEO_ASSET_DIR}/${encodedFileDirName}/360p/prog.m3u8`)
        .outputOptions('-hls_list_size 0')
        .run();
}

module.exports = { standardEncodeAndSaveToM3U8: standardEncodeAndSaveToM3U8 };