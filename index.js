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

app.use(
  cors({
    origin: [FRONT_URL],
    methods: ["GET", "POST", "PUT", ],
    credentials: true,
    origin: true,
  })
);

app.use(requestIp.mw())

routes(app) // Agregamos todas las rutas que se encuentran en routes/index.js

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
