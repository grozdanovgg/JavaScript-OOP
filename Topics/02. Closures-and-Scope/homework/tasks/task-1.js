function solve() {
    var library = (function() {
        var books = [];
        var categories = [];


        function listBooks() {

            if (!arguments[0]) {

                if (books.length === 0) {
                    return [];
                }
                if (books.length === 1) {
                    return books;
                }
            } else {
                if (arguments[0].hasOwnProperty('category')) {
                    return books.filter(x => x.category === arguments[0].category)

                } else if (arguments[0].hasOwnProperty('author')) {
                    for (var b of books) {
                        if (b === arguments[0].author) {
                            return b;
                        } else {
                            return [];
                        }
                    }
                }
            }

            //return books;
        }

        function addBook(book) {
            if (book.title.length < 2 || book.title.length > 100) {
                throw Error('Book title must be between 2 and 100 char length!');
            }
            if (book.isbn.length !== 10 && book.isbn.length !== 13 || book.isbn === undefined) {
                throw Error('ISBN number must be 10 or 13 char long!');
            }

            if (!book.author.length) {
                throw Error("Author name must not be empty!")
            }
            if (books.some(x => x.title === book.title)) {
                throw Error('Book title already added!')
            }

            if (books.some(x => x.isbn === book.isbn)) {
                throw Error('This ISBN already exist in the collection!')
            }

            if (!checkAvailability(categories, book.category)) {
                categories.push(book.category);
            }

            function checkAvailability(arr, val) {
                return arr.some(function(arrVal) {
                    return val == arrVal;
                });
            }

            books.push(book);
            book.ID = books.length + 1;

            return book;
        }

        function listCategories() {
            return categories;
        }

        return {
            books: {
                list: listBooks,
                add: addBook
            },
            categories: {
                list: listCategories
            }
        };
    }());
    return library;
}

module.exports = solve;