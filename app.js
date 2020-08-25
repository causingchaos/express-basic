"use strict";
const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.port || process.env.PORT;
const http = require('http');
//console.log(http.METHODS); // logs avaliable http methods (get, put, ect)
//console.log(http.STATUS_CODES); // logs avaliable http status codes
const cors = require("cors");

// API Routes
const channelAPI = require('./api/channel.js');
const authAPI = require('./api/auth.js');

// Custom Middleware
const { sup, how } = require('./middleware/middle.js');
app.use(sup); // run this on all incoming route requests

//handle json body request
app.use(cors()); // adding on cors headers
app.use(express.json()); // convert all incoming json to objects

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
  let secret = `<a href="/.htaccess">secret</a>`
  let html = `<!Doctype html><html><head><title>Sample</title></head></html>`
  html+= `<body><h1>Sample</h1><main>${secret}</main></body>` 
  res.send(html);
})
.post("/", (req, res) => {} )
.patch("/", (req, res) => {} )
.put("/", (req, res) => {} )
.delete("/", (req, res) => {} );

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

