var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  sql = require("sqlite3"),
  dbPath = __dirname + "/notes.sqlite",
  db = new sql.Database(dbPath, sql.OPEN_READWRITE, function (error) {
    serverSetup();
  });

function serverSetup () {
  app.use("/", express.static("app"));
  app.use(bodyParser());

  app.get("/tasks", function (req, res) {
    db.prepare("select * from notes")
      .all(function (err, rows) {
        res.json(rows);
      });
  });

  // TODO: sanitize input
  app.post("/tasks", function (req, res) {
    var title = req.body.title || "",
      text = req.body.text || "";
    db.run("insert into notes (title, text) values(?,?)", title, text)
      .prepare("select * from notes order by id desc limit 1")
      .get(function (err, row) {
        res.json(row);
      });
  });

  // TODO: sanitize input
  app.put("/tasks/:id", function (req, res) {
    var title = req.body.title,
      text = req.body.text,
      id = req.params.id;
    db.run("update notes set title=?, text=? where id=?", title, text, id)
      .prepare("select * from notes where id=?", id)
      .get(function (err, row) {
        res.json(row);
      });
  });

  // TODO: sanitize input
  app.delete("/tasks/:id", function (req, res, id) {
    db.run("delete from notes where id=?", req.params.id, function () {
      res.json({});
    });
  });

  app.listen(3000);
}
