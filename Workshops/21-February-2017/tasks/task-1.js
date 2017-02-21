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
        }
    }
    class Player {
        set name(name) {
            validator.validateString(name);
            this._name = name;
        }
        get name() {
            return this._name;
        }

        addPlaylist(playlistToAdd) {

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

        addPlayable(playable) {
            // validator.isPlayableInstance(playable);
            this._playList.push(playable);
            return this;
        }
        getPlayableById(id) {
            let index = this._playList.findIndex(function(x) {
                return x.id === id;
            });
            if (index > 0) {
                return this._playList[index];
            } else {
                return null;
            }
        }
        removePlayable(id) {}
        removePlayable(playable) {}
        listPlayables(page, size) {}


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