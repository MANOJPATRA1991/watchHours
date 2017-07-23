var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');
var tempUser = new Schema({
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,

    OauthId: String,
    OauthToken: String,

    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type:String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    GENERATED_VERIFYING_URL: String
});

//User instance method
tempUser.methods.getName = function(){
    return (this.firstname + ' ' + this.lastname);
}

// User.methods.comparePassword= function(password){
//     return bcrypt.compareSync(password, this.password);
// }

tempUser.plugin(passportLocalMongoose);

var tempUser = mongoose.model('tempUser', tempUser);
module.exports = tempUser;