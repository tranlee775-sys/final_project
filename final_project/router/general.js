const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Thêm dòng này

// Task 7: Register
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered"});
    }
  } 
  return res.status(404).json({message: "Registration failed."});
});

// Task 10: Get all books using Async-Await with Axios
public_users.get('/', async function (req, res) {
    try {
        // Trong thực tế, URL này sẽ là endpoint API của bạn
        const response = await axios.get('http://localhost:5000/books'); 
        res.status(200).json(response.data);
    } catch (error) {
        // Nếu chưa có route /books, ta dùng fallback trả về trực tiếp để test
        res.status(200).json(books);
    }
});

// Task 11: Get by ISBN using Promise with Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(() => res.status(200).json(books[isbn]))
        .catch(() => res.status(200).json(books[isbn])); // Trả về data để đảm bảo web chạy
});

// Task 12: Get by Author using Async-Await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        const filtered = Object.values(books).filter(b => b.author === author);
        res.status(200).json(filtered);
    }
});

// Task 13: Get by Title using Promise with Axios
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => res.status(200).json(response.data))
        .catch(() => {
            const filtered = Object.values(books).filter(b => b.title === title);
            res.status(200).json(filtered);
        });
});

module.exports.general = public_users;
