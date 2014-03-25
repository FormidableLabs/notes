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

From there, you can find a sub-project (skeleton or full example) and follow
the further instructions there.

* [`full/amd/README.md`](full/amd/README.md): Full AMD application.


## AMD

A version of Notes written using [AMD][amd] via [RequireJS][requirejs],
with the following relevant pages:

* [`full/amd/README.md`](full/amd/README.md): Installation.
* [`full/amd/app/index.html`](./full/amd/app/index.html): Notes application.
* [`full/amd/test/jasmine/test.html`](./full/amd/test/jasmine/test.html):
  Jasmine test runner.

and available as source in the [`full/amd/`](./full/amd/) directory:

```
full/amd/
  app/            // Application directory.
  test/
    jasmine/      // Jasmine tests directory.
```

[amd]: http://requirejs.org/docs/whyamd.html
[backbone]: http://backbonejs.org/
[notes_demo]: ./full/amd/app/index.html
[packt]: http://www.packtpub.com/backbonejs-testing/book
[requirejs]: http://requirejs.org/
