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
var connect = require("gulp-connect");
var webpack = require("webpack");
var rimraf = require("gulp-rimraf");

var buildCfg = require("./webpack.config.js");
var mochaCfg = require("./test/mocha/webpack.config.js");
var jasmineCfg = require("./test/jasmine/webpack.config.js");

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

// -----------
// Development
// -----------
gulp.task("clean:dist", function () {
  return gulp.src(["app/js-dist"], { read: false })
    .pipe(rimraf());
});

gulp.task("build:dist", _webpack(_.merge({}, buildCfg, {
  optimize: {
    minimize: false
  }
})));

gulp.task("watch:dist", function () {
  gulp.watch([
    "app/js/app/**/*.js"
  ], ["build:dist"]);
});

// TODO: Put `clean:*` tasks back in as deps! (???)
// TODO: Doc `sources` server at: http://127.0.0.1:3001/test/mocha/test.html

// -----
// Mocha
// -----
gulp.task("clean:mocha", function () {
  return gulp.src(["test/mocha/js-dist"], { read: false })
    .pipe(rimraf());
});

gulp.task("build:mocha", _webpack(mochaCfg));

gulp.task("watch:mocha", function () {
  gulp.watch([
    "app/js/app/**/*.js",
    "test/mocha/js/**/*.js"
  ], ["build:mocha"]);
});


// -----
// Mocha
// -----
gulp.task("clean:jasmine", function () {
  return gulp.src(["test/jasmine/js-dist"], { read: false })
    .pipe(rimraf());
});

gulp.task("build:jasmine", _webpack(jasmineCfg));

gulp.task("watch:jasmine", function () {
  gulp.watch([
    "app/js/app/**/*.js",
    "test/jasmine/js/**/*.js"
  ], ["build:jasmine"]);
});

gulp.task("watch", ["watch:dist", "watch:mocha", "watch:jasmine"]);

gulp.task("build:prod", ["clean:dist"], _webpack(buildCfg));

gulp.task("build:dev", ["build:dist", "build:mocha", "build:jasmine"]);

// ----------------------------------------------------------------------------
// Servers
// ----------------------------------------------------------------------------
// Dev. server
gulp.task("server", function () {
  nodemon({
    script: "server/index.js",
    ext: "js"
  });
});

// Source maps server
gulp.task("server:sources", function () {
  connect.server({
    root: __dirname,
    port: 3001
  });
});

// ----------------------------------------------------------------------------
// Aggregations
// ----------------------------------------------------------------------------
gulp.task("dev",      ["build:dev", "watch"]);
gulp.task("check",    ["jshint"]);
gulp.task("build",    ["build:prod"]);
gulp.task("default",  ["build:dev", "check"]);
