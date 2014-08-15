/**
 * Gruntfile
 */
var _ = require("lodash");
var path = require("path");

module.exports = function (grunt) {

  // Helpers
  /**
   * Strip comments from JSON file (naive) and return JS object.
   */
  var _readJsonCfg = function (name) {
    if (!grunt.file.exists(name)) { return "{}"; }
    return JSON.parse(grunt.file.read(name).replace(/\/\/.*\n/g, ""));
  };

  // Common configurations.
  var MINIFY = {
    minify: true,
    compressPath: function (p) {
      return "http://127.0.0.1:3000/app/" + path.relative("app", p);
    },
    map: "http://127.0.0.1:3000/<%= mapPath %>/bundle.map.json",
    output: "<%= mapPath %>/bundle.map.json"
  };
  var REMAP = [{
    src: "**/*.js",
    expose: "app",
    cwd: "./app/js/app"
  }];

  // Need to exactly match string in `package.json`.
  process.env.BROWSERIFYSWAP_ENV = "production";

  // Declarations: Individual tasks:
  // * `dist`
  // * `dist-watch`
  // * `dist-min`
  // * `dist-min-watch`
  // * `mocha`
  // * `mocha-watch`
  // * `jasmine`
  // * `jasmine-watch`
  var BUNDLES = {
    dist: {
      src: "./app/js/app/app.js",
      dest: "<%= distPath %>/bundle.js"
    },
    mocha: {
      options: {
        plugin: [["remapify", REMAP]]
      },
      src: "./test/mocha/js/main.js",
      dest: "<%= mochaDistPath %>/bundle.js"
    },
    jasmine: {
      options: {
        plugin: [["remapify", REMAP]]
      },
      src: "./test/jasmine/js/main.js",
      dest: "<%= jasmineDistPath %>/bundle.js"
    }
  };
  BUNDLES["dist-min"] = _.extend({
    options: {
      plugin: [["minifyify", MINIFY]]
    }
  }, BUNDLES.dist);
  var BUNDLES_WATCH = _.chain(BUNDLES)
    .map(function (v, k) {
      return [k + "-watch", _.merge({
        options: {
          watch: true,
          keepAlive: true
        }
      }, v)];
    })
    .object()
    .value();

  var KARMA_JASMINE_OPTIONS = {
    runnerPort: 9999,
    reporters: ["spec"],
    frameworks: ["jasmine"],
    files: [
      // Test libraries.
      "node_modules/sinon/pkg/sinon.js",

      // Off of the bundle.
      "<%= jasmineDistPath %>/bundle.js"
    ],
    client: {
      mocha: {
        ui: "bdd"
      }
    }
  };
  var KARMA_MOCHA_OPTIONS = {
    runnerPort: 9999,
    reporters: ["spec"],
    frameworks: ["mocha"],
    files: [
      // Test libraries.
      "node_modules/sinon/pkg/sinon.js",

      // Off of the bundle.
      "<%= mochaDistPath %>/bundle.js"
    ],
    client: {
      mocha: {
        ui: "bdd"
      }
    }
  };

  // Configuration.
  grunt.initConfig({

    // ------------------------------------------------------------------------
    // Helper variables and paths.
    // ------------------------------------------------------------------------
    // Application production (bundled) distribution path.
    distPath: "app/js-dist",
    mapPath: "app/js-map",
    mochaDistPath: "test/mocha/js-dist",
    jasmineDistPath: "test/jasmine/js-dist",

    // ------------------------------------------------------------------------
    // Clean tasks.
    // ------------------------------------------------------------------------
    clean: {
      dist: [
        "<%= distPath %>",
        "<%= mapPath %>"
      ],
      mocha: "<%= mochaDistPath %>",
      jasmine: "<%= jasmineDistPath %>"
    },

    // ------------------------------------------------------------------------
    // JsHint style checks.
    // ------------------------------------------------------------------------
    jshint: {
      options: _readJsonCfg(".jshint-frontend.json"),
      client: {
        files: {
          src: [
            "app/js/*.js",
            "app/js/app/**/*.js"
          ]
        }
      },
      test: {
        options: {
          "es3": false // Allow old-IE breaking variations for `to.be.true`.
        },
        files: {
          src: [
            "test/*/js/**/*.js"
          ]
        }
      },
      server: {
        options: _readJsonCfg(".jshint-backend.json"),
        files: {
          src: [
            "*.js",
            "server/**/*.js"
          ]
        }
      }
    },

    // ------------------------------------------------------------------------
    // Bundle.
    // ------------------------------------------------------------------------
    browserify: _.merge({
      options: {
        transform: ["hbsfy"]
      }
    }, BUNDLES, BUNDLES_WATCH),

    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 8
      },
      "watch": [
        "browserify:dist-watch",
        "browserify:mocha-watch",
        "browserify:jasmine-watch"
      ]
    },

    // ------------------------------------------------------------------------
    // Karma test driver.
    // ------------------------------------------------------------------------
    karma: {
      "mocha-fast": {
        options: KARMA_MOCHA_OPTIONS,
        singleRun: true,
        browsers: ["PhantomJS"]
      },
      "jasmine-fast": {
        options: KARMA_JASMINE_OPTIONS,
        singleRun: true,
        browsers: ["PhantomJS"]
      },
      "mocha-windows": {
        options: KARMA_MOCHA_OPTIONS,
        singleRun: true,
        browsers: ["PhantomJS", "IE", "Chrome"]
      },
      "jasmine-windows": {
        options: KARMA_JASMINE_OPTIONS,
        singleRun: true,
        browsers: ["PhantomJS", "IE", "Chrome"]
      },
      "mocha-ci": {
        options: KARMA_MOCHA_OPTIONS,
        singleRun: true,
        browsers: ["PhantomJS", "Firefox"]
      },
      "jasmine-ci": {
        options: KARMA_JASMINE_OPTIONS,
        singleRun: true,
        browsers: ["PhantomJS", "Firefox"]
      },
      "mocha-all": {
        options: KARMA_MOCHA_OPTIONS,
        singleRun: true,
        browsers: ["PhantomJS", "Chrome", "Firefox", "Safari"]
      },
      "jasmine-all": {
        options: KARMA_JASMINE_OPTIONS,
        singleRun: true,
        browsers: ["PhantomJS", "Chrome", "Firefox", "Safari"]
      },
      "jasmine-dev": {
        // Runs tests automatically on changes in ongoing terminal.
        options: KARMA_JASMINE_OPTIONS,
        browsers: ["PhantomJS", "Chrome", "Firefox", "Safari"]
      },
      "mocha-dev": {
        // Runs tests automatically on changes in ongoing terminal.
        options: KARMA_MOCHA_OPTIONS,
        browsers: ["PhantomJS", "Chrome", "Firefox", "Safari"]
      }
    },

    // ------------------------------------------------------------------------
    // Development servers.
    // ------------------------------------------------------------------------
    // Full REST backend with Express.
    nodemon: {
      dev: {
        script: "server/index.js"
      },
      options: {
        watch: ["server"]
      }
    },

    // Pure static (localStorage) server.
    connect: {
      // Run examples server at: http://127.0.0.1:9874
      dev: {
        options: {
          port: 9874,
          base: ".",
          keepalive: true
        }
      }
    }

  });

  // Load dependencies.
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-concurrent");

  // --------------------------------------------------------------------------
  // Tasks: Build
  // --------------------------------------------------------------------------
  // Make map directory.
  grunt.registerTask("create:map", function () {
    grunt.file.mkdir(grunt.config("mapPath"));
  });
  // Development build: Everything, no minification.
  grunt.registerTask("build:dev", [
    "clean:dist",
    "create:map",
    "clean:mocha",
    "clean:jasmine",
    "browserify:dist",
    "browserify:mocha",
    "browserify:jasmine"
  ]);
  // Production build: App-only, minified.
  grunt.registerTask("build:prod", [
    "clean:dist",
    "create:map",
    "browserify:dist-min"
  ]);
  grunt.registerTask("build",       ["build:prod"]);

  // --------------------------------------------------------------------------
  // Tasks: QA
  // --------------------------------------------------------------------------
  grunt.registerTask("karma:fast",  ["karma:mocha-fast", "karma:jasmine-fast"]);
  grunt.registerTask("karma:ci",    ["karma:mocha-ci", "karma:jasmine-ci"]);
  grunt.registerTask("karma:all",   ["karma:mocha-all", "karma:jasmine-all"]);

  grunt.registerTask("test",        ["karma:fast"]);

  grunt.registerTask("check",       ["jshint", "test"]);
  grunt.registerTask("check:ci",    ["jshint", "karma:ci"]);
  grunt.registerTask("check:all",   ["jshint", "karma:all"]);

  // --------------------------------------------------------------------------
  // Tasks: Default
  // --------------------------------------------------------------------------
  grunt.registerTask("server",      ["nodemon:dev"]);
  grunt.registerTask("static",      ["connect:dev"]);
  grunt.registerTask("watch",       ["concurrent:watch"]);
  grunt.registerTask("default",     ["build:dev", "check", "watch"]);
};
