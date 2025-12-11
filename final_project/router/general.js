const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//========  REGISTRATION ===========
public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username=req.body.username;
  const password=req.body.password;

  //check if both username and password are provided
  if(username && password){
    //check if user does NOT already exist
    if(!isValid(username)){
        //add the new user to the users array
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }else{
        return res.status(404).json({message: "User already exists"})
    }
  }
   //return error if username or password is missing
   return res.status(404).json({message: "Unable to register user."});
});

//========= Get the book list available in the shop  =========
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  //ROUTER function
  res.send(JSON.stringify(books,null,4));
});

//======== Get book details based on ISBN  ===========
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  // Extract the ISBN from the request parameters
  const isbn = req.params.isbn;
  // Use the extracted ISBN as a key to look up the book details
  // Note: The keys in `books` object are numbers, so standard object access works.
  const bookDetails = books[isbn];
  return res.json(bookDetails);
 });
  
// ========= Get book details based on author =============
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  
  // Get the author name from the URL parameter
  const requestedAuthor = req.params.author;

   //Initialize an empty array to collect matches
   const matchingBooks = [];

   // This line obtains all keys as an array of strings:
   const bookKeys = Object.keys(books);
  
   //Iterate through all keys (implied ISBNs)
  for (const isbn of bookKeys) {
    const bookDetails = books[isbn];

    // Check if the current book's author matches the requested author (case-insensitive)
    if (bookDetails.author.toLowerCase() === requestedAuthor.toLowerCase()) {
        matchingBooks.push(bookDetails);
      }
    }
    // Return the response based on whether books were found
    if (matchingBooks.length > 0) {
      return res.json(matchingBooks);
    }else{
        return res.status(404).json({ message: `No books found for author: ${requestedAuthor}` });
    }
});

// ========  Get all books based on title  ============
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
 
   // Get the title from the URL parameter
   const requestedTitle = req.params.title;

   //Initialize an empty array to collect matches
   const matchingBooks = [];

   // This line obtains all keys as an array of strings:
   const bookKeys = Object.keys(books);
  
   //Iterate through all keys (implied ISBNs)
  for (const isbn of bookKeys) {
    const bookDetails = books[isbn];

    // Check if the current book's title matches the requested title (case-insensitive)
    if (bookDetails.title.toLowerCase() === requestedTitle.toLowerCase()) {
        matchingBooks.push(bookDetails);
      }
    }
    // Return the response based on whether books were found
    if (matchingBooks.length > 0) {
      return res.json(matchingBooks);
    }else{
        return res.status(404).json({ message: `No books found for title: ${requestedTitle}` });
    }
  

});

// =========  Get book review  ============
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

    //==
    let isbn = req.params.isbn;
    if(books[isbn]){
      return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
    }
    else{
      return res.status(404).send("No book found with ISBN "+isbn);
    }
  });
    //=====

module.exports.general = public_users;
