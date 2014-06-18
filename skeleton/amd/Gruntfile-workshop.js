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
    // TODO (WORKSHOP): Add clean configuration

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
      options: _readJsonCfg(".jshint-frontend.json"),
      // TODO (WORKSHOP): Add a `client` configuration for:
      // - Files in `app/js/` directory with `.js` suffix.
      // - Files in **anywhere within** `app/js/app/` directory with `.js`
      //   suffix.
      // - Test out with running `grunt jshint:client`
      server: {
        options: _readJsonCfg(".jshint-backend.json"),
        files: {
          src: [
            "*.js",
            "server/**/*.js"
          ]
        }
      }
    }

    // ------------------------------------------------------------------------
    // Development servers.
    // ------------------------------------------------------------------------
    // Full REST backend with Express.
    // TODO (WORKSHOP): Add nodemon configuration

  });

  // Load dependencies.
  // TODO (WORKSHOP): Load clean plugin
  // TODO (WORKSHOP): Load nodemon plugin
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  // --------------------------------------------------------------------------
  // Tasks: Build
  // --------------------------------------------------------------------------
  grunt.registerTask("build:vendor", [
    // TODO (WORKSHOP): Need to `clean` and `copy` the vendor files.
  ]);
  grunt.registerTask("build:dist", [
    // TODO (WORKSHOP): Need to `copy` the distribution files and build
    //                  the RequireJS bundle (hint: `requirejs`)
  ]);
  grunt.registerTask("build", [
    // TODO (WORKSHOP): Need to aggregate the two previous tasks ;)
  ]);

  // --------------------------------------------------------------------------
  // Tasks: QA
  // --------------------------------------------------------------------------
  grunt.registerTask("check", ["jshint"]);

  // --------------------------------------------------------------------------
  // Tasks: Default
  // --------------------------------------------------------------------------
  // TODO (WORKSHOP): Alias nodemon task to `server`
  grunt.registerTask("default", ["build", "check"]);
};
