// SKELETON
define([
  "jquery",

  // Polyfill JSON for old browsers.
  "json2"
], function (
  $
) {
  "use strict";


  // Actually wire up and kick everything off!
  //
  // **Note**: The `app.js` file is usually just comprised of **imports**
  // of the individual Backbone.js components above and the below function
  // on page load.
  $(function () {
    // Hide the existing Notes HTML content for our skeleton application.
    // This hide can be removed later, once you are using the HTML content
    // in `index.html`.
    $(".notes-html").hide();

    $("<h1>HELLO WORLD!</h1>")
      .css("text-align", "center")
      .appendTo($("body"));
  });
});
