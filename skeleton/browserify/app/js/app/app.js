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
var $ = require("jquery");
var Backbone = require("backbone");
Backbone.$ = $; // Fix Backbone for Browserify.

var helloTmpl = require("./templates/hello.hbs");

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
  defaults: {
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
  helloView.model.set("message", "Hello World!");
  helloView.render();
});
