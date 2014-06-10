// SKELETON
/**
 * Application.
 *
 * This file is usually the "binding" of all of the individual Backbone.js
 * components into a unified whole. It is also typically *not* unit tested
 * because it has side effects from just running it. So, here is the expected
 * place to also do things like start Backbone.js History, do `$()` DOM
 * manipulation, etc.
 */
define([
  "jquery",
  "backbone",

  // Import and compile a HBS template.
  // For real application, remove this import (and the real file) and replace
  // with imports for your Backbone components needed to bootstrap the full
  // application. Likely this means a collection and router.
  "hbs!app/templates/hello",

  // Polyfill JSON for old browsers.
  "json2"
], function (
  $,
  Backbone,
  helloTmpl
) {
  "use strict";

  // --------------------------------------------------------------------------
  // Backbone.js Components.
  // --------------------------------------------------------------------------
  // Let's write a very simple Backbone model, and bind that with a template
  // to a view.

  // Backbone.js Model
  //
  // The model contains the data. Typically this is sync'ed with remote or
  // local storage.
  var HelloModel = Backbone.Model.extend({
    // Backend REST url prefix.
    urlRoot: "/hello",

    // Default values.
    defaults: {
      id: 0,
      message: "I am the default message"
    }
  });

  // Backbone.js View
  //
  // The view binds model (or collection) data to a Handlebars template and
  // attaches that to the page HTML. It also controls other behaviors.
  var HelloView = Backbone.View.extend({

    // HTML element to attach to.
    el: ".hello",

    // Model data to use (unless one is passed to constructor).
    model: new HelloModel(),

    // Template to bind data to.
    template: helloTmpl,

    // Function to actually bind all of the above together.
    render: function () {
      // Get model JSON data,
      // Add to template and render,
      // Replace existing element HTML!
      this.$el.html(this.template(this.model.toJSON()));

      // `render` should always return `this` by convention.
      return this;
    }
  });

  // --------------------------------------------------------------------------
  // Application Bootstrap
  // --------------------------------------------------------------------------
  // Actually wire up and kick everything off!
  //
  // **Note**: The `app.js` file is usually just comprised of **imports**
  // of the individual Backbone.js components above and the below function
  // on page load.
  $(function () {
    // Now instantiate our view and render!
    var helloView = new HelloView();

    // Update the model data. Without, renders `defaults.message`.
    helloView.model.fetch()
      .done(function () {
        // Success!
        helloView.render();
      })
      .fail(function (jqXHR, textStatus) {
        // Failure!
        var err = jqXHR.responseText || jqXHR.statusText || textStatus;
        helloView.$el.html(
          "<div>Model fetch failed with: <code>" + err + "</code></div>");
      });
  });
});
