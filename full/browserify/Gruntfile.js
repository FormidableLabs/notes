/**
 * Gruntfile
 */
module.exports = function (grunt) {

  // Helpers
  /**
   * Strip comments from JSON file (naive) and return JS object.
   */
  var _readJsonCfg = function (name) {
    if (!grunt.file.exists(name)) { return "{}"; }
    return JSON.parse(grunt.file.read(name).replace(/\/\/.*\n/g, ""));
  };

  // Declarations:
  var KARMA_JASMINE_OPTIONS = {}; // TODO
  var KARMA_MOCHA_OPTIONS = {
    runnerPort: 9999,
    reporters: ["spec"],
    frameworks: ["mocha"],
    files: [
      // Off of the bundle.
      "<%= mochaDistPath %>/bundle-karma.js"

      // TODO: Try individual specs instead.
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
    mochaDistPath: "test/mocha/js-dist",

    // ------------------------------------------------------------------------
    // Clean tasks.
    // ------------------------------------------------------------------------
    clean: {
      dist: "<%= distPath %>"
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
    browserify: {
      dist: {
        options: {
          transform: ["hbsfy"]
        },
        files: {
          "<%= distPath %>/bundle.js": [
            "./app/js/app/app.js"
          ],
          "<%= mochaDistPath %>/bundle.js": [
            "./test/mocha/js/main-browser.js"
          ],
          "<%= mochaDistPath %>/bundle-karma.js": [
            "./test/mocha/js/main-karma.js"
          ]
        }
      },
      watch: {
        options: {
          watch: true,
          keepAlive: true,
          transform: ["hbsfy"]
        },
        files: {
          "<%= distPath %>/bundle.js": [
            "./app/js/app/app.js"
          ],
          "<%= mochaDistPath %>/bundle.js": [
            "./test/mocha/js/main-browser.js"
          ],
          "<%= mochaDistPath %>/bundle-karma.js": [
            "./test/mocha/js/main-karma.js"
          ]
        }
      }
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

  // --------------------------------------------------------------------------
  // Tasks: Build
  // --------------------------------------------------------------------------
  grunt.registerTask("build", [
    "clean:dist",
    "browserify:dist"
  ]);

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
  grunt.registerTask("server",    ["nodemon:dev"]);
  grunt.registerTask("static",    ["connect:dev"]);
  grunt.registerTask("watch",     ["browserify:watch"]);
  grunt.registerTask("default",   ["build", "check", "watch"]);
};
