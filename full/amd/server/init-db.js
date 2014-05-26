var sql = require("sqlite3"),

  dbPath = __dirname + "/notes.sqlite",
  /*jslint bitwise: true */
  openState = sql.OPEN_READWRITE | sql.OPEN_CREATE,
  /*jslint bitwise: false */

  columns = "(id integer primary key autoincrement, title text, text text)",
  createTable = "create table notes " + columns,
  dropTable = "drop table if exists notes",

  db = new sql.Database(dbPath, openState, function (error) {
    db.run(dropTable, function () {
      db.run(createTable);
    });
    db.close();
  });
