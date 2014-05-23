var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  PORT = process.env.PORT || 3000;

app.use("/", express.static("app"))
  .use("/app", express.static("app"))
  .use("/test", express.static("test"))
  .use(bodyParser())
  .listen(PORT)
