## Unit testing

Tests are implemented with the unit testing framework [QUnit](http://qunitjs.com/).

To create a new test put a file `my.test.js` in the `units` directory and it will be included in the compiled package `test/build.js`.

In order to manually start compilation process run

    $ gulp webpack

or set up watchers for automatic rebuild on any change

    $ gulp

To execute the tests it's necessary to open `index.html` in a web browser.
