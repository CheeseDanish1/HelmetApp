require("dotenv").config();
require("./database/connection");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const serialize = require("./utils/serialize");

const app = express();
const http = require("http").Server(app);

const PORT = process.env.PORT || 3001;
const routes = require("./routes");

app.get("/", (req, res) => {
  res.send({ status: "Success!" });
});

app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const { decryptData } = require("./utils/crypt");
const COOKIE_NAME = "authorization";
app.use(async (req, res, next) => {
  const cookie = req.cookies[COOKIE_NAME] || req.headers[COOKIE_NAME];
  const data = decryptData(cookie);
  if (!cookie || !data) {
    req.user = null;
    return next();
  }
  req.user = await serialize.user(data);
  return next();
});

app.use("/", routes);

http.listen(PORT, () => console.log(`Running on ${PORT}`));
