/**
 * Test dependencies.
 *
 * This file lists out all of the individual spec (test) files so that they
 * are run by our infrastructure.
 */
// App configuration.
var appConfig = require("app/config"),
  cfgId = !!window.__karma__ ? "karma" : "browser";

appConfig.storeName = "notes-browserify-" + cfgId + "-jasmine";

// Require each module directly.
appConfig.useLocalStorage ?
  require("./collections/notes.spec") :
  require("./collections/notes-rest.spec");

require("./models/note.spec");
require("./routers/router.spec");
// require("./views/note.spec");
// require("./views/note-nav.spec");
// require("./views/note-view.spec");
// require("./views/notes.spec");
// require("./views/notes-filter.spec");
// require("./views/notes-item.spec");
