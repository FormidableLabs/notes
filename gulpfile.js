/**
 * The gulpfile controls the "meta" level of this project. Namely,
 * coordinating, validating, etc. the various sub-projects. This file is most
 * appropriate for contributors to the project as a whole, and **not**
 * developers looking to use the `skeleton` or `full` implementations of
 * the examples.
 *
 * To run **everything** (install, build, copy to skeleton, check):
 *
 * ```
 * $ gulp
 * ```
 *
 * For a dev-friendly workflow, the do a `setup` then `watch` for full
 * files to copy over to `skeleton`.
 *
 * ```
 * $ gulp setup
 * $ gulp watch
 * ```
 */
var fs = require("fs"),
  path = require("path"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  exec = require("gulp-exec"),
  replace = require("gulp-replace"),

  // Oh, gulp, you disappoint me.
  runSeq = require("run-sequence");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jsonCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// Wrapper for gulp-exec to bridge easily to grunt tasks.
var _execTask = function (cmd, args) {
  return exec(
    "echo \"Running '<%= options.cmd %> <%= options.args %>' in " +
    "'<%= options.dirname(file.path) %>'\" && " +
    "cd \"<%= options.dirname(file.path) %>\" && " +
    "<%= options.cmd %> <%= options.args %>", {
      dirname: path.dirname,
      args: args,
      cmd: cmd
    });
};

var _gruntTask = function (name) {
  return _execTask("./node_modules/.bin/grunt", name);
};

// Make sequential and start fresh.
// Wrap with a `reduceRight` and then execute the outer wrapper.
var _seq = function (names, cb) {
  return names.reduceRight(function (memo, name) {
    return function () { runSeq([name], memo); };
  }, cb);
};

// ----------------------------------------------------------------------------
// JsHint
// ----------------------------------------------------------------------------
gulp.task("jshint:frontend", function () {
  gulp
    .src("*/*/Gruntfile.js")
    .pipe(_gruntTask("jshint"));
});

gulp.task("jshint:backend", function () {
  gulp
    .src([
      "*.js",
      "*/*/Gruntfile.js"
    ])
    .pipe(jshint(_jsonCfg("./_dev/.jshintrc-backend.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint", ["jshint:frontend", "jshint:backend"]);

// ----------------------------------------------------------------------------
// Builders
// ----------------------------------------------------------------------------
// File globs.
var FILES = {
  AMD: {
    KEY: "amd",
    GRUNT: "*/amd/Gruntfile.js",
    SOURCES: [
      "full/amd/{.,}*",
      "!full/amd/README.md",

      "full/amd/app/js/*.js",
      "full/amd/app/css/**",
      "full/amd/test/*/*.html",
      "full/amd/test/*/js/*.js",

      "!full/amd/bower_components/{.,}**/{.,}*",
      "!full/amd/node_modules/{.,}**/{.,}*"
    ]
  },
  BROWSERIFY: {
    KEY: "browserify",
    GRUNT: "*/browserify/Gruntfile.js",
    SOURCES: [
      "full/browserify/{.,}*",
      "!full/browserify/README.md",

      "full/browserify/app/css/**",
      "full/browserify/test/*/*.html",
      "full/browserify/test/*/js/*.js",

      "!full/browserify/bower_components/{.,}**/{.,}*",
      "!full/browserify/node_modules/{.,}**/{.,}*"
    ]
  }
};

// Set up skeleton tasks.
Object.keys(FILES).forEach(function (key) {
  var cfg = FILES[key];

  // Generally speaking, `full` implementations control `skeleton`
  // implementations. These tasks bring the skeletons into sync with the fulls.
  gulp.task("sync:" + cfg.KEY, function () {
    gulp
      .src(cfg.SOURCES, { base: "full/" + cfg.KEY })
      .pipe(gulp.dest("skeleton/" + cfg.KEY));
  });

  gulp.task("install:" + cfg.KEY, function () {
    gulp
      .src(cfg.GRUNT)
      .pipe(_execTask("npm", "install"));
  });

  gulp.task("build:" + cfg.KEY, function () {
    gulp
      .src(cfg.GRUNT)
      .pipe(_gruntTask("build"));
  });

  gulp.task("check:" + cfg.KEY, function () {
    gulp
      .src(cfg.GRUNT)
      .pipe(_gruntTask("check"));
  });

  gulp.task("check:all:" + cfg.KEY, function () {
    gulp
      .src(cfg.GRUNT)
      .pipe(_gruntTask("check:all"));
  });

  gulp.task("watch:" + cfg.KEY, function () {
    gulp.watch(cfg.SOURCES, ["sync:" + cfg.KEY]);
  });
});

// Sync extra stuff from AMD -> Browserify
gulp.task("sync:skel:amd-to-browserify", function () {
  gulp
    .src([
      "skeleton/amd/app/js/app/templates/*.hbs"
    ], { base: "skeleton/amd" })
    .pipe(gulp.dest("skeleton/browserify"));
});

gulp.task("sync:full:amd-to-browserify", function () {
  gulp
    .src([
      "full/amd/app/js/app/templates/*.hbs",
      "full/amd/server/**"
    ], { base: "full/amd" })
    .pipe(gulp.dest("full/browserify"));
});

// Switch between `localStorage` and REST backends.
//
// **Note**: We keep `gh-pages` branch with `useLs = true` to allow static
// serving and localStorage demos...
var useLs = false; // true, false -- Use LocalStorage?
var oldBack = useLs ? "false" : "true";
var newBack = useLs ? "true" : "false";
gulp.task("replace:backend", function () {
  gulp
    .src([
      "full/amd/app/js/app/**/*.js",
      "full/amd/test/*/js/**/*.js"
    ], { base: "full/amd/" })
    .pipe(replace("window._USE_LOCAL_STORAGE = " + oldBack + ";",
                  "window._USE_LOCAL_STORAGE = " + newBack + ";"))
    .pipe(gulp.dest("full/amd/"));
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("sync",       ["sync:amd", "sync:browserify",
                         "sync:skel:amd-to-browserify",
                         "sync:full:amd-to-browserify"]);
gulp.task("install",    ["install:amd", "install:browserify"]);
gulp.task("build",      ["build:amd", "build:browserify"]);

gulp.task("watch",      ["watch:amd", "watch:browserify"]);

gulp.task("check",      ["jshint"]);
gulp.task("check:ci",   ["jshint:backend"]);
gulp.task("check:fast", ["jshint:backend", "check:amd", "check:browserify"]);
gulp.task("check:all",  ["jshint:backend", "check:all:amd",
                         "check:all:browserify"]);

gulp.task("setup", function (cb) {
  _seq([
    "sync",
    "install",
    "build",
  ], cb)();
});

gulp.task("default", function (cb) {
  _seq([
    "setup",
    "check"
  ], cb)();
});
