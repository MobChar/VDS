var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const passport = require("passport");
const db= require('../DB/NeDB');


passport.use(new GoogleStrategy({
    clientID:     '624446983148-ojji55e759nbp9iob1er3i52ha962b43.apps.googleusercontent.com',
    clientSecret: 'hN8bvTOc-J4X9RoR8NQ7yNwf',
      //callbackURL:"https://video-vds.herokuapp.com/comment/auth/google/callback",
      callbackURL: "http://localhost:3000/comment/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //Save user profile
       
        db.user.insert({_id: profile.id, email: profile.email, name: profile.displayName, image: profile.picture});
       
        // request.user=profile;
        return done(null, profile);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports=passport;

