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
              "sinonjs/sinon.js"
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
      options: {
        frameworks: ["jasmine", "requirejs"],
        runnerPort: 9999,
        reporters: ["spec"],
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
      },
      fast: {
        singleRun: true,
        browsers: ["PhantomJS"]
      },
      windows: {
        singleRun: true,
        browsers: ["PhantomJS", "IE", "Chrome"]
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
    },

    connect: {
      // Run examples server at: http://127.0.0.1:9874
      app: {
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
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-contrib-connect");

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
  grunt.registerTask("test",      ["karma:fast"]);

  grunt.registerTask("check",     ["jshint", "test"]);
  grunt.registerTask("check:ci",  ["jshint", "karma:ci"]);
  grunt.registerTask("check:all", ["jshint", "karma:all"]);

  // --------------------------------------------------------------------------
  // Tasks: Default
  // --------------------------------------------------------------------------
  grunt.registerTask("server",    ["connect:app"]);
  grunt.registerTask("default",   ["build", "check"]);
};
