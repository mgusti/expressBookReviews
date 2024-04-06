const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
    const username = req.body.username;
    const password = req.body.password;
    if(username&&password){
        const present = users.filter((user)=> user.username === username)
        if(present.length===0){
            users.push({"username":req.body.username,"password":req.body.password});
            return res.status(201).json({message:"User Created successfully, You can login"})
        }
        else{
          return res.status(400).json({message:"User already exists"})
        }
    }
    else if(!username && !password){
      return res.status(400).json({message:"Bad request"})
    }
    else if(!username || !password){
      return res.status(400).json({message:"Check username and password"})
    }  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
    res.send(books[ISBN]); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let new_books = {}
    const new_author = req.params.author;
    let i=1;
    for(let bookid in books){
      if(books[bookid].author === new_author ){
        new_books[i++] = books[bookid];
      }
    }
    res.send(JSON.stringify(new_books))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let new_books = {}
    const new_title = req.params.title;
    let i = 1;
    for(bookid in books){
        if(books[bookid].title === new_title ){
        new_books[i++] = books[bookid]
        }
    }
    res.send(JSON.stringify(new_books))

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].review),null,4);
});

module.exports.general = public_users;
