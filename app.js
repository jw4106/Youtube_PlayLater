const express = require('express');
const app = express();
require('./db');

app.set('view engine', 'hbs');
var $ = require('jquery');

//==========PASSPORT============================
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret: 'AITBestClass', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//==============================================

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Playlist = mongoose.model('Playlist');
var Video = mongoose.model('Video');

//==========PASSPORT=================================================
app.get('/', function(req, res){
	res.render('index.hbs');
});

//login will GET user authentication for login via Youtube API
app.get('/login', function(req, res){
	res.render('login.hbs', {message: req.flash('loginMessage')});
});

app.post('/login', passport.authenticate('local-login', {
	successRedirect: '/home',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('/signup', function(req, res){
	res.render('signup.hbs', {message: req.flash('signupMessage')});
});

app.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/home',
	failureRedirect: '/signup',
	failureFlash : true
}));

app.get('/profile', isLoggedIn, function(req, res){
	res.render('profile.hbs', {
		user : req.user
	});
});

app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}
//====================================================================================

let array = undefined;

app.post('/home',isLoggedIn, function(req, res) {

	let playlist = new Playlist({title: req.body.new_playlist, videoIdArray: []});
	console.log(playlist);
	User.findOneAndUpdate(
		{
			"local.email":req.user.local.email
		}, 
		{
			$push: 
			{
				playlists: playlist
			}
		}, 
		function(err, post, count){
			res.redirect('/home');
		});	

});

app.get('/home', isLoggedIn,function(req, res) {
	User.find({"local.email":req.user.local.email}, function(err, user, count) {
    	res.render('home.hbs', {Playlist: req.user.playlists, user:req.user.local});
	});
});

//implementing youtube api search function
app.get('/browse', isLoggedIn, function(req, res){
	res.render('browse.hbs', {Playlist: req.user.playlists});
});


app.post('/browse', isLoggedIn, function(req, res){
	console.log("test");
	console.log(req.body.videolink + " " + req.body.playlistchoice);
	res.redirect('/browse');
});


app.get('/playlist/:slug', isLoggedIn, function(req, res){
	User.find({"local.email":req.user.local.email},(err, post, count)=>{
		console.log(post.playlist);
		res.render('playlist2', {playlist: post.playlist});
	})
});

app.listen(process.env.PORT || 3000);
