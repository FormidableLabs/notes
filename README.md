Notes
=====

Sample applications, tests, and examples for [Backbone.js][backbone].


## Introduction

**[Notes][notes_demo]** is a simple personal note manager web application,
written for the book **[Backbone.js Testing][packt]**. This project introduces
situation-specific versions of the application and tests to demonstrate an
exemplary modern frontend web project - including the infrastructure,
application and full test suite.


## Installation

First, follow the instructions in [`INSTALL.md`](INSTALL.md) to get all of the
core technologies needed for any parts of this project.

Then, clone this directory or fork your own version of the repository:

```
$ cd /PATH/TO/REPOS/
$ git clone https://github.com/FormidableLabs/notes.git
```

## Projects

From there, you can find a sub-project (skeleton or full example) and follow
the further instructions there.

* [`skeleton/amd/README.md`](skeleton/amd/README.md): Skeleton AMD application,
  available in source at: [`skeleton/amd/`](skeleton/amd/).
    * [Backbone.js Application](http://formidablelabs.github.io/notes/skeleton/amd/app/index.html)
    * [Jasmine Tests](http://formidablelabs.github.io/notes/skeleton/amd/test/jasmine/test.html)
    * [Mocha Tests](http://formidablelabs.github.io/notes/skeleton/amd/test/mocha/test.html)

* [`full/amd/README.md`](full/amd/README.md): Full AMD application, available
  in source at: [`full/amd/`](full/amd/).
    * [Backbone.js Application](http://formidablelabs.github.io/notes/full/amd/app/index.html)
    * [Jasmine Tests](http://formidablelabs.github.io/notes/full/amd/test/jasmine/test.html)
    * [Mocha Tests](http://formidablelabs.github.io/notes/full/amd/test/mocha/test.html)


## Build

We test all changes with [Travis CI][trav]. Here's our current
[build status][trav_site]:

[![Build Status][trav_img]][trav_site]


## Development

The project assumes a REST backend, but has a localStorage version of the full
and skeleton apps available by editing:

```js
var useLs = true; // Use LocalStorage?
```

in the root `gulpfile.js`, and then running:

```
$ gulp replace:backend
$ gulp
```

The `gh-pages` branch (which also stores built files to source for serving)
has this option enabled.


[notes_demo]: ./full/amd/app/index.html
[packt]: http://www.packtpub.com/backbonejs-testing/book
[backbone]: http://backbonejs.org/
[trav]: https://travis-ci.org/
[trav_img]: https://api.travis-ci.org/FormidableLabs/notes.png
[trav_site]: https://travis-ci.org/FormidableLabs/notes
