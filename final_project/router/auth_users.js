const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [    
             {
               "username": "username1",
               "password": "pswd1"
             },
            {
               "username":"your_username",
               "password":"your_password"
           }
          ];

//======== CHECK IF USERNAME IS IN SYSTEM  ===========
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    //Check if a user with a given username already exists
    //Filter the users array for any user with the same username
    let userswithsamename=users.filter((user)=>{
        return user.username===username;
    });
    //Return true if any user with the same username is found, otherwise false
    if(userswithsamename.length>0){
        return true;
    }else{
        return false;
    }
}

//======AUTHENTICATION   ================
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers=users.filter((user)=>{
    return (user.username===username && user.password===password);
  });
  //Return TRUE is any valid user found, otherwise false
   if (validusers.length>0){
    return true;
  }else{
    return false;
 }
}
//==========LOGIN ===============
//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  //check if username and password is missing
  if (!username || !password){
    return res.status(404).json({message:"Error logging in"});
  }

  //Authenticate user
  if (authenticatedUser(username,password)){
    //Generate JWT access token
    let accessToken = jwt.sign({
        date: password
    },'access',{expiresIn: 60*60});

    //Store access token and username in session
    req.session.authorization={
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
   }else{
    return res.status(208).json({message:"Invalid Login. Check username and password"})
    }});
  //}
//});

//===== Add a book review ======
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const user = req.session.authorization.username;
  const review = req.query.review;
  const isbn = req.params.isbn;
  if (books[isbn]){
    if(books[isbn].reviews[user]){
        books[isbn].reviews[username] = [review];
        return res.json({message: "Existing review modified"});
    }else{
        books[isbn].reviews[user] = [review];
        return res.json({message: "New review added"});
    }
   }
    else {
        return res.json({message: "No book found with this ISBN"+isbn});
    }
});
    

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
