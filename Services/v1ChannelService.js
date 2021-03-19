const db = require('../DB/NeDB');



service = {};
service.getChannel = function (channelId, callback){
    db.channel.find({ _id: channelId }, function (err, docs) {
        callback(err, docs);
    });
};

module.exports = service;