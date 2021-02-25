const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const paymentRouter = require("./routes/payment.routes");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
// Parse cookie bodies, and allow setting/getting cookies
app.use(cookieParser());

// Use Handlebars as the view engine
app.set("view engine", "handlebars");

app.use("/payment", paymentRouter);

module.exports = app;
