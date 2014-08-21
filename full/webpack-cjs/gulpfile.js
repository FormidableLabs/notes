/**
 * Gulpfile
 */
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var gulp = require("gulp");
var jshint = require("gulp-jshint");
var nodemon = require("gulp-nodemon");
var webpack = require("gulp-webpack");
var rimraf = require("gulp-rimraf");

// ----------------------------------------------------------------------------
// Globals
// ----------------------------------------------------------------------------
var CONFIG = {
  APP: {
    ENTRY: "app/js/app/app.js"
  },
  DIST: {
    PATH: "app/js-dist/bundle.js"
  }
};

CONFIG.WEBPACK = {
  cache: true,
  context: path.join(__dirname, "/app"),
  entry: path.join(__dirname, CONFIG.APP.ENTRY),
  output: {
    path: path.join(__dirname, path.dirname(CONFIG.DIST.PATH)),
    filename: path.basename(CONFIG.DIST.PATH)
  },
  module: {
    loaders: [
      { test: /\.hbs$/, loader: "handlebars-loader" }
    ]
  },
  resolve: {
    alias: {
      "underscore": "lodash/dist/lodash.underscore"
    }
  }
};

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
var _webpack = function (opts) {
  return gulp
    .src(CONFIG.APP.ENTRY)
    .pipe(webpack(_.merge({}, CONFIG.WEBPACK, opts)))
    .pipe(gulp.dest(path.dirname(CONFIG.DIST.PATH)));
};

gulp.task("clean", function () {
  return gulp.src([
      path.dirname(CONFIG.DIST.PATH)
    ], { read: false })
    .pipe(rimraf());
});

gulp.task("build:dev", ["clean"], function () {
  return _webpack({
    // Add source map.
    devtool: "#source-map"
  });
});

gulp.task("build:prod", ["clean"], function () {
  return _webpack({
    optimize: {
      minimize: true
    },
    // TODO: Need to hide this from production.
    // TODO: Need to make 127.0.0.1 serving.
    devtool: "#source-map"
  });
});

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
