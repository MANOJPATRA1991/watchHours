var express = require('express');

var cors = require('cors');

var router = express.Router();

var passport = require('passport');
var bodyParser = require('body-parser');

var User = require('../models/users');
var Verify = require('./verify');

router.use(bodyParser.json());

var myHasher = function(password, tempUserData, insertTempUser, callback) {
                      var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                      return insertTempUser(hash, tempUserData, callback);
                    };

nev.configure({
    verificationURL: 'http://localhost:3443/#!/email-verification/${URL}',
    URLLength: 48,
    persistentUserModel: User,
    tempUserCollection: 'tempusers',
 
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'patra.manoj0@gmail.com',
            pass: 'MAN@1991'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <patra.manoj0@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    },
    shouldSendConfirmation: false
  }, function(error, options){
});

/* GET users listing. */
router.route('/')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    User.find({}, function (err, user) {
        if (err) next(err);
        res.json(user);
    });
});

nev.generateTempUserModel(User);
 
// using a predefined file 
var TempUser = require('../models/tempUserModel');
nev.configure({
    tempUserModel: TempUser
}, function(error, options){
});

// user registration
router.post('/register', function(req, res){
    User.register(new User({
                      username: req.body.username, 
                      email: req.body.email
                    }), req.body.password, function(err, user){
        if(err){
            return res.status(500).json({err: err});
        }
       
        if(req.body.firstname){
            user.firstname = req.body.firstname;
        }
        
        if(req.body.lastname){
            user.lastname = req.body.lastname;
        }
        nev.createTempUser(user, function(err, existingPersistentUser, newTempUser) {
            // some sort of error 
            if (err)
                // handle error... 
                return res.status(200).json({err: 'Could not log in user'}); 
    
            // user already exists in persistent collection... 
            if (existingPersistentUser)
                return res.status(500).json("User already exists. Login to continue");
         
            // a new user 
            if (newTempUser) {
                var URL = newTempUser[nev.options.URLFieldName];
                nev.sendVerificationEmail(email, URL, function(err, info) {
                    if (err)
                        // handle error... 
                        return res.status(500).json("Could not login user");
                    // flash message of success 
                    console.log("email sent!");
                });
         
            // user already exists in temporary collection... 
            } else {
                // flash message of failure...
                console.log("Cannot create user. User already exists"); 
            }
        });

        var url = '...';
        nev.confirmTempUser(url, function(err, user) {
            if (err)
                // handle error... 
                return res.status(500).json("Could not create user");
            // user was found! 
            if (user) {
              // optional 
              nev.sendConfirmationEmail(user['email_field_name'], function(err, info) {
                  // redirect to their profile... 
                  user.save(function(err, user){
                    passport.authenticate('local')(req, res, function(){
                        return res.status(200).json({status: 'Account Registered! Please check your email for activation'}); 
                    }); 
                  });
              });
            }
            
            // user's data probably expired... 
            else
                // redirect to sign-up 
                redirect('/register');  
        });
    }); 
});

// login user
router.post('/login', function(req, res, next){
    // An optional info argument will be passed, containing additional details provided by the strategy's verify callback.
   passport.authenticate('local', function(err, user, info){
       if(err){
           return next(err);
       }
       if(!user){
           return res.status(401).json({
               err: info
           });
       }
       // user will be assigned to req.user if login completes
       req.logIn(user, function(err){
           if(err){
               return res.status(500).json({
                   err: 'Could not log in user.'
               });
           }
           
           console.log('User in users: ', user);
           
           var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
           
           res.status(200).json({
               status: 'Login successful!',
               success: true,
               token: token,
               admin: user.admin,
               _id: user._id
           });
       });
   })(req, res, next); //on success req.user contains the authenticated user
});

// logout user
router.get('/logout', function(req, res){
    //removes the req.user property and clear the login session
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

// facebook authentication with passport
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', function(req, res, next){
    passport.authenticate('facebook', function(err, user, info){
        if(err){
            return next(err);
        }
        if(!user){
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err){
            if(err){
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});

            res.redirect(303, 'https://localhost:3443/#!/?token=' + token + '&user=' + user.username + '&_id=' + user._id);
        });
    })(req, res, next);
});

module.exports = router;
