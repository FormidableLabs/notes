/**
 * Webpack configuration
 */

var path = require("path");

module.exports = {
  cache: true,
  context: path.join(__dirname, "app"),
  entry: "./js/app/app",
  output: {
    path: path.join(__dirname, "app/js-dist"),
    filename: "bundle.js"
  },
  devtool: "#source-map",
  optimize: {
    minimize: true
  },
  module: {
    loaders: [
      { test: /\.hbs$/, loader: "handlebars-loader" }
    ]
  },
  resolve: {
    alias: {
      "underscore": "lodash/dist/lodash.underscore"
    }
  }
};
