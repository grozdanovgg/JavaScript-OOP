function solve() {
    let getID = (function() {
        let id = 0;

        return function() {
            id += 1;
            return id;
        };
    }());

    const validator = {
        validateString: function(string) {
            if (string.length < 3 && string.length > 25) {
                throw "String must be a string between 3 and 25 char long"
            }
        },
        validateAudioLength: function(length) {
            if (length < 0) {
                throw "Audio length must be greater than 0";
            }
        },
        isPlayableInstance: function(playable) {
            if (!(playable instanceof Playable)) {
                throw "Input should be of type Playable"
            }
        },
        isPayListInstance: function(playListToAdd) {
            if (!(playlistToAdd instanceof PlayList)) {
                throw 'playlistToAdd must be a PlayList instance';
            }
        }
    }

    class Player {
        set name(name) {
            validator.validateString(name);
            this.name = name;
            this._playersList = [];
        }
        get name() {
            return this._name;
        }
        set name(name) {
            validator.validateString(name);
            this._name = name;
        }

        addPlaylist(playlistToAdd) {
            validator.isPayListInstance(playlistToAdd);
            this._playersList.push(playlistToAdd);
            return this;
        }

        getPlaylistById(id) {
            let index = this._playersList.findIndex(function(x) {
                return x.id === id;
            });
            if (index >= 0) {
                return this._playersList[index];
            } else {
                return null;
            }
        }
        removePlaylist(idOrPlayable) {
            if (idOrPlayable.id) {
                let index = this._playersList.findIndex(function(x) {
                    return x.id === idOrPlayable.id;
                });
                if (index >= 0) {
                    this._playersList.splice(index, 1)
                } else {
                    throw "Playable with the provided id is not contained in the playlist";
                }
            } else {
                let index = this._playersList.findIndex(function(x) {
                    return x.id === idOrPlayable;
                });
                if (index >= 0) {
                    this._playersList.splice(index, 1)
                } else {
                    throw "Playable with the provided id is not contained in the playlist";
                }
            }
            return this;
        }
        listPlaylists(page, size) {
            let arr = this._playersList,
                start = 0,
                end = 0;
            arr.sort(function(a, b) {
                if (a.title < b.title)
                    return -1;
                if (a.title > b.title)
                    return 1;
                return 0;
            }).sort(function(a, b) { return a.id - b.id })

            if (arr.length < size) {
                return this._playersList;
            }
            if (page * size >= arr.length ||
                page < 0 ||
                size <= 0) {
                throw "Input parameters not OK"
            }
            start = page * size;
            end = ((page + 1) * size)
            arr = arr.slice(start, end)

            return arr;
        }
        contains(playable, playlist) {
            let index = this._playersList.findIndex(x => x.getPlaylistById(playlist.id) === playlist.id);

            if (index < 0) {
                return false;
            } else {
                return true;
            }
        }

        search(pattern) {
            let arr = [],
                result = [];
            arr = this._playersList.filter(x => x.title.search(pattern) !== -1);
            for (item of arr) {
                result.push({ id: item.id, title: item.title })
            }
            return result;
        }
    }
    class PlayList {
        constructor(name) {
            this._id = getID();
            this.name = name;
            this._playList = []
        }
        get id() {
            return this._id;
        }
        set name(name) {
            validator.validateString(name);
            this._name = name;
        }
        get name() {
            return this._name;
        }
        get playList() {
            return this._playList;
        }

        addPlayable(playable) {
            // validator.isPlayableInstance(playable);
            this._playList.push(playable);
            return this;
        }
        getPlayableById(id) {
            let index = this._playList.findIndex(function(x) {
                return x.id === id;
            });
            if (index >= 0) {
                return this._playList[index];
            } else {
                return null;
            }
        }
        removePlayable(idOrPlayable) {
            if (idOrPlayable.id) {
                let index = this._playList.findIndex(function(x) {
                    return x.id === idOrPlayable.id;
                });
                if (index >= 0) {
                    this._playList.splice(index, 1)
                } else {
                    throw "Playable with the provided id is not contained in the playlist";
                }
            } else {
                let index = this._playList.findIndex(function(x) {
                    return x.id === idOrPlayable;
                });
                if (index >= 0) {
                    this._playList.splice(index, 1)
                } else {
                    throw "Playable with the provided id is not contained in the playlist";
                }
            }
            return this;
        }
        listPlayables(page, size) {
            let arr = this._playList,
                start = 0,
                end = 0;
            arr.sort(function(a, b) {
                if (a.title < b.title)
                    return -1;
                if (a.title > b.title)
                    return 1;
                return 0;
            }).sort(function(a, b) { return a.id - b.id })

            if (arr.length < size) {
                return this._playList;
            }
            if (page * size >= arr.length ||
                page < 0 ||
                size <= 0) {
                throw "Input parameters not OK"
            }
            start = page * size;
            end = ((page + 1) * size)
            arr = arr.slice(start, end)

            return arr;
        }
    }
    class Playable {
        constructor(title, author) {
            this._id = getID();
            this.title = title;
            this.author = author;
        }
        get id() {
            return this._id;
        }
        set title(title) {
            validator.validateString(title);
            this._title = title;
        }
        get title() {
            return this._title;
        }
        set author(author) {
            validator.validateString(author);
            this._author = author;
        }
        get author() {
            return this._author;
        }
        play() {
            return `[${this._id}]. [${this.title}] - [${this.author}]`
        }
    }
    class Audio extends Playable {
        constructor(title, author, length) {
            super(title, author);
            this.length = length;
        }
        set length(length) {
            validator.validateAudioLength(length);
            this._length = length;
        }
        get length() {
            return this._length;
        }
        play() {
            return `${super.play()} - [${this._length}]`;
        }

    }
    class Video extends Playable {
        constructor(title, author, imdbRating) {
            super(title, author);
            this.imdbRating = imdbRating;
        }
        set imdbRating(imdbRating) {
            if (imdbRating >= 1 && imdbRating <= 5) {
                this._imdbRating = imdbRating;
            } else {
                throw "IMDB rating must be between 1 and 5";
            }
        }
        get imdbRating() {
            return this._imdbRating;
        }
        play() {
            return `${super.play()} - [${this.imdbRating}]`;
        }
    }

    const module = {

        getPlayer: function(name) {
            // returns a new player instance with the provided name
            return new Player(name);
        },
        getPlaylist: function(name) {
            //returns a new playlist instance with the provided name
            return new PlayList(name);
        },
        getAudio: function(title, author, length) {
            //returns a new audio instance with the provided title, author and length
            return new Audio(title, author, length);
        },
        getVideo: function(title, author, imdbRating) {
            //returns a new video instance with the provided title, author and imdbRating
            return new Video(title, author, imdbRating)
        }
    };

    return module;
}

module.exports = solve;