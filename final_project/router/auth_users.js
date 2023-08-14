const express = require('express');
const { Cookie } = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users= [{"username":"Batu", "password":"123456"}, {"username":"Usr1", "password":"3210"}]

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });

      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ 

    let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
        });

    if(validusers.length > 0)
    {
        return true;
    } 
    else 
    {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) 
  {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60  });

    req.session.authorization = {accessToken,username}
   

  return res.status(200).send("User successfully logged in" + JSON.stringify(req.session));
  } 
  else 
  {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    let book=books[req.params.isbn];
    let found=false;

    if(Object.keys(book.reviews).length <= 0)
    {
        book.reviews= [];
    }


    for (let i=0 ; i<Object.keys(book.reviews).length ;i++)
    {
        if(book.reviews["username"]==req.session.username)
        {
            found=true;
            book.reviews[i]={"username": req.session.authorization.username, "review": req.body.review};
            return res.send("Review Updated!");
        }
    }

    if(!found)
    {
        book.reviews.push({"username": req.session.authorization.username, "review": req.body.review});

        return res.send("Review added!");
    }
    
  
  return res.send(req.session.authorization.username + "book" + JSON.stringify(book.reviews))
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    let book=books[req.params.isbn];
    let found=false;

    for (let i=0 ; i<Object.keys(book.reviews).length ;i++)
    {
        if(book.reviews["username"]==req.session.username)
        {
            
            found=true;
            let filteredlist=book.reviews.filter((review) => {
                if(review.user !== req.session.username)
                {
                    return review;
                }
            });
    
            book.reviews=filteredlist;
            return res.send("Review Deleted");
        }
    }

    if(!found)
    {
        book.reviews[req.session.authorization]={"username": req.session.authorization.username, "review": req.body.review};

        return res.send("Review not found");
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
