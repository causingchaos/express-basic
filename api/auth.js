"use strict";
const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 13; // 1sec/hash

//data -- temp -- will wire in database instead
const users = require('../data/user.js').users;

/* Middlware */

/**
 * /api/auth endpoints
 */

 // WARNING DATA FROM CLIENT NOT BEING SANITIZED

router.post('/register', async (req, res) => {
    console.log("POST /api/auth/register")
    //get the email and password from req.body
    //check for duplicate email address
    let userMatch = users.find((user) => req.body.email === user.email);
    if (!userMatch) {
      //let passHash = '$2b$13$CW3SP.VCKI0NQFgu9plKQeXc3KugDB9hD/EB.nDgS79FQyxzBSDBW';
      console.log(req.body);
      let passHash = await bcrypt.hash(req.body.password, saltRounds);
      //add to the user data
      let newUser = {
        _id: Date.now(),
        email: req.body.email,
        password: passHash
      };
      users.push(newUser);
      console.log('Full user list', users);
      //send a response
      res.status(201).send({data: newUser}); 
    } else {
      res
        .status(400)
        .send({ error: { code: 400, message: 'Email address already used'} })
    }
});

router.post('/login', async (req, res) => {
  // get email and password from the req.body
  // find the match for the email
  let userMatch = users.find((user) => req.body.email === user.email);
  if (userMatch) {
    //validate the password using bcrypt
    let submittedPass = req.body.password;
    let savedPass = userMatch.password; // hashed password stored in DB
    const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
    if (passwordDidMatch) {
      console.log("passwords matched")
      res.status(200).send({ data: { token: 'this is a pretend token' } });
    }else{
      res.status(401).send({
        error: { code: 401, message: 'invalid username or password'},
      });
    };
  } else {
    // cause a delay to hide the fact that there was no match
    let fakePass = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaa`;
    await bcrypt.compare(submittedPass, fakePass);
    res
      .status(401)
      .send({ error: { code: 401, message: 'invalid username or password' } });
  };
});

module.exports = router;