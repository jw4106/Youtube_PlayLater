
# Youtube PlayLater 

## Overview

This project aims to mimic youtube's playlist. It will allow you to log in and generate playlists based on youtube videos you choose to add to playlists. 

You can either create a new playlist, delete from a playlist or browse for videos that you wish to add to a playlist. We allow login and sign ups accordingly for user authentication and to remember playlists. 


## Data Model

//Each video object with title, link- for html purposes and videoId just in case
var Video = new mongoose.Schema({
  link: String
});

//each playlist will store videoIds for each video that is in it
var Playlist = new mongoose.Schema({
  title: String,
  videoIdarray: [Video],
  slug: String
});

//each user will have a password/username [password will be hashed later]
//playlist storing video objects that can be displayed later
var userSchema = new mongoose.Schema({
  local : {
    email: String,
    password: String,
  },
  playlists: [Playlist] 
});


## [Link to Commented First Draft Schema](db.js) 

## Wireframes

/ - page for Login

![list create](documentation/Login.png)

/home - page for creating/browsing playlists

![list](documentation/Home.png)

/Browse - page for new videos

![list](documentation/Browse.png)

/playlist/:slug - page showing a playlist

![list](documentation/PlaylistView.png)


## Site map

![list](documentation/sitemap.png)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a playlist list
4. as a user, I can view all of the playlists I've created in a single list
5. as a user, I can add/remove videos to an existing playlist
6. as a user, I can browse for videos to add

## Research Topics

* (5 points) Integrate user authentication
    * I'm going to be using a login for user authentication
    * And account has been made for testing; I'll email you the password
* (1-6 points) Use a client-side JavaScript library
    * Youtube API uses client-side video searching from youtube's video database
* (1-6 points) Per external API used
    * Youtube Data v3 API     


## [Link to Initial Main Project File](app.js) 

[app.js](https://github.com/nyu-csci-ua-0480-007-fall-2017/jw4106-final-project/blob/master/app.js)

## Annotations / References Used

1. [passport.js authentication docs](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)
2. [Youtube API tutorial](https://www.youtube.com/watch?v=-vH2eZAM30s)
3. [Another API tutorial](http://www.codexpedia.com/api/youtube-search-api-example-with-javascript-and-html/)
4. [Another API tutorial](https://developers.google.com/youtube/v3/docs/search/list)