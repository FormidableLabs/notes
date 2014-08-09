Notes (Browserify) Full
=======================

A version of Notes written using [Browserify][browserify].

## Sources

The relevant pages for this project are:

* [`app/index.html`](app/index.html): Notes application.
* [`test/jasmine/test.html`](test/jasmine/test.html):
  Jasmine test runner.
* [`test/mocha/test.html`](test/mocha/test.html):
  Mocha test runner.

and available as source in the directory:

```
full/browserify/
  app/                // Application directory.
    js/               // JS sources (not served in prod)
    js-dist/          // Production bundle
  test/
    jasmine/          // Jasmine test directory
    mocha/            // Mocha test directory
```

## Development

The application uses [Grunt][grunt] for the frontend development workflow.
Typically, a developer:

* Installs all necessary components.
* Runs a watch process and a development server.
* Develops!

### Setup

First, install NPM and Bower dependencies:

```
$ npm install
```

Then build your JavaScript into a web-ready bundle.

```
# One time only.
$ grunt build

# Keep building with watch
$ grunt watch
```

In a separate terminal, initialize a database. You can rerun this later to reset
the database.

```
$ node server/init-db.js
```

From there, fire up a local static development server with:

```
$ grunt server
```

and from there you can view the application at:

* [http://127.0.0.1:3000](http://127.0.0.1:3000): Full production
  bundle as a single file. (Have to run `grunt build:dist` to pick up new
  changes.)
* [http://127.0.0.1:3000?_dist=0](http://127.0.0.1:3000?_dist=0):
  Development-only version that uses raw, indivudal JS sources, downloading
  each individually.

and the test results at:

* [http://127.0.0.1:3000/test/jasmine/test.html](http://127.0.0.1:3000/test/jasmine/test.html)
* [http://127.0.0.1:3000/test/mocha/test.html](http://127.0.0.1:3000/test/mocha/test.html)

Note that the application **needs** to be served and not accessed via
`file://` in order for all parts to properly work. You will want to leave
the server running during development and refresh your browser to see changes.

### Code Quality

We have several code quality checks for the project.

Run JsHint style checks:

```
$ grunt jshint
```

Run unit tests using Karma:

```
$ grunt test
```

Run everything:

```
$ grunt check
```

### Next Steps

Generally speaking, just running:

```
$ grunt
```

builds the app and runs a basic set of quality checks. You can see more about
available Grunt tasks with:

```
$ grunt --help
```

[browserify]: http://browserify.org/
[grunt]: http://gruntjs.com/
