const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Dữ liệu sách đã có sẵn trong booksdb.js

// Task 2 & 10: Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
  try {
    // Giả lập một Promise để lấy danh sách sách (Yêu cầu của Task 10)
    const getBooks = () => Promise.resolve(books);
    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 3 & 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});
  
// Task 4 & 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getByAuthor = () => {
      return Promise.resolve(Object.values(books).filter(b => b.author === author));
    };
    const filteredBooks = await getByAuthor();
    if (filteredBooks.length > 0) {
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      return res.status(404).json({message: "Author not found"});
    }
  } catch (err) {
    return res.status(500).json({message: "Error"});
  }
});

// Task 5 & 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const filtered = Object.values(books).filter(b => b.title === title);
    if (filtered.length > 0) resolve(filtered);
    else reject("Title not found");
  })
  .then((results) => res.status(200).send(JSON.stringify(results, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
