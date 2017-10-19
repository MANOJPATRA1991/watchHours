var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

//requires the model with Passport-Local Mongoose plugged in
var User = require('./models/users');

var config = require('./config');

//use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

//use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.facebook = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: config.facebook.profileFields
}, function(accessToken, refreshToken, profile, done){

    // asynchronous
    process.nextTick(function() {

        User.findOne({OauthId: profile.id}, function(err, user){
            if(err){
                return {err: 'Cannot reach facebook server. Try after sometime'};
            }
            if(!err && user !== null){
                done(null, user);
            }else{
                user = new User({
                    username: profile.displayName
                });
                user.email= profile.emails[0].value || '';
                user.OauthId = profile.id;
                user.OauthToken = accessToken;
                user.save(function(err){
                    if(err){
                        done(err);
                    }else{
                        done(null, user);
                    }
                });
            }
        });
    });

}));