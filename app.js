const express = require('express');
const app = express();
require('./db');
app.set('view engine', 'hbs');
var $ = require('jquery');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

var mongoose = require('mongoose');

var User = mongoose.model('User');
var Playlist = mongoose.model('Playlist');
var Video = mongoose.model('Video');

var loggedin = true;
let search = "";
let array = undefined;

app.post('/home', function(req, res) {
	new Playlist({
		title: req.body.new_playlist
	}).save(function(err, playlist, count){
		console.log('success', playlist, count, err);
		res.redirect('/home');
	});    
});

app.get('/home', function(req, res) {
	if(loggedin){
		Playlist.find({}, function(err, varToStoreResult, count) {
			//console.log(varToStoreResult); // <---- variable contains found documents!
	    	//res.render('home.hbs', {varToStoreResult: sessionplaylist[userId]});
	    	res.render('home.hbs', {Playlist: varToStoreResult, array:array});
		});
	}
	else{
		res.redirect('/login');
	}
});

//implementing youtube api search function
app.get('/browse', function(req, res){
	Playlist.find({}, function(err, varToStoreResult, count) {
    	res.render('browse.hbs', {Playlist: varToStoreResult});
	});
});

app.post('/browse', function(req, res){
	res.redirect('/browse');
});

app.get('/playlist', function(req, res){
	res.render('playlist.hbs');
});

app.get('/playlist/:slug', function(req, res){
	ImagePost.find({slug:req.params.slug},(err, post, count)=>{
		res.render('playlist', {playlist: post});
	} )
});



//login will GET user authentication for login via Youtube API
app.get('/login', function(req, res){
//var google = require('googleapis');
//var OAuth2 = google.auth.OAuth2;
//var oauth2Client = new OAuth2(
// 	YOUR_CLINET_ID,
// 	YOUR_CLIENT_SECRET,
// 	YOUR_REDIRECT_URL
// );
	res.render('login.hbs');
});


//since I will be using Youtube API, Sign up will be removed 
app.post('/login', function(req, res){
	res.render('login.hbs');
});

app.listen(process.env.PORT || 3000);

// $("#results").append("<text area rows=\"1\" cols=\"100\">https://www.youtube.com/embed/"+item.id.videoId+"</textarea>");