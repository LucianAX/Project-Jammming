import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';

class App extends React.Component
{
    constructor(props) {
        super(props);
    
        this.state = {
            searchResults: [],
            playlistName: 'New Playlist',
            playlistTracks: [],
        };

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }
    
    addTrack(track) {        
        let flag = this.state.playlistTracks.find (existingTrack => existingTrack.id === track.id);
       
        if (!flag) {
            let newPlaylist = this.state.playlistTracks;
            newPlaylist.push(track);

            this.setState({
                playlistTracks: newPlaylist
            });
        }   
    }
    removeTrack(track) {
        let shortenedPlaylist = this.state.playlistTracks.filter (currentTrack => currentTrack.id !== track.id);

        this.setState({
            playlistTracks: shortenedPlaylist
        });
    }
    updatePlaylistName(name) {
        this.setState({
            playlistName: name
        });
    }
        
        // methods for interaction with the Spotify API
    savePlaylist() {
        let trackURIs = this.state.playlistTracks.map(track => track.uri);
        Spotify.savePlaylist(this.state.playlistName, trackURIs)
            .then(() => {
                this.setState({
                    playlistName: 'New Playlist',
                    playlistTracks: []
                });
            });        
    }
    search(term) {
        Spotify.search(term)
            .then(results => {             
                this.setState({
                    searchResults: results
                });
                console.log(results);
            })
    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={ this.search } />
                    <div className="App-playlist">
                        <SearchResults searchResults={ this.state.searchResults }
                                       onAdd={ this.addTrack } />
                        <Playlist playlistName={ this.state.playlistName }
                                  onNameChange={ this.updatePlaylistName }
                                  playlistTracks={ this.state.playlistTracks }
                                  onRemove={ this.removeTrack }
                                  onSave={ this.savePlaylist } />
                    </div>
                </div>
            </div>
        )
      }
  
}

export default App;
