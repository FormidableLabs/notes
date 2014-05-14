var express = require("express"),
  app = express(),
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

  app.post("/task", function (req, res) {
  });

  app.put("/task/:id", function (req, res) {
  });

  app.delete("/task/:id", function (req, res) {
  });

  app.listen(3333);
}
