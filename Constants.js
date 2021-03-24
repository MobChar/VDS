const { resolve } = require('path');

resolve = require('path').resolve;
module.exports={
    VIDEO_ASSET_DIR: resolve('Asset/VideoAsset'),
    IMAGE_ASSET_DIR:resolve('Asset/ImageAsset'),
    VIEW_ASSET_DIR:resolve('View'),
    DEFAULT_IMAGE_PATH:'/imageAsset/default.png'
}