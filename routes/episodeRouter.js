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

episodeRouter.route('/:seriesId')
    .get(function(req, res, next){
        // /?seriesId=
        var seriesId = req.params.seriesId;
        var episodes = [];
        if (seriesId) {
            // find all episodes for a particular series id
            // exclued episodes with airedSeason equals 0
            // sort first by season, then by episode
            episodes = Episode.find().where({seriesId: seriesId,
                                    airedSeason: {$gte: 0}}).sort('airedSeason airedEpisodeNumber'); 
        }

        // execute the query episodes.find()
        episodes.find()
            .populate('comments.postedBy')
            .exec(function(err, episodes) {
            // if any error exist, move to the next middleware function
            if (err) next(err);
            // write result to the response as json
            res.json(episodes);
        });
    });

episodeRouter.route('/')
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
            tvdb.getSeriesAllById(response[0].id)
            .then(response => {
                var episodes = response.episodes;
                // create new Episode objects
                _.each(episodes, function(episode) {
                    tvdb.getEpisodeById(episode.id)
                    .then(response => {
                        console.log(response.airedSeason, response.airedEpisodeNumber);
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
                            writers: response.writers,
                            comments: []
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

episodeRouter.route('/:episodeId/comments')
    .get(function (req, res, next) {
        Episode.findById(req.params.episodeId)
            .populate('comments.postedBy')
            .exec(function (err, episode) {
                if (err) next(err);
                res.json(episode.comments);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Episode.findById(req.params.episodeId, function (err, episode) {
            if (err) next(err);

            req.body.postedBy = req.decoded._id;

            episode.comments.push(req.body);
            episode.save(function (err, episode) {
                if (err) next(err);
                console.log('Updated Comments!');
                res.json(episode);
            });
        });
    });

episodeRouter.route('/:episodeId/comments/:commentId')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Episode.findById(req.params.episodeId)
            .populate('comments.postedBy')
            .exec(function (err, episode) {
                if (err) next(err);
                res.json(episode.comments.id(req.params.commentId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Episode.findById(req.params.episodeId, function (err, episode) {
            if (err) next(err);
            episode.comments.id(req.params.commentId).remove();

            req.body.postedBy = req.decoded._id;

            episode.comments.push(req.body);
            episode.save(function (err, episode) {
                if (err) next(err);
                console.log('Updated Comments!');
                res.json(episode);
            });
        });
    });

module.exports = episodeRouter;