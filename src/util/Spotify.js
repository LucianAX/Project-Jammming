import Credentials from './Credentials';

const client_id = Credentials.client_id;
//const redirect_uri = 'http://localhost:3000/';
const redirect_uri = 'http://fascinated-able.surge.sh';
let accessToken;

const Spotify = {
      /*** Obtain a Spotify access token ***/
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    
      /* using the Implicit Grant Flow of Spotify - values for the access token
      and expiration time are in the URL parameter after authentication. */
      
      // check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        
    if(accessTokenMatch && expiresInMatch) {
      
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      
        // This clears the parameters, allowing to grab
        // a new access token when the current one expires
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    } else {
          // redirect user to this URL
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
        window.location = accessUrl;
    }
  },
      /***  Implement Spotify search request  ***/
  search(term) {
    const accessToken = Spotify.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;

    return fetch(endpoint, {
                              headers: {
                                Authorization: `Bearer ${accessToken}`
                              }
                            })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Request failed!');
          }, networkError => console.log(networkError.message) )
          
          .then(jsonResponse => {
              if (!jsonResponse.tracks) {
                return [];
              }
              return jsonResponse.tracks.items.map(track => (
                      {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                      }
                    ));
          });
  },

      /***  Save a user's playlist  ***/
  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userID;
    const userID_endpoint = 'https://api.spotify.com/v1/me';
       
    return fetch(userID_endpoint, { headers: headers })  // request to get user's ID
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Request failed!');
          }, networkError => console.log(networkError.message) )
          
          .then(jsonResponse => {
            userID = jsonResponse.id;
            
              // request to create a new playlist in the user's account and retrieve playlist's ID
            const playlist_endpoint = `https://api.spotify.com/v1/users/${userID}/playlists`;
            return fetch(playlist_endpoint,
                        {
                          headers: headers,
                          method: 'POST',
                          body: JSON.stringify({ name: playlistName }),
                        })
                  .then(response => {
                    if (response.ok) {
                      return response.json();
                    }
                    throw new Error('Request failed!');
                  }, networkError => console.log(networkError.message) )

                  .then(jsonResponse => {
                    const playlistID = jsonResponse.id;

                      // request to add tracks to the new playlist
                    const add_track_endpoint = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
                    return fetch(add_track_endpoint,
                                {
                                  headers: headers,
                                  method: 'POST',
                                  body: JSON.stringify({ uris: trackURIs })
                                })
                  });
          });
  }
}

export default Spotify;