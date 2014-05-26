Tasks
=====

## Browserify

* LS vs. REST: Check build switch and test more.
    * Maybe move **entirely** to `config.js` for everything...
* Backbone can't get jQuery. Need an expose or a dependency or something.
    * `browserify-shim`? Package.json deps?
* Bootstrap is not available. (Maybe still need `bower` for this?).
    * `npm install bootstrap` is **wrong** ;)
* Minification: `uglifyify` or `minifyify`
* Optional Libs: `grunt-watchify`, `browserify-shim`.

* *Error - Showdown Lib*: Actually **in** the library (ugh). `undefind`
  `if (typeof module !== 'undefind' && typeof exports !== 'undefined' && typeof require !== 'undefind') {`

## Skeleton

* Remove `notes` app HTML setup and make clean.

## Full

* Prune all extra bower and npm dependencies (probably lots!)

## Meta Infrastructure

* Build index.html for entire site.
* Maybe add offcanvas nav for site, projects.
