Install redis (you probably want to do this in your home directory so `cd`):

    wget http://download.redis.io/redis-stable.tar.gz
    tar xvzf redis-stable.tar.gz
    cd redis-stable
    make
    cd src
    sudo cp redis-server /usr/local/bin/
    sudo cp redis-cli /usr/local/bin/

Now install the appropriate node packages:

    npm install redis
    npm install node-uuid

To launch the application, you need to spin up a redis and node server. Do the following:

    redis-server
    node index.js
