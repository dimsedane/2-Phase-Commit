2-Phase-Commit
==============

An example implementation of 2 Phase Commit

To use it, run 

    node server.js

Start the coordinator.html to have a graphical representation of the connected clients and their state.

Then start a client.html for each client that should be connected to the coordinator. Then send a message from the coordinator.html and watch the magic :)

Only works on localhost, and requires socket.io

To install socket.io run

    npm install socket.io
