Building secure express base application

To run application:

node app.js


// Docs
Express API
https://expressjs.com/en/4x/api.html

// npm install packages of note.
dotenv
touch .env in root
add port you want to keep secret
add JWT_KEY which is our secret key to sign all json web tokens 

use genkey.js to generate a super secret key


// notes 
added auth/login routes
TODO: add JWT
