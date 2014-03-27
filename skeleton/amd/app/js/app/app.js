// SKELETON
define([
  "jquery",

  // Polyfill JSON for old browsers.
  "json2"
], function (
  $
) {
  "use strict";

  $(function () {
    $("<h1>HELLO WORLD!</h1>")
      .css("text-align", "center")
      .appendTo($("body"));
  });
});
