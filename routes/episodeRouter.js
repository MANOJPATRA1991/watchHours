var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var TVDB = require('node-tvdb');
var async = require('async');
var _ = require('lodash');

var Show = require('../models/shows');
var Episode = require('../models/episodes');

var Verify = require('./verify');

var episodeRouter = express.Router();

episodeRouter.use(bodyParser.json());
var BASE_IMAGE_URL = "https://thetvdb.com/banners/";

episodeRouter.route('/')
    .get(function(req, res, next){
        // /?seriesId=
        var seriesId = req.query.seriesId;
        var episodes = [];
        if (seriesId) {
            // find all episodes for a particular series id
            // sort first by season, then by episode
            episodes = Episode.find().where({seriesId: seriesId}).sort('airedSeason airedEpisodeNumber'); 
        }

        // execute the query episodes.find()
        episodes.find().exec(function(err, episodes) {
            // if any error exist, move to the next middleware function
            if (err) next(err);
            // write result to the response as json
            res.json(episodes);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        // the tmdb api key for my account
        var apiKey = '5BB799C77561B167';
        
        // create a new TVDB instance
        var tvdb = new TVDB(apiKey);

        var seriesImdbId = req.body.IMDB;

        // get series by IMDB ID
        tvdb.getSeriesByImdbId(seriesImdbId)
        .then(response => {
            // retrieve series id from the returned data
            // and search for series data from TVDB
            console.log(response[0].id);
            tvdb.getSeriesAllById(response[0].id)
            .then(response => {
                var episodes = response.episodes;
                // create new Episode objects
                _.each(episodes, function(episode) {
                    tvdb.getEpisodeById(episode.id)
                    .then(response => {
                        var episode = new Episode({
                            _id: response.id,
                            airedEpisodeNumber: response.airedEpisodeNumber,
                            airedSeason: response.airedSeason,
                            director: response.director,
                            episodeName: response.episodeName,
                            episodeImage: BASE_IMAGE_URL + response.filename,
                            firstAired: response.firstAired,
                            guestStars: response.guestStars,
                            overview: response.overview,
                            seriesId: response.seriesId,
                            writers: response.writers
                        })

                        Episode.create(episode, function(err, newEpisode){
                            if(err){
                                if (err) {
                                    if (err.code == 11000) {
                                        console.log('Episode already exists');
                                        return res.status(409).end('Episode already exists!');
                                    }
                                    next(err);
                                }
                            }
                            console.log('Episode created!');
                            var id = newEpisode._id;
                        });
                    })
                    .catch(error => {next(error);});
                });
            })
            .catch(error => {next(error);})
            })
        .catch(error => {next(error);});
    });
    


module.exports = episodeRouter;