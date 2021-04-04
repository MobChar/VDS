const e = require('express');
const db = require('../DB/NeDB');
const channelService = require('./v1ChannelService');



service = {};
service.subscribe = function (channelId, googleId, callback) {
    channelService.getChannel(channelId, (err, docs) => {
        if (err) return callback(err, null);
        else if (docs = null) return callback(new Error("Channel not found"), null);
        else
            db.subscribe.findOne({ channelId: channelId, googleId: googleId }, function (err, docs) {
                if (err) {
                    return callback(err, docs);
                }
                else if (docs !== null) {
                    return callback(new Error("Already subscribed"), null);
                }
                else {
                    db.subscribe.insert({ channelId: channelId, googleId: googleId }, function (err2, docs2) {
                        if (err2) {
                            return callback(err2, null);
                        }
                        else return callback(null, docs2);
                    })
                }
            })
    })

};

service.unsubscribe = function (channelId, googleId, callback) {
    channelService.getChannel(channelId, (err, docs) => {
        if (err) return callback(err, null);
        else if (docs = null) return callback(new Error("Channel not found"), null);
        else
            db.subscribe.remove({ channelId: channelId, googleId: googleId }, function (err, numRemoved) {
                if (err) {
                    return callback(err, null);
                }
                else return callback(null, numRemoved);
            })

    });
};

module.exports = service;