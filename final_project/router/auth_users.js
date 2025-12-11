const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"your_username",password:"your_password"}];

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
  return users.some(
    (user)=>user.username===username && user.password===password
  );
};
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
    },'access',{expires: 60*60});

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
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
