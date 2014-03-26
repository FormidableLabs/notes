Installation - Notes Project
============================

The Notes project needs a basic Git and Node.js installation on a modern
Windows, Linux or Mac OS X machine.


## Project Installations

Once you tackle the base installation here, you can look to further package
specific installations including:

* [`full/amd/README.md`](full/amd/README.md): Notes (AMD) implementation.


## Development

You will need the following basic tools on your development machine:

* Git
* Node.js/NPM

### Git

Git comes installed by default on many OS's. If you don't find it available
on the command line with:

```
$ git --version
```

then download a package at the
[Official Downloads Page](http://git-scm.com/downloads)

Some additional resources:

* [Git Documentation](http://git-scm.com/doc)
* [Git Cheatsheet](https://na1.salesforce.com/help/pdfs/en/salesforce_git_developer_cheatsheet.pdf)

On Windows, you may need to add:

```
;C:\Program Files\Git\bin;C:\Program Files\Git\cmd
```

to "Advanced System Settings > Environment Variables > System Variables > Path"
to get `git` properly available from the command line.

### Node.js

Node.js is used to drive the entire frontend build. If you don't find a modern
version installed on your OS, download a package at the
[Official Downloads Page](http://nodejs.org/download/)

Verify installation with:

```
$ node --version
$ npm --version
```

## Extras

### Shell Enhancements

To avoid typing long paths like:

```
$ node_modules/.bin/grunt
$ node_modules/.bin/bower
```

We also recommend adding the following path snippet (in Bash):

```
export PATH=${PATH}:./node_modules/.bin
```

and in Windows
"Advanced System Settings > Environment Variables > User Variables > Path"
append the following:

```
;node_modules\.bin
```

## Recommended Other Tools

### Windows

* [Google Chrome](https://www.google.com/intl/en/chrome/browser/)
* [ConEmu](https://code.google.com/p/conemu-maximus5/): A console.
* [Console2](http://sourceforge.net/projects/console/): A console.
* [Notepad++](http://notepad-plus-plus.org/)
