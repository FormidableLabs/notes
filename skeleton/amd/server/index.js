var express = require("express"),
  app = express(),
  bodyParser = require("body-parser");
  app.use("/", express.static("app"))
    .use("/app", express.static("app"))
    .use("/test", express.static("test"))
    .use(bodyParser())
    .listen(3000);
