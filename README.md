# Spotify Lyric Website
Website that prompts you to login using your spotify account and then show the lyrics of the song you're listening to.

Working website running on Google Cloud Platform: https://spotify-lyrics-283323.ew.r.appspot.com


### Dependencies Used:
  * **body-parser**
  * **cors**
  * **dotenv** | Handle all the API keys and secrets.
  * **express** | Backend for the website.
  * **express-session** | Handle the sessions for different users
  * **genius-lyrics-api** | Fetch the lyrics for the songs
  * **nodemon** | Used for refreshing the file on save.
  * **spotify-web-api-node** | Used to get Authorization from the user and get the current playback.
  * **uuid** | Used to generate a unique id for express-session.


### Routes explaned:

#### `/login`
Simply just redirect to the Spotify authorization url

#### `/logout`
Destroy the express session and redirect to `/?logout=1`, which is handeled on the frontend to clear the session storage.

#### `/callback`
We get redirected here from the Spotify Authorization page. We get the 'code' that comes with the redirect, which is then used for getting access_token and refresh_token from the Spotify API. After we've got the tokens, we set them in express session to be used later. Lastly we redirect the user to `/?id=x`, where `x` is the session id. This lets the frontend know that we've logged in successfully and that we can now show the lyrics container, instead of the login container.

#### `/getlyrics`
We set the access_token and refresh_token from the express session to the spotifyApi instance. We get the current playback and pass it through a function that gets the artists and the song name. We retrive the lyrics using Genius API. If we get find the lyrics, we send them as JSON to the front. If lyrics are not found, we send a JSON with the status 404, so the frontend can show a "Lyrics not found message". If everything goes wrong, we send a 500 status.

#### `/`
Send the `index.html` file from `/public` directory

### Known Issues :warning:

 * **If lyrics are not found, a message is not showing up in the browser.**
 * **Sometimes it takes longer than 20 seconds to refresh the lyrics.**

## Preview

![Image Preview](https://i.imgur.com/UEGYU24.png)
