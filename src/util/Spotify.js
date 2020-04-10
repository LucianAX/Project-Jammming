    /*** Obtain a Spotify access token ***/

const client_id = '6c33890bba254d428ca0bbd41708c593';
const redirect_uri = 'http://localhost:3000/';
let accessToken = '';

let Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;
    
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
        window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&
        response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
    }
  },

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
                    ))
          });
  }
}

export default Spotify;