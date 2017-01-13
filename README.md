CTS Server
==========

Dependencies
------------

You'll need to install the following:

* NodeJS
* MongoDB

Running
-------

1. **Install Dependencies:** If this is the first time you're running the server, make sure you have all
the required NPM modules.

     ```
     npm install
     ```

2. **Create optons file:** If this is your first time, create a local options file

     ```
     cp app/opts-local.js.example app/opts-local.js
     ```

   This file is ignored by git and will add any custom settings your
   environment requires. The `app/opts.js` file loads your local opts and will
   extend and overwrite its own settings.

3. **Initialize submodules:** If this is your first time, run:

     ```
     git submodule init
     git submodule update
     ```

If this is your nth time, you might just want to run the update.

4. **Start the server.**

     ```
     node app/app.js
     ```

This will start the server on port 8888 by default, which the development build
of `cts-ui` is preconfigured to work with. 

Testing
-------

Tests are stored in the `test/` directory and written with
[Mocha](http://mochajs.org/). If you have never used Mocha
before, you should first run:

     ```
     sudo npm install -g mocha
     ```

Or run the Windows equivalent.

To run unit tests, run:

     ```
     mocha
     ```

You should see output like:

     ```
       ․

       3 passing (4ms)
     ```

