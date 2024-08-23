const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

const IS_PRODUCTION = process.env.IS_PRODUCTION;
const DB_URL =
  IS_PRODUCTION == true ? process.env.SERVER_DB_URL : process.env.LOCAL_DB_URL;

const Role = require("./routes/role.route");
const User = require("./routes/user.route");
const Opportunity = require("./routes/opportunity.route");

let server;

if (IS_PRODUCTION == "true") {
  const privateKey = fs.readFileSync("secret-keys/private.key", "utf8");
  const certificate = fs.readFileSync("secret-keys/certificate.crt", "utf8");
  // const ca = fs.readFileSync("secret-keys/server.csr", "utf8");

  server = https.createServer({ key: privateKey, cert: certificate }, app);
} else {
  server = http.createServer(app);
}

app.set("port", PORT);
app.use(bodyParser.json({ limit: "50mb" }));
const corsOptions = {
  origin: ["http://localhost:5173", "http://192.168.29.159:5173", "*"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/v1/role", Role);
app.use("/api/v1/user", User);
app.use("/api/v1/opportunity", Opportunity);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("============ Database connected successfully =========");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

server.listen(PORT, "192.168.29.33", function () {
  if (IS_PRODUCTION == "true") {
    console.log("Express https server listening on *:" + PORT);
  } else {
    console.log("Express http server listening on *:" + PORT);
  }
});
