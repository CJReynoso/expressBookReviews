const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Return the list of Books
    return res.send(JSON.stringify(books));
  });

let asyncAllBooks= new Promise((resolve, reject) =>{
        resolve(JSON.stringify(books))
    })


asyncAllBooks.then((successResponse) =>{
    console.log(successResponse)
})
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Return the details
  return res.send(books[req.params.isbn]);
 });

 let asyncBooksByIsbn= new Promise((resolve,reject) =>{
     resolve(books[5])
 })

 asyncBooksByIsbn.then((successResponse) =>{
    console.log(successResponse)
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Return the details
  let sbook;

  for (let i=1; i<11; i++)
  {
      if(books[i].author=== req.params.author)
      {
          sbook=books[i]
      }
  }

  return res.send(sbook);
});

let asyncBooksByAuthor= new Promise((resolve,reject) =>{
    let author='Unknown'
    let sbook;

  for (let i=1; i<11; i++)
  {
      if(books[i].author=== author)
      {
          sbook=books[i]
      }
  }
  resolve(sbook)
})

asyncBooksByAuthor.then((successResponse) =>{
    console.log(successResponse)
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Return the details
  let sbook;

  for (let i=1; i<11; i++)
  {
      if(books[i].title=== req.params.title)
      {
          sbook=books[i]
      }
  }

  return res.send(sbook);
});

let asyncBooksByTitle= new Promise((resolve,reject) =>{
    let title='Fairy tales'
    let sbook;

  for (let i=1; i<11; i++)
  {
      if(books[i].title=== title)
      {
          sbook=books[i]
      }
  }
    resolve(sbook)
})

asyncBooksByTitle.then((successResponse) =>{
    console.log(successResponse)
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Return the reviews
  return res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
