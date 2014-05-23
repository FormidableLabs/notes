// Decide `localStorage` vs. REST backend.
window._USE_LOCAL_STORAGE = true;

/**
 * Test dependencies.
 *
 * This file lists out all of the individual spec (test) files so that they
 * are run by our infrastructure.
 */
define([
  window._USE_LOCAL_STORAGE === true ?
    "spec/collections/notes.spec" :
    "spec/collections/notes-rest.spec",
  "spec/models/note.spec",
  "spec/routers/router.spec",
  "spec/views/note.spec",
  "spec/views/note-nav.spec",
  "spec/views/note-view.spec",
  "spec/views/notes.spec",
  "spec/views/notes-filter.spec",
  "spec/views/notes-item.spec"
]);
