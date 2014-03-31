define([
  "jquery",
  "app/views/note-nav"
], function ($, NoteNavView) {

  describe("app/views/note-nav", function () {
    beforeEach(function () {
      // Fixture.
      this.$fixture = $(
        "<ul id='note-nav'>" +
          "<li class='note-view'></li>" +
          "<li class='note-edit'></li>" +
          "<li class='note-delete'></li>" +
        "</ul>"
      ).appendTo($("#fixtures"));

      // The nav. view just wraps existing DOM elements,
      // and doesn't separately render.
      this.view = new NoteNavView({
        el: this.$fixture
      });
    });

    afterEach(function () {
      this.view.remove();
      $("#fixtures").empty();
    });

    describe("events", function () {
      it("fires events on 'view' click", function () {
        var navSpy = sinon.spy(),
          updateSpy = sinon.spy(),
          otherSpy = sinon.spy();

        this.view.on({
          "nav:view": navSpy,
          "nav:update:view": updateSpy,
          "nav:edit nav:update:edit": otherSpy,
          "nav:delete nav:update:delete": otherSpy
        });

        this.$fixture.find(".note-view").click();

        expect(navSpy.callCount).toBe(1);
        expect(updateSpy.callCount).toBe(1);
        expect(otherSpy.callCount).toBe(0);
      });

    });

    describe("menu bar display", function () {
      it("has no active navs by default", function () {
        // Check no list items are active.
        expect(this.view.$("li.active").length).toBe(0);

        // Another way - manually check each list nav.
        expect($(".note-view")
          .attr("class")).not.toContain("active");
        expect($(".note-edit")
          .attr("class")).not.toContain("active");
        expect($(".note-delete")
          .attr("class")).not.toContain("active");
      });

      // Test the actual menu clicks.
      it("updates nav on 'edit' click", function () {
        $(".note-edit").click();
        expect($(".note-edit").attr("class")).toContain("active");
      });

      // Test event triggers (possibly from other views).
      it("updates nav on 'edit' event", function () {
        this.view.trigger("nav:update:edit");
        expect($(".note-edit").attr("class")).toContain("active");
      });
    });
  });
});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/chapters/04/test/test.html
 * http://backbone-testing.com/chapters/04/test/js/spec/views/note-nav.spec.js
 * http://backbone-testing.com/notes/test/test.html?grep=App.Views.NoteNav
 */
