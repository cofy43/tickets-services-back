require("dotenv").config()
const cors = require('cors')
const express = require("express");
const { routes } = require('./app/Routes')
const { FRONT_URL } = require('./app/Config')
const requestIp = require('request-ip')
var cookies = require("cookie-parser")

const app = express();
const allowList = [FRONT_URL, "http://localhost:3001"]

app.use(cookies())

app.use(express.json()); // parse requests of content-type - application/json

app.use(
  cors({
    origin: function (origin, callback) {
      // Log and check yourself if the origin actually matches what you've defined in the allowList array
      console.log(origin);
      console.log(allowList);
      if (allowList.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {        
        callback(new Error('Not allowed by CORS'))
      }
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
