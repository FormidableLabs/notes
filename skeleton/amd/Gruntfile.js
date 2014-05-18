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
    frameworks: ["jasmine", "requirejs"],
    files: [
      // Test libraries.
      "app/js/vendor/sinon.js",

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
    frameworks: ["mocha", "requirejs"],
    files: [
      // Test libraries.
      "app/js/vendor/sinon.js",
      // Chai / Sinon-Chai need async load.
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

    nodemon: {
      dev: {
        script: "server/index.js"
      },
      options: {
        watch: ["server"]
      }
    },

    // ------------------------------------------------------------------------
    // Helper variables and paths.
    // ------------------------------------------------------------------------
    // Path to bower installation.
    bowerPath: "bower_components",
    // Application serving path for where vendor libraries should end up.
    vendorPath: "app/js/vendor",
    // Application production (bundled) distribution path.
    distPath: "app/js-dist",

    // ------------------------------------------------------------------------
    // Clean tasks.
    // ------------------------------------------------------------------------
    clean: {
      vendor: "<%= vendorPath %>",
      dist: "<%= distPath %>"
    },

    // ------------------------------------------------------------------------
    // Copy tasks.
    // ------------------------------------------------------------------------
    copy: {
      // Copy over specific vendor dependencies from bower.
      //
      // **Note**: This task should be run periodically to update sources
      // otherwise stored in source.
      vendor: {
        files: [
          // Copy over libraries, remove intermediate paths, and keep same name.
          //
          // This area is appropriate for libraries that you want to copy as
          // one-off files and *don't* need to rename.
          //
          // E.g.:
          //
          //     bower_components/FULL/PATH/TO/LIBRARY.js ->
          //     app/js/vendor/LIBRARY.js
          //
          //     bower_components/jquery/dist/jquery.js ->
          //     app/js/vendor/jquery.js
          {
            cwd: "<%= bowerPath %>",
            dest: "<%= vendorPath %>",
            expand: true,
            flatten: true,
            src: [
              // App libraries.
              "jquery/dist/jquery.js",
              "lodash/dist/lodash.underscore.js",
              "json2/json2.js",
              "backbone/backbone.js",
              "backbone.localStorage/backbone.localStorage.js",
              "showdown/src/showdown.js",

              // Test libraries.
              "mocha/mocha.js",
              "mocha/mocha.css",
              "chai/chai.js",
              "sinonjs/sinon.js",
              "sinon-chai/lib/sinon-chai.js"
            ]
          },
          // Copy HBS lib and dependencies.
          {
            cwd: "<%= bowerPath %>/hbs",
            dest: "<%= vendorPath %>/hbs",
            expand: true,
            src: [
              "hbs/**",
              "hbs.js"
            ]
          },
          // Copy css/fonts/js of bootstrap's distribution.
          {
            cwd: "<%= bowerPath %>/bootstrap/dist",
            dest: "<%= vendorPath %>/bootstrap",
            expand: true,
            src: [
              "css/**",
              "fonts/**",
              "js/**"
            ]
          },
          // Copy select Jasmine files.
          {
            cwd: "<%= bowerPath %>/jasmine",
            dest: "<%= vendorPath %>/jasmine",
            expand: true,
            flatten: true,
            src: [
              "lib/jasmine-core/jasmine.css",
              "lib/jasmine-core/jasmine.js",
              "lib/jasmine-core/jasmine-html.js"
            ]
          }
        ]
      },

      // Copy over specific distribution dependencies from bower.
      dist: {
        files: [
          // Copy to production "distribution" directory.
          {
            cwd: "<%= bowerPath %>",
            dest: "<%= distPath %>",
            expand: true,
            flatten: true,
            src: [
              // Infrastructure.
              "requirejs/require.js"
            ]
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // Bundle tasks.
    // ------------------------------------------------------------------------
    requirejs: {
      app: {
        options: {
          name: "app/app",
          baseUrl: "app/js/vendor",
          mainConfigFile: "app/js/config.js",
          out: "<%= distPath %>/bundle.js",
          optimize: "uglify2"
        }
      }
    },

    // ------------------------------------------------------------------------
    // JsHint style checks.
    // ------------------------------------------------------------------------
    jshint: {
      client: {
        options: _readJsonCfg(".jshint.json"),
        files: {
          src: [
            "app/js/*.js",
            "app/js/app/**/*.js",
            "test/*/js/**/*.js"
          ]
        }
      }
    },

    // ------------------------------------------------------------------------
    // Karma test driver.
    // ------------------------------------------------------------------------
    // See: http://karma-runner.github.io/0.8/plus/RequireJS.html
    // See: https://github.com/kjbekkelund/karma-requirejs
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

  });

  // Load dependencies.
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-karma");

  // --------------------------------------------------------------------------
  // Tasks: Build
  // --------------------------------------------------------------------------
  grunt.registerTask("build:vendor", [
    "clean:vendor",
    "copy:vendor"
  ]);
  grunt.registerTask("build:dist", [
    "clean:dist",
    "copy:dist",
    "requirejs"
  ]);
  grunt.registerTask("build", [
    "build:vendor",
    "build:dist"
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
  grunt.registerTask("server",    "nodemon:dev");
  grunt.registerTask("default",   ["build", "check"]);
};
