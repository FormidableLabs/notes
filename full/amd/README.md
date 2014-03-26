Notes (AMD) Full
================

A version of Notes written using [AMD][amd] via [RequireJS][requirejs].

## Sources

The relevant pages for this project are:

* [`app/index.html`](app/index.html): Notes application.
* [`test/jasmine/test.html`](test/jasmine/test.html):
  Jasmine test runner.

and available as source in the directory:

```
full/amd/
  app/                // Application directory.
    js/               // JS sources (not served in prod)
    js-dist/          // Production bundle
  test/
    jasmine/          // Jasmine test directory
```

## Development

The application uses [Grunt][grunt] for the frontend development workflow.
Typically, a developer:

* Installs all necessary components.
* Runs a development server.
* Develops!

### Setup

First, install NPM and Bower dependencies:

```
$ npm install
```

Then copy over the vendor libraries to the application directory
"app/js/vendor", which is `.gitignore`'d and *not* kept in source.

```
$ grunt build
```

From there, fire up a local static development server with:

```
$ grunt server
```

and from there you can view the application at:

* [http://127.0.0.1:9874/app/](http://127.0.0.1:9874/app/): Full production
  bundle as a single file. (Have to run `grunt build:dist` to pick up new
  changes.)
* [http://127.0.0.1:9874/app/?_dist=0](http://127.0.0.1:9874/app/?_dist=0):
  Development-only version that uses raw, indivudal JS sources, downloading
  each individually.

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

[amd]: http://requirejs.org/docs/whyamd.html
[grunt]: http://gruntjs.com/
[requirejs]: http://requirejs.org/
