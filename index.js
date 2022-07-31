require("dotenv").config();
const cors = require('cors')
const express = require("express");
const { routes } = require('./routes')
const { FRONT_URL } = require('./config')

const app = express();

app.use(express.json()); // parse requests of content-type - application/json

app.use(
  cors({
    origin: [FRONT_URL, "http://localhost:3000/"],
    credentials: true,
  })
);

routes(app) // Agregamos todas las rutas que se encuentran en routes/index.js

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
