const express = require('express');
const router = express.Router();

/* 
  /api/channel/ API Endpoints
*/
router.get("/", (req,res) => {
  // return list of channels
  // respond with a 200 status code (OK)
  //res.json(data);
  res.send({data: "hi"});
  console.log("GET /api/channel/")  
});

router.get("/:id", (req, res) => {
  // return a speicfic channel
  // respond with a 200
  let id = parseInt(req.params.id);
  res.send({data: `You requested id: ${id}`});
});

router.post("/", (req, res) => {
  // add a new channel then return new list
  // respond with a 201 
  //let name  = req.body.name;
  console.log(req.body);
  let obj = { data: `creating a new object` }
  res.status(201).json(obj);
  console.log("POST /api/channel")
});


module.exports = router;