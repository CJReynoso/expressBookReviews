const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const cors = require('cors');
const { Cookie } = require('express-session');

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

let users= [{"username":"Batu", "password":"123456"}]


const app = express();

app.use(cors());

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: false, saveUninitialized: true,} ))

/*
app.use("/customer/auth/*", function auth(req,res,next){

});
*/
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
