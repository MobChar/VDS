const { standardEncodeAndSaveToM3U8 } = require('./VideoConverter');
const HLSProvider = require('./HLSProvider');
const Constants = require('./Constants');
const app = require('express')();
const fs = require('fs');
const hls = require('hls-server');
const bodyParser = require('body-parser');
const playbackAPI = require('./Middleware/PlaybackAPI');
const channelAPI = require('./Middleware/ChannelAPI');
const commentAPI = require('./Middleware/CommentAPI');
const likeAPI = require('./Middleware/LikeAPI');
const subscribeAPI = require('./Middleware/SubscribeAPI');
const express = require('express');
const authMiddleware = require('./Security/AuthencationMiddleware');
const passport = require('./Security/Passport');
const expressSession = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { resolveSoa } = require('dns');
const db = require('./DB/NeDB');


app.use(cors({origin: function(origin, callback){
    return callback(null, [origin]);
  },
  optionsSuccessStatus: 200,
  credentials: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//Session filter in comment path
// app.use('/comment', expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: { secure: false, httpOnly: false } }));
// app.use('/comment', passport.initialize());
// app.use('/comment', passport.session());

app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: { secure: false, httpOnly: false } }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/demo',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./test.html'));  
        res.end();  

})
// change code after clone
// app.use('/static', express.static('./public'));
app.get('/login',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./View/User/Login.html'));  
        res.end();
})
app.get('/logout',(req,res)=>{
    if(req.session!=undefined)
    req.session.destroy();
    res.status(200).end("OK");
})
app.get('/newfeed',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./View/User/NewFeeds.html'));  
        res.end();
})
app.get('/detail',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./View/User/DetailVideo.html'));  
        res.end();
})
app.get('/allchannel',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./View/User/Channel.html'));  
        res.end();
})
app.get('/allchannel/channel',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./View/User/DetailChannel.html'));  
        res.end();
})
app.get('/admin/login',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./View/Admin/Login.html'));  
        res.end();
})
app.get('/admin/managevideo',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./View/Admin/ManageVideo.html'));  
        res.end();
})
app.get('/admin/video/detail',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write( fs.readFileSync('./View/Admin/DetailVideo.html'));  
        res.end();
})
// end change code 
//Key request
app.get('/key', (req, res) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    

   

    let channel = db.channel.find({ username: username, password: password }, function (err, docs) {
        if (docs.length > 0) {

            req.channel = docs[0];
            let token=jwt.sign({
                "username":username, "password":password
             }, 'MyKey', { expiresIn: '24h' });

            return res.status(200).json({token: token, channel:req.channel});
            // next();
        }
        else {
            return res.status(401).end('Authorization credentials not valid');
        }
    });
  
});


//JWT Filter
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

app.get('/comment/auth/google/success',function(req,res){
    res.writeHead(302, {
        'Location': '/newfeed'
        //add other headers here...
      });
    res.end(req.session.passport.user.id);
})

app.get('/comment/auth/info',function(req,res){
    res.status(200).json(req.session.passport.user);
})

app.use('/video', playbackAPI);
app.use('/channel', channelAPI);
app.use('/comment', commentAPI);
app.use('/like',likeAPI);
app.use('/subscribe',subscribeAPI);
app.use('/imageAsset', express.static(Constants.IMAGE_ASSET_DIR));
app.use('/videoAsset', express.static(Constants.VIDEO_ASSET_DIR));
app.use('/static',express.static(Constants.STATIC_ASSET_DIR));


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