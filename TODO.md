Tasks
=====

## Browserify

* (BUG) **Bootstrap**: Not available (Maybe still need `bower` for this?).
    * Both `full` and `skeleton` are missing.
    * `npm install bootstrap` is **wrong** ;)

* (FEATURE) Grunt: New `watch`, etc. tasks
    * `watch`: Make consistent across amd / browserify
    * `default`: Make consistent to. Try to add a static server.

* (FEATURE) Minification: `uglifyify` or `minifyify`
    * Optional Libs: `grunt-watchify`, `browserify-shim`.

* (FEATURE) README:
    * Add dev. workflow, etc.
    * Update for AMD, Browserify full's.
    * Add to skeletons.

* (BUG) Backbone can't get jQuery. Need an expose or a dependency or something.
    * `browserify-shim`? Package.json deps?


## Full

* LocalStorage vs. REST: Check build switch and test more.
    * Maybe move **entirely** to `config.js` for everything...

* Prune all extra bower and npm dependencies (probably lots!)

## Meta Infrastructure

* Build index.html for entire site.
* Maybe add offcanvas nav for site, projects.
