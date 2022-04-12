const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const routes = require("./app/routes/routes.js");

var corsOptions = {
  origin: "http://localhost:3000"
};
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With,content-type, Accept, Authorization ");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.use('/api', routes);

// Create a connection to the database


// set port, listen for requests

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
} );