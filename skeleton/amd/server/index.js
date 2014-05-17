var express = require("express"),
  app = express(),
  bodyParser = require("body-parser");
  app.use("/", express.static("app"))
    .use(bodyParser())
    .listen(3000);
