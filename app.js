"use strict";
const express = require("express");
const app = express();
const http = require('http');
//console.log(http.METHODS);
//console.log(http.STATUS_CODES);
const cors = require("cors");
const { sup, how } = require('./middleware/middle.js');

// API Routes
const channelAPI = require('./api/channel.js');

// Middleware
app.use(sup); // run this on all incoming route requests
app.use(cors()); // adding on cors headers

app
.get("/", how, sup, (req, res) => {
  //console.log(req.headers)
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
  res.send({data: "hi"});
})
.post("/", (req, res) => {} )
.patch("/", (req, res) => {} )
.put("/", (req, res) => {} )
.delete("/", (req, res) => {} );

app.use('/api/channel', channelAPI);

app.get("/old", (req, res) => {
  res.redirect(301, "/new");
});

app.get("/new", (req, res) => {
  res.send("<h2>NEW</h2>");
});

app.listen(3000, (err) => {
  if(err){
    console.log("there was a problem", err);
    return;
  }
  console.log("listening on port 3000");
})