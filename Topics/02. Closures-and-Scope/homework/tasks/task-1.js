function solve() {
    var library = (function() {
        var books = [];
        var categories = [];

        function listBooks() {
            if (books.length === 0) {
                return [];
            }
            if (books.length === 1) {
                return books;
            }
            if (!categories.some(x => x === this.book.category)) {
                return [];
            }

            return books;
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

            if (books.some(x => x.ISBN === book.ISBN)) {
                throw Error('This ISBN already exist in the collection!')
            }

            if (categories.some(x => x.category !== book.category)) {
                categories.push(book.category);
            }

            books.push(book);
            book.ID = books.length + 1;
            return book;
        }

        function listCategories() {
            // if (arguments.length === 1) {
            //     return arguments;
            // }
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