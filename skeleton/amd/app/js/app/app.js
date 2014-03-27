// SKELETON
define([
  "jquery",
  "backbone",

  // Import and compile a HBS template.
  "hbs!app/templates/hello",

  // Polyfill JSON for old browsers.
  "json2"
], function (
  $,
  Backbone,
  helloTmpl
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

    $(helloTmpl({ message: "Hello World!" }))
      .css("text-align", "center")
      .appendTo($("body"));
  });
});
