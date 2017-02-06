function solve() {
    var library = (function() {
        var books = [];
        var categories = [];
        // function returnBookWithCategory(bookToMatch) {
        //     let result = [];
        //     for (var i = 0; i <= categories.length; i += 1) {
        //         if (books[i].category === bookToMatch[0].category) {
        //             return result.push(books[i]);
        //         }
        //     }
        //     return result;
        // }

        // if (!bookWithThisCategoryAdded(arguments)) {
        //             return [];
        //         }

        // function bookWithThisCategoryAdded(arr) {
        //     for (var i = 0; i <= categories.length; i += 1) {
        //         if (categories[i] === arr[0].category) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
        function bookInCategory(obj) {
            let result = [];
            for (var b of books) {
                if (b.category === obj.category) {
                    result.push(b);
                }
            }
            return result;
        }

        function listBooks(optional) {
            console.log(optional.category);

            if (!optional) {
                if (books.length === 0) {
                    return [];
                }
                if (books.length === 1) {
                    return books;
                }
            } else {
                if (optional.hasOwnProperty('category')) {
                    bookInCategory(optional);

                    // for (var j of categories) {
                    //     if (j === optional.category) {
                    //         return j;
                    //     } else {

                    //     }
                    // }

                    // if (!arguments[0].hasOwnProperty('title')) {
                    //     for (var b of books) {
                    //         if (b.category === arguments[0].category) {
                    //             result.push(b);
                    //         }
                    //         return result;
                    //     }
                    // }
                } else if (optional.hasOwnProperty('author')) {
                    for (var b of books) {
                        if (b === optional.author) {
                            return b;
                        } else {
                            return [];
                        }
                    }
                }
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