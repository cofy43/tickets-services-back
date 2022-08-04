require("dotenv").config()
const cors = require('cors')
const express = require("express");
const { routes } = require('./app/Routes')
const { FRONT_URL } = require('./app/Config')
const requestIp = require('request-ip')
var cookies = require("cookie-parser")

const app = express();

app.use(cookies())

app.use(express.json()); // parse requests of content-type - application/json

whitelist = [FRONT_URL]
app.use(
  cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(whitelist.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(requestIp.mw())

routes(app) // Agregamos todas las rutas que se encuentran en routes/index.js

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
