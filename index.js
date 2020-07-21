"use-strict";


const SpotifyWebApi = require("spotify-web-api-node");
const path = require("path");
require("dotenv").config();

const geniusLyricsApi = require("genius-lyrics-api");

const scopes = ["user-read-playback-state"],
  state = "spotify_auth_state";

const spotifyApi = new SpotifyWebApi({redirectUri: process.env.REDRIECTURI2, clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET});

const authUrl = spotifyApi.createAuthorizeURL(scopes, state);

const opn = require("opn");
//opn(authUrl);

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const router = express.Router();

var session = require('express-session')

app.use(session({
  genid: function(req) {
    return uuidv4()
  },
  resave: true,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {}
}))



let port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
//app.use(express.static(path.join(__dirname, "public")));


/*
  Create Unique ID for the current user
*/
const { v4: uuidv4 } = require('uuid');



app.use('/login', (req, res) => {
  res.redirect(authUrl);
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  console.log('loggedout')
  res.redirect('/?logout=1')
})


app.get("/callback", function (req, res) {
  let code = req.query["code"];

  spotifyApi.authorizationCodeGrant(code).then(function (data) {
    req.session['access_token'] = data.body['access_token'];
    req.session['refresh_token'] = data.body["refresh_token"];
    
    res.redirect("/?id=" + encodeURIComponent(req.session.id));
  }, function (err) {
    console.log("Something went wrong!", err);
  });
});


//starts the server and listens for requests
app.listen(port, function () {
  console.log(`api running on port ${port}`);
  console.log(`Access localhost:${port} to see the lyrics for the currently played song`);
});

app.get("/getlyrics", function (req, res) {
  let id = req.session.id
  spotifyApi.setAccessToken(req.session["access_token"]);
  spotifyApi.setRefreshToken(req.session["refresh_token"]);
  spotifyApi.getMyCurrentPlaybackState().then(function (data) {
    let temp = getSongArtist(data.body);
    let name = temp[0],
      artist = temp[1];
    const options = {
      apiKey: process.env.GENIUS_API_KEY,
      title: name,
      artist: artist,
      optimizeQuery: true
    };
    geniusLyricsApi.getLyrics(options).then(lyrics => {
      if (lyrics == null) {
        res.json({status: "404", message: "Lyrics not found"});
      } else {
        lyrics = lyrics.replace(/(?:\r\n|\r|\n)/g, "<br/>");
        res.json({status: "200", message: "successful", lyrics: lyrics, artist: artist, songName: name});
      }
    }).catch(err => {
      res.json({status: "500", message: "Something went wrong"});
    });
  }).catch(err => res.json({status: "500", message: "Something went wrong"}));
}, function (err) {
  // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
  spotifyApi.refreshAccessToken().then(function (data) {
    console.log("The access token has been refreshed!");

    // Save the access token so that it's used in future calls
    req.session['access_token'] = data.body["access_token"]
    console.log("[*******]")
    res.redirect(req.originalUrl);
  }, function (err) {
    console.log("Could not refresh access token", err);
  });
});


app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
})


function getSongArtist(body) {
  let name = body.item.name;
  let artist = body.item.artists["0"].name;
  return [name, artist];
}