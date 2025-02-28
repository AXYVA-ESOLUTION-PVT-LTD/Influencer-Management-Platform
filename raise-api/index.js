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
const Post = require("./routes/post.route");
const Influencer = require("./routes/influencer.route");
const Brand = require("./routes/brand.route");
const TicketNotification = require("./routes/ticketnotification.route");
const Chat = require("./routes/chat.route");
const Ticket = require("./routes/ticket.route");
const Notification = require("./routes/notification.route");
const Tiktok = require("./routes/tiktok.route");
const Platform = require("./routes/platform.route");
const Publication = require("./routes/publication.route");
const Wallet = require("./routes/wallet.route");
const Transaction = require("./routes/transaction.route");
const Payment = require("./routes/payment.route");
const Facebook = require("./routes/facebook.route");
const Instagram = require("./routes/instagram.route");
const Youtube = require("./routes/youtube.route");
const eventsCronjob = require('./controllers/eventcron.controller');

const path = require("path");
const { getRefreshToken } = require("./controllers/tokengenerator");

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
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "https://dash.brandraise.io"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// app.use(cors({
//   origin: 'https://dash.brandraise.io',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

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

app.use("/v1/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/v1/role", Role);
app.use("/v1/user", User);
app.use("/v1/opportunity", Opportunity);
app.use("/v1/posts", Post);
app.use("/v1/influencer", Influencer);
app.use("/v1/brand", Brand);
app.use("/v1/ticket-notification", TicketNotification);
app.use("/v1/chat", Chat);
app.use("/v1/ticket", Ticket);
app.use("/v1/notification", Notification);
app.post('/v1/refresh-token', getRefreshToken);
app.use('/v1/tiktok', Tiktok);
app.use('/v1/platform', Platform);
app.use('/v1/publication', Publication);
app.use('/v1/wallet', Wallet);
app.use('/v1/transaction', Transaction);
app.use('/v1/payment', Payment);
app.use('/v1/facebook', Facebook);
app.use('/v1/instagram', Instagram);
app.use('/v1/youtube', Youtube);

app.get("/testing",(req,res)=>{
	return res.status(200).json({msg:"server is up an running"});
})

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("============ Database connected successfully =========");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

  // const HOST = '0.0.0.0'; 
  const HOST = 'localhost'; 

server.listen(PORT, HOST, function () {
  if (IS_PRODUCTION == "true") {
    console.log("Express https server listening on *:" + PORT);
  } else {
    console.log("Express http server listening on *:" + PORT);
  }
});

if(eventsCronjob) {
  eventsCronjob.instagramAccessTokenUpdateCron();
  eventsCronjob.facebookAccessTokenUpdateCron();
}