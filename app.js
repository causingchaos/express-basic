"use strict";
const express = require("express");
const app = express();

//** Package imports */
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const http = require('http');
//console.log(http.METHODS); // logs avaliable http methods (get, put, ect)
//console.log(http.STATUS_CODES); // logs avaliable http status codes

/** Variables */
const port = process.env.port || process.env.PORT;
const jwt_key = process.env.JWT_KEY;
const cookie_key = process.env.COOKIE_SECRET;
const isSecure = app.get('env') != 'development'; //false when in dev

//config of packages
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // adding on cors headers credentials allow cross origin
})); 
app.use(express.json()); // convert all incoming json to objects
app.use(cookieParser(cookie_key)); // secret string uses it to encrypt.

// API Routes
const channelAPI = require('./api/channel.js');
const authAPI = require('./api/auth.js');

// Custom Middleware
const { sup, how } = require('./middleware/middle.js');
app.use(sup); // run this on all incoming route requests

let options = {
  dotfile: "allow", // allow, deny, ignore   ignore any . secret files
  etag: true,
  index: false, // disable directory indexing
  maxAge: "7d", // don't redirect to root when items not found
  redirect: false,
  setHeaders: function(res, path, stat) { 
    //add this header to all static respones
    res.set('x-timestamp', Date.now());
  }
};

app.use(express.static("public", options))

// Handle root
app
.get("/", how, sup, (req, res) => {
  //console.log(req.headers)
  console.log("==== log of header===")
  console.log( req.url );
  console.log( req.ip );
  console.log( req.hostname );
  console.log( req.method ); //get
  console.log( req.protocol ); //http /https
  console.log( req.path ); // just the path part of the url
  console.log( req.subdomains ); // test.sales.example.com ['test','sales']
  console.log( req.query ); // querystring
  console.log( req.params ); // /use/72 /product/238238 app.get("/user/:id") app.get("/product/:id")   // req.params.id
  //res.send("<h1>Hello</h1>");  //determine the content-type automatically
  //res.status(404).end();
 // res.send({data: "hi"});
  //let secret = `<a href="/.htaccess">secret</a>`
  //let html = `<!Doctype html><html><head><title>Sample</title></head></html>`
  //html+= `<body><h1>Sample</h1><main>${secret}</main></body>` 
  //res.send(html);
  res.status(200).send({code: 0, message: 'ok'}); //health check route.
})
.post("/", (req, res) => {} )
.patch("/", (req, res) => {} )
.put("/", (req, res) => {} )
.delete("/", (req, res) => {} );

// token endpoint
app.get('/token', (req, res) => {
  // route to get a token
  let id = Math.random().toString(36).substring(2, 8);
  let limit = 60 * 3; // 180 seconds
  let expires = Math.floor(Date.now() / 1000) + limit;
  let payload = {
    _id: id,
    exp: expires,
  };
  let token = jwt.sign(payload, jwt_key);
  res.status(201).send({code: 0, message: "ok", data: token});
});

// test endpoint   
app.get('/test', (req, res) => {
  // Simulate a route that needs a valid token to access (our middleware)
  const header = req.header('Authorization');
  const [type, token] = header.split(" ");
  console.log(type);
  console.log(token);
  if( type === 'Bearer' && typeof token !== 'undefined') {
    console.log('good to go');
    try{
      let payload = jwt.verify(token, jwt_key);
      let current = Math.floor(Date.now() / 1000);
      let diff = current - payload.exp;
      res.status(200).send({code: 0, message: `all good ${diff} remaining`});
    } catch (err) {
      res.status(401).send({code: 123, message: 'Invalid or expired token.'}); // 401 invalid authorization
    }
  } else {
    res.status(401).send({code: 456, message: 'Invalid Token'})
  }
});

// Channel endpoints
app.use('/api/channel', channelAPI);

app.use('/api/auth', authAPI)

app.get("/old", (req, res) => {
  res.redirect(301, "/new");
});

app.get("/new", (req, res) => {
  res.send("<h2>NEW</h2>"); // type html
  //res.end() // no type header set
  //res.sendFile("./img/cotton-candy.gif", err => console.log)
  res.json(); // set type as application/json
});

app.listen(port, (err) => {
  if(err){
    console.log("there was a problem", err);
    return;
  }
  console.log(`listening on port ${port}`);
});

