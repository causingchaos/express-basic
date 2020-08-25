"use strict";
const express = require('express');
const router = express.Router();
const data = require('../data/data.js'); // data.channels[n].id .name .last_update

/*
Middleware
*/
router.use(function(req, res, next) {
  console.log(req.url, "@", Date.now());
  next();
})

/* 
  /api/channel/ API Endpoints
*/
router
  .get("/", (req,res) => {
    // return list of channels
    // respond with a 200 status code (OK)
    res.json(data);
    //res.send({data: "hi"});
    console.log("GET /api/channel/")  
});

router.get("/:id", (req, res) => {
  // return a speicfic channel
  // respond with a 200
  let obj = data.channels.find( item => item.id == parseInt(req.params.id));
  res.json(obj);
  console.log(`GET /api/channel/${id}`);
});

router.post("/", (req, res) => {
  // add a new channel then return new list
  // respond with a 201 
  console.log(req.body);
  let { name }  = req.body;
  console.log(req.body);
  let id = data.channels.reduce((prev, curr) => {
    return prev < curr.id ? curr.id : prev;
  }, 0) + 1;
  let last_update = Date.now();
  let obj = { id, name, last_update };
  //let obj = { data: `creating a new object` }
  data.channels.push(obj)
  res.status(201).json(obj);
  console.log("POST /api/channel")
});

router.put("/:id", (req, res) => {
  //replace a channel based on id
  // respond with 200 or 204
  // 202 if the operation is async and still pending
  // basically an UPDATE but we could also do an INSERT if the id is avaliable
  // or we could choose to greate a new id and do an INSERT if the id does not exist
  let id = parseInt(req.params.id);
  //let name = req.body.name;
  let obj = { data: `maybe creating a new obect`}
  res.status(200).json(obj);
  console.log("PUT /ap/channel");
});

router.patch("/:id", (req,res) => {  // Patch only does an update.
  // edit a channel
  // respond with 200 or 204
  // 202 if the operation is async and still pending
  let id = parseInt(req.params.id);
  //let name = req.body.name;
  let obj = { data: `updating a channel`}
  res.status(200).json(obj);
  console.log("PATCH /ap/channel");
});

router.delete("/:id", (req, res)=> {
  // delete a channel
  // respond with 200 or 204
  // 202 if the operation is aysnc and still pending
  let id = req.params.id;
  res.status(204).end();
  console.log("DELETE /api/channel");
});

router.head("/", (req, res) => {
  // return same headers as get. no content. to check that endpoint is functional
  res.send(200).end();
});

router.options("/", (req, res) => {
  // return headers including ALLOW to say what methods are allowed
  res.status(200);
  res.set("Allow", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  res.set("Access-Control-Allow-Origin", "*"); // cors header
  res.set("Content-Length", "0");
  res.end();
})


module.exports = router;