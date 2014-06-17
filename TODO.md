Tasks
=====

## General

* (FEATURE): Jade-build the base README to a full HTML page and better
  `gh-pages`.

* Prune all extra bower and npm dependencies (probably lots!)

## Browserify

* (CHORE) Dev with source maps, but **without** minify.

* (BUG) **Grunt Watch**: Doesn't pick up changes with minify.

* (CHORE) STILL have extra `underscore` dep. in bundle.
  https://github.com/thlorenz/browserify-shim/issues/29
  https://github.com/jeromegn/Backbone.localStorage/issues/134

### Optional

* (FEATURE) Grunt: New `watch`, etc. tasks
    * `watch`: Make consistent across amd / browserify
    * `default`: Make consistent to. Try to add a static server.

* (FEATURE) README:
    * Add dev. workflow, etc.
    * Update for AMD, Browserify full's.
    * Add to skeletons.

* (CHORE) LocalStorage vs. REST: Check build switch and test more.
    * Maybe move **entirely** to `config.js` for everything...
    * AMD: `_USE_LOCAL_STORAGE`
    * Browserify: `useLocalStorage: false`

## Training

* **Backbone.js**
    * Challenges: Make these easier and more structured.
        * Children views.

## Meta Infrastructure

* Build index.html for entire site.
* Maybe add offcanvas nav for site, projects.
