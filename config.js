module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl': 'mongodb://localhost:27017/watchHours',
    'facebook': {
        //App ID
        clientID: '496648813792811',
        clientSecret: '291201a471d0ef0f4d0645f27ce8aa86',
        callbackURL: 'https://localhost:3443/users/facebook/callback',
        profileFields: ['displayName', 'email', 'name'],
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }
}