var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Show = require('../models/shows');
var User = require('../models/users');

var Verify = require('./verify');

var subscription = express.Router();

subscription.use(bodyParser.json());

subscription.route('/subscribe')
    .post(Verify.verifyOrdinaryUser, function(req, res, next){
        Show.findById(req.body.showId, function(err, show) {
            if (err) return next(err);
            show.subscribers.push(req.body.uid);
            show.save(function(err) {
                if (err) return next(err);
                res.send(200);
            });
        });
    });

subscription.route('/unsubscribe')
    .post(Verify.verifyOrdinaryUser, function(req, res, next){
        Show.findById(req.body.showId, function(err, show) {
            if (err) return next(err);
            var index = show.subscribers.indexOf(req.body.uid);
            show.subscribers.splice(index, 1);
            show.save(function(err) {
                if (err) return next(err);
                res.send(200);
            });
        });
    });

module.exports = subscription;