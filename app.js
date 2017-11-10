const express = require('express');
const app = express();
require('./db');
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

var mongoose = require('mongoose');

var User = mongoose.model('User');
var Playlist = mongoose.model('Playlist');
var Video = mongoose.model('Video');

var loggedin = true;

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
	    	res.render('home.hbs', {Playlist: varToStoreResult});
		});
	}
	else{
		res.redirect('/login');
	}
});

//implementing youtube api search function
app.get('/browse', function(req, res){
	//this will render youtube API searchlist to display search videos
	// function handleAPILoaded(){
	// 	4('#search-button').attr('disabled', false);
	// }
	// function search(){
	// 	var q = $('query').val();
	// 	var request = gapi.client.youtube.searchlist({
	// 		q: q,
	// 		part: 'snippet'
	// 	});

	// 	request.execute(function(response){
	// 		var str = JSON.stringify(response.result);
	// 		$('#search-container').html('<pre>' + str + '</pre>');
	// 	});
	// }

	res.render('browse.hbs');
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
