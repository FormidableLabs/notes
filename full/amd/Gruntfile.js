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
    // JsHint style checks.
    // ------------------------------------------------------------------------
    jshint: {
      client: {
        options: _readJsonCfg(".jshint.json"),
        files: {
          src: []
        }
      }
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
              "mocha/mocha.js",
              "mocha/mocha.css",
              "chai/chai.js",
              "sinon-chai/lib/sinon-chai.js",
              "blanket/dist/qunit/blanket.js",
              "jquery/dist/jquery.js",
              "json2/json2.js",
              "underscore/underscore.js",
              "backbone/backbone.js",
              "backbone.localStorage/backbone.localStorage.js"
            ]
          },
          // Copy and **rename** Sinon.JS library file.
          {
            src: "<%= bowerPath %>/sinon/index.js",
            dest: "<%= vendorPath %>/sinon.js"
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
          // Copy all of showdown's distribution.
          {
            cwd: "<%= bowerPath %>/showdown/src",
            dest: "<%= vendorPath %>/showdown",
            expand: true,
            src: ["**"]
          }
        ]
      }
    }
  });

  // Load vendor tasks.
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-copy");
};
