var sql = require("sqlite3"),
  db = new sql.Database(__dirname + "/notes.sqlite", sql.OPEN_READWRITE | sql.OPEN_CREATE, function (error) {
    db.run("drop table if exists notes", function () {
      db.run("create table notes (id integer primary key autoincrement, title text, text text)");
    });
    db.close();
  });