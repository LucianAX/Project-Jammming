import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
//import Spotify from '../../util/Spotify';

class App extends React.Component
{
    constructor(props) {
        super(props);
    
        this.state = {
            searchResults: [
                { name: 'name1', artist: 'artist1', album: 'album1', id: 'id1' },
                { name: 'name2', artist: 'artist2', album: 'album2', id: 'id2' },
                { name: 'name3', artist: 'artist3', album: 'album3', id: 'id3' },
            ],
            playlistName: 'Big Bad Playlist',
            playlistTracks: [
                { name: 'plname1', artist: 'plartist1', album: 'plalbum1', id: 'plid1' },
                { name: 'plname2', artist: 'plartist2', album: 'plalbum2', id: 'plid2' },
                { name: 'plname3', artist: 'plartist3', album: 'plalbum3', id: 'plid3' },
            ],
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
    }
    search(term) {
        console.log(term);
        //Spotify.search(term);
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
