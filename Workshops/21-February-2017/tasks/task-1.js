function solve() {
    let getID = (function() {
        let id = 0;

        return function() {
            id += 1;
            return id;
        };
    }());
    const VALIDATOR = {

    }
    class Player {
        set name(name) {
            this._name = name;
        }
        get name(name) {
            return this._name;
        }

        addPlaylist(playlistToAdd) {

        }
    }
    class PlayList {
        constructor() {
            this._id = getid();
        }

    }

    const module = {

        getPlayer: function(name) {
            // returns a new player instance with the provided name
        },
        getPlaylist: function(name) {
            //returns a new playlist instance with the provided name
        },
        getAudio: function(title, author, length) {
            //returns a new audio instance with the provided title, author and length
        },
        getVideo: function(title, author, imdbRating) {
            //returns a new video instance with the provided title, author and imdbRating
        }
    };

    return module;
}

module.exports = solve;