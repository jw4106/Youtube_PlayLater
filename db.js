// db.js
var mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs');
var bcrypt = require('bcrypt-nodejs');

//Each video object with title, link- for html purposes and videoId just in case
var Video = new mongoose.Schema({
	title: String,
	link: String,
	videoId: Number
});

//each playlist will store videoIds for each video that is in it
var Playlist = new mongoose.Schema({
	title: String,
	videoIdarray: [Number]
});

//each user will have a password/username [password will be hashed later]
//playlist storing video objects that can be displayed later
var userSchema = new mongoose.Schema({
	local : {
		email: String,
		password: String,
		playlist: [String] 
	}
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}


mongoose.model('Video', Video);
module.exports = mongoose.model('User', userSchema);
mongoose.model('Playlist', Playlist);
Playlist.plugin(URLSlugs('title'));

//===============================================================================
// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 let dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
dbconf = 'mongodb://localhost/jw4106';
mongoose.connect(dbconf);
}
//==============================================================================

//mongoose.connect('mongodb://localhost/finalproject');
//mongoose.connect('mongodb://jw4106:dNmDqrh3@class-mongodb.cims.nyu.edu/jw4106');