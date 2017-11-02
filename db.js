// db.js
var mongoose = require('mongoose')

//my schema goes here!
var Video = new mongoose.Schema({
	title: String,
	link: String,
	videoId: Number
});

var User = new mongoose.Schema({
	username: String,
	password: String,
	playlist: [String] 
});

var Playlist = new mongoose.Schema({
	videoIdarray: [Number]
});

mongoose.model('Video', Video);
mongoose.model('User', User);
mongoose.model('Playlist', Playlist);

mongoose.connect('mongodb://localhost/finalproject');