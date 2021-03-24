const { standardEncodeAndSaveToM3U8 } = require('./VideoConverter');
const HLSProvider = require('./HLSProvider');
const Constants = require('./Constants');
const app = require('express')();
const fs = require('fs');
const hls = require('hls-server');
const bodyParser = require('body-parser');
const playbackAPI = require('./Middleware/PlaybackAPI');
const channelAPI = require('./Middleware/ChannelAPI');
const commentAPI=require('./Middleware/CommentAPI');
const express = require('express');
const authMiddleware = require('./Security/AuthencationMiddleware');
const passport = require('./Security/Passport');
const expressSession = require('express-session');
const cors=require('cors');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/comment',expressSession({secret: 'keyboard cat',  resave: true,saveUninitialized: true, cookie: {secure: false, httpOnly: false }}));
app.use('/comment',passport.initialize());
app.use('/comment',passport.session());
app.use(authMiddleware);

// var liveStreamURLList = [];

app.get('/', (req, res) => {
    return res.status(200).sendFile(`${Constants.VIEW_ASSET_DIR}/index.html`);
});
// app.get('/live-stream-list', (req, res) => {
//     return res.status(200).end(JSON.stringify({ liveStreamURLList }));
// })


//Oauth2
app.get('/comment/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/comment/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/comment/auth/google/success',
        failureRedirect: '/comment/auth/google/failure'
    }));

app.use('/video', playbackAPI);
app.use('/channel', channelAPI);
app.use('/comment',commentAPI);
app.use('/imageAsset', express.static(Constants.IMAGE_ASSET_DIR));
app.use('/videoAsset', express.static(Constants.VIDEO_ASSET_DIR))

//Init server
const server = app.listen(process.env.PORT || 3000);


//Init HLS Support
// new hls(server, { path: '/video', dir: Constants.VIDEO_ASSET_DIR });

// console.log("ok");

// //Init AMQP
// var rabbitChannel;
// const setUpRabbit = require('./AmqpService/RabbitMQConfig');
// const { connect } = require('http2');
// setUpRabbit.then(
//     result => {
//         rabbitChannel = result;

//         rabbitChannel.consume('open_live_stream', function (payload) {
//             let data = JSON.parse(payload.content);
//             liveStreamURLList.push(data.liveStreamURL);
//             console.log(liveStreamURLList);
//         }, {
//             noAck: true
//         });

//         rabbitChannel.consume('close_live_stream', function (payload) {
//             let data = JSON.parse(payload.content);
//         }, {
//             noAck: true
//         });
//     }
//     , error => {
//         console.log(error);
//         throw error;
//     });

// console.log("ok");