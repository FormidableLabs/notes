var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  sql = require("sqlite3"),
  dbPath = __dirname + "/notes.sqlite",
  db = null,
  PORT = process.env.PORT || 3000;

function serverSetup() {
  app.use("/js-dist/*.map", function (req, res) {
    res.send(404, "404"); // Prevent sourcemap serving.
  });
  app.use("/", express["static"]("app"));
  app.use("/app", express["static"]("app"));
  app.use("/test", express["static"]("test"));
  app.use("/node_modules", express["static"]("node_modules"));
  app.use(bodyParser());

  app.get("/notes", function (req, res) {
    db.prepare("select * from notes")
      .all(function (err, rows) {
        res.json(rows);
      });
  });

  // TODO: sanitize input
  app.post("/notes", function (req, res) {
    var title = req.body.title || "",
      text = req.body.text || "";
    db.run("insert into notes (title, text) values(?,?)", title, text)
      .prepare("select * from notes order by id desc limit 1")
      .get(function (err, row) {
        res.json(row);
      });
  });

  // TODO: sanitize input
  app.put("/notes/:id", function (req, res) {
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
  app["delete"]("/notes/:id", function (req, res, id) {
    db.run("delete from notes where id=?", req.params.id, function () {
      res.json({});
    });
  });

  app.listen(3000);
}

db = new sql.Database(dbPath, sql.OPEN_READWRITE, serverSetup);
