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

  // Configuration.
  grunt.initConfig({

    // ------------------------------------------------------------------------
    // Helper variables and paths.
    // ------------------------------------------------------------------------
    // Path to bower installation.
    bowerPath: "bower_components",
    // Application serving path for where vendor libraries should end up.
    vendorPath: "app/js/vendor",

    // ------------------------------------------------------------------------
    // Clean tasks.
    // ------------------------------------------------------------------------
    clean: {
      vendor: "<%= vendorPath %>"
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
          //     bower_components/blanket/dist/qunit/blanket.js ->
          //     app/js/vendor/blanket.js
          {
            cwd: "<%= bowerPath %>",
            dest: "<%= vendorPath %>",
            expand: true,
            flatten: true,
            src: [
              // Infrastructure.
              "requirejs/require.js",

              // App libraries.
              "jquery/dist/jquery.js",
              "lodash/dist/lodash.underscore.js",
              "json2/json2.js",
              "backbone/backbone.js",
              "backbone.localStorage/backbone.localStorage.js",
              "showdown/src/showdown.js",

              // Test libraries.
              "sinonjs/sinon.js"
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
      options: {
        frameworks: ["jasmine", "requirejs"],
        runnerPort: 9999,
        reporters: ["spec"],
        files: [
          // Adapters, config and test wrapper.
          "app/js/config.js",
          "test/jasmine/js/main-karma.js",

          // Includes.
          { pattern: "app/js/**/*.js",                included: false },
          { pattern: "test/jasmine/js/spec/**/*.js",  included: false }
        ]
      },
      fast: {
        singleRun: true,
        browsers: ["PhantomJS"]
      },
      ci: {
        singleRun: true,
        browsers: ["PhantomJS", "Firefox"]
      },
      all: {
        singleRun: true,
        browsers: ["PhantomJS", "Chrome", "Firefox", "Safari"]
      },
      dev: {
        // Runs tests automatically on changes in ongoing terminal.
        browsers: ["PhantomJS", "Chrome", "Firefox", "Safari"]
      }
    }

  });

  // Load dependencies.
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-karma");

  // --------------------------------------------------------------------------
  // Tasks: Build
  // --------------------------------------------------------------------------
  grunt.registerTask("build:vendor", [
    "clean:vendor",
    "copy:vendor"
  ]);
  grunt.registerTask("build", [
    "build:vendor",
    "copy:vendor"
  ]);

  // --------------------------------------------------------------------------
  // Tasks: QA
  // --------------------------------------------------------------------------
  grunt.registerTask("test",      ["karma:fast"]);

  grunt.registerTask("check",     ["jshint", "test"]);
  grunt.registerTask("check:ci",  ["jshint", "karma:ci"]);
  grunt.registerTask("check:all", ["jshint", "karma:all"]);

  // --------------------------------------------------------------------------
  // Tasks: Default
  // --------------------------------------------------------------------------
  grunt.registerTask("default",   ["build", "check"]);
};
