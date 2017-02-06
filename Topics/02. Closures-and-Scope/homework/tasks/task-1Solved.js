function solve() {
	var library = (function () {
		var books = [];
		var categories = [];
		const minTitleLength = 2,
			maxTitleLength = 100;

		function addBook(book) {
			if (book.title.length < minTitleLength || book.title.length > maxTitleLength) {
				throw new Error("Title must have between 2 and 100 characters!")
			}
			if (book.author === '') {
				throw new Error("Author name must not be empty!")
			}
			let isIsbnNotUnique = books.find(x => x.isbn === book.isbn),
				isIsbnLength10 = (book.isbn.length === 10),
				isIsbnLength13 = (book.isbn.length === 13);
			isBookTitleNotUnique = books.find(x => x.title === book.title)
			if (isIsbnNotUnique) {
				throw new Error('ISBN number is not unique')
			}
			if (!isIsbnLength10 && !isIsbnLength13) {
				throw new Error(`ISBN length is ${book.isbn.length}. The length must be exactly 10 or 13 characters`)
			}
			if (isBookTitleNotUnique) {
				throw new Error(`Book title {book.title} is not unique`)
			}

			if (!categories.some(x => x === book.category)) {
				categories.push(book.category)
			}
			book.ID = books.length + 1;
			books.push(book);
			return book;
		}

		function listBooks() {
			if (arguments[0]) {
				if (arguments[0].hasOwnProperty("category")) {
					return books.filter(x => x.category === arguments[0].category)
				}
				if (arguments[0].hasOwnProperty("author")) {
					return books.filter(x => x.author === arguments[0].author)
				}
			}
			return books;
		}

		function listCategories() {
			return categories.sort();
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

// var book1 = {
// 		title: 'the good parts',
// 		isbn: '1234567890',
// 		author: 'Gosho',
// 		category: 'triler'
// 	},
// 	testLibrary = solve();

// testLibrary.books.add(book1);
// console.log(testLibrary.books.list());
// console.log(testLibrary.categories.list());
module.exports = solve;