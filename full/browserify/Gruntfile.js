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
  var KARMA_JASMINE_OPTIONS = {
    runnerPort: 9999,
    reporters: ["spec"],
    frameworks: ["jasmine", "TODO_BROWSERIFY"],
    files: [
      // Test libraries.
      "app/js/vendor/sinon.js", // TODO[BROWSERIFY]

      // Adapters, config and test wrapper.
      "app/js/config.js",
      "test/jasmine/js/main-karma.js",

      // Includes.
      { pattern: "app/js/**/*.js",                included: false },
      { pattern: "app/js/**/*.hbs",               included: false },
      { pattern: "test/jasmine/js/spec/**/*.js",  included: false }
    ]
  };
  var KARMA_MOCHA_OPTIONS = {
    runnerPort: 9999,
    reporters: ["spec"],
    frameworks: ["mocha", "TODO_BROWSERIFY"],
    files: [
      // Test libraries.
      "app/js/vendor/sinon.js", // TODO[BROWSERIFY]
      // Chai / Sinon-Chai need async load. // TODO[BROWSERIFY]
      { pattern: "app/js/vendor/chai.js",         included: false },
      { pattern: "app/js/vendor/sinon-chai.js",   included: false },

      // Adapters, config and test wrapper.
      "app/js/config.js",
      "test/mocha/js/main-karma.js",

      // Includes.
      { pattern: "app/js/**/*.js",                included: false },
      { pattern: "app/js/**/*.hbs",               included: false },
      { pattern: "test/mocha/js/spec/**/*.js",    included: false }
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
      options: _readJsonCfg(".jshint.json"),
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
      }
    },

    // ------------------------------------------------------------------------
    // Bundle.
    // ------------------------------------------------------------------------
    browserify: {
      dist: {
        src: [
          "./app/js/app/app.js"
        ],
        dest: "<%= distPath %>/bundle.js"
      },
      watch: {
        options: {
          watch: true,
          keepAlive: true
        },
        src: [
          "./app/js/app/app.js"
        ],
        dest: "<%= distPath %>/bundle.js"
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
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-karma");

  // --------------------------------------------------------------------------
  // Tasks: Build
  // --------------------------------------------------------------------------
  grunt.registerTask("build", [
    "clean:dist",
    "copy:dist"
    // TODO[BROWSERIFY]
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
  grunt.registerTask("default",   ["build", "check"]);
};
