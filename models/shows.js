var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Show = new Schema({
    _id: Number,
    seriesName: String,
    airsDayOfWeek: String,
    airsTime: String,
    firstAired: Date,
    genre: [String],
    network: String,
    overview: String,
    rating: Number,
    ratingCount: Number,
    status: String,
    banner: String,
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }]
});

var Show = mongoose.model('Show', Show);
module.exports = Show;