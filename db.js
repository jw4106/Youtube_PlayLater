// db.js
var mongoose = require('mongoose')

//Each video object with title, link- for html purposes and videoId just in case
var Video = new mongoose.Schema({
	title: String,
	link: String,
	videoId: Number
});

//each user will have a password/username [password will be hashed later]
//playlist storing video objects that can be displayed later
var User = new mongoose.Schema({
	username: String,
	password: String,
	playlist: [String] 
});


//each playlist will store videoIds for each video that is in it
var Playlist = new mongoose.Schema({
	videoIdarray: [Number]
});

mongoose.model('Video', Video);
mongoose.model('User', User);
mongoose.model('Playlist', Playlist);

mongoose.connect('mongodb://localhost/finalproject');