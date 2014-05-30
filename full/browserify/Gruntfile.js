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
          ]
        }
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
  /* TODO
  grunt.registerTask("karma:fast",  ["karma:mocha-fast", "karma:jasmine-fast"]);
  grunt.registerTask("karma:ci",    ["karma:mocha-ci", "karma:jasmine-ci"]);
  grunt.registerTask("karma:all",   ["karma:mocha-all", "karma:jasmine-all"]);
  */

  grunt.registerTask("test",        []); // TODO["karma:fast"]);

  grunt.registerTask("check",       ["jshint", "test"]);
  /* TODO
  grunt.registerTask("check:ci",    ["jshint", "karma:ci"]);
  grunt.registerTask("check:all",   ["jshint", "karma:all"]);
  */

  // --------------------------------------------------------------------------
  // Tasks: Default
  // --------------------------------------------------------------------------
  grunt.registerTask("server",    ["nodemon:dev"]);
  grunt.registerTask("static",    ["connect:dev"]);
  grunt.registerTask("watch",     ["browserify:watch"]);
  grunt.registerTask("default",   ["build", "check", "watch"]);
};
