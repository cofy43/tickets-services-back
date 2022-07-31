require("dotenv").config();
const cors = require('cors')
const express = require("express");
const { FRONT_URL } = require('./config')

const app = express();

app.use(express.json()); // parse requests of content-type - application/json

app.use(
  cors({
    origin: [FRONT_URL, "http://localhost:3000/"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

app.use("/request-type", (req, res, next) => {
  console.log("Request type: ", req.method);
  next();
});

app.get("/", (req, res) => {
  res.send("Successful response.");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
