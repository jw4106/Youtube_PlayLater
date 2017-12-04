const express = require('express');
const app = express();
require('./db');

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
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
	if(req.body.new_playlist.length >= 1){	
		let playlist = new Playlist({title: req.body.new_playlist, videoIdArray: []});
		// explicitly call validate here
        playlist.validate(function(err) {

            User.findOneAndUpdate(
            {
                "_id":req.user.id
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
	}
	else{
		res.redirect('/home');
	}
});

app.get('/home', isLoggedIn,function(req, res) {

	User.find({"_id":req.user.id}, function(err, user, count) {	
    	res.render('home.hbs', {Playlist : req.user.playlists, user : req.user.local});
	});
});

//implementing youtube api search function
app.get('/browse', isLoggedIn, function(req, res){
	res.render('browse.hbs', {Playlist: req.user.playlists});
});


app.post('/browse', isLoggedIn, function(req, res){
	let video = new Video({link : req.body.videolink});
	let redirection = 0;
	video.validate(function(err) {
		User.find({"_id":req.user.id},(err, user, count)=>{
		let index = 0;
		
		user[0].playlists.map(function(ele, i){
			if(req.body.videolink.indexOf("https://www.youtube.com/embed/") !== -1){
				if(ele.title === req.body.playlistchoice){
					ele.videoIdarray.push(video);
					index = i;
					redirection = 1;
				}
			}
		});

		user[0].save(function(err){
			if(redirection === 0){
				res.redirect('/browse');
			}
			else{
				res.redirect('/playlist/'+req.user.playlists[index].slug);			
			}
		});
		});	
	});	
});


app.get('/playlist/:slug', isLoggedIn, function(req, res){
	User.find({"_id":req.user.id},(err, user, count)=>{

		user[0].playlists.map(function(ele){
			if(ele.slug === req.params.slug){
				res.render('playlist', {playlist: ele.videoIdarray});
			}	
		});
	});
});

app.post('/playlist/:slug', isLoggedIn, function(req, res){
	User.find({"_id":req.user.id},(err, user, count)=>{
	let index = 0;
	if(Array.isArray(req.body.array)){
		user[0].playlists.map(function(ele, i){
			if(ele.slug === req.params.slug){
				index = i;
			}	
		});		
		for(let j = 0; j < req.body.array.length; j++){
			for(let k = 0; k < user[0].playlists[index].videoIdarray.length; k++){
				if(user[0].playlists[index].videoIdarray[k].link === req.body.array[j]){
					user[0].playlists[index].videoIdarray.splice(k, 1);
				}
			}
		}		
	}
	else{		
		for(let l = 0; l < user[0].playlists[index].videoIdarray.length; l++){			
			if(user[0].playlists[index].videoIdarray[l].link === req.body.array){
				user[0].playlists[index].videoIdarray.splice(l, 1);
			}
		}				
	}
	user[0].save(function(err){
		res.redirect('/playlist/'+req.params.slug);		
	});
	});		
});

app.listen(process.env.PORT || 3000);
