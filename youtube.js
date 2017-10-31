const express = require('express');
const app = express();
require('./db');
const session = require('express-session');
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

var mongoose = require('mongoose');

var User = mongoose.model('User');
var Playlist = mongoose.model('Playlist');
var Video = mongoose.model('Video');

app.post('/add', function(req, res) {
	new Movie({
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		updated_at : Date.now()
	}).save(function(err, movie, count){
		let thismovie = {title: req.body.title, director: req.body.director, year: req.body.year};
		//req.session.movies.push(thismovie);
		if(sessionmovies[req.session.id] === undefined){
			sessionmovies[req.session.id] = [];
		}
		sessionmovies[req.session.id].push(thismovie);
		res.redirect('/mymovies');
	});    
});

app.get('/home', function(req, res) {
	Playlist.find({}, function(err, varToStoreResult, count) {
		console.log(varToStoreResult); // <---- variable contains found documents!
    	res.render('home.hbs', {varToStoreResult: sessionmovies[req.session.id]});
	});
});