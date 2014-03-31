define([
  "backbone",
  "app/routers/router",
  "app/collections/notes",
  "app/views/notes",
  "app/views/notes-filter",
  "app/views/note"
], function (
  Backbone,
  Router,
  NotesCollection,
  NotesView,
  NotesFilterView,
  NoteView
) {

  describe("app/routers/router", function () {
    // Default option: Trigger and replace history.
    var opts = { trigger: true, replace: true };

    // Common setup (after stubbing, etc.).
    var _setupRouter = function (ctx) {
      // Create router with stubs and manual fakes.
      ctx.router = new Router();

      // Start history to enable routes to fire.
      Backbone.history.start();

      // Spy on all route events.
      ctx.routerSpy = sinon.spy();
      ctx.router.on("route", ctx.routerSpy);
    };

    // Routing tests are a bit complicated in that the actual hash
    // fragment can change unless fully mocked out. We *do not* mock
    // the URL mutations meaning that a hash fragment will appear in
    // our test run (making the test driver appear to be a single
    // page app).
    //
    // There are alternative approaches to this, such as Backbone.js'
    // own unit tests which fully fake out the URL browser location
    // with a mocked object to instead contain URL information and
    // behave mostly like a real location.
    beforeEach(function () {
      // Dependencies and fake patches.
      this.sandbox = sinon.sandbox.create();

      this.sandbox.mock(NotesView);
      this.sandbox.stub(NotesFilterView.prototype);
      this.sandbox.stub(NoteView.prototype);
      NoteView.prototype.render.returns({ $el: null });

      this.sandbox.stub(NotesCollection.prototype, "get", function (i) {
        return i === "1" ? { id: "1" } : null;
      });

      // Starting point.
      this.router = null;
    });

    afterEach(function () {
      // Navigate to home page and stop history.
      if (this.router) {
        this.router.navigate("", opts);
      }

      Backbone.history.stop();
      this.sandbox.restore();
    });

    describe("routing", function () {

      beforeEach(function () {
        // Stub out notes and note to check routing.
        //
        // Happens **before** the router instantiation.
        // If we stub *after* instantiation, then `notes` and `note`
        // can no longer be stubbed in the usual manner.
        sinon.stub(Router.prototype, "notes");
        sinon.stub(Router.prototype, "note");

        _setupRouter(this);
      });

      afterEach(function () {
        Router.prototype.notes.restore();
        Router.prototype.note.restore();
      });

      it("can route to notes", function () {
        // Start out at other route and navigate home.
        this.router.navigate("", opts);
        this.router.navigate("note/1/edit", opts);
        this.router.navigate("", opts);

        expect(Router.prototype.notes.callCount).toBe(2);
        expect(Router.prototype.notes.calledWithExactly(null)).toBe(true);
      });

      it("can route to note", function () {
        this.router.navigate("note/1/edit", opts);
        expect(Router.prototype.note.callCount).toBe(1);
        expect(Router.prototype.note
          .calledWithExactly("1", "edit", null)).toBe(true);
      });

    });

    describe("notes", function () {

      beforeEach(function () {
        _setupRouter(this);
      });

      it("can navigate to notes page", function () {
        // Start out at other route and navigate home.
        this.router.navigate("note/1/edit", opts);
        this.router.navigate("", opts);

        // Spy has now been called **twice**.
        expect(this.routerSpy.callCount).toBe(2);
        expect(this.routerSpy.calledWith("notes")).toBe(true);
      });

    });

    describe("note", function () {

      beforeEach(function () {
        _setupRouter(this);
      });

      it("can navigate to note page", function () {
        this.router.navigate("note/1/edit", opts);

        expect(this.routerSpy.callCount).toBe(1);
        expect(this.routerSpy
          .calledWith("note", ["1", "edit", null])).toBe(true);
      });

      it("can navigate to same note", function () {
        this.router.navigate("note/1/edit", opts);

        expect(this.routerSpy.callCount).toBe(1);
        expect(this.routerSpy
          .calledWith("note", ["1", "edit", null])).toBe(true);

        // Manually patch in model property (b/c stubbed).
        this.router.noteView.model = { id: "1" };

        // Navigating to same with different action works.
        this.router.navigate("note/1/view", opts);

        expect(this.routerSpy.callCount).toBe(2);
        expect(this.routerSpy
          .calledWith("note", ["1", "view", null])).toBe(true);

        // Even with error, should still `remove` existing.
        this.router.navigate("note/2/view", opts);
        expect(this.router.noteView.remove.callCount).toBe(1);
      });

      it("navigates to list on no model", function () {
        this.router.navigate("note/2/edit", opts);

        // Note that the route events are out of order because
        // the re-navigation to "notes" happens **first**.
        expect(this.routerSpy.callCount).toBe(2);
        expect(this.routerSpy
          .calledWith("note", ["2", "edit", null])).toBe(true);
        expect(this.routerSpy
          .calledWith("notes", [null])).toBe(true);
      });

    });
  });
});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/chapters/05/test/test.html
 * http://backbone-testing.com/notes/test/js/spec/routers/router.spec.js
 * http://backbone-testing.com/notes/test/test.html?grep=Router
 */
