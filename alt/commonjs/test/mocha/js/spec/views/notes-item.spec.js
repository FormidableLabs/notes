var Backbone = require("backbone");
var NotesItemView = require("app/views/notes-item");
var NoteModel = require("app/models/note");

describe("app/views/notes-item", function () {
  // Don't need to specify fixtures, as rendering creates an
  // unattached element that the app manually appends, and we
  // directly check here.
  before(function () {
    sinon.stub(NotesItemView.prototype, "remove");
    this.navigate = sinon.stub(Backbone.history, "navigate");

    this.view = new NotesItemView({
      model: new NoteModel({ id: "0", title: "title" })
    });
  });

  afterEach(function () {
    this.navigate.reset();
  });

  after(function () {
    NotesItemView.prototype.remove.restore();
    this.navigate.restore();
    this.view.remove();
  });

  describe("remove", function () {
    it("is removed on model destroy", function () {
      this.view.model.trigger("destroy");
      expect(this.view.remove).to.be.calledOnce;
    });
  });

  describe("render", function () {
    // One way to verify is with a stub.
    it("renders on model change w/ stub", sinon.test(function () {
      // Stub view and re-init to bind.
      this.stub(this.view, "render");
      this.view.initialize();

      this.view.model.trigger("change");
      expect(this.view.render).to.have.been.calledOnce;
    }));

    // Here is another way to do the same check with a mock.
    it("renders on model change w/ mock", sinon.test(function () {
      // Mock view and re-init to bind.
      var exp = this.mock(this.view).expects("render").once();
      this.view.initialize();

      this.view.model.trigger("change");
      exp.verify();
    }));
  });

  // -- Omitted in Book. --
  describe("DOM", function () {
    it("renders data to HTML", function () {
      var $item = this.view.render().$el;

      // Should set `id` on DOM element and title.
      expect($item.attr("id")).to.equal(this.view.model.id);
      expect($item.find(".note-title").text()).to.equal("title");
    });
  });

  describe("actions", function () {
    it("views on click", function () {
      this.view.$(".note-view").click();

      expect(this.navigate)
        .to.be.calledOnce.and
        .to.be.calledWith("note/0/view");
    });

    it("edits on click", function () {
      this.view.$(".note-edit").click();

      expect(this.navigate)
        .to.be.calledOnce.and
        .to.be.calledWith("note/0/edit");
    });

    it("deletes on click", sinon.test(function () {
      // Empty stub for model destroy to prevent side effects.
      this.stub(this.view.model, "destroy");
      this.view.$(".note-delete").click();

      expect(this.view.model.destroy).to.be.calledOnce;
    }));
  });
});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/chapters/05/test/test.html
 * http://backbone-testing.com/chapters/05/test/js/spec/views/notes-item.spec.js
 * http://backbone-testing.com/notes/test/test.html?grep=App.Views.NotesItem
 */
