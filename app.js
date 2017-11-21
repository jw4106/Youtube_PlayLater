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

app.get('/home', isLoggedIn,function(req, res) {
	Playlist.find({}, function(err, varToStoreResult, count) {
		//console.log(varToStoreResult); // <---- variable contains found documents!
    	//res.render('home.hbs', {varToStoreResult: sessionplaylist[userId]});
    	res.render('home.hbs', {Playlist: varToStoreResult, array:array});
	});
});

//implementing youtube api search function
app.get('/browse', isLoggedIn, function(req, res){
	Playlist.find({}, function(err, varToStoreResult, count) {
    	res.render('browse.hbs', {Playlist: varToStoreResult});
	});
});

app.post('/browse', function(req, res){
	res.redirect('/browse');
});

app.get('/playlist', isLoggedIn, function(req, res){
	res.render('playlist.hbs');
});

app.get('/playlist/:slug', function(req, res){
	ImagePost.find({slug:req.params.slug},(err, post, count)=>{
		res.render('playlist', {playlist: post});
	} )
});

app.listen(process.env.PORT || 3000);
