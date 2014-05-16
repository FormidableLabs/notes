var sql = require("sqlite3"),
  db = new sql.Database("./notes.sqlite", sql.OPEN_READWRITE, function (error) {
    db.run("drop table if exists notes", function () {
      db.run("create table notes (id integer primary key autoincrement, title text, text text)");
    });
    db.close();
  });
