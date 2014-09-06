/**
 * Gulpfile
 */
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var gulp = require("gulp");
var gutil = require("gulp-util");
var jshint = require("gulp-jshint");
var nodemon = require("gulp-nodemon");
var webpack = require("webpack");
var rimraf = require("gulp-rimraf");

var buildCfg = require("./webpack.config.js");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jsonCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// ----------------------------------------------------------------------------
// JsHint
// ----------------------------------------------------------------------------
gulp.task("jshint:client", function () {
  gulp
    .src([
      "app/js/*.js",
      "app/js/app/**/*.js"
    ])
    .pipe(jshint(_jsonCfg(".jshint-frontend.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:test", function () {
  gulp
    .src([
      "test/*/js/**/*.js"
    ])
    .pipe(jshint(_.extend(_jsonCfg(".jshint-frontend.json"), {
      "es3": false // Allow old-IE breaking variations for `to.be.true`.
    })))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:backend", function () {
  gulp
    .src([
      "server/**/*.js",
      "gulpfile.js"
    ])
    .pipe(jshint(_jsonCfg(".jshint-backend.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint", ["jshint:client", "jshint:test", "jshint:backend"]);

// ----------------------------------------------------------------------------
// Builders
// ----------------------------------------------------------------------------
// Create webpack task.
var _webpack = function (cfg) {
  var compiler = webpack(cfg); // Single compiler for caching.

  return function (done) {
    compiler.run(function (err, stats) {
      if (err) { throw new gutil.PluginError("webpack", err); }

      gutil.log("[webpack]", stats.toString({
        hash: true,
        colors: true
      }));

      done();
    });
  };
};

gulp.task("clean", function () {
  return gulp.src([
      "app/js-dist"
    ], { read: false })
    .pipe(rimraf());
});

gulp.task("build:dev", ["clean"], _webpack(_.merge({}, buildCfg, {
  optimize: {
    minimize: false
  }
})));

gulp.task("build:prod", ["clean"], _webpack(buildCfg));

gulp.task("server", function () {
  nodemon({
    script: "server/index.js",
    ext: "js"
  });
});

// ----------------------------------------------------------------------------
// Aggregations
// ----------------------------------------------------------------------------
gulp.task("check",    ["jshint"]);
gulp.task("build",    ["build:prod"]);
gulp.task("default",  ["build:dev", "check"]);
