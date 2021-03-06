function solve() {
    let getID = (function() {
        let id = 0;

        return function() {
            id += 1;
            return id;
        };
    }());
    class Item {
        constructor(description, name) {
            this.id = getID();
            this.description = description;
            this.name = name;
        }

        set description(description) {
            if (description === "") {
                throw "description must not be empty";
            } else if (typeof description !== "string") {
                throw "Description shoud be a valid string";
            } else {
                this._description = description;
            }
        }
        get description() {
            return this._description;
        }

        set name(name) {
            if (typeof name !== "string") {
                throw "Name is not a valid string";
            } else if (name.length < 2 || name.length > 40) {
                throw "Name must be between 2 and 40 characteres long";
            } else {
                this._name = name;
            }
        }
        get name() {
            return this._name;
        }
    }

    class Book extends Item {

        constructor(description, name, isbn, genre) {
            super(description, name);
            this.isbn = isbn;
            this.genre = genre;
        }

        set isbn(isbn) {
            if (isbn.length === 10 || isbn.length === 13) {
                if (/^\d+$/.test(isbn)) {
                    this._isbn = isbn;
                } else {
                    throw "ISBN must contains digits only";
                }

            } else {
                throw "ISBN must be 10 or 13 char long";
            }
        }
        get isbn() {
            return this._isbn;
        }
        set genre(genre) {
            if (typeof genre !== "string") {
                throw "Genre must be valid string";
            } else if (genre.length < 2 || genre.length > 20) {
                throw "Genre length must be between 2 and 20 characteres";
            } else {
                this._genre = genre;
            }
        }
        get genre() {
            return this._genre;
        }

    }

    class Media extends Item {
        constructor(description, name, duration, rating) {
            super(description, name);
            this.duration = duration;
            this.rating = rating;
        }

        set duration(duration) {
            if (duration > 0) {
                this._duration = duration;
            } else {
                throw "duration must be number greater than 0";
            }
        }
        set rating(rating) {
            if (rating >= 1 && rating <= 5) {
                this._rating = rating;
            } else {
                throw "rating must be number between 1 and 5 inclusive";
            }
        }
        get duration() {
            return this._duration;
        }
        get rating() {
            return this._rating;
        }
    }

    class Catalog {
        constructor(name) {
            this.id = getID();
            this.name = name;
            this._items = [];
        }

        set name(name) {
            if (name.length < 2 || name.length > 40) {
                throw "Catalog name must be between 2 and 40 char long";
            } else {
                this._name = name;
            }
        }
        get name() {
            return this._name;
        }
        get items() {
            return this._items;
        }

        add(items) {
            function isItem(input) {
                if (input instanceof Item) {
                    return true;
                }
                return false;
            }
            if (Array.isArray(items)) {
                if (items.length === 0) {
                    throw "The items array is empty";
                } else if (!isItem) {
                    throw "The input is not a valid item";
                } else {
                    for (let item of items) {
                        this._items.push(item);
                    }
                }

            } else {
                if (arguments.length === 0) {
                    throw "The input is empty";
                } else if (!isItem) {
                    throw "The input is not a valid item";
                } else {
                    for (let i = 0; i < arguments.length; i += 1) {
                        this._items.push(arguments[i]);
                    }
                }
            }
            return this;
        }

        find(id) {

            if (typeof id === 'number') {
                if (this._items.find(x => x.id === id)) {
                    return this._items.find(x => x.id === id);
                } else {
                    return null;
                }
            } else if (id.id || id.name) {
                // console.log(id.id);
                // console.log(id.name);
                let result = [],
                    tempArr = [],
                    optionID = id.id,
                    optionName = id.name;

                if (id.id) {
                    tempArr = this._items.filter(x => x.id === optionID);
                    for (let item of tempArr) {
                        result.push(item);
                    }
                }
                if (id.name) {
                    tempArr = this._items.filter(x => x.id === optionName);
                    for (let item of tempArr) {
                        result.push(item);
                    }
                }
                //console.log(result);
                return result;
            } else {
                //console.log(id);
                throw "ID must be defined";
            }
        }
        search(pattern) {
            let result = [],
                tempArr;
            if (typeof pattern === 'string' && pattern.length > 0) {
                tempArr = this._items.filter(x => x.name.search(pattern) !== -1);
                tempArr = this._items.filter(x => x.description.search(pattern) !== -1);
                return result;
            } else {
                throw "The pattern is not valid";
            }
        }
    }

    class BookCatalog extends Catalog {

        constructor(name) {
            super(name);
        }
        add(...books) {
            if (Array.isArray(books[0])) {
                books = books[0];
            }

            books.forEach(function(x) {
                if (!(x instanceof Book)) {
                    throw 'Must add only books';
                }
            });

            return super.add(...books);
        }

        getGenres() {
            let result = [];
            this._items.forEach(x => result.push(x.genre));
            result = result.filter((x, y, z) => z.indexOf(x) === y);

            return result.map(x => x.toLowerCase());
        }
    }

    class MediaCatalog extends Catalog {
        constructor(name) {
            super(name);
        }

        add(...medias) {
            if (Array.isArray(medias[0])) {
                medias = medias[0];
            }

            medias.forEach(function(x) {
                if (!(x instanceof Media)) {
                    throw 'Must add only medias';
                }
            });

            return super.add(...medias);
        }
        getTop(count) {
            if (typeof count !== 'number') {
                throw 'Count should be a number';
            }
            if (count < 1) {
                throw 'Count must be more than 1';
            }

            return this.items
                .sort((a, b) => a.rating < b.rating)
                .filter((_, ind) => ind < count)
                .map(x => ({ id: x.id, name: x.name }));
        }

    }

    return {
        getBook: function(name, isbn, genre, description) {
            return new Book(description, name, isbn, genre);
        },
        getMedia: function(name, rating, duration, description) {
            return new Media(description, name, duration, rating);
        },
        getBookCatalog: function(name) {
            return new BookCatalog(name);
        },
        getMediaCatalog: function(name) {
            return new MediaCatalog(name);
        }
    };
}

module.exports = solve;