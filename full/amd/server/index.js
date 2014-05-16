var express = require("express"),
  _ = require("lodash"),
  app = express(),
  json = require('express-json'),
  form = require('express-form2'),
  sql = require("sqlite3"),
  db = new sql.Database("./server/notes.sqlite", sql.OPEN_READWRITE, function (error) {
    serverSetup();
  });

function serverSetup () {
  app.use("/", express.static("app"));

  app.get("/tasks", function (req, res) {
    db.prepare("select * from notes")
      .all(
        function (err, rows) {
          res.json(rows);
      });
  });

  // TODO: sanitize input ???
  app.post("/tasks", function (req, res) {
    console.log(req.body);
    db.run("insert into notes (title, text) values(?,'')", title);
    db.prepare("select * from notes order by id desc limit 1")
      .all(
        function (err, rows) {
          res.json(rows);
      });
  });

  app.put("/tasks/:id", function (req, res) {
    var title = req.query.title,
      text = req.query.text;
  });

  app.delete("/tasks/:id", function (req, res, id) {
    db.run("delete from notes where id=1");
  });

  app.listen(3333);
}
