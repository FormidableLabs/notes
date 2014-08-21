/**
 * Gulpfile
 */
var fs = require("fs");
var gulp = require("gulp");
var jshint = require("gulp-jshint");
var webpack = require("gulp-webpack");

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
gulp.task("jshint:frontend", function () {
  gulp
    .src("app/js/app/**/*.js")
    .pipe(jshint(_jsonCfg(".jshint-frontend.json")))
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

gulp.task("jshint", ["jshint:frontend", "jshint:backend"]);

// ----------------------------------------------------------------------------
// Builders
// ----------------------------------------------------------------------------
gulp.task("webpack", function () {
  return gulp
    .src("app/js/app/app.js")
    .pipe(webpack({ /* webpack configuration */ }))
    .pipe(gulp.dest("app/js-dist/bundle.js"));
});

gulp.task("server", function () {
});

// ----------------------------------------------------------------------------
// Aggregations
// ----------------------------------------------------------------------------
gulp.task("check",    ["jshint"]);
gulp.task("default",  ["check"]);

