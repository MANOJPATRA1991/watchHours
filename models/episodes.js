var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Episode = new Schema({
    _id: Number,
    airedEpisodeNumber: Number,
    airedSeason: Number,
    director: String,
    episodeName: String,
    episodeImage: String,
    firstAired: Date,
    guestStars: [
      String
    ],
    overview: String,
    seriesId: Number,
    writers: [
      String
    ]
});

var Episode = mongoose.model('Episode', Episode);
module.exports = Episode;