CTS Server
==========

Running
--------

1. If this is the first time you're running the server, make sure you have all
the required NPM modules.

     ```
     npm install
     ```

2. Create a local options file

     ```
     cp app/opts-local.js.example app/opts-local.js
     ```

   This file is ignored by git and will add any custom settings your
   environment requires. The `app/opts.js` file loads your local opts and will
   extend and overwrite its own settings.

3. Start the server.

     ```
     node app/app.js
     ```

This will start the server on port 8888 by default, which the development build
of `cts-ui` is preconfigured to work with.
