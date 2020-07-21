# Spotify Lyric Website
Website that prompts you to login using your spotify account and then show the lyrics of the song you're listening to.

Working website running on Google Cloud Platform: https://spotify-lyrics-283323.ew.r.appspot.com


### Dependencies Used:
  * body-parser
  * cors
  * dotenv
    * Handle all the API keys and secrets
  * express
    * Backend for the website
  * express-session
    * Handle the sessions for different users
  * genius-lyrics-api
    * Fetch the lyrics for the songs
  * nodemon
    * **Not necessary.** Used for refreshing the file on save
  * spotify-web-api-node
    * Used to get Authorization from the user and get the current playback.
  * uuid
    * Used to generate a unique id for express-session
