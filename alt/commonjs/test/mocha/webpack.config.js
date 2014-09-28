/**
 * Webpack configuration
 */

var path = require("path");

module.exports = {
  cache: true,
  context: __dirname,
  entry: "./js/main",
  output: {
    path: path.join(__dirname, "js-dist"),
    filename: "bundle.js"
  },
  devtool: "#source-map",
  module: {
    loaders: [
      { test: /\.hbs$/, loader: "handlebars-loader" }
    ]
  },
  resolve: {
    alias: {
      "underscore": "lodash/dist/lodash.underscore",
      "app": path.join(__dirname, "../../app/js/app")
    }
  }
};
