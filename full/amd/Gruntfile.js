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
    jshint: {
      client: {
        options: _readJsonCfg(".jshint.json"),
        files: {
          src: []
        }
      }
    }
  });

  // Load vendor tasks.
  grunt.loadNpmTasks("grunt-contrib-jshint");

};
