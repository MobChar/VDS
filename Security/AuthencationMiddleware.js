const jwt = require('jsonwebtoken');
const extractToken = require('./TokenExtractor');
const db = require('../DB/NeDB');

const auth = async (req, res, next) => {
    console.log(req.url);
    console.log(req);


    //Extract token and decode 
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        //Comment use session
        if (req.url.split('/')[1] === 'comment') {
            console.log("URL " + req.url);
            //Check if have session
            if (req.session === undefined || req.session.passport === undefined || req.session.passport.user === undefined) res.status(401).end('You must authorized to google modify this resource');
            else next();
        }
        else {
            let token = extractToken(req);
            console.log(token);
            if (token === null) res.status(401).end('You must authorized to modify this resource');
            else {
                jwt.verify(token, 'MyKey', function (err, decoded) {
                    if (err) {
                        console.log(err);
                        res.status(401).end('Authorization credentials not valid');
                    }
                    else {
                        //Query db get authorization info
                        console.log(decoded);
                        let channel = db.channel.find({ username: decoded.username, password: decoded.password }, function (err, docs) {
                            if (docs.length > 0) {

                                req.channel = docs[0];
                                next();
                            }
                            else {
                                res.status(401).end('Authorization credentials not valid');
                            }
                        });

                        // console.log('///aaaaa');
                        // console.log(channel);
                    }
                })
            }
        }
    }
    else next();


}
module.exports = auth;