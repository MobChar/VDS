const express = require('express');
const router = express.Router();
const validator = require('validator');
const { channel } = require('../DB/NeDB');
const services = require('../Services/v1Service');

router.post('/:channelId', function (req, res) {
    const errors = [];
    if (typeof req.params.channelId !== 'string' || !validator.isLength(req.params.channelId, { min: 5, max: 100 })) errors.push({ path: "channelID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }


    services.subscribe.subscribe(req.params.channelId, req.session.passport.user.id, (err2, newDoc) => {
        if (err2) return res.status(500).end(err2.message);
        return res.status(200).end(JSON.stringify(newDoc));
    });

});

router.delete('/:channelId', function (req, res) {
    const errors = [];
    if (typeof req.params.channelId !== 'string' || !validator.isLength(req.params.channelId, { min: 5, max: 100 })) errors.push({ path: "channelID", message: "string from 5-100" });
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }


    services.subscribe.unsubscribe(req.params.channelId, req.session.passport.user.id, (err2, numRemoved) => {
        if (err2) return res.status(500).end(err2.message);
        return res.status(200).end(JSON.stringify(numRemoved));
    })





})


module.exports = router;